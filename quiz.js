/**
 * quiz.js — Quiz generator + topic summarizer
 *
 * Uses Claude Haiku to generate:
 *   - Multiple choice quizzes from any indexed topic
 *   - Topic summaries (what was covered, key vocab, exercises)
 *   - Flashcard-style Q&A pairs
 */

import { db } from './db.js';

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

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 1500, temperature: 0.7,
        messages: [{ role:'user', content: prompt }]
      })
    });
    const data = await res.json();
    const raw  = data.content?.[0]?.text?.trim().replace(/^```json|^```|```$/gm,'').trim();
    return { questions: JSON.parse(raw) };
  } catch(e) {
    return { error: e.message };
  }
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

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 1000, temperature: 0.3,
        messages: [{ role:'user', content: prompt }]
      })
    });
    const data = await res.json();
    const raw  = data.content?.[0]?.text?.trim().replace(/^```json|^```|```$/gm,'').trim();
    return JSON.parse(raw);
  } catch(e) {
    return { error: e.message };
  }
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

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 1200, temperature: 0.5,
        messages: [{ role:'user', content: prompt }]
      })
    });
    const data = await res.json();
    const raw  = data.content?.[0]?.text?.trim().replace(/^```json|^```|```$/gm,'').trim();
    return { cards: JSON.parse(raw) };
  } catch(e) {
    return { error: e.message };
  }
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
