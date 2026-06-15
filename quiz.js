/**
 * quiz.js — Quiz generator + topic summarizer
 *
 * Uses Claude Haiku to generate:
 *   - Multiple choice quizzes from any indexed topic
 *   - Topic summaries (what was covered, key vocab, exercises)
 *   - Flashcard-style Q&A pairs
 */

import { db } from './db.js';
import { completeText, isProvider } from './llm-provider.js';

// ── Call the resolved LLM provider + parse JSON with clear error messages ──────
// Receives an `llm` context from resolveProvider ({ ok, provider, apiKey, ... }):
// the user's BYOK provider, or the owner's free default. Maps provider errors to
// clear user-facing text and parses the model's JSON output (any provider).
async function callLLM(llm, { system, messages, maxTokens, temperature }) {
  if (!llm || !llm.ok || !llm.apiKey || !isProvider(llm.provider)) {
    return {
      __error:
        'No AI provider available — add your own API key in Settings, or the server needs a free-provider key configured.',
    };
  }
  let text;
  try {
    const out = await completeText({
      provider: llm.provider,
      apiKey: llm.apiKey,
      system,
      messages,
      maxTokens,
      temperature,
    });
    text = (out.text || '').trim();
  } catch (e) {
    const msg = e.message || String(e);
    if (/HTTP 401|authentication|unauthorized|invalid.*key/i.test(msg)) {
      return { __error: 'API key is invalid (401). Check the key in Settings or your .env.' };
    }
    if (/quota|credit|billing|HTTP 402/i.test(msg)) {
      return { __error: 'Provider account out of credit / over quota: ' + msg };
    }
    if (/rate.?limit|HTTP 429/i.test(msg)) {
      return { __error: 'Rate limit hit — retry shortly.' };
    }
    return { __error: 'LLM error: ' + msg };
  }
  if (!text) {
    return { __error: 'Model returned empty content (it may have hit a stop condition).' };
  }
  try {
    return { __json: JSON.parse(text.replace(/^```json|^```|```$/gm, '').trim()) };
  } catch (e) {
    return {
      __error: 'Model returned invalid JSON: ' + e.message + ' (first 200 chars: ' + text.slice(0, 200) + ')',
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
export async function generateQuiz(llm, topic, count=5) {
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

  const result = await callLLM(llm, {
    maxTokens: 1500, temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return { questions: result.__json };
}

// ── Topic summarizer ──────────────────────────────────────────────────────────
export async function summarizeTopic(llm, unit, topic) {
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

  const result = await callLLM(llm, {
    maxTokens: 1000, temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return result.__json;
}

// ── Flashcard generator ───────────────────────────────────────────────────────
export async function generateFlashcards(llm, unit, topic, count=10) {
  const content = getTopicContent(unit, topic);
  if (!content) return { error: 'No content found' };

  const prompt = `Create ${count} flashcards from this material. Focus on vocabulary, concepts, and syntax.
Return ONLY a JSON array:
[{"front": "term or question", "back": "definition or answer"}]

Material:
${content.slice(0, 2500)}`;

  const result = await callLLM(llm, {
    maxTokens: 1200, temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });
  if (result.__error) return { error: result.__error };
  return { cards: result.__json };
}

// ── Session topic detector ────────────────────────────────────────────────────
export async function detectCurrentTopic(llm, recentTranscript) {
  if (!recentTranscript || recentTranscript.length < 20) return null;

  const topics = db.prepare(`SELECT DISTINCT unit, topic FROM docs ORDER BY unit, topic`).all();
  const topicList = topics.map(t => `${t.unit} / ${t.topic}`).join('\n');

  const result = await callLLM(llm, {
    maxTokens: 60, temperature: 0,
    system: `Given a transcript snippet and a list of course topics, identify the best matching topic.
Return ONLY JSON: {"unit": "...", "topic": "...", "confidence": 0.0-1.0}
If nothing matches well, return {"unit": null, "topic": null, "confidence": 0}`,
    messages: [{ role:'user', content: `Transcript: "${recentTranscript.slice(0,300)}"\n\nAvailable topics:\n${topicList}` }]
  });
  if (result.__error) return null;
  return result.__json;
}
