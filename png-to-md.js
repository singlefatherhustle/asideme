#!/usr/bin/env node
/**
 * png-to-md.js — Batch image/PDF to Markdown converter
 *
 * Processes every PNG, JPG, JPEG, WEBP, GIF, and PDF in a folder,
 * runs Claude Vision on each one, and saves a clean .md file alongside it.
 *
 * Run ONCE before ingesting — after this you never pay for Vision again
 * and bulk-ingest runs in seconds instead of minutes.
 *
 * Usage:
 *   node png-to-md.js <folder>              Convert all images in folder
 *   node png-to-md.js <folder> --force      Reconvert even if .md already exists
 *   node png-to-md.js <folder> --pdf-only   Only process PDF files
 *   node png-to-md.js <folder> --img-only   Only process image files
 *   node png-to-md.js <folder> --dry-run    Preview without converting
 *   node png-to-md.js <file.png>            Convert a single file
 *
 * Examples:
 *   node png-to-md.js ~/Desktop/course-slides/
 *   node png-to-md.js ./week3-pdfs --force
 *   node png-to-md.js ./assets/diagram.png
 */

import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname, basename, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── ANSI colours ──────────────────────────────────────────────────────────────
const C = {
  reset:'\x1b[0m', bold:'\x1b[1m', dim:'\x1b[2m',
  cyan:'\x1b[36m', green:'\x1b[32m', yellow:'\x1b[33m',
  red:'\x1b[31m', blue:'\x1b[34m', magenta:'\x1b[35m',
};
const c = (col, str) => `${C[col]}${str}${C.reset}`;

// ── File types ────────────────────────────────────────────────────────────────
const IMAGE_EXTS = new Set(['png','jpg','jpeg','webp','gif']);
const PDF_EXTS   = new Set(['pdf']);
const IMAGE_MIME = { png:'image/png', jpg:'image/jpeg', jpeg:'image/jpeg', webp:'image/webp', gif:'image/gif' };

// ── CLI args ──────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const force   = args.includes('--force');
const dryRun  = args.includes('--dry-run');
const pdfOnly = args.includes('--pdf-only');
const imgOnly = args.includes('--img-only');
const target  = args.find(a => !a.startsWith('--'));

// ── Prompt used for both images and PDFs ──────────────────────────────────────
function buildPrompt(filename) {
  return `Extract ALL content from this file for a software engineering course knowledge base.

Extract and include:
1. Every word of visible text — slide titles, bullet points, labels, annotations
2. ALL code shown — reproduce it exactly in fenced code blocks with the correct language tag
3. Diagrams and flowcharts — describe structure, nodes, arrows, and relationships precisely  
4. Tables — reproduce in markdown table format
5. Any URLs, links, or references shown
6. Section headers and sub-headers

Format rules:
- Output clean, well-structured markdown
- Start with a # heading (use the slide/page title, or infer from content)
- Use ## for sub-sections if the content has clear sections
- Preserve the logical order of content as it appears
- For code: always include the language tag on the fenced block (js, py, sql, bash, etc.)
- Do not add commentary or explanations — just extract what's there

Filename: ${filename}`;
}

// ── Convert image file → markdown string ──────────────────────────────────────
async function imageToMarkdown(filePath, apiKey) {
  const ext      = extname(filePath).slice(1).toLowerCase();
  const mime     = IMAGE_MIME[ext] || 'image/png';
  const imgData  = readFileSync(filePath).toString('base64');
  const filename = basename(filePath);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: [
          { type:'image', source:{ type:'base64', media_type:mime, data:imgData } },
          { type:'text',  text: buildPrompt(filename) },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text || text.length < 10) throw new Error('Empty response from Vision');
  return text;
}

// ── Convert PDF file → markdown string ───────────────────────────────────────
async function pdfToMarkdown(filePath, apiKey) {
  const stat = statSync(filePath);
  if (stat.size > 32 * 1024 * 1024) {
    throw new Error(`File too large (${Math.round(stat.size/1024/1024)}MB) — max 32MB`);
  }

  const pdfData  = readFileSync(filePath).toString('base64');
  const filename = basename(filePath);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          { type:'document', source:{ type:'base64', media_type:'application/pdf', data:pdfData } },
          { type:'text',     text: buildPrompt(filename) },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text?.trim();
  if (!text || text.length < 10) throw new Error('Empty response from Vision');
  return text;
}

