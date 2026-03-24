import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@deepgram/sdk";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));

import {
  createSession,
  getSession,
  listSessions,
  updateSessionTitle,
  updateSessionTags,
  deleteSession,
  addMessage,
  getMessages,
  getFullMessages,
  addTranscript,
  touchSession,
  getSessionStats,
  db,
} from "./db.js";
import { classify } from "./classifier.js";
import { getRelevantContext, isDuplicate } from "./rag.js";
import { sessionToMarkdown, sessionToNotion } from "./export.js";
import { DEEPGRAM_KEYWORDS } from "./vocab.js";
import {
  ingestFile,
  ingestDirectory,
  docsCount,
  listDocTopics,
  setApiKey,
} from "./ingest.js";
import {
  generateQuiz,
  summarizeTopic,
  generateFlashcards,
  detectCurrentTopic,
} from "./quiz.js";
import {
  createProviderConnection,
  logProviderStatus,
  ACTIVE_PROVIDER,
} from "./transcription-provider.js";
import {
  searchWeb,
  fetchUrl,
  storeUrlContent,
  detectUrls,
  needsWebSearch,
} from "./websearch.js";
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY;
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
const PORT = parseInt(process.env.PORT || "3001", 10);
const MAX_MSGS = parseInt(process.env.SESSION_MAX_MESSAGES || "60", 10);

if (!ANTHROPIC_KEY) {
  console.error("❌  ANTHROPIC_API_KEY missing");
  process.exit(1);
}

// Give the ingest module access to the API key for image vision extraction
setApiKey(ANTHROPIC_KEY);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── Rate limiting (#10) ───────────────────────────────────────────────────────
// Chat endpoint — expensive (Anthropic + classifier calls)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 questions per minute max
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — slow down a bit" },
  skip: (req) => req.ip === "127.0.0.1" || req.ip === "::1", // no limit on localhost
});

// Ingest endpoint — Vision API calls cost money
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // 20 file uploads per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads — wait a moment" },
});

// Quiz/summary endpoints
const quizLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many quiz requests" },
});

// General API — light requests
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Rate limit exceeded" },
});

// ── Docs / ingest routes ──────────────────────────────────────────────────────
app.get("/api/docs", apiLimiter, (_, res) => {
  res.json({ count: docsCount(), topics: listDocTopics() });
});

// ── Provider info — lets the frontend know which STT is active ────────────────
app.get("/api/provider", apiLimiter, (_, res) => {
  const info = {
    active: ACTIVE_PROVIDER,
    isDeepgram: ACTIVE_PROVIDER === "deepgram",
    isGoogle: ACTIVE_PROVIDER === "google",
    isGooglePlugin: ACTIVE_PROVIDER === "google-plugin",
    isAws: ACTIVE_PROVIDER === "aws",
    isAzure: ACTIVE_PROVIDER === "azure",
    isWhisper: ACTIVE_PROVIDER === "whisper",
    isBrowser: ACTIVE_PROVIDER === "browser",
    // Tells the frontend whether to send raw audio or wait for plugin text
    sendsAudio: !["browser", "google-plugin"].includes(ACTIVE_PROVIDER),
    label:
      {
        deepgram: "Deepgram Nova-2",
        google: "Google Cloud STT",
        "google-plugin": "Google Chrome Plugin",
        aws: "AWS Transcribe",
        azure: "Azure Speech",
        whisper: "OpenAI Whisper",
        browser: "Browser SR",
      }[ACTIVE_PROVIDER] || ACTIVE_PROVIDER,
  };
  res.json(info);
});

