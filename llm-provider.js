// llm-provider.js — multi-provider LLM abstraction with BYOK + free default.
//
// Mirrors the facade shape of transcription-provider.js (a PROVIDERS map as the
// single source of truth) but treats per-user/BYOK key resolution and per-request
// provider selection as first-class, and normalizes every provider's request and
// streaming response into one neutral shape so server.js and the frontend stay
// provider-agnostic. Raw fetch only — matches the project's no-SDK style.
//
// Key-resolution order (resolveProvider):
//   1. user's BYOK key (decrypted)        -> source: "byok"
//   2. owner's free default, then fallback -> source: "free"
//   3. nothing configured                  -> { ok:false, reason:"no_provider" }
import { decryptSecret } from "./crypto-util.js";

// Model ids are env-overridable so a tier bump is a one-line config change.
export const PROVIDERS = {
  gemini: {
    label: "Google Gemini",
    env: "GEMINI_API_KEY",
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    free: true,
    keyHint: "AIza…",
  },
  groq: {
    label: "Groq (Llama 3.3 70B)",
    env: "GROQ_API_KEY",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    free: true,
    keyHint: "gsk_…",
  },
  anthropic: {
    label: "Anthropic Claude",
    env: "ANTHROPIC_API_KEY",
    model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
    free: false,
    keyHint: "sk-ant-…",
  },
  openai: {
    label: "OpenAI",
    env: "OPENAI_API_KEY",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    free: false,
    keyHint: "sk-…",
  },
};

export const DEFAULT_LLM_PROVIDER = process.env.DEFAULT_LLM_PROVIDER || "gemini";
export const FALLBACK_LLM_PROVIDER = process.env.FALLBACK_LLM_PROVIDER || "groq";

// Request timeouts so an unresponsive provider can't hang a connection
// indefinitely (resource-exhaustion / DoS guard).
const COMPLETE_TIMEOUT_MS = parseInt(process.env.LLM_TIMEOUT_MS || "30000", 10);
const STREAM_TIMEOUT_MS = parseInt(process.env.LLM_STREAM_TIMEOUT_MS || "120000", 10);

export function isProvider(p) {
  return typeof p === "string" && Object.prototype.hasOwnProperty.call(PROVIDERS, p);
}

function ownerKey(provider) {
  const meta = PROVIDERS[provider];
  return meta ? process.env[meta.env] || "" : "";
}

/** Provider list for the settings UI — never includes any key material. */
export function publicProviderList() {
  return Object.entries(PROVIDERS).map(([key, m]) => ({
    key,
    label: m.label,
    free: m.free,
    keyHint: m.keyHint,
  }));
}

/**
 * Decide which provider + key a request should use.
 * @param {object|null} user - a users row (may carry byok_* columns), or null for the free path.
 * @returns {{ ok:true, provider, apiKey, model, source:"byok"|"free", label } | { ok:false, reason:"no_provider", source:"none" }}
 */
export function resolveProvider(user) {
  // 1. User BYOK key.
  if (user && isProvider(user.byok_provider) && user.byok_api_key_enc) {
    try {
      const key = decryptSecret({
        enc: user.byok_api_key_enc,
        iv: user.byok_key_iv,
        tag: user.byok_key_tag,
      });
      if (key) {
        const meta = PROVIDERS[user.byok_provider];
        return {
          ok: true,
          provider: user.byok_provider,
          apiKey: key,
          model: meta.model,
          source: "byok",
          label: meta.label,
        };
      }
    } catch (err) {
      // Corrupt/undecryptable key — log WITHOUT the key, fall through to the free path.
      console.warn(`[llm] BYOK decrypt failed for user ${user.id ?? "?"}: ${err.message}`);
    }
  }
  // 2. Owner free-provider key: default, then fallback.
  for (const p of [DEFAULT_LLM_PROVIDER, FALLBACK_LLM_PROVIDER]) {
    if (isProvider(p) && ownerKey(p)) {
      const meta = PROVIDERS[p];
      return { ok: true, provider: p, apiKey: ownerKey(p), model: meta.model, source: "free", label: meta.label };
    }
  }
  // 3. Nothing configured.
  return { ok: false, reason: "no_provider", source: "none" };
}