// ── Walk directory ────────────────────────────────────────────────────────────
function walk(dir, files = []) {
  try {
    readdirSync(dir).sort().forEach(name => {
      if (name.startsWith('.') || name === 'node_modules') return;
      const full = join(dir, name);
      try {
        const stat = statSync(full);
        if (stat.isDirectory()) {
          walk(full, files);
        } else {
          const ext = extname(name).slice(1).toLowerCase();
          const isImg = IMAGE_EXTS.has(ext);
          const isPdf = PDF_EXTS.has(ext);
          if (pdfOnly && isPdf) files.push({ path:full, ext, name, size:stat.size });
          else if (imgOnly && isImg) files.push({ path:full, ext, name, size:stat.size });
          else if (!pdfOnly && !imgOnly && (isImg || isPdf)) files.push({ path:full, ext, name, size:stat.size });
        }
      } catch(_) {}
    });
  } catch(_) {}
  return files;
}

// ── Format helpers ────────────────────────────────────────────────────────────
function fmtSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
  return (bytes/1024/1024).toFixed(1) + 'MB';
}

function mdPath(filePath) {
  const dir  = dirname(filePath);
  const name = basename(filePath, extname(filePath));
  return join(dir, name + '.md');
}

function getIcon(ext) {
  return IMAGE_EXTS.has(ext) ? '🖼' : '📑';
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c('cyan','⚡')} ${c('bold','ASIDE — Image/PDF → Markdown Converter')}\n`);

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    console.error(c('red','✗ ANTHROPIC_API_KEY not set in .env'));
    process.exit(1);
  }

  if (!target) {
    console.log(c('yellow','Usage: node png-to-md.js <folder-or-file> [options]'));
    console.log(c('dim','\nOptions:'));
    console.log('  --force       Reconvert even if .md already exists');
    console.log('  --dry-run     Preview without converting');
    console.log('  --pdf-only    Only process PDF files');
    console.log('  --img-only    Only process image files (PNG, JPG, WEBP, GIF)');
    console.log(c('dim','\nExamples:'));
    console.log('  node png-to-md.js ~/Desktop/course-slides/');
    console.log('  node png-to-md.js ./week3-pdfs --force');
    console.log('  node png-to-md.js ./assets/diagram.png');
    console.log(c('dim','\nAfter converting, run:'));
    console.log('  node bulk-ingest.js <same-folder>');
    return;
  }

  const absTarget = resolve(target);

  // ── Single file mode ────────────────────────────────────────────────────────
  let isStat;
  try { isStat = statSync(absTarget); } catch(_) {
    console.error(c('red', `✗ Not found: ${absTarget}`));
    process.exit(1);
  }

  if (!isStat.isDirectory()) {
    const ext = extname(absTarget).slice(1).toLowerCase();
    if (!IMAGE_EXTS.has(ext) && !PDF_EXTS.has(ext)) {
      console.error(c('red', `✗ Unsupported type: .${ext}`));
      process.exit(1);
    }

    const out = mdPath(absTarget);
    if (existsSync(out) && !force) {
      console.log(c('yellow', `Already converted: ${basename(out)} (use --force to redo)`));
      return;
    }

    console.log(`Converting ${c('cyan', basename(absTarget))}...`);
    const t0 = performance.now();
    try {
      const md = IMAGE_EXTS.has(ext)
        ? await imageToMarkdown(absTarget, ANTHROPIC_KEY)
        : await pdfToMarkdown(absTarget, ANTHROPIC_KEY);
      writeFileSync(out, md, 'utf8');
      const ms = Math.round(performance.now() - t0);
      console.log(c('green', `✓ Saved: ${basename(out)} (${md.length} chars, ${ms}ms)`));
    } catch(e) {
      console.error(c('red', `✗ Failed: ${e.message}`));
    }
    return;
  }

  // ── Directory mode ──────────────────────────────────────────────────────────
  const files = walk(absTarget);

  if (!files.length) {
    console.log(c('yellow', 'No supported files found.'));
    console.log(c('dim', 'Supported: png, jpg, jpeg, webp, gif, pdf'));
    return;
  }

  // Separate already converted vs needs conversion
  const toConvert = files.filter(f => force || !existsSync(mdPath(f.path)));
  const skipped   = files.length - toConvert.length;

  // Summary
  const byExt = {};
  files.forEach(f => { byExt[f.ext] = (byExt[f.ext]||0)+1; });
  console.log(c('bold', `Found ${files.length} files in ${absTarget}:`));
  Object.entries(byExt).forEach(([ext,n]) => {
    console.log(`  ${getIcon(ext)} .${ext.padEnd(6)} ${c('cyan', n)} file${n>1?'s':''}`);
  });

  if (skipped > 0 && !force) {
    console.log(c('dim', `\n  ${skipped} already converted — skipping (use --force to redo)`));
  }
  console.log(c('bold', `\n  Converting ${toConvert.length} files...\n`));

  if (dryRun) {
    console.log(c('yellow', '⚠  DRY RUN — nothing will be written\n'));
    toConvert.forEach(f => {
      console.log(`  ${getIcon(f.ext)} ${f.name} ${c('dim','→')} ${basename(mdPath(f.path))} ${c('dim', fmtSize(f.size))}`);
    });
    return;
  }

  if (toConvert.length === 0) {
    console.log(c('green', '✓ All files already converted. Run with --force to redo.'));
    return;
  }

  // Process with rate limiting — Haiku handles ~5 concurrent but we keep it simple
  let ok = 0, fail = 0;
  const t0 = performance.now();
  const errors = [];

  for (let i = 0; i < toConvert.length; i++) {
    const f   = toConvert[i];
    const ext = f.ext;
    const pct = Math.round(((i+1)/toConvert.length)*100);
    const bar = '█'.repeat(Math.round(pct/5)) + '░'.repeat(20-Math.round(pct/5));

    process.stdout.write(`\r  [${bar}] ${pct}% (${i+1}/${toConvert.length}) ${c('dim', f.name.slice(0,35).padEnd(35))}`);

    try {
      const md = IMAGE_EXTS.has(ext)
        ? await imageToMarkdown(f.path, ANTHROPIC_KEY)
        : await pdfToMarkdown(f.path, ANTHROPIC_KEY);

      const out = mdPath(f.path);
      writeFileSync(out, md, 'utf8');
      ok++;

      process.stdout.write(
        `\r  ${c('green','✓')} ${getIcon(ext)} ${f.name.padEnd(45)} ${c('dim', fmtSize(f.size))} → ${c('cyan', md.length + ' chars')}\n`
      );

      // Small delay between calls to avoid rate limits
      if (i < toConvert.length - 1) await sleep(200);

    } catch(e) {
      fail++;
      errors.push({ file: f.name, error: e.message });
      process.stdout.write(
        `\r  ${c('red','✗')} ${getIcon(ext)} ${f.name.padEnd(45)} ${c('red', e.message.slice(0,50))}\n`
      );
    }
  }

  // Summary
  const elapsed = ((performance.now()-t0)/1000).toFixed(1);
  console.log(`\n${c('bold','Done in')} ${elapsed}s`);
  console.log(`  ${c('green','✓')} ${ok} converted   ${c('red','✗')} ${fail} failed   ${c('dim','⊘')} ${skipped} skipped`);

  if (errors.length) {
    console.log(c('yellow','\nFailed files:'));
    errors.forEach(e => console.log(`  ${c('red','✗')} ${e.file}: ${e.error}`));
  }

  if (ok > 0) {
    console.log(`\n${c('cyan','💡')} Next step — ingest the markdown files:`);
    console.log(`  ${c('bold','node bulk-ingest.js')} ${target}`);
    console.log(c('dim','\n  The .md files will be ingested instantly — no Vision calls needed.'));
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

main().catch(e => {
  console.error(C.red + '✗ Fatal: ' + e.message + C.reset);
  process.exit(1);
});
