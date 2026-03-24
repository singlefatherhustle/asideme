/**
 * ingest.js — Universal file ingestion pipeline
 *
 * Supports: .md, .txt, .js, .ts, .jsx, .tsx, .py, .sql, .json, .pdf, .png, .jpg, .jpeg, .webp
 *
 * Called by:
 *   - POST /api/ingest/upload  (file upload via UI)
 *   - node ingest.js <path>    (manual CLI ingestion)
 *   - auto-scan of teacher-docs/ and ingested/ on startup
 *
 * PNG/image files are processed through Claude Vision to extract:
 *   - All visible text (slide titles, bullet points, code, diagrams)
 *   - Diagram descriptions (flowcharts, architecture diagrams)
 *   - Code snippets shown in screenshots
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Ensure docs table has all needed columns ──────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS docs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    path        TEXT UNIQUE NOT NULL,
    unit        TEXT NOT NULL DEFAULT '',
    topic       TEXT NOT NULL DEFAULT '',
    title       TEXT NOT NULL DEFAULT '',
    file_type   TEXT NOT NULL DEFAULT 'md',
    content     TEXT NOT NULL,
    tokens      TEXT NOT NULL DEFAULT '',
    indexed_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );
  CREATE INDEX IF NOT EXISTS idx_docs_unit     ON docs(unit);
  CREATE INDEX IF NOT EXISTS idx_docs_topic    ON docs(topic);
  CREATE INDEX IF NOT EXISTS idx_docs_filetype ON docs(file_type);
`);

// ── Stopwords ─────────────────────────────────────────────────────────────────
const STOPWORDS = new Set(['the','a','an','is','it','in','on','at','to','of','and',
  'or','for','with','this','that','are','was','be','has','have','do','does','not',
  'but','from','by','as','so','if','what','how','when','why','where','which','who',
  'can','will','would','should','could','also','then','about','into','more','some',
  'just','use','used','using','get','set','let','var','const','return','function']);

export function tokenize(str) {
  return [...new Set(
    str.toLowerCase()
      .replace(/[^a-z0-9\s]/g,' ')
      .split(/\s+/)
      .filter(t => t.length > 2 && !STOPWORDS.has(t))
  )].join(' ');
}

// ── Extract title ─────────────────────────────────────────────────────────────
function extractTitle(content, filePath) {
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return basename(filePath, extname(filePath)).replace(/[-_]/g,' ');
}

// ── Parse metadata from path ──────────────────────────────────────────────────
function parseMeta(filePath) {
  const rel   = filePath.replace(__dir + '/', '');
  const parts = rel.split('/');

  if (parts[0] === 'teacher-docs' && parts[1] === 'units' && parts.length >= 4) {
    return {
      unit:  parts[2].replace(/^\d+-/,'').replace(/_/g,' '),
      topic: parts[3].replace(/^\d+\.\d+-/,'').replace(/_/g,' '),
    };
  }

  if (parts[0] === 'ingested') {
    return { unit: parts[1] || 'uploaded', topic: parts[2] || basename(filePath, extname(filePath)) };
  }

  const ext = extname(filePath).slice(1);
  const codeTypes = { js:'javascript', ts:'typescript', py:'python', sql:'sql', jsx:'react', tsx:'react typescript' };
  if (codeTypes[ext]) return { unit: 'code examples', topic: codeTypes[ext] };

  return { unit: 'general', topic: basename(filePath, extname(filePath)).replace(/[-_]/g,' ') };
}

// ── PDF extraction via Claude Vision ─────────────────────────────────────────
// Claude natively understands PDF as a document type — no page conversion needed.
// This handles Google Slides exports, scanned docs, and complex formatted PDFs
// that the old pure-JS text stripper would mangle.
async function extractPdfVision(filePath, apiKey) {
  const key = apiKey || _apiKey;
  if (!key) throw new Error('No API key for PDF Vision extraction');

  const stat = statSync(filePath);
  if (stat.size > 32 * 1024 * 1024) {
    console.warn(`  ⚠ PDF too large for Vision (${Math.round(stat.size/1024/1024)}MB) — skipping`);
    return '[PDF too large to process — split into smaller files]';
  }

  const pdfData  = readFileSync(filePath).toString('base64');
  const name     = basename(filePath);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: pdfData },
          },
          {
            type: 'text',
            text: `Extract ALL content from this PDF for a software engineering course knowledge base.

Include:
1. Every slide title and all bullet points verbatim
2. All code examples — reproduce inside fenced code blocks with correct language tags
3. Diagrams and flowcharts — describe structure, nodes, connections, and labels clearly
4. Tables — reproduce in markdown format
5. Any URLs or references mentioned

Format as clean markdown. Start with a # heading for the document title.
File: ${name}`,
          },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'PDF Vision API error');
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() || '[No content extracted from PDF]';
}

// ── Code file: wrap with language context ─────────────────────────────────────
function processCode(content, filePath) {
  const ext  = extname(filePath).slice(1);
  const name = basename(filePath);
  const langMap = { js:'JavaScript', ts:'TypeScript', jsx:'React JSX', tsx:'React TSX',
                    py:'Python', sql:'SQL', json:'JSON', sh:'Shell', bash:'Shell' };
  const lang = langMap[ext] || ext.toUpperCase();
  return `# Code Example: ${name}\nLanguage: ${lang}\n\n\`\`\`${ext}\n${content}\n\`\`\``;
}

// ── Upsert statement ──────────────────────────────────────────────────────────
const upsert = db.prepare(`
  INSERT INTO docs (path, unit, topic, title, file_type, content, tokens)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(path) DO UPDATE SET
    content    = excluded.content,
    tokens     = excluded.tokens,
    title      = excluded.title,
    unit       = excluded.unit,
    topic      = excluded.topic,
    file_type  = excluded.file_type,
    indexed_at = unixepoch()
`);

// ── Ingest single file ────────────────────────────────────────────────────────
export async function ingestFile(filePath, apiKey) {
  const ext     = extname(filePath).slice(1).toLowerCase();
  const relPath = relative(__dir, filePath);

  let content  = '';
  let fileType = ext;

  const TEXT_EXTS  = new Set(['md','txt','html','css','json']);
  const CODE_EXTS  = new Set(['js','ts','jsx','tsx','py','sql','sh','bash']);
  const IMAGE_EXTS = new Set(['png','jpg','jpeg','webp','gif']);

  if (TEXT_EXTS.has(ext)) {
    content = readFileSync(filePath, 'utf8');

  } else if (CODE_EXTS.has(ext)) {
    content  = processCode(readFileSync(filePath, 'utf8'), filePath);
    fileType = 'code';

  } else if (ext === 'pdf') {
    content  = await extractPdfVision(filePath, apiKey);
    fileType = 'pdf';

  } else if (IMAGE_EXTS.has(ext)) {
    // Check file size — skip images over 5MB (base64 would be too large)
    const stat = statSync(filePath);
    if (stat.size > 5 * 1024 * 1024) {
      console.warn(`  ⚠ Skipping ${basename(filePath)} — over 5MB`);
      return null;
    }
    content  = await extractImageContent(filePath, apiKey);
    fileType = 'image';

  } else {
    return null;
  }

  if (!content || content.length < 20) return null;

  const { unit, topic } = parseMeta(filePath);
  const title  = extractTitle(content, filePath);
  const tokens = tokenize(content);

  upsert.run(relPath, unit, topic, title, fileType, content, tokens);
  return { path: relPath, unit, topic, title, fileType, chars: content.length };
}

// ── Image vision extraction via Claude ────────────────────────────────────────
// API key is set by server.js before any image files are ingested
let _apiKey = null;
export function setApiKey(key) { _apiKey = key; }

const IMAGE_MEDIA = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', webp:'image/webp', gif:'image/gif' };

export async function extractImageContent(filePath, apiKey) {
  const key = apiKey || _apiKey;
  if (!key) throw new Error('No API key — call setApiKey() before ingesting images');

  const ext       = extname(filePath).slice(1).toLowerCase();
  const mediaType = IMAGE_MEDIA[ext] || 'image/png';
  const imgData   = readFileSync(filePath).toString('base64');
  const name      = basename(filePath);

  const prompt = `This is an image from a software engineering course (could be a slide, handout, diagram, or screenshot of code).

Extract ALL of the following into structured text:
1. Every word of visible text — titles, bullet points, labels, captions, annotations
2. Code shown in the image — reproduce it exactly inside a fenced code block with the correct language tag
3. Diagrams / flowcharts — describe the structure, nodes, arrows, and relationships clearly
4. Tables — reproduce them in markdown table format
5. URLs or links visible in the image

Format your response as clean markdown that would be useful for answering student questions about this material.
Start with a # heading that titles the content (infer from context if not explicit).

Image filename: ${name}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-api-key':       key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imgData } },
          { type: 'text',  text: prompt },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Vision API error');
  }

  const data = await res.json();
  return data.content?.[0]?.text?.trim() || '[No content extracted from image]';
}

// ── Walk and ingest a directory ───────────────────────────────────────────────
const SUPPORTED = new Set([
  'md','txt','html','css','json',
  'js','ts','jsx','tsx','py','sql','sh','bash',
  'pdf',
  'png','jpg','jpeg','webp','gif',
]);

function walk(dir, files=[]) {
  try {
    readdirSync(dir).forEach(name => {
      if (name.startsWith('.') || name === 'node_modules') return;
      const full = join(dir, name);
      try {
        if (statSync(full).isDirectory()) walk(full, files);
        else if (SUPPORTED.has(extname(name).slice(1).toLowerCase())) files.push(full);
      } catch(_) {}
    });
  } catch(_) {}
  return files;
}

export async function ingestDirectory(dir, apiKey) {
  const files   = walk(dir);
  const results = [];
  for (const f of files) {
    try {
      const r = await ingestFile(f, apiKey);
      if (r) { results.push(r); console.log(`  ✓ [${r.fileType.padEnd(5)}] ${r.path}`); }
    } catch(e) { console.warn(`  ✗ ${f}: ${e.message}`); }
  }
  return results;
}

export function docsCount()     { try { return db.prepare('SELECT COUNT(*) as n FROM docs').get().n; } catch(_) { return 0; } }
export function listDocTopics() { try { return db.prepare('SELECT DISTINCT unit, topic, title, file_type FROM docs ORDER BY unit, topic').all(); } catch(_) { return []; } }
export function getDocByPath(p) { try { return db.prepare('SELECT * FROM docs WHERE path=?').get(p); } catch(_) { return null; } }

// ── CLI usage: node ingest.js <path> ─────────────────────────────────────────
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) {
    console.log('Usage: node ingest.js <file-or-directory>');
    process.exit(1);
  }

  const stat = statSync(target);
  if (stat.isDirectory()) {
    console.log(`Ingesting directory: ${target}`);
    const results = await ingestDirectory(target);
    console.log(`\n✅  ${results.length} files indexed`);
  } else {
    const r = await ingestFile(target);
    console.log(r ? `✅  Ingested: ${r.title} (${r.chars} chars)` : '⚠  File not supported or empty');
  }
  process.exit(0);
}