// ── Request adapters ─────────────────────────────────────────────────────────
// Convert a neutral { system, messages:[{role:"user"|"assistant", content}] } into
// each provider's wire format. Returns { url, headers, body }.
function buildRequest(provider, apiKey, { system, messages, maxTokens, temperature, stream }) {
  const model = PROVIDERS[provider].model;

  if (provider === "anthropic") {
    return {
      url: "https://api.anthropic.com/v1/messages",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: {
        model,
        max_tokens: maxTokens,
        ...(temperature != null ? { temperature } : {}),
        ...(system ? { system } : {}),
        messages,
        ...(stream ? { stream: true } : {}),
      },
    };
  }

  if (provider === "gemini") {
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
    const verb = stream ? "streamGenerateContent" : "generateContent";
    const qs = stream ? "?alt=sse" : "";
    return {
      // Key goes in the x-goog-api-key header, NOT the URL — so it can never end
      // up in an access log, error message, or any URL-derived string.
      url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:${verb}${qs}`,
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: {
        ...(system ? { system_instruction: { parts: [{ text: system }] } } : {}),
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          ...(temperature != null ? { temperature } : {}),
        },
      },
    };
  }

  // groq + openai are OpenAI-compatible.
  const url =
    provider === "groq"
      ? "https://api.groq.com/openai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
  const msgs = system ? [{ role: "system", content: system }, ...messages] : messages;
  return {
    url,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: {
      model,
      messages: msgs,
      max_tokens: maxTokens,
      ...(temperature != null ? { temperature } : {}),
      ...(stream ? { stream: true, stream_options: { include_usage: true } } : {}),
    },
  };
}

function extractText(provider, data) {
  if (provider === "anthropic") {
    return {
      text: (data.content || []).map((b) => b.text || "").join(""),
      usage: { input: data.usage?.input_tokens ?? 0, output: data.usage?.output_tokens ?? 0 },
    };
  }
  if (provider === "gemini") {
    return {
      text: (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join(""),
      usage: {
        input: data.usageMetadata?.promptTokenCount ?? 0,
        output: data.usageMetadata?.candidatesTokenCount ?? 0,
      },
    };
  }
  // groq/openai
  return {
    text: data.choices?.[0]?.message?.content || "",
    usage: { input: data.usage?.prompt_tokens ?? 0, output: data.usage?.completion_tokens ?? 0 },
  };
}

function extractDelta(provider, json) {
  if (provider === "anthropic") {
    if (json.type === "content_block_delta" && json.delta?.type === "text_delta") {
      return { text: json.delta.text };
    }
    if (json.type === "message_delta" && json.usage) {
      return { usage: { input: 0, output: json.usage.output_tokens ?? 0 } };
    }
    return {};
  }
  if (provider === "gemini") {
    const out = {
      text: (json.candidates?.[0]?.content?.parts || []).map((p) => p.text || "").join(""),
    };
    if (json.usageMetadata) {
      out.usage = {
        input: json.usageMetadata.promptTokenCount ?? 0,
        output: json.usageMetadata.candidatesTokenCount ?? 0,
      };
    }
    return out;
  }
  // groq/openai
  const out = { text: json.choices?.[0]?.delta?.content || "" };
  if (json.usage) {
    out.usage = { input: json.usage.prompt_tokens ?? 0, output: json.usage.completion_tokens ?? 0 };
  }
  return out;
}

/**
 * Non-streaming completion — for titles, follow-ups, classification, quiz, web search.
 * @returns {Promise<{ text:string, usage:{input:number,output:number} }>}
 */
export async function completeText({ provider, apiKey, system, messages, maxTokens = 512, temperature }) {
  if (!isProvider(provider)) throw new Error(`completeText: unknown provider "${provider}"`);
  if (!apiKey) throw new Error(`completeText: no API key for "${provider}"`);
  const { url, headers, body } = buildRequest(provider, apiKey, {
    system,
    messages,
    maxTokens,
    temperature,
    stream: false,
  });
  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(COMPLETE_TIMEOUT_MS),
  });
  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`[llm:${provider}] HTTP ${resp.status}: ${errText.slice(0, 300)}`);
  }
  return extractText(provider, await resp.json());
}

/**
 * Streaming chat. Invokes onToken(textDelta) for each chunk and resolves with the
 * accumulated text + token usage. Normalizes every provider's SSE into plain deltas.
 * @returns {Promise<{ fullText:string, usage:{input:number,output:number} }>}
 */
export async function streamChat({ provider, apiKey, system, messages, maxTokens = 700, temperature }, onToken) {
  if (!isProvider(provider)) throw new Error(`streamChat: unknown provider "${provider}"`);
  if (!apiKey) throw new Error(`streamChat: no API key for "${provider}"`);
  const { url, headers, body } = buildRequest(provider, apiKey, {
    system,
    messages,
    maxTokens,
    temperature,
    stream: true,
  });
  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(STREAM_TIMEOUT_MS),
  });
  if (!resp.ok || !resp.body) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`[llm:${provider}] HTTP ${resp.status}: ${errText.slice(0, 300)}`);
  }
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let fullText = "";
  let usage = { input: 0, output: 0 };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buf.indexOf("\n")) !== -1) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      let json;
      try {
        json = JSON.parse(payload);
      } catch {
        continue; // partial JSON across chunk boundary is rare for these APIs; skip malformed line
      }
      const delta = extractDelta(provider, json);
      if (delta.text) {
        fullText += delta.text;
        if (typeof onToken === "function") onToken(delta.text);
      }
      if (delta.usage) usage = delta.usage;
    }
  }
  return { fullText, usage };
}

/** Probe a BYOK key with one cheap call before persisting it. */
export async function validateKey(provider, apiKey) {
  if (!isProvider(provider)) return { ok: false, error: `unknown provider "${provider}"` };
  if (!apiKey || typeof apiKey !== "string") return { ok: false, error: "missing key" };
  try {
    await completeText({
      provider,
      apiKey,
      system: "",
      messages: [{ role: "user", content: "ping" }],
      maxTokens: 4,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

/** Boot log — reports the resolved free/default provider, never a key. */
export function logLlmProviderStatus() {
  const r = resolveProvider(null);
  if (r.ok) {
    console.log(`🤖  LLM default: ${r.label} → ${PROVIDERS[r.provider].model}`);
    const fb = PROVIDERS[FALLBACK_LLM_PROVIDER];
    if (FALLBACK_LLM_PROVIDER !== r.provider && fb && ownerKey(FALLBACK_LLM_PROVIDER)) {
      console.log(`    fallback: ${fb.label} → ${fb.model}`);
    }
  } else {
    console.warn(
      `⚠  No LLM provider key set — set ${PROVIDERS[DEFAULT_LLM_PROVIDER].env} ` +
        `(or ${PROVIDERS[FALLBACK_LLM_PROVIDER].env}) in .env, or users must BYOK.`
    );
  }
}
