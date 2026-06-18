#!/usr/bin/env node
/**
 * bulk-ingest.js — CLI batch ingestion tool
 *
 * Usage:
 *   node bulk-ingest.js <folder>              Ingest all supported files in a folder
 *   node bulk-ingest.js <folder> --dry-run    Preview what would be ingested (no writes)
 *   node bulk-ingest.js <folder> --images-only  Only process PNG/JPG files
 *   node bulk-ingest.js <folder> --unit "react" --topic "hooks"  Tag all files
 *   node bulk-ingest.js --list               List all currently indexed docs
 *   node bulk-ingest.js --clear-ingested     Delete all uploaded/ingested docs (not teacher-docs)
 *   node bulk-ingest.js --stats              Show indexing stats
 *
 * Examples:
 *   node bulk-ingest.js ./slides/week3/
 *   node bulk-ingest.js ~/Downloads/react-slides --unit "frontend libraries" --topic "react hooks"
 *   node bulk-ingest.js ./assets --images-only --dry-run
 */

import 'dotenv/config';
import { readdirSync, statSync, copyFileSync, mkdirSync } from 'fs';
import { join, extname, basename, resolve, relative, dirname } from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __dir = dirname(fileURLToPath(import.meta.url));

// ── Parse CLI args ────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const dryRun  = args.includes('--dry-run');
const imgOnly = args.includes('--images-only');
const listCmd = args.includes('--list');
const clearCmd= args.includes('--clear-ingested');
const statsCmd= args.includes('--stats');

const unitIdx  = args.indexOf('--unit');
const topicIdx = args.indexOf('--topic');
const customUnit  = unitIdx  !== -1 ? args[unitIdx+1]  : null;
const customTopic = topicIdx !== -1 ? args[topicIdx+1] : null;

const targetDir = args.find(a => !a.startsWith('--') && args.indexOf(a) !== unitIdx+1 && args.indexOf(a) !== topicIdx+1);

// ── ANSI colours ──────────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  blue:   '\x1b[34m',
  magenta:'\x1b[35m',
};
const c = (color, str) => `${C[color]}${str}${C.reset}`;

// ── Supported file types ──────────────────────────────────────────────────────
const ALL_EXTS   = new Set(['md','txt','js','ts','jsx','tsx','py','sql','pdf','json','sh','html','css','png','jpg','jpeg','webp','gif']);
const IMAGE_EXTS = new Set(['png','jpg','jpeg','webp','gif']);
const CODE_EXTS  = new Set(['js','ts','jsx','tsx','py','sql','sh','bash']);

function getIcon(ext) {
  const icons = { md:'📄',pdf:'📑',png:'🖼',jpg:'🖼',jpeg:'🖼',webp:'🖼',gif:'🖼',
    js:'📜',ts:'📜',jsx:'⚛',tsx:'⚛',py:'🐍',sql:'🗄',json:'📋',txt:'📃',html:'🌐',css:'🎨' };
  return icons[ext] || '📎';
}

// ── Walk directory ────────────────────────────────────────────────────────────
function walk(dir, files = []) {
  try {
    readdirSync(dir).forEach(name => {
      if (name.startsWith('.') || name === 'node_modules' || name === 'ingested') return;
      const full = join(dir, name);
      try {
        const stat = statSync(full);
        if (stat.isDirectory()) walk(full, files);
        else {
          const ext = extname(name).slice(1).toLowerCase();
          if (ALL_EXTS.has(ext)) {
            if (!imgOnly || IMAGE_EXTS.has(ext)) files.push({ path: full, ext, name, size: stat.size });
          }
        }
      } catch(_) {}
    });
  } catch(_) {}
  return files;
}

