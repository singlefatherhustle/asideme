const SYSTEM = `You are a filter for a live software engineering teaching assistant.
Given a raw speech transcript, return ONLY valid JSON:
{"answer": boolean, "reason": "brief", "query": "cleaned question/topic"}

Answer TRUE for: questions, concepts needing examples, errors/bugs, tradeoffs, design decisions.
Answer FALSE for: pure filler (um/uh/so), fragments under 5 substantive words, admin talk (share screen, is everyone here), pure repetition.
When TRUE, "query" must be a clean well-formed version fixing transcription errors and removing filler.
Be permissive — when uncertain, answer true.`;

export async function classify(apiKey, text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) return { answer: false, reason: 'too short', query: text };
  if (/^(um+|uh+|hmm+|so+|yeah+|ok+|alright+)\s*[.,!?]*$/i.test(text.trim()))
    return { answer: false, reason: 'filler', query: text };

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-api-key':apiKey, 'anthropic-version':'2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 120, temperature: 0,
        system: SYSTEM, messages: [{ role:'user', content: text }]
      })
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text?.trim().replace(/^```json|```$/g,'').trim() || '{}';
    const result = JSON.parse(raw);
    return { answer: Boolean(result.answer), reason: result.reason||'', query: result.query||text };
  } catch(e) {
    return { answer: true, reason: 'classifier unavailable', query: text };
  }
}
