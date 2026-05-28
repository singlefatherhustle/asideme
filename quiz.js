/**
 * quiz.js — Quiz generator + topic summarizer
 *
 * Uses Claude Haiku to generate:
 *   - Multiple choice quizzes from any indexed topic
 *   - Topic summaries (what was covered, key vocab, exercises)
 *   - Flashcard-style Q&A pairs
 */

import { db } from './db.js';

// ── Call Anthropic + parse JSON response with clear error messages ────────────
// Anthropic returns a 401 + error body when the API key is invalid. The old
// code blindly parsed `data.content?.[0]?.text` which is `undefined` on 401,
// producing the cryptic '"undefined" is not valid JSON' message. This helper
// detects auth/quota/config errors up front and returns clear text instead.
async function callClaude(apiKey, body) {
  if (!apiKey || apiKey.endsWith('_here') || apiKey.length < 30) {
    return {
      __error:
        'Anthropic API key missing or invalid — set ANTHROPIC_API_KEY in .env (current key looks like a placeholder).',
    };
  }
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    return { __error: 'Network error reaching Anthropic: ' + e.message };
  }
  let data;
  try {
    data = await res.json();
  } catch (_) {
    return { __error: 'Anthropic returned non-JSON response (HTTP ' + res.status + ')' };
  }
  if (!res.ok || data.type === 'error') {
    const msg = data?.error?.message || data?.message || 'HTTP ' + res.status;
    if (/authentication|invalid x-api-key|unauthorized/i.test(msg)) {
      return {
        __error:
          'Anthropic API key is invalid (401). Replace the placeholder in .env with a real sk-ant-... key.',
      };
    }
    if (/quota|credit|billing/i.test(msg)) {
      return { __error: 'Anthropic account out of credit / over quota: ' + msg };
    }
    if (/rate.?limit/i.test(msg)) {
      return { __error: 'Anthropic rate limit hit — retry shortly: ' + msg };
    }
    return { __error: 'Anthropic error: ' + msg };
  }
  const raw = data.content?.[0]?.text?.trim();
  if (!raw) {
    return { __error: 'Anthropic returned empty content (model may have hit a stop condition).' };
  }
  try {
    return { __json: JSON.parse(raw.replace(/^```json|^```|```$/gm, '').trim()) };
  } catch (e) {
    return {
      __error: 'Model returned invalid JSON: ' + e.message + ' (first 200 chars: ' + raw.slice(0, 200) + ')',
    };
  }
}

// ── Get doc content for a topic ───────────────────────────────────────────────
function getTopicContent(unit, topic) {
  const rows = db.prepare(
    `SELECT title, content FROM docs WHERE unit LIKE ? OR topic LIKE ? ORDER BY indexed_at LIMIT 10`
  ).all(`%${unit}%`, `%${topic}%`);
  return rows.map(r => `# ${r.title}\n${r.content.slice(0, 800)}`).join('\n\n---\n\n');
}

function getAllContent(sessionId) {
  // Get all docs + filter by session topic tags if available
  const rows = db.prepare(`SELECT title, unit, topic, content FROM docs ORDER BY unit, topic LIMIT 63`).all();
  return rows.map(r => `[${r.unit} / ${r.topic}]\n${r.content.slice(0, 400)}`).join('\n\n---\n\n');
}

// ── Quiz generator ────────────────────────────────────────────────────────────
export async function generateQuiz(apiKey, topic, count=5) {
  const content = getTopicContent(topic, topic);
  if (!content) return { error: 'No content found for this topic' };

  const prompt = `Based on this course material, generate exactly ${count} multiple choice questions.
Return ONLY a JSON array. No markdown, no explanation.

Format:
[{
  "q": "question text",
  "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
  "answer": "A",
  "explanation": "brief explanation of why"
}]

Material:
${content.slice(0, 3000)}`;

  const result = await callClaude(apiKey, {
    model: 'claude-haiku-4-5-20251001', max_tokens: 1500, temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return { questions: result.__json };
}

// ── Topic summarizer ──────────────────────────────────────────────────────────
export async function summarizeTopic(apiKey, unit, topic) {
  const content = getTopicContent(unit, topic);
  if (!content) return { error: 'No content found' };

  const prompt = `Summarize this course material into a structured learning guide.
Return ONLY JSON. No markdown, no explanation.

Format:
{
  "title": "topic title",
  "overview": "2-3 sentence summary",
  "key_concepts": ["concept 1", "concept 2", ...],
  "vocabulary": [{"term": "...", "definition": "..."}, ...],
  "common_mistakes": ["mistake 1", ...],
  "exercises": ["practice exercise 1", ...]
}

Material:
${content.slice(0, 3000)}`;

  const result = await callClaude(apiKey, {
    model: 'claude-haiku-4-5-20251001', max_tokens: 1000, temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return result.__json;
}

// ── Flashcard generator ───────────────────────────────────────────────────────
export async function generateFlashcards(apiKey, unit, topic, count=10) {
  const content = getTopicContent(unit, topic);
  if (!content) return { error: 'No content found' };

  const prompt = `Create ${count} flashcards from this material. Focus on vocabulary, concepts, and syntax.
Return ONLY a JSON array:
[{"front": "term or question", "back": "definition or answer"}]

Material:
${content.slice(0, 2500)}`;

  const result = await callClaude(apiKey, {
    model: 'claude-haiku-4-5-20251001', max_tokens: 1200, temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return { cards: result.__json };
}

// ── Session topic detector ────────────────────────────────────────────────────
export async function detectCurrentTopic(apiKey, recentTranscript) {
  if (!recentTranscript || recentTranscript.length < 20) return null;

  const topics = db.prepare(`SELECT DISTINCT unit, topic FROM docs ORDER BY unit, topic`).all();
  const topicList = topics.map(t => `${t.unit} / ${t.topic}`).join('\n');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 60, temperature: 0,
        system: `Given a transcript snippet and a list of course topics, identify the best matching topic.
Return ONLY JSON: {"unit": "...", "topic": "...", "confidence": 0.0-1.0}
If nothing matches well, return {"unit": null, "topic": null, "confidence": 0}`,
        messages: [{ role:'user', content: `Transcript: "${recentTranscript.slice(0,300)}"\n\nAvailable topics:\n${topicList}` }]
      })
    });
    const data = await res.json();
    const raw  = data.content?.[0]?.text?.trim().replace(/^```json|^```|```$/gm,'').trim();
    return JSON.parse(raw);
  } catch(_) { return null; }
}
