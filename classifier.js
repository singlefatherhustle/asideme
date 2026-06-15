const SYSTEM = `You are a filter for a live software engineering teaching assistant.
Given a raw speech transcript, return ONLY valid JSON:
{"answer": boolean, "reason": "brief", "query": "cleaned question/topic"}

Answer TRUE for: questions, concepts needing examples, errors/bugs, tradeoffs, design decisions.
Answer FALSE for: pure filler (um/uh/so), fragments under 5 substantive words, admin talk (share screen, is everyone here), pure repetition.
When TRUE, "query" must be a clean well-formed version fixing transcription errors and removing filler.
Be permissive — when uncertain, answer true.`;

import { completeText } from './llm-provider.js';

// classify(llm, text) — llm is a resolveProvider() context ({ ok, provider, apiKey }).
export async function classify(llm, text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) return { answer: false, reason: 'too short', query: text };
  if (/^(um+|uh+|hmm+|so+|yeah+|ok+|alright+)\s*[.,!?]*$/i.test(text.trim()))
    return { answer: false, reason: 'filler', query: text };

  // No provider available → be permissive so the pipeline still answers.
  if (!llm || !llm.ok || !llm.apiKey) {
    return { answer: true, reason: 'classifier unavailable', query: text };
  }

  try {
    const { text: out } = await completeText({
      provider: llm.provider,
      apiKey: llm.apiKey,
      maxTokens: 120,
      temperature: 0,
      system: SYSTEM,
      messages: [{ role: 'user', content: text }],
    });
    const raw = out?.trim().replace(/^```json|```$/g, '').trim() || '{}';
    const result = JSON.parse(raw);
    return { answer: Boolean(result.answer), reason: result.reason || '', query: result.query || text };
  } catch (e) {
    console.warn(`[classify] ${e.message}`);
    return { answer: true, reason: 'classifier unavailable', query: text };
  }
}
