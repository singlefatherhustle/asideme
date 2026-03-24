/**
 * websearch.js — Web search and URL fetching for DevListen
 *
 * Two capabilities:
 *
 * 1. searchWeb(apiKey, query)
 *    Uses Anthropic's native web_search tool to find real-time info.
 *    Returns extracted text from search results.
 *    Covers: npm docs, MDN, Stack Overflow, GitHub, any library.
 *
 * 2. fetchUrl(url)
 *    Fetches a URL and extracts clean text content.
 *    Called when the transcript contains a URL someone pastes/mentions.
 *    Stores result in the docs table for RAG.
 *
 * 3. detectUrlsInText(text)
 *    Scans transcript text for URLs to trigger auto-fetch.
 */

import { db } from './db.js';
import { tokenize } from './ingest.js';

// ── Web search via Anthropic native tool ──────────────────────────────────────
// Returns the full text Claude generated after doing a web search.
// This is NOT streaming — used as a pre-step before the main answer.
export async function searchWeb(apiKey, query) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      tools: [{
        type: 'web_search_20250305',
        name: 'web_search',
      }],
      system: `You are a precise technical research assistant for a software engineering class.
Search for the most accurate, up-to-date information about the query.
Return a concise technical summary with:
- Key facts, syntax, or API details
- A short code example if relevant
- The source URL
Keep it under 300 words. Be direct, no filler.`,
      messages: [{ role: 'user', content: `Search for: ${query}` }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Web search API error');
  }

  const data = await res.json();

  // Extract text from all content blocks (may include tool_use + text blocks)
  const text = data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('\n')
    .trim();

  return text || null;
}

// ── URL fetcher ───────────────────────────────────────────────────────────────
// Fetches a URL and extracts readable text content.
// Stores it in the docs table so it becomes searchable in future RAG calls.
export async function fetchUrl(url) {
  // Validate URL
  let parsed;
  try { parsed = new URL(url); } catch(_) { throw new Error(`Invalid URL: ${url}`); }
  if (!['http:','https:'].includes(parsed.protocol)) throw new Error('Only http/https URLs supported');

  // Block localhost/internal IPs for security
  const host = parsed.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
    throw new Error('Local URLs not allowed');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'DevListen/3.1 (educational tool)',
        'Accept': 'text/html,application/xhtml+xml,text/plain',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    let content = '';

    if (contentType.includes('text/html')) {
      // Strip HTML tags and extract readable content
      content = text
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/\s{3,}/g, '\n\n')
        .trim();
    } else {
      content = text.trim();
    }

    // Truncate to reasonable size
    if (content.length > 20000) content = content.slice(0, 20000) + '\n\n[... content truncated ...]';

    return { url, content, title: extractPageTitle(text) };

  } catch(e) {
    clearTimeout(timeout);
    throw e;
  }
}

function extractPageTitle(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m ? m[1].trim().slice(0, 100) : 'Fetched page';
}

// ── Store fetched URL content in docs table for RAG ───────────────────────────
const upsertDoc = db.prepare(`
  INSERT INTO docs (path, unit, topic, title, file_type, content, tokens)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(path) DO UPDATE SET
    content    = excluded.content,
    tokens     = excluded.tokens,
    title      = excluded.title,
    indexed_at = unixepoch()
`);

export function storeUrlContent(url, title, content) {
  const safePath = 'fetched/' + url.replace(/[^a-z0-9]/gi, '_').slice(0, 100);
  const tokens   = tokenize(content);
  const topic    = new URL(url).hostname.replace('www.','');

  try {
    upsertDoc.run(safePath, 'web references', topic, title, 'url', content, tokens);
    return true;
  } catch(_) {
    return false;
  }
}

// ── URL detection in transcript text ─────────────────────────────────────────
const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g;

export function detectUrls(text) {
  const matches = text.match(URL_REGEX) || [];
  // Filter out noise — only keep URLs from known dev domains
  const DEV_DOMAINS = new Set([
    'developer.mozilla.org', 'mdn.io',
    'npmjs.com', 'npm.im',
    'github.com', 'raw.githubusercontent.com',
    'stackoverflow.com',
    'nodejs.org', 'deno.land',
    'reactjs.org', 'react.dev',
    'expressjs.com',
    'postgresql.org',
    'docs.anthropic.com',
    'typescript-lang.org', 'typescriptlang.org',
    'python.org', 'pypi.org',
    'vitejs.dev', 'webpack.js.org',
    'tailwindcss.com',
    'prisma.io', 'drizzle.team',
    'docs.deepgram.com',
    'web.dev', 'css-tricks.com',
  ]);

  return matches.filter(url => {
    try {
      const host = new URL(url).hostname.replace('www.','');
      return DEV_DOMAINS.has(host) || DEV_DOMAINS.has(host.split('.').slice(-2).join('.'));
    } catch(_) { return false; }
  });
}

// ── Decide if a question needs web search ─────────────────────────────────────
// Returns true when the question is likely about something outside the docs
// (recent packages, version-specific APIs, error messages, etc.)
export function needsWebSearch(question, ragHasResults) {
  if (ragHasResults) return false; // docs already have the answer

  const q = question.toLowerCase();
  const webSignals = [
    /version \d/,                           // "version 18", "v3.2"
    /latest|current|new in|released/,       // recency signals
    /npm install|yarn add|pip install/,     // package install
    /error:|warning:|cannot find|not found/, // error messages
    /how do i install|how to set up/,       // setup questions
    /vs |versus|compare|difference between/, // comparisons
    /deprecated|removed in/,               // breaking changes
    /\w+\.js|\w+ts|\w+py/,                 // specific file patterns
  ];

  return webSignals.some(rx => rx.test(q));
}
