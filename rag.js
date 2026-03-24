/**
 * rag.js — BM25 retrieval over session history + teacher docs
 *
 * Two search layers:
 *   1. Teacher docs  — authoritative course material (higher weight)
 *   2. Session msgs  — prior Q&As from this session (continuity)
 */

import { getMessages, db } from './db.js';

const STOPWORDS = new Set(['the','a','an','is','it','in','on','at','to','of','and',
  'or','for','with','this','that','are','was','be','has','have','do','does','not',
  'but','from','by','as','so','if','what','how','when','why','where','which','who',
  'can','will','would','should','could','also','then','about','into','more','some',
  'just','use','used','using','get','set','let','var','we','you','i','my','your']);

function tokenize(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function bm25(qTokens, docStr, k1=1.5, b=0.75, avg=120) {
  const tokens = tokenize(docStr);
  if (!tokens.length) return 0;
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t]||0)+1);
  return qTokens.reduce((s, qt) => {
    const tf = freq[qt]||0;
    if (!tf) return s;
    return s + Math.log(1+1/(tf+0.5)) * (tf*(k1+1)) / (tf+k1*(1-b+b*tokens.length/avg));
  }, 0);
}

// ── Search teacher docs ───────────────────────────────────────────────────────
function searchDocs(qTokens, topK=2) {
  if (!qTokens.length) return [];
  const topTokens = qTokens.slice(0, 6);
  const conditions = topTokens.map(() => `(tokens LIKE ? OR content LIKE ?)`).join(' OR ');
  const params = topTokens.flatMap(t => [`%${t}%`, `%${t}%`]);
  let candidates = [];
  try {
    candidates = db.prepare(
      `SELECT path, unit, topic, title, content FROM docs WHERE ${conditions} LIMIT 20`
    ).all(...params);
  } catch(_) {
    try { candidates = db.prepare(`SELECT path, unit, topic, title, content FROM docs LIMIT 63`).all(); } catch(_) {}
  }
  return candidates
    .map(d => ({ ...d, score: bm25(qTokens, d.content, 1.5, 0.75, 150) * 1.4 }))
    .filter(d => d.score > 0.08)
    .sort((a,b) => b.score-a.score)
    .slice(0, topK);
}

// ── Search session history ────────────────────────────────────────────────────
function searchSession(sessionId, qTokens, topK=2) {
  const messages = getMessages(sessionId);
  if (messages.length < 4) return [];
  const pairs = [];
  for (let i=0; i<messages.length-1; i++) {
    if (messages[i].role!=='user'||messages[i+1]?.role!=='assistant') continue;
    const score = bm25(qTokens, messages[i].content+' '+messages[i+1].content);
    if (score > 0.05) pairs.push({ q:messages[i].content.slice(0,200), a:messages[i+1].content.slice(0,400), score, index:i });
  }
  return pairs.filter(p=>p.index<messages.length-3).sort((a,b)=>b.score-a.score).slice(0,topK);
}

// ── Build context string ──────────────────────────────────────────────────────
export function getRelevantContext(sessionId, question, opts={}) {
  const { docTopK=2, sessionTopK=2 } = opts;
  const qTokens = tokenize(question);
  if (!qTokens.length) return { context:'', sources:[] };

  const docResults = searchDocs(qTokens, docTopK);
  const sessResults = searchSession(sessionId, qTokens, sessionTopK);

  const sources = [];
  let context = '';

  if (docResults.length) {
    const block = docResults.map(d => {
      sources.push({ type:'doc', title:d.title, unit:d.unit, topic:d.topic });
      return `[${d.title} — ${d.unit} / ${d.topic}]\n${d.content.slice(0,600).trim()}`;
    }).join('\n\n---\n\n');
    context += `TEACHER'S COURSE MATERIAL (primary reference — use exact vocabulary):\n${block}\n\n`;
  }

  if (sessResults.length) {
    const block = sessResults.map(p=>`Q: ${p.q}\nA: ${p.a}`).join('\n\n---\n\n');
    sources.push({ type:'session', count:sessResults.length });
    context += `RELEVANT FROM EARLIER THIS SESSION:\n${block}\n\n`;
  }

  if (!context) return { context:'', sources:[] };
  context += "Align answers with the teacher's vocabulary and examples above.";
  return { context, sources };
}

// ── Duplicate detection ───────────────────────────────────────────────────────
export function isDuplicate(sessionId, question, threshold=0.75) {
  const messages = getMessages(sessionId);
  const qTokens = tokenize(question);
  if (!qTokens.length||messages.length<2) return null;
  for (let i=messages.length-2; i>=Math.max(0,messages.length-16); i-=2) {
    if (messages[i].role!=='user') continue;
    const pTokens = tokenize(messages[i].content);
    const overlap = qTokens.filter(t=>pTokens.includes(t)).length;
    if (overlap/Math.max(qTokens.length,pTokens.length) >= threshold)
      return messages[i+1]?.role==='assistant' ? messages[i+1].content : null;
  }
  return null;
}
