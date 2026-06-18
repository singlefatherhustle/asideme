/**
 * websearch.js — Web search and URL fetching for ASIDE
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

import { lookup } from 'node:dns/promises';
import ipaddr from 'ipaddr.js';

// SSRF protection: resolve hostname to IP(s) and reject anything that isn't
// in the public unicast range. Catches:
//   - IPv4 private (10/8, 172.16/12, 192.168/16)
//   - IPv4 loopback (127/8), link-local (169.254/16, includes AWS/GCP metadata)
//   - IPv4 multicast/broadcast/reserved
//   - IPv6 loopback (::1), link-local (fe80::/10), ULA (fc00::/7), multicast
//   - DNS rebinding (host that resolves to multiple A records — we check all)
async function assertPublicHost(hostname) {
  if (!hostname) throw new Error('Missing hostname');
  let addrs;
  try {
    addrs = await lookup(hostname, { all: true, verbatim: true });
  } catch (_) {
    throw new Error(`Cannot resolve host: ${hostname}`);
  }
  for (const { address } of addrs) {
    let parsedIp;
    try { parsedIp = ipaddr.parse(address); } catch (_) {
      throw new Error(`Invalid resolved IP: ${address}`);
    }
    const range = parsedIp.range();
    // Only allow public unicast addresses.
    if (range !== 'unicast') {
      throw new Error(`Host resolves to non-public range (${range}): ${address}`);
    }
  }
}

// Maximum bytes we'll read from any fetched URL. Prevents an attacker from
// pointing us at a multi-gigabyte file and exhausting memory.
const MAX_FETCH_BYTES = 5 * 1024 * 1024; // 5 MB

// ── URL fetcher ───────────────────────────────────────────────────────────────
// Fetches a URL and extracts readable text content.
// Stores it in the docs table so it becomes searchable in future RAG calls.
export async function fetchUrl(url) {
  // Validate URL syntax + protocol
  let parsed;
  try { parsed = new URL(url); } catch(_) { throw new Error(`Invalid URL: ${url}`); }
  if (!['http:','https:'].includes(parsed.protocol)) {
    throw new Error('Only http/https URLs supported');
  }

  // SSRF: resolve and verify the host is in public IP space.
  // KNOWN LIMITATION (DNS-rebinding TOCTOU): we validate the IP at lookup() time,
  // but fetch() re-resolves the hostname independently, so a hostile resolver with
  // a sub-second TTL could flip to an internal IP between this check and connect.
  // Full mitigation requires resolving once and connecting to the validated IP via
  // a custom undici dispatcher (e.g. request-filtering-agent) — tracked as follow-up.
  // The redirect loop below DOES re-validate each hop, closing the redirect-based bypass.
  await assertPublicHost(parsed.hostname);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    // SSRF: follow redirects MANUALLY and re-validate every hop's host. Auto-follow
    // would let a public URL 30x-redirect to a private/loopback/metadata address.
    const MAX_REDIRECTS = 5;
    let currentUrl = url;
    let res;
    for (let hop = 0; ; hop++) {
      res = await fetch(currentUrl, {
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'User-Agent': 'ASIDE/3.1 (educational tool)',
          'Accept': 'text/html,application/xhtml+xml,text/plain',
        },
      });
      const location = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && location) {
        if (hop >= MAX_REDIRECTS) throw new Error('Too many redirects');
        let next;
        try { next = new URL(location, currentUrl); } catch (_) {
          throw new Error('Invalid redirect Location');
        }
        if (!['http:', 'https:'].includes(next.protocol)) {
          throw new Error('Redirect to non-http(s) scheme blocked');
        }
        await assertPublicHost(next.hostname); // re-validate the redirect target
        try { await res.body?.cancel(); } catch (_) { /* drain */ }
        currentUrl = next.toString();
        continue;
      }
      break;
    }
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

    // Cap response size BEFORE materializing it in memory.
    const declared = parseInt(res.headers.get('content-length') || '0', 10);
    if (declared > MAX_FETCH_BYTES) {
      throw new Error(`Response too large: ${declared} bytes (max ${MAX_FETCH_BYTES})`);
    }

    // Stream-read with running byte cap (handles missing Content-Length).
    const reader = res.body?.getReader();
    let chunks = [];
    let bytes = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.length;
        if (bytes > MAX_FETCH_BYTES) {
          controller.abort();
          throw new Error(`Response exceeded ${MAX_FETCH_BYTES} byte cap mid-stream`);
        }
        chunks.push(value);
      }
    }
    const decoded = new TextDecoder().decode(
      chunks.length ? Buffer.concat(chunks.map((c) => Buffer.from(c))) : Buffer.alloc(0),
    );

    const contentType = res.headers.get('content-type') || '';
    const text = decoded;

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