// ── Format bytes ──────────────────────────────────────────────────────────────
function fmtSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
  return (bytes/1024/1024).toFixed(1) + 'MB';
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${c('cyan','⚡')} ${c('bold','ASIDE Bulk Ingest')} ${c('dim','v3.1')}\n`);

  // Lazy import DB (only loads SQLite when needed)
  const { db, docsCount, listDocTopics } = await import('./ingest.js').then(async m => {
    const db_mod = await import('./db.js');
    return { ...m, ...db_mod };
  });

  // ── --stats ──────────────────────────────────────────────────────────────────
  if (statsCmd) {
    const { docsCount, listDocTopics } = await import('./ingest.js');
    const count  = docsCount();
    const topics = listDocTopics();
    const byType = {};
    topics.forEach(t => { byType[t.file_type] = (byType[t.file_type]||0)+1; });

    console.log(c('bold','📊 Indexing Stats'));
    console.log(`   Total docs: ${c('cyan', count)}`);
    console.log(`   Topics:     ${c('cyan', topics.length)}`);
    console.log(`\n   By type:`);
    Object.entries(byType).sort((a,b)=>b[1]-a[1]).forEach(([t,n]) => {
      console.log(`     ${getIcon(t)} ${t.padEnd(6)} ${c('cyan',n)}`);
    });
    return;
  }

  // ── --list ────────────────────────────────────────────────────────────────────
  if (listCmd) {
    const { listDocTopics } = await import('./ingest.js');
    const topics = listDocTopics();
    if (!topics.length) { console.log(c('yellow','No docs indexed yet.')); return; }
    console.log(c('bold',`📚 ${topics.length} indexed documents:\n`));
    let lastUnit = '';
    topics.forEach(t => {
      if (t.unit !== lastUnit) {
        console.log(`  ${c('cyan','['+t.unit+']')}`);
        lastUnit = t.unit;
      }
      const icon = getIcon(t.file_type);
      console.log(`    ${icon} ${t.topic} ${c('dim','— '+t.title)}`);
    });
    return;
  }

  // ── --clear-ingested ──────────────────────────────────────────────────────────
  if (clearCmd) {
    const { db } = await import('./db.js');
    const n = db.prepare(`DELETE FROM docs WHERE path LIKE 'ingested/%'`).run().changes;
    console.log(c('green', `✓ Removed ${n} ingested docs from index`));
    console.log(c('dim', '  (Files in ingested/ folder not deleted — only removed from search index)'));
    return;
  }

  // ── Batch ingest ──────────────────────────────────────────────────────────────
  if (!targetDir) {
    console.log(c('yellow','Usage: node bulk-ingest.js <folder> [options]'));
    console.log(c('dim','\nOptions:'));
    console.log('  --dry-run          Preview without writing to DB');
    console.log('  --images-only      Only process image files');
    console.log('  --unit "name"      Tag all files with this unit name');
    console.log('  --topic "name"     Tag all files with this topic name');
    console.log('  --list             Show all indexed docs');
    console.log('  --stats            Show indexing statistics');
    console.log('  --clear-ingested   Remove all uploaded docs from index');
    console.log(c('dim','\nExamples:'));
    console.log('  node bulk-ingest.js ./slides/week3/');
    console.log('  node bulk-ingest.js ~/Downloads/react-pdfs --unit "frontend libraries"');
    console.log('  node bulk-ingest.js ./assets --images-only --dry-run');
    return;
  }

  const absDir = resolve(targetDir);
  console.log(`${c('bold','Target:')} ${absDir}`);

  let stat;
  try { stat = statSync(absDir); } catch(_) {
    console.error(c('red', `✗ Directory not found: ${absDir}`));
    process.exit(1);
  }

  if (!stat.isDirectory()) {
    console.error(c('red', `✗ Not a directory: ${absDir}`));
    process.exit(1);
  }

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) {
    console.error(c('red','✗ ANTHROPIC_API_KEY not set in .env'));
    process.exit(1);
  }

  const files = walk(absDir);
  if (!files.length) {
    console.log(c('yellow','\nNo supported files found.'));
    console.log(c('dim','Supported: md, pdf, png, jpg, js, ts, py, sql, txt, json, html, css'));
    return;
  }

  // Group by type for summary
  const byType = {};
  files.forEach(f => { byType[f.ext] = (byType[f.ext]||0)+1; });

  console.log(c('bold',`\nFound ${files.length} files:`));
  Object.entries(byType).sort((a,b)=>b[1]-a[1]).forEach(([ext,n]) => {
    console.log(`  ${getIcon(ext)} .${ext.padEnd(6)} ${c('cyan',n)} file${n>1?'s':''}`);
  });

  if (dryRun) {
    console.log(c('yellow','\n⚠  DRY RUN — no files will be written to the index\n'));
    files.forEach(f => console.log(`  ${getIcon(f.ext)} ${f.name} ${c('dim',fmtSize(f.size))}`));
    return;
  }

  // Copy files to ingested/ so server can reindex them too
  const ingestedBase = join(__dir, 'ingested', customUnit || 'bulk');
  mkdirSync(ingestedBase, { recursive: true });

  const { ingestFile, setApiKey } = await import('./ingest.js');
  setApiKey(ANTHROPIC_KEY);

  console.log(c('bold','\nIndexing...\n'));

  let ok = 0, fail = 0, skip = 0;
  const t0 = performance.now();

  for (let i = 0; i < files.length; i++) {
    const f   = files[i];
    const pct = Math.round((i/files.length)*100);
    const bar = '█'.repeat(Math.round(pct/5)) + '░'.repeat(20-Math.round(pct/5));

    process.stdout.write(`\r  [${bar}] ${pct}% ${c('dim',f.name.slice(0,30).padEnd(30))}`);

    try {
      // Copy to ingested/ for persistence
      const dest = join(ingestedBase, f.name);
      copyFileSync(f.path, dest);

      // Ingest (will use Vision for PDFs and images)
      const result = await ingestFile(dest, ANTHROPIC_KEY);

      if (result) {
        ok++;
        process.stdout.write(`\r  ${c('green','✓')} ${getIcon(f.ext)} ${f.name.padEnd(40)} ${c('dim',fmtSize(f.size))} → ${c('cyan',result.chars+' chars')}\n`);
      } else {
        skip++;
        process.stdout.write(`\r  ${c('yellow','–')} ${getIcon(f.ext)} ${f.name.padEnd(40)} ${c('dim','skipped (empty or unsupported)')}\n`);
      }
    } catch(e) {
      fail++;
      process.stdout.write(`\r  ${c('red','✗')} ${getIcon(f.ext)} ${f.name.padEnd(40)} ${c('dim',e.message.slice(0,50))}\n`);
    }
  }

  const elapsed = ((performance.now()-t0)/1000).toFixed(1);
  console.log(`\n${c('bold','Done in')} ${elapsed}s`);
  console.log(`  ${c('green','✓')} ${ok} indexed  ${c('yellow','–')} ${skip} skipped  ${c('red','✗')} ${fail} failed`);
  if (ok > 0) console.log(`\n  ${c('cyan','💡')} Restart ASIDE or call ${c('bold','POST /api/ingest/reindex')} to make new docs searchable.`);
}

main().catch(e => {
  console.error(C.red + '✗ Fatal: ' + e.message + C.reset);
  process.exit(1);
});