// File upload — raw binary stream
app.post("/api/ingest/upload", ingestLimiter, async (req, res) => {
  const filename = req.headers["x-filename"];
  const unit = req.headers["x-unit"] || "uploaded";

  if (!filename)
    return res.status(400).json({ error: "x-filename header required" });

  const ext = extname(filename).slice(1).toLowerCase();
  const supported = new Set([
    "md",
    "txt",
    "js",
    "ts",
    "jsx",
    "tsx",
    "py",
    "sql",
    "pdf",
    "json",
    "sh",
    "html",
    "css",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
  ]);
  if (!supported.has(ext))
    return res.status(400).json({ error: `Unsupported file type: .${ext}` });

  try {
    await mkdir(join(__dir, "ingested", unit), { recursive: true });
    const dest = join(__dir, "ingested", unit, filename);
    const ws = createWriteStream(dest);

    req.pipe(ws);

    ws.on("finish", async () => {
      try {
        // Pass API key for image vision processing
        const result = await ingestFile(dest, ANTHROPIC_KEY);
        if (result) {
          console.log(
            `📥  Ingested: [${result.fileType}] ${result.title} (${result.chars} chars)`,
          );
          res.json({ ok: true, ...result });
        } else {
          res.status(422).json({ error: "File could not be parsed" });
        }
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });

    ws.on("error", (e) => res.status(500).json({ error: e.message }));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Re-index all teacher-docs and ingested/
app.post("/api/ingest/reindex", async (req, res) => {
  const teacherResults = await ingestDirectory(
    join(__dir, "teacher-docs"),
    ANTHROPIC_KEY,
  );
  const uploadedResults = await ingestDirectory(
    join(__dir, "ingested"),
    ANTHROPIC_KEY,
  );
  res.json({
    indexed: teacherResults.length + uploadedResults.length,
    total: docsCount(),
  });
});

// ── Quiz routes ───────────────────────────────────────────────────────────────
app.post("/api/quiz", quizLimiter, async (req, res) => {
  const { topic, count = 5 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic required" });
  const result = await generateQuiz(ANTHROPIC_KEY, topic, count);
  res.json(result);
});

app.post("/api/summary", quizLimiter, async (req, res) => {
  const { unit = "", topic = "" } = req.body;
  const result = await summarizeTopic(ANTHROPIC_KEY, unit, topic);
  res.json(result);
});

app.post("/api/flashcards", quizLimiter, async (req, res) => {
  const { unit = "", topic = "", count = 10 } = req.body;
  const result = await generateFlashcards(ANTHROPIC_KEY, unit, topic, count);
  res.json(result);
});

app.post("/api/detect-topic", apiLimiter, async (req, res) => {
  const { transcript } = req.body;
  const result = await detectCurrentTopic(ANTHROPIC_KEY, transcript);
  res.json(result || { unit: null, topic: null, confidence: 0 });
});

// ── URL fetch — ingests a URL into the docs knowledge base ────────────────────
app.post("/api/fetch-url", apiLimiter, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });
  try {
    const { url: fetchedUrl, content, title } = await fetchUrl(url);
    const stored = storeUrlContent(fetchedUrl, title, content);
    console.log(`🌐  Fetched + indexed: ${title} (${content.length} chars)`);
    res.json({ ok: true, title, chars: content.length, stored });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Sessions ──────────────────────────────────────────────────────────────────
app.post("/api/session", apiLimiter, (req, res) => {
  const id = uuidv4();
  const title =
    req.body?.title ||
    `Session ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  createSession(id, title);
  res.json({ sessionId: id, title });
});

app.get("/api/sessions", apiLimiter, (_, res) => res.json(listSessions()));

app.get("/api/session/:id", (req, res) => {
  const s = getSession(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  res.json({ ...s, messages: getFullMessages(req.params.id) });
});

app.get("/api/session/:id/stats", (req, res) => {
  const stats = getSessionStats(req.params.id);
  if (!stats) return res.status(404).json({ error: "Not found" });
  res.json(stats);
});

app.delete("/api/session/:id", (req, res) => {
  deleteSession(req.params.id);
  res.json({ ok: true });
});

app.patch("/api/session/:id/title", (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "title required" });
  updateSessionTitle(req.params.id, title);
  res.json({ ok: true });
});

// ── Export ────────────────────────────────────────────────────────────────────
app.get("/api/session/:id/export/markdown", (req, res) => {
  const md = sessionToMarkdown(req.params.id);
  if (!md) return res.status(404).json({ error: "Session not found" });
  const session = getSession(req.params.id);
  const filename = (session?.title || "session")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();
  res.setHeader("Content-Type", "text/markdown");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}.md"`);
  res.send(md);
});

app.post("/api/session/:id/export/notion", async (req, res) => {
  try {
    const result = await sessionToNotion(
      req.params.id,
      NOTION_KEY,
      NOTION_DB_ID,
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Auto-title using Claude ───────────────────────────────────────────────────
async function autoTitle(sessionId, apiKey) {
  const session = getSession(sessionId);
  if (!session) return;
  const messages = getMessages(sessionId);
  if (messages.length < 6) return; // wait for a few Q&As
  if (
    !session.title.startsWith("Session ") &&
    session.title !== "Untitled Session"
  )
    return;

  try {
    const sample = messages
      .filter((m) => m.role === "user")
      .slice(0, 4)
      .map((m) => m.content)
      .join("\n");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 30,
        temperature: 0,
        system:
          "Generate a concise 4-7 word title for this coding session based on the topics discussed. Return ONLY the title, no punctuation.",
        messages: [{ role: "user", content: sample }],
      }),
    });
    const data = await res.json();
    const title = data.content?.[0]?.text?.trim();
    if (title) updateSessionTitle(sessionId, title);
  } catch (_) {}
}

// ── Follow-up suggestions — things the student can say/ask next ───────────────
async function getFollowUps(apiKey, question, answer) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 150,
        temperature: 0.7,
        system: `Given what a teacher just covered and a student's response, suggest 3 things
the student could say next — out loud, to the teacher, in class.
Sound like an engaged, sharp student: smart questions, observations, or connections to prior material.
Write in first-person spoken voice. Short. Natural. No bullet points.
Return ONLY a JSON array of 3 strings.
Example: ["So does that mean we'd use this over a regular for loop?", "Right, because the callback fires after the promise resolves", "What happens if the async function throws inside a try catch?"]`,
        messages: [
          {
            role: "user",
            content: `Teacher covered: ${question}\nStudent's response: ${answer.slice(0, 300)}`,
          },
        ],
      }),
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text
      ?.trim()
      .replace(/^```json|^```|```$/gm, "")
      .trim();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 3) : [];
  } catch (_) {
    return [];
  }
}

// ── Tags extractor ────────────────────────────────────────────────────────────
function extractTags(text) {
  const l = text.toLowerCase();
  return [
    [/\basync|await|promise|callback\b/, "async"],
    [/\bclass|inherit|extend|interface|oop\b/, "OOP"],
    [/\barray|map|filter|reduce|set|hashmap\b/, "data-struct"],
    [/\bsql|query|join|index|database\b/, "SQL"],
    [/\bapi|rest|http|fetch|endpoint|graphql\b/, "API"],
    [/\breact|hook|state|prop|component|jsx\b/, "React"],
    [/\bbig.?o|algorithm|sort|search|complexity\b/, "algorithms"],
    [/\btypescript|generic|interface|type\b/, "TypeScript"],
    [/\btest|mock|debug|assert|coverage\b/, "testing"],
    [/\bpython|flask|django|fastapi|pip\b/, "Python"],
    [/\bnode|express|npm|middleware\b/, "Node.js"],
    [/\bdocker|kubernetes|ci.?cd|deploy\b/, "DevOps"],
    [/\bpointer|memory|heap|rust|c\+\+\b/, "systems"],
    [/\bmachine.?learning|neural|model|training\b/, "ML/AI"],
  ]
    .filter(([rx]) => rx.test(l))
    .map(([, t]) => t)
    .slice(0, 4);
}

// ── Chat SSE ──────────────────────────────────────────────────────────────────
app.post("/api/chat", chatLimiter, async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message)
    return res.status(400).json({ error: "sessionId and message required" });
  const session = getSession(sessionId);
  if (!session) return res.status(404).json({ error: "Session not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (event, data) =>
    res.write(`event:${event}\ndata:${JSON.stringify(data)}\n\n`);

  // 1. Classify
  send("status", { stage: "classifying" });
  const clf = await classify(ANTHROPIC_KEY, message);
  if (!clf.answer) {
    send("filtered", { reason: clf.reason, original: message });
    res.end();
    return;
  }

  const cleanQuery = clf.query || message;
  const tags = extractTags(cleanQuery);

  // 2. Duplicate check
  const dupAnswer = isDuplicate(sessionId, cleanQuery);
  if (dupAnswer) {
    send("status", { stage: "duplicate" });
    send("duplicate", { answer: dupAnswer, query: cleanQuery });
    res.end();
    return;
  }

  send("status", { stage: "answering", query: cleanQuery });

  // 3. RAG — search teacher docs + session history
  const { context: ragContext, sources: ragSources } = getRelevantContext(
    sessionId,
    cleanQuery,
  );
  const hasRag = ragContext.length > 0;
  const hasDocRag = ragSources.some((s) => s.type === "doc");

  // 4. URL detection — if transcript contains a dev URL, fetch and index it
  const urls = detectUrls(cleanQuery);
  for (const url of urls) {
    try {
      const { url: u, content, title } = await fetchUrl(url);
      storeUrlContent(u, title, content);
      send("url_fetched", { url: u, title });
      console.log(`🌐  Auto-fetched URL: ${title}`);
    } catch (_) {}
  }

  // 5. Web search — when question is outside the docs
  let webContext = "";
  let usedWebSearch = false;
  if (needsWebSearch(cleanQuery, hasRag)) {
    try {
      send("status", { stage: "searching" });
      const webResult = await searchWeb(ANTHROPIC_KEY, cleanQuery);
      if (webResult) {
        webContext = `WEB SEARCH RESULT (real-time):\n${webResult}`;
        usedWebSearch = true;
        console.log(`🔍  Web search used for: "${cleanQuery.slice(0, 60)}"`);
      }
    } catch (e) {
      console.warn("Web search failed:", e.message);
    }
  }

  // 6. Add user message and build history
  addMessage(sessionId, "user", cleanQuery, tags);
  touchSession(sessionId);
  const history = getMessages(sessionId, MAX_MSGS);

  // 7. Build system prompt — generates responses the student can say out loud
  const systemPrompt = [
    `You are a real-time coaching assistant listening to a live software engineering class.

Your ONLY job is to generate a smart, natural response that the STUDENT can say out loud
to their teacher or class — right now, in the moment.

This is NOT an explanation for the student to read silently.
This IS something they speak aloud to sound knowledgeable and engaged.

RESPONSE TYPES — match what the situation calls for:
- Teacher asks the class a question → give a direct, confident answer the student can say
- Teacher explains a concept → give a thoughtful follow-up or reinforcing comment
- Teacher shows code → give an observation, edge case, or "what if" question the student can ask
- Teacher mentions a term/tool → give a brief but sharp contribution that shows understanding
- Student wants to ask something smart → give a precise, well-phrased question the student can ask

VOICE AND TONE RULES — this must sound like a sharp student speaking, not a textbook:
- First person: "So basically...", "Right, because...", "That makes sense because...", "So if I understand correctly..."
- Natural spoken cadence — short sentences, the way people actually talk in class
- Confident but not arrogant — sounds like someone who has been paying attention
- Use the exact vocabulary the teacher used — mirror their terminology
- 1-3 sentences maximum — anything longer is too much to say out loud naturally
- If code is relevant, reference it conversationally: "so that's why we use async there..."
- Never use bullet points — this is spoken word, not a list
- Never start with "As a student" or "I would say" — just give the actual words

KNOWLEDGE PRIORITY:
1. Course material below — use the teacher's exact terms and examples
2. Web search results below — for version-specific or real-time info
3. Your own engineering knowledge — fill any gaps

Never say "I don't know." Never explain things academically. Speak like a student who gets it.`,
    hasRag ? `\n\nCOURSE CONTEXT:\n${ragContext}` : "",
    webContext ? `\n\nWEB SEARCH RESULT:\n${webContext}` : "",
  ].join("");

  // 8. Stream
  const t0 = Date.now();
  let fullResponse = "";

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
        stream: true,
        system: systemPrompt,
        messages: history,
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.json();
      send("error", { message: err.error?.message || "Anthropic error" });
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const dec = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const obj = JSON.parse(data);
          if (
            obj.type === "content_block_delta" &&
            obj.delta?.type === "text_delta"
          ) {
            fullResponse += obj.delta.text;
            send("token", { token: obj.delta.text });
          }
        } catch (_) {}
      }
    }

    const ms = Date.now() - t0;
    addMessage(sessionId, "assistant", fullResponse, tags, ms, hasRag);

    // Update session tags
    try {
      const existing = JSON.parse(session.tags || "[]");
      const merged = [...new Set([...existing, ...tags])].slice(0, 10);
      updateSessionTags(sessionId, merged);
    } catch (_) {}

    // Auto-title after enough context
    autoTitle(sessionId, ANTHROPIC_KEY).catch(() => {});

    // Send done IMMEDIATELY so frontend finalizes the QA block
    send("done", {
      ms,
      ragUsed: hasRag,
      ragSources,
      hasDocRag,
      usedWebSearch,
      tags,
    });

    // Follow-ups fire after done — frontend handles them if they arrive
    getFollowUps(ANTHROPIC_KEY, cleanQuery, fullResponse)
      .then((followUps) => {
        if (followUps.length) send("followups", { followUps });
        res.end();
      })
      .catch(() => {
        res.end();
      });

    console.log(
      `💬  [${sessionId.slice(0, 8)}] "${cleanQuery.slice(0, 50)}" → ${ms}ms${hasRag ? " +RAG" : ""}`,
    );
  } catch (err) {
    console.error("Stream error:", err);
    send("error", { message: err.message });
    res.end();
  }
});

// ── HTTP + WebSocket server ───────────────────────────────────────────────────
const server = createServer(app);

if (DEEPGRAM_KEY) {
  const deepgram = createClient(DEEPGRAM_KEY);
// ── Transcription WebSocket — provider-agnostic ───────────────────────────────
// Swap STT providers by setting TRANSCRIPTION_PROVIDER in .env
// Supported: deepgram, google, google-plugin, aws, azure, whisper, browser
const wss = new WebSocketServer({ server, path: "/transcribe" });

wss.on("connection", (client) => {
  let provider = null;

  try {
    provider = createProviderConnection(client, {
      apiKey:     DEEPGRAM_KEY,
      sampleRate: 16000,
      language:   "en-US",
      diarize:    true,
    });
  } catch(err) {
    client.send(JSON.stringify({ type:"error", message: err.message }));
    return;
  }

  client.on("message", (data, isBinary) => {
    if (isBinary) {
      // Raw PCM audio — forward to active STT provider (unless plugin mode)
      if (ACTIVE_PROVIDER !== "google-plugin") {
        provider?.send(data);
      }
    } else {
      // Text messages — for control commands and google-plugin transcript passthrough
      try {
        const msg = JSON.parse(data.toString());

        // Google Plugin sends text transcripts in its own format
        if (msg.type === "transcript" && provider?.handleTextMessage) {
          provider.handleTextMessage(msg);
        }
        // Standard control commands
        else if (msg.type === "stop") {
          provider?.stop();
        }
        else if (msg.type === "save" && msg.sessionId) {
          addTranscript(msg.sessionId, msg.speaker ?? 0, msg.text);
        }
      } catch(_) {}
    }
  });

  client.on("close", () => { try { provider?.stop(); } catch(_) {} });
  client.on("error", (err) => console.error("Client WS error:", err.message));
});
}

server.listen(PORT, async () => {
  console.log(`\n⚡  DevListen v3.1 → http://localhost:${PORT}\n`);
  logProviderStatus();
  if (!NOTION_KEY)
    console.log("ℹ  No NOTION_API_KEY — Notion export disabled\n");

  const count = docsCount();
  if (count === 0) {
    console.log("📚  Indexing teacher docs + ingested files...");
    await ingestDirectory(join(__dir, "teacher-docs"), ANTHROPIC_KEY);
    await ingestDirectory(join(__dir, "ingested"), ANTHROPIC_KEY);
    console.log(`📚  ${docsCount()} docs ready\n`);
  } else {
    console.log(`📚  ${count} docs ready in RAG\n`);
  }

  // ── Nightly session cleanup (#7) ────────────────────────────────────────────
  // Runs immediately on start, then every 24 hours.
  // Deletes sessions (and their messages) older than SESSION_CLEANUP_DAYS.
  const CLEANUP_DAYS = parseInt(process.env.SESSION_CLEANUP_DAYS || "30", 10);

  function runCleanup() {
    try {
      const cutoff = Math.floor(Date.now() / 1000) - CLEANUP_DAYS * 86400;
      const result = db
        .prepare(
          `DELETE FROM sessions WHERE last_active < ? AND id NOT IN (
           SELECT id FROM sessions ORDER BY last_active DESC LIMIT 10
         )`,
        )
        .run(cutoff);
      if (result.changes > 0) {
        console.log(
          `🗑  Cleaned up ${result.changes} old session(s) (older than ${CLEANUP_DAYS} days)`,
        );
      }
    } catch (e) {
      console.warn("Cleanup error:", e.message);
    }
  }

  runCleanup();
  setInterval(runCleanup, 24 * 60 * 60 * 1000); // every 24 hours
  console.log(
    `🗑  Session cleanup scheduled (keep last ${CLEANUP_DAYS} days)\n`,
  );
});
