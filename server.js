import "dotenv/config";

// Sentry initializes BEFORE express so it can patch http/express modules.
// No-op if SENTRY_DSN is unset — guards every call site so dev breaks nothing
// when the env var is missing. Frontend Sentry is a separate concern (would
// need a CDN tag or bundle) and can be added later if needed.
import * as Sentry from "@sentry/node";
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.0, // no performance traces — just error capture
    sendDefaultPii: false,
    // PII redaction: scrub the most sensitive fields before any payload leaves
    // the process. Mirrors what log.js does for the local logger.
    beforeSend(event) {
      try {
        if (event.user) {
          if (event.user.email) event.user.email = "[redacted]";
          if (event.user.ip_address) event.user.ip_address = "[redacted]";
        }
        if (event.request) {
          delete event.request.cookies;
          if (event.request.headers) {
            delete event.request.headers.cookie;
            delete event.request.headers.authorization;
          }
          if (event.request.data) {
            try {
              const d =
                typeof event.request.data === "string"
                  ? JSON.parse(event.request.data)
                  : event.request.data;
              for (const k of [
                "email",
                "query",
                "message",
                "transcript",
                "content",
                "details",
              ]) {
                if (d && d[k]) d[k] = "[redacted]";
              }
              event.request.data = d;
            } catch (_) {
              // body wasn't JSON — drop it entirely, don't leak unstructured bytes
              event.request.data = "[redacted]";
            }
          }
        }
      } catch (e) {
        // Never let redaction fail loud — better to send a less-redacted event
        // than to crash. Log locally only.
        console.warn("Sentry beforeSend redaction failed:", e && e.message);
      }
      return event;
    },
  });
  console.log("⚡  Sentry error tracking enabled");
}

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@deepgram/sdk";
import { dirname, join, extname, basename, resolve } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "node:fs";
import { log, safeLog } from "./log.js";

const __dir = dirname(fileURLToPath(import.meta.url));

import {
  createSession,
  getSession,
  getSessionForUser,
  listSessions,
  listSessionsForUser,
  updateSessionTitle,
  updateSessionTags,
  deleteSession,
  addMessage,
  getMessages,
  getFullMessages,
  addTranscript,
  touchSession,
  getSessionStats,
  writeAuditLog,
  db,
} from "./db.js";
import { classify } from "./classifier.js";
import { getRelevantContext, isDuplicate } from "./rag.js";
import { sessionToMarkdown, sessionToNotion, sessionToTranscript } from "./export.js";
import {
  summaryToMarkdown,
  summaryToPDF,
  quizToMarkdown,
  quizToPDF,
  flashcardsToMarkdown,
  flashcardsToPDF,
} from "./export-summary.js";
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
import {
  createOrRefreshUser,
  getUserByEmail,
  userFromCookie,
  userFromToken,
  setSessionCookie,
  clearSessionCookie,
  requireActiveAccess,
  publicUser,
  isValidEmail,
  issueVerifyToken,
  consumeVerifyToken,
  bumpSessionVersion,
  canIssueMagicLinkFor,
  listUsersWithSubscription,
  updateSubscriptionFromStripe,
  REQUIRE_VERIFICATION,
  TRIAL_HOURS,
  COOKIE_NAME,
  setUserByok,
  clearUserByok,
} from "./auth.js";
import {
  resolveProvider,
  streamChat,
  completeText,
  validateKey,
  publicProviderList,
  logLlmProviderStatus,
  isProvider,
  PROVIDERS,
} from "./llm-provider.js";
import { encryptSecret, isEncryptionConfigured } from "./crypto-util.js";
import { sendMagicLink } from "./email.js";
import {
  isStripeConfigured,
  createCheckoutSession,
  createPortalSession,
  verifyWebhookSignature,
  syncSubscriptionEvent,
} from "./billing.js";

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const DEEPGRAM_KEY = process.env.DEEPGRAM_API_KEY;
const NOTION_KEY = process.env.NOTION_API_KEY;
const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;
const PORT = parseInt(process.env.PORT || "3001", 10);
const MAX_MSGS = parseInt(process.env.SESSION_MAX_MESSAGES || "60", 10);

// Anthropic is no longer required to boot — the default LLM is now the free
// provider (Gemini) via llm-provider.js, with Anthropic available as BYOK or
// fallback. We only need *some* LLM provider key; logLlmProviderStatus() warns
// at startup if none is configured.
if (ANTHROPIC_KEY) {
  // Ingest image-vision (PNG→MD) uses Claude specifically; wire it when present.
  setApiKey(ANTHROPIC_KEY);
}

const app = express();
// Behind a reverse proxy (Fly.io = 1 hop), trust the proxy's X-Forwarded-For so
// rate limiters key on the real client IP, not the single proxy IP. A precise hop
// count (not `true`) keeps XFF non-spoofable — express-rate-limit rejects `true`.
app.set("trust proxy", parseInt(process.env.TRUST_PROXY_HOPS || "1", 10));

// ── Security: helmet + CSP ────────────────────────────────────────────────────
// CSP allows ASIDE's existing asset sources (Google Fonts, Prism CDN, our own
// Anthropic API for the WebSocket). HSTS is gated on production so localhost
// devs can use http://. crossOriginEmbedderPolicy is disabled so CDN assets
// continue to work in browsers that enforce COEP strictly.
// In production, only encrypted WebSocket (wss:) is allowed. Dev keeps ws:
// so local http://localhost works without certs.
const isProd = process.env.NODE_ENV === "production";
const wsConnectSrc = isProd ? ["wss:"] : ["wss:", "ws:"];

// gzip compression — biggest perf win for an app with 198 KB of inline HTML.
// Cuts the wire size ~6x, dropping first-paint time significantly on any
// connection slower than a LAN. Stream-safe (works with the SSE chat endpoint).
app.use(
  compression({
    // Don't compress responses with a `x-no-compression` header (rare, but
    // useful for streaming endpoints that don't benefit from gzip).
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
    // Threshold: skip tiny responses where compression overhead exceeds win.
    threshold: 512,
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // ASIDE has inline scripts (theme bootstrap, SW reg, library)
          "https://cdnjs.cloudflare.com", // Prism
        ],
        // helmet's default is `script-src-attr 'none'`, which blocks every
        // inline event handler (onclick, onchange, …) in the markup. We use
        // ~30 inline onclicks across the modals, quiz, flashcards, summary,
        // and study tabs — none of them take user-controlled input, all user
        // content runs through esc() before being inserted. Since script-src
        // already allows 'unsafe-inline', granting the same to script-src-attr
        // doesn't expand the attack surface.
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // inline <style> blocks
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com", // Prism theme
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: [
          "'self'",
          "https://api.anthropic.com",
          "https://api.deepgram.com",
          ...wsConnectSrc,
        ],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "same-site" },
    hsts: isProd
      ? { maxAge: 31536000, includeSubDomains: true, preload: false }
      : false,
  }),
);

// Permissions-Policy: explicitly deny powerful browser APIs we don't use.
// Microphone is allowed (self) because ASIDE records audio for transcription.
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    [
      'accelerometer=()',
      'autoplay=()',
      'camera=()',                     // ASIDE never uses camera
      'cross-origin-isolated=()',
      'display-capture=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'geolocation=()',                // never needed
      'gyroscope=()',
      'keyboard-map=()',
      'magnetometer=()',
      'microphone=(self)',             // required for transcription
      'midi=()',
      'payment=()',                    // Stripe redirects to its own domain
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'usb=()',
      'web-share=(self)',
      'xr-spatial-tracking=()',
    ].join(', '),
  );
  next();
});

// ── CORS — locked down by env in production ──────────────────────────────────
// Dev: wide open. Prod: only CORS_ORIGIN may call us. The app itself is
// same-origin, so the only legitimate cross-origin caller is a future SPA.
const corsOrigin =
  process.env.CORS_ORIGIN ||
  (process.env.NODE_ENV === "production" ? false : true);
app.use(
  cors({
    origin: corsOrigin,
    credentials: true, // needed for cookie-based auth across origins
  }),
);

// ── Stripe webhook MUST be mounted BEFORE express.json() so Stripe can
// verify the raw body signature. express.json() would consume the stream.
app.post(
  "/api/stripe-webhook",
  express.raw({ type: "application/json", limit: "1mb" }),
  async (req, res) => {
    const sigHeader = req.headers["stripe-signature"];
    if (!sigHeader) return res.status(400).send("missing signature");
    let event;
    try {
      event = verifyWebhookSignature(req.body, sigHeader);
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    try {
      const result = await syncSubscriptionEvent(event);
      console.log(
        `📩 Stripe ${event.type} → ${JSON.stringify(result).slice(0, 200)}`,
      );
      res.json({ received: true, result });
    } catch (err) {
      console.error("Stripe webhook handler error:", err.message);
      // Stripe retries on 5xx, so return 200 for our internal errors to avoid
      // an infinite retry loop. The error is already logged.
      res.json({ received: true, error: err.message });
    }
  },
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser(process.env.SESSION_SECRET || "dev-only"));

// ── Operational endpoints (load balancers + monitoring) ──────────────────────
// /health  — process is up. No external dependencies checked.
// /ready   — DB reachable + ANTHROPIC_KEY configured. Returns 503 if not ready.
// /metrics — Prometheus-style counters. Cheap to compute, cache-friendly.
const BOOT_TIME = Date.now();

app.get("/health", (_, res) => {
  res.json({ status: "ok", uptime_seconds: Math.floor((Date.now() - BOOT_TIME) / 1000) });
});

app.get("/ready", (_, res) => {
  const checks = { db: false, anthropic_key: !!ANTHROPIC_KEY };
  try {
    db.prepare("SELECT 1").get();
    checks.db = true;
  } catch (_) {
    checks.db = false;
  }
  const ready = checks.db && checks.anthropic_key;
  res.status(ready ? 200 : 503).json({ status: ready ? "ready" : "not_ready", checks });
});

app.get("/metrics", (_, res) => {
  try {
    const userCount = db.prepare("SELECT COUNT(*) as n FROM users").get().n;
    const sessionCount = db.prepare("SELECT COUNT(*) as n FROM sessions").get().n;
    const docCount = db.prepare("SELECT COUNT(*) as n FROM docs").get().n;
    const paidUsers = db
      .prepare("SELECT COUNT(*) as n FROM users WHERE plan IN ('paid','team') AND subscription_status = 'active'")
      .get().n;
    const trialActive = db
      .prepare("SELECT COUNT(*) as n FROM users WHERE plan = 'trial' AND trial_expires_at > ?")
      .get(Date.now()).n;
    const generationsToday = db
      .prepare(
        "SELECT COALESCE(SUM(daily_calls), 0) as n FROM users WHERE daily_window_at > ?",
      )
      .get(Date.now() - 24 * 60 * 60 * 1000).n;
    // Prometheus text format (simple, no client lib needed)
    res.setHeader("Content-Type", "text/plain; version=0.0.4");
    res.send(
      [
        `# HELP aside_uptime_seconds Process uptime in seconds`,
        `# TYPE aside_uptime_seconds gauge`,
        `aside_uptime_seconds ${Math.floor((Date.now() - BOOT_TIME) / 1000)}`,
        `# HELP aside_users_total Total registered users`,
        `# TYPE aside_users_total gauge`,
        `aside_users_total ${userCount}`,
        `# HELP aside_users_paid_active Active paid subscribers`,
        `# TYPE aside_users_paid_active gauge`,
        `aside_users_paid_active ${paidUsers}`,
        `# HELP aside_users_trial_active Active trial users`,
        `# TYPE aside_users_trial_active gauge`,
        `aside_users_trial_active ${trialActive}`,
        `# HELP aside_sessions_total Total sessions ever created`,
        `# TYPE aside_sessions_total gauge`,
        `aside_sessions_total ${sessionCount}`,
        `# HELP aside_docs_total Documents indexed in RAG corpus`,
        `# TYPE aside_docs_total gauge`,
        `aside_docs_total ${docCount}`,
        `# HELP aside_generations_today Generations called in the last 24h (sum across users)`,
        `# TYPE aside_generations_today gauge`,
        `aside_generations_today ${generationsToday}`,
        "",
      ].join("\n"),
    );
  } catch (e) {
    res.status(500).send(`# error: ${e.message}\n`);
  }
});

// ── SW version: served with cache-busting + content-hash version injection ────
// The literal token __SW_VERSION__ in public/sw.js is replaced at serve-time
// with a content hash of the file. Every deploy that changes sw.js content
// automatically invalidates the old cache without anyone bumping a constant.
const swPath = join(__dir, "public", "sw.js");
let swContent = readFileSync(swPath, "utf8");
const swHash = crypto
  .createHash("sha256")
  .update(swContent)
  .digest("hex")
  .slice(0, 12);
swContent = swContent.replace(/__SW_VERSION__/g, `aside-${swHash}`);
app.get("/sw.js", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.send(swContent);
});

// (legacy SW path kept below for completeness — explicit /sw.js wins)
app.get("/sw.js.legacy", (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Service-Worker-Allowed", "/");
  next();
});
app.get("/manifest.webmanifest", (req, res, next) => {
  res.setHeader("Cache-Control", "public, max-age=300");
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  next();
});

// ── Route topology ────────────────────────────────────────────────────────────
//   /            → marketing landing page (public/landing/index.html)
//   /app         → the actual ASIDE app shell (public/index.html)
//   /pricing     → pricing landing page
//   /manifesto   → manifesto / about page
//   /welcome     → 301 redirect to / (back-compat with old links)
//
// The app deliberately moved off / so first-time visitors hit the marketing
// surface. Installed PWA users continue to land on /app because manifest's
// start_url is set there.
const landingRoot = join(__dir, "public", "landing");
const publicRoot = join(__dir, "public");
app.get("/", (_, res) => res.sendFile(join(landingRoot, "index.html")));
// /landing/ — legacy/internal references that point to the landing root.
// Serve the same homepage so links like `/landing/#features` resolve cleanly.
app.get("/landing/", (_, res) => res.sendFile(join(landingRoot, "index.html")));
app.get("/app", (_, res) => res.sendFile(join(publicRoot, "index.html")));
// Standalone preview of an alternate landing direction (claude.ai feel).
// Self-contained file so it can be A/B'd against / without touching the live
// landing CSS. Delete or keep based on whether the direction is approved.
app.get("/demo", (_, res) => res.sendFile(join(landingRoot, "demo.html")));
app.get("/pricing", (_, res) => res.sendFile(join(landingRoot, "pricing.html")));
app.get("/manifesto", (_, res) => res.sendFile(join(landingRoot, "manifesto.html")));
app.get("/welcome", (_, res) => res.redirect(301, "/"));

// Static middleware still serves all assets (icons, css, js, manifest, docs,
// favicon, mark.svg, sw.js) but `index: false` prevents it from auto-serving
// public/index.html at / — we want our explicit route above to win.
app.use(express.static("public", { index: false }));
// Expose teacher-docs and ingested folders so the Library modal can render
// markdown content. Image files are blocked at the route layer — only the .md
// transcripts are surfaced to the client now that all images have md siblings.
const blockImages = (req, res, next) => {
  if (/\.(png|jpe?g|gif|webp|bmp|tiff?|svg)$/i.test(req.path)) {
    return res.status(404).end();
  }
  next();
};
app.use(
  "/teacher-docs",
  blockImages,
  express.static("teacher-docs", { fallthrough: false, index: false }),
);
app.use(
  "/ingested",
  blockImages,
  express.static("ingested", { fallthrough: false, index: false }),
);

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

// Abuse-report and DMCA submissions: stricter per-IP so the abuse channel
// itself doesn't become an abuse vector (someone flooding the queue with
// junk reports). 10 reports per 15 min per IP is generous for legit users,
// hostile for spammers.
const abuseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many reports — try again later" },
});

// ── Docs / ingest routes ──────────────────────────────────────────────────────
// Only .md docs are exposed to the client. Image rows stay in the DB so the RAG
// pipeline can still use their OCR'd content as retrieval context.
app.get("/api/docs", apiLimiter, (_, res) => {
  const topics = listDocTopics().filter((t) => t.file_type !== "image");
  res.json({ count: topics.length, topics });
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
// HARDENED: path traversal prevention + auth gate + size cap.
const INGEST_ROOT = resolve(__dir, "ingested");
const MAX_UPLOAD_BYTES = parseInt(
  process.env.MAX_UPLOAD_BYTES || String(25 * 1024 * 1024), // 25 MB default
  10,
);
const SUPPORTED_UPLOAD_EXTS = new Set([
  "md", "txt", "js", "ts", "jsx", "tsx", "py", "sql", "pdf", "json", "sh",
  "html", "css", "png", "jpg", "jpeg", "webp", "gif",
]);

app.post(
  "/api/ingest/upload",
  ingestLimiter,
  requireActiveAccess,
  async (req, res) => {
    // Sanitize filename: basename strips any directory parts.
    const filename = basename(String(req.headers["x-filename"] || ""));
    // Sanitize unit: alphanumeric + dash/underscore only.
    const unit = String(req.headers["x-unit"] || "uploaded").replace(
      /[^a-zA-Z0-9_-]/g,
      "",
    );

    if (!filename || filename.startsWith(".")) {
      return res
        .status(400)
        .json({ error: "x-filename header required (no hidden files)" });
    }
    if (!unit) {
      return res.status(400).json({ error: "Invalid x-unit value" });
    }

    const ext = extname(filename).slice(1).toLowerCase();
    if (!SUPPORTED_UPLOAD_EXTS.has(ext)) {
      return res.status(400).json({ error: `Unsupported file type: .${ext}` });
    }

    // Resolve and verify the final path is still inside INGEST_ROOT.
    // Defense in depth against any sanitization bypass.
    const destDir = resolve(INGEST_ROOT, unit);
    const dest = resolve(destDir, filename);
    if (
      !destDir.startsWith(INGEST_ROOT + "/") &&
      destDir !== INGEST_ROOT
    ) {
      return res.status(400).json({ error: "Path traversal blocked (unit)" });
    }
    if (!dest.startsWith(destDir + "/")) {
      return res
        .status(400)
        .json({ error: "Path traversal blocked (filename)" });
    }

    try {
      await mkdir(destDir, { recursive: true });
      const ws = createWriteStream(dest);

      // Stream-level size cap. Closes the request if the upload exceeds the
      // configured maximum, preventing disk-filling DoS.
      let bytesWritten = 0;
      let aborted = false;
      req.on("data", (chunk) => {
        bytesWritten += chunk.length;
        if (bytesWritten > MAX_UPLOAD_BYTES && !aborted) {
          aborted = true;
          req.unpipe(ws);
          ws.end();
          // Best-effort cleanup
          try {
            createWriteStream(dest).end();
          } catch (_) {}
          if (!res.headersSent) {
            res.status(413).json({
              error: `Upload exceeds ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB limit`,
            });
          }
        }
      });

      req.pipe(ws);

      ws.on("finish", async () => {
        if (aborted) return;
        try {
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
          if (!res.headersSent) {
            res.status(500).json({ error: "Ingest failed" });
          }
          console.error("Ingest error:", e.message);
        }
      });

      ws.on("error", (e) => {
        if (!res.headersSent) {
          res.status(500).json({ error: "Upload write failed" });
        }
        console.error("Upload write error:", e.message);
      });
    } catch (e) {
      if (!res.headersSent) {
        res.status(500).json({ error: "Upload failed" });
      }
      console.error("Upload setup error:", e.message);
    }
  },
);

// Re-index all teacher-docs and ingested/ — ADMIN ONLY.
// This endpoint triggers Claude Vision on every image, which costs real $.
// Locking it to an admin allowlist (ADMIN_EMAILS env var) prevents an
// unauthenticated attacker from running up your Anthropic bill.
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "signup_required" });
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.includes(req.user.email.toLowerCase())) {
    return res.status(403).json({ error: "admin_only" });
  }
  next();
}

app.post(
  "/api/ingest/reindex",
  requireActiveAccess,
  requireAdmin,
  async (req, res) => {
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
  },
);

// ── Auth: signup, signin, me, signout ─────────────────────────────────────────
// Email-only signup. Issues a 48-hour free trial, stored against the email
// in the users table, with an HMAC-signed cookie as the session token. No
// password (yet) — the trial is a low-friction onboarding step, not a vault.
// Per-IP rate limit for the unauthenticated auth endpoints. Real humans
// retry once or twice; bots iterate. 8/hr/IP is generous for legit users
// (typo recovery, partner sharing) and hostile for credential-stuffing /
// magic-link harvesting bots. The per-email rate limit (see auth.js
// canIssueMagicLinkFor) is the orthogonal backstop.
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many signup attempts. Try again in an hour." },
});

// Verify-token endpoint — tighter still. A bot trying to guess a token
// would burn through hundreds of attempts; legit users only ever hit it
// once per email. 12 verify attempts per 15 minutes per IP catches scans
// without ever bothering legitimate users.
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many verification attempts. Try again later." },
});

// Signup flow:
//   1. POST /api/signup { email }
//      → creates (or finds) user row, issues verify token, sends magic link
//      → response identical for new + existing emails (no enumeration leak)
//      → returns { ok: true, status: 'check_email', verifyLink? (dev) }
//   2. User clicks magic link → GET /verify?token=... → server claims token,
//      marks email_verified_at, sets session cookie, redirects to /app.
//
// In dev mode (RESEND_API_KEY unset), the magic link is also returned in the
// JSON response + logged to stdout so the developer can click it manually.
app.post("/api/signup", signupLimiter, async (req, res) => {
  const email = (req.body?.email || "").toString();
  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "invalid_email",
      message: "Enter a valid email address to start your trial.",
    });
  }
  // Per-email rate limit (anti inbox-bombing) — distinct from IP-based
  // signupLimiter. Prevents one attacker varying IPs to flood one inbox.
  const gate = canIssueMagicLinkFor(email);
  if (!gate.ok) {
    return res.status(429).json({
      error: "too_many_links",
      message: `Too many verification links sent to this address. Try again in ${Math.ceil(gate.retryAfterMs / 60000)} minutes.`,
    });
  }
  // Forgot-cookie protection: re-signup with same email returns the original
  // user. trial_expires_at is set on first creation only — never reset.
  const user = createOrRefreshUser(email);

  // If verification is not required (dev default) AND user is already verified,
  // skip the magic link and issue the cookie directly. Otherwise issue token.
  if (!REQUIRE_VERIFICATION) {
    // Dev mode: keep email-only signup with auto-verification for ease of use,
    // but still go through the verify-token path so the flow can be tested.
    const token = issueVerifyToken(user.id);
    const sendResult = await sendMagicLink(email, token);
    return res.json({
      ok: true,
      status: "check_email",
      message:
        "Check your inbox for a magic link to verify and start your trial.",
      dev: sendResult.dev || false,
      verifyLink: sendResult.link || undefined, // present only in dev
    });
  }

  // Production: always require email verification.
  const token = issueVerifyToken(user.id);
  await sendMagicLink(email, token);
  res.json({
    ok: true,
    status: "check_email",
    message:
      "Check your inbox for a magic link to verify and start your trial.",
  });
});

// Magic-link verification — single-use, expires in 30 min, sets cookie.
// verifyLimiter caps 12 attempts per 15 min per IP so bots can't try to brute
// the token space (HMAC tokens are unguessable in practice, but the limit is
// cheap defense in depth + protects the DB from useless lookups).
app.get("/verify", verifyLimiter, async (req, res) => {
  const token = (req.query?.token || "").toString();
  const user = consumeVerifyToken(token);
  if (user) {
    writeAuditLog(user.id, "email_verified", null, req);
  }
  if (!user) {
    return res.status(400).send(`
      <!doctype html><html><head><meta charset="utf-8">
      <title>Verification link invalid — ASIDE</title>
      <link rel="stylesheet" href="/landing/landing.css"></head>
      <body><div class="ambient"></div><div class="grain"></div>
      <main class="container" style="padding:120px 0;text-align:center">
        <h1 class="h-hero" style="font-size:48px">Link expired</h1>
        <p class="sub">That verification link is invalid or has expired.</p>
        <a href="/" class="btn btn-primary">Start over →</a>
      </main></body></html>
    `);
  }
  // Successful verification → set session cookie + redirect to app.
  setSessionCookie(res, user);
  res.redirect("/app?verified=1");
});

// Resend the verify email if the user lost the link.
app.post("/api/signup/resend", signupLimiter, async (req, res) => {
  const email = (req.body?.email || "").toString();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "invalid_email" });
  }
  const user = getUserByEmail(email);
  // Always return success — no email enumeration leak.
  if (!user) return res.json({ ok: true });
  if (user.email_verified_at) return res.json({ ok: true, alreadyVerified: true });
  const token = issueVerifyToken(user.id);
  const sendResult = await sendMagicLink(email, token);
  res.json({
    ok: true,
    dev: sendResult.dev || false,
    verifyLink: sendResult.link || undefined,
  });
});

// Legacy alias — /api/signin maps to signup for email-only flow. Both create
// the cookie via the magic-link path now.
app.post("/api/signin", signupLimiter, async (req, res) => {
  const email = (req.body?.email || "").toString();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "invalid_email" });
  }
  const user = createOrRefreshUser(email);
  const token = issueVerifyToken(user.id);
  const sendResult = await sendMagicLink(email, token);
  res.json({
    ok: true,
    status: "check_email",
    message: "Check your inbox for the sign-in link.",
    dev: sendResult.dev || false,
    verifyLink: sendResult.link || undefined,
  });
});

app.get("/api/me", (req, res) => {
  const user = userFromCookie(req);
  if (!user) return res.json({ user: null });
  res.json({ user: publicUser(user) });
});

app.post("/api/signout", (req, res) => {
  // Bump session_version so every outstanding cookie for this user becomes
  // invalid — true revocation, not just client-side clear. Even if someone
  // stole the cookie, the next request with it will fail userFromToken().
  const user = userFromCookie(req);
  if (user) {
    bumpSessionVersion(user.id);
    writeAuditLog(user.id, "signout", null, req);
  }
  clearSessionCookie(res);
  res.json({ ok: true });
});

// ── BYOK settings: provider + API key ─────────────────────────────────────────
// Lightweight auth (logged-in user) WITHOUT requireActiveAccess so reading/saving
// settings never consumes a daily generation call.
app.get("/api/settings", apiLimiter, (req, res) => {
  const user = userFromCookie(req);
  if (!user) return res.status(401).json({ error: "signup_required" });
  res.json({
    byokProvider: user.byok_provider || null,
    hasByokKey: !!(user.byok_provider && user.byok_api_key_enc),
    providers: publicProviderList(),
    freeProvider: process.env.DEFAULT_LLM_PROVIDER || "gemini",
  });
});

app.post("/api/settings", apiLimiter, async (req, res) => {
  const user = userFromCookie(req);
  if (!user) return res.status(401).json({ error: "signup_required" });
  const { provider, apiKey } = req.body || {};

  // Clear BYOK: an empty/absent provider wipes the stored key.
  if (!provider) {
    clearUserByok(user.id);
    writeAuditLog(user.id, "byok_clear", null, req);
    return res.json({ ok: true, byokProvider: null, hasByokKey: false });
  }

  if (!isProvider(provider)) {
    return res.status(400).json({ error: "invalid_provider" });
  }
  if (typeof apiKey !== "string" || apiKey.trim().length < 8 || apiKey.length > 400) {
    return res.status(400).json({ error: "invalid_key", message: "That API key looks malformed." });
  }
  if (!isEncryptionConfigured()) {
    return res.status(503).json({
      error: "encryption_unavailable",
      message: "Server key storage isn't configured (KEY_ENC_SECRET missing).",
    });
  }

  // Probe the key with one cheap call before persisting — no dead keys stored.
  const check = await validateKey(provider, apiKey.trim());
  if (!check.ok) {
    return res.status(400).json({
      error: "key_rejected",
      message: `That ${PROVIDERS[provider].label} key was rejected: ${check.error}`,
    });
  }

  try {
    setUserByok(user.id, provider, encryptSecret(apiKey.trim()));
    writeAuditLog(user.id, "byok_set", provider, req);
  } catch (err) {
    console.error(`[settings] encrypt/store failed for user ${user.id}: ${err.message}`);
    return res.status(500).json({ error: "store_failed" });
  }
  // Never echo the key back.
  res.json({ ok: true, byokProvider: provider, hasByokKey: true });
});

// ── Billing: Stripe Checkout + Customer Portal ───────────────────────────────
// POST /api/checkout — creates a Stripe Checkout Session for the Pro plan and
// returns the URL. Frontend redirects user to result.url. On success Stripe
// redirects back to /app?checkout=success; the subscription is then provisioned
// asynchronously via the /api/stripe-webhook handler above.
app.post("/api/checkout", apiLimiter, requireActiveAccess, async (req, res) => {
  if (!isStripeConfigured()) {
    return res.status(503).json({
      error: "stripe_not_configured",
      message:
        "Payments aren't configured yet. Set STRIPE_SECRET_KEY + STRIPE_PRICE_ID env vars.",
    });
  }
  const interval = req.body?.interval === "year" ? "year" : "month";
  try {
    const session = await createCheckoutSession(req.user, { interval });
    res.json({ ok: true, url: session.url });
  } catch (err) {
    console.error("createCheckoutSession error:", err.message);
    res.status(500).json({ error: "checkout_failed", message: err.message });
  }
});

// POST /api/billing-portal — sends an existing subscriber to the Stripe
// Customer Portal to manage their subscription (cancel, update card, view
// invoices). Requires they've already paid at least once.
app.post(
  "/api/billing-portal",
  apiLimiter,
  requireActiveAccess,
  async (req, res) => {
    if (!isStripeConfigured()) {
      return res.status(503).json({ error: "stripe_not_configured" });
    }
    if (!req.user.stripe_customer_id) {
      return res.status(400).json({
        error: "no_subscription",
        message: "You don't have an active subscription yet.",
      });
    }
    try {
      const session = await createPortalSession(req.user);
      res.json({ ok: true, url: session.url });
    } catch (err) {
      console.error("createPortalSession error:", err.message);
      res.status(500).json({ error: "portal_failed", message: err.message });
    }
  },
);

// ── GDPR: data subject endpoints ─────────────────────────────────────────────
// POST /api/account/export — JSON dump of everything we hold on the user.
// Required by GDPR Art. 15 (access) and Art. 20 (portability).
app.post(
  "/api/account/export",
  apiLimiter,
  requireActiveAccess,
  (req, res) => {
    const userId = req.user.id;
    const sessions = listSessionsForUser(userId);
    const sessionsWithData = sessions.map((s) => {
      const messages = db
        .prepare(
          "SELECT role, content, tags, ms, rag_used, created_at FROM messages WHERE session_id = ? ORDER BY created_at",
        )
        .all(s.id);
      const transcripts = db
        .prepare(
          "SELECT speaker, text, created_at FROM transcripts WHERE session_id = ? ORDER BY created_at",
        )
        .all(s.id);
      return { ...s, messages, transcripts };
    });
    const payload = {
      exported_at: new Date().toISOString(),
      account: publicUser(req.user),
      sessions: sessionsWithData,
    };
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="aside-export-${userId}.json"`,
    );
    res.send(JSON.stringify(payload, null, 2));
  },
);

// POST /api/account/delete — fully removes the user. Cascades via FK to wipe
// sessions, messages, transcripts. Required by GDPR Art. 17 (erasure).
app.post(
  "/api/account/delete",
  apiLimiter,
  requireActiveAccess,
  (req, res) => {
    const userId = req.user.id;
    // Audit BEFORE delete so the user_id reference is still meaningful.
    writeAuditLog(userId, "account_delete", null, req);
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
    db.prepare("DELETE FROM users WHERE id = ?").run(userId);
    clearSessionCookie(res);
    log.info({ event: "account_deleted", userId }, "user deleted account");
    res.json({ ok: true });
  },
);

// ── Abuse reporting + DMCA + admin moderation queue ──────────────────────────
//
// User-initiated reports of abusive content go to abuse_reports as kind='abuse'.
// DMCA notices go to the same table as kind='dmca' with a structured payload
// (so we maintain §512 safe-harbor by following the formal process). All
// reports stay live in the library/UI until an admin reviews them — per the
// "queue-for-review" design choice. Admins act via /api/admin/abuse-queue.

// Helper: pull IP + UA from the request for forensic correlation later.
function reqIpUa(req) {
  const ip =
    req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req?.ip ||
    req?.socket?.remoteAddress ||
    null;
  const ua = req?.headers?.["user-agent"] || null;
  return { ip, ua };
}

// Sanitize free-text fields: cap length + strip control chars.
function clipText(s, max = 2000) {
  if (typeof s !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return s.replace(/[\x00-\x08\x0B-\x1F\x7F]/g, "").slice(0, max).trim();
}

// POST /api/abuse-report — authenticated user reports a piece of content.
// Body: { contentType, contentId, reason, details }
// Returns: { ok: true, id }
app.post(
  "/api/abuse-report",
  abuseLimiter,
  requireActiveAccess,
  (req, res) => {
    const { contentType, contentId, reason, details } = req.body || {};
    const allowedTypes = ["doc", "transcript", "session", "message", "other"];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ error: "Invalid content type" });
    }
    if (!contentId || typeof contentId !== "string" || contentId.length > 200) {
      return res.status(400).json({ error: "Missing or invalid content ID" });
    }
    if (!reason || typeof reason !== "string") {
      return res.status(400).json({ error: "Reason required" });
    }
    const { ip, ua } = reqIpUa(req);
    const result = db
      .prepare(
        `INSERT INTO abuse_reports
        (kind, reporter_id, content_type, content_id, reason, details, ip, ua)
        VALUES ('abuse', ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        req.user.id,
        contentType,
        contentId,
        clipText(reason, 100),
        clipText(details, 2000),
        ip,
        ua,
      );
    writeAuditLog(
      req.user.id,
      "abuse_report",
      { contentType, contentId, reportId: result.lastInsertRowid },
      req,
    );
    log.info(
      { event: "abuse_report", userId: req.user.id, contentType, reportId: result.lastInsertRowid },
      "abuse report received",
    );
    res.json({ ok: true, id: result.lastInsertRowid });
  },
);

// POST /api/abuse-report-public — anonymous report (for non-users — e.g. a
// teacher whose lecture was recorded without consent). Requires email so we
// can follow up. Rate-limited per-IP to deter spam.
app.post("/api/abuse-report-public", abuseLimiter, (req, res) => {
  const { email, contentType, contentId, reason, details } = req.body || {};
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Valid email required" });
  }
  const allowedTypes = ["doc", "transcript", "session", "message", "other"];
  if (!allowedTypes.includes(contentType)) {
    return res.status(400).json({ error: "Invalid content type" });
  }
  if (!reason || typeof reason !== "string") {
    return res.status(400).json({ error: "Reason required" });
  }
  const { ip, ua } = reqIpUa(req);
  const result = db
    .prepare(
      `INSERT INTO abuse_reports
      (kind, reporter_email, content_type, content_id, reason, details, ip, ua)
      VALUES ('abuse', ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      clipText(email, 200),
      contentType,
      clipText(contentId || "unknown", 200),
      clipText(reason, 100),
      clipText(details, 2000),
      ip,
      ua,
    );
  log.info(
    { event: "abuse_report_public", reportId: result.lastInsertRowid },
    "public abuse report received",
  );
  res.json({ ok: true, id: result.lastInsertRowid });
});

// POST /api/dmca-takedown — formal DMCA §512(c)(3) notice. Public, no auth
// required (the copyright holder is usually not an ASIDE user).
// Required fields per 17 U.S.C. §512(c)(3)(A):
//   - identity of copyrighted work
//   - location of infringing material on ASIDE
//   - claimant contact info (name, email, address, phone)
//   - good-faith statement
//   - accuracy + penalty-of-perjury statement
//   - physical or electronic signature
app.post("/api/dmca-takedown", abuseLimiter, (req, res) => {
  const b = req.body || {};
  const required = [
    "claimantName",
    "claimantEmail",
    "claimantAddress",
    "copyrightedWork",
    "infringingLocation",
    "goodFaithStatement",
    "accuracyStatement",
    "signature",
  ];
  for (const f of required) {
    if (!b[f] || typeof b[f] !== "string" || !b[f].trim()) {
      return res
        .status(400)
        .json({ error: `Missing required DMCA field: ${f}` });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.claimantEmail)) {
    return res.status(400).json({ error: "Valid claimant email required" });
  }
  if (b.goodFaithStatement !== true && b.goodFaithStatement !== "true") {
    // Only enforce the boolean if it's not a free-text statement
    if (typeof b.goodFaithStatement === "string" && b.goodFaithStatement.length < 20) {
      return res.status(400).json({
        error: "Good-faith statement must be a written declaration",
      });
    }
  }
  const { ip, ua } = reqIpUa(req);
  const payload = JSON.stringify({
    claimantName: clipText(b.claimantName, 200),
    claimantEmail: clipText(b.claimantEmail, 200),
    claimantAddress: clipText(b.claimantAddress, 500),
    claimantPhone: clipText(b.claimantPhone, 50),
    copyrightedWork: clipText(b.copyrightedWork, 1000),
    infringingLocation: clipText(b.infringingLocation, 1000),
    goodFaithStatement: clipText(String(b.goodFaithStatement), 500),
    accuracyStatement: clipText(String(b.accuracyStatement), 500),
    signature: clipText(b.signature, 200),
  });
  const result = db
    .prepare(
      `INSERT INTO abuse_reports
      (kind, reporter_email, content_type, content_id, reason, details, payload, ip, ua)
      VALUES ('dmca', ?, 'other', ?, 'DMCA takedown', ?, ?, ?, ?)`,
    )
    .run(
      clipText(b.claimantEmail, 200),
      clipText(b.infringingLocation, 200),
      clipText(b.copyrightedWork, 2000),
      payload,
      ip,
      ua,
    );
  log.info(
    { event: "dmca_takedown", reportId: result.lastInsertRowid },
    "DMCA takedown notice received",
  );
  res.json({
    ok: true,
    id: result.lastInsertRowid,
    message:
      "DMCA notice received. We will review within 24 hours. You will receive a confirmation email at " +
      b.claimantEmail,
  });
});

// GET /api/admin/abuse-queue — admin-only, paginated list of pending reports.
// Query: ?status=pending|dismissed|removed&kind=abuse|dmca&limit=50&offset=0
app.get(
  "/api/admin/abuse-queue",
  apiLimiter,
  requireActiveAccess,
  requireAdmin,
  (req, res) => {
    const status = req.query.status || "pending";
    const kind = req.query.kind || null;
    const limit = Math.min(parseInt(req.query.limit) || 50, 200);
    const offset = parseInt(req.query.offset) || 0;
    const params = [status];
    let sql = `SELECT id, kind, reporter_id, reporter_email, content_type, content_id,
      reason, details, payload, status, reviewed_by, reviewed_at, created_at
      FROM abuse_reports WHERE status = ?`;
    if (kind) {
      sql += " AND kind = ?";
      params.push(kind);
    }
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    const reports = db.prepare(sql).all(...params);
    const counts = db
      .prepare(
        `SELECT status, COUNT(*) as n FROM abuse_reports GROUP BY status`,
      )
      .all();
    res.json({ reports, counts });
  },
);

// POST /api/admin/abuse/:id/dismiss — mark a report as dismissed (not a violation).
app.post(
  "/api/admin/abuse/:id/dismiss",
  apiLimiter,
  requireActiveAccess,
  requireAdmin,
  (req, res) => {
    const reportId = parseInt(req.params.id);
    if (!reportId) return res.status(400).json({ error: "Invalid report ID" });
    const r = db
      .prepare(
        `UPDATE abuse_reports SET status='dismissed', reviewed_by=?, reviewed_at=unixepoch()
         WHERE id=? AND status='pending'`,
      )
      .run(req.user.id, reportId);
    if (r.changes === 0) {
      return res.status(404).json({ error: "Report not found or already reviewed" });
    }
    writeAuditLog(req.user.id, "abuse_dismiss", { reportId }, req);
    res.json({ ok: true });
  },
);

// POST /api/admin/abuse/:id/remove — mark a report as actioned AND soft-delete
// the referenced content. For docs: sets removed_at. For transcripts/messages:
// hard-deletes. For sessions: hard-deletes (cascades to messages + transcripts).
app.post(
  "/api/admin/abuse/:id/remove",
  apiLimiter,
  requireActiveAccess,
  requireAdmin,
  (req, res) => {
    const reportId = parseInt(req.params.id);
    if (!reportId) return res.status(400).json({ error: "Invalid report ID" });
    const report = db
      .prepare("SELECT * FROM abuse_reports WHERE id = ?")
      .get(reportId);
    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.status !== "pending") {
      return res.status(400).json({ error: "Report already reviewed" });
    }

    // Apply the takedown based on content type.
    let removed = false;
    try {
      if (report.content_type === "doc") {
        const r = db
          .prepare("UPDATE docs SET removed_at=unixepoch() WHERE id=? OR path=?")
          .run(parseInt(report.content_id) || 0, report.content_id);
        removed = r.changes > 0;
      } else if (report.content_type === "transcript") {
        const r = db
          .prepare("DELETE FROM transcripts WHERE id=?")
          .run(parseInt(report.content_id) || 0);
        removed = r.changes > 0;
      } else if (report.content_type === "message") {
        const r = db
          .prepare("DELETE FROM messages WHERE id=?")
          .run(parseInt(report.content_id) || 0);
        removed = r.changes > 0;
      } else if (report.content_type === "session") {
        const r = db
          .prepare("DELETE FROM sessions WHERE id=?")
          .run(report.content_id);
        removed = r.changes > 0;
      }
    } catch (e) {
      log.error(
        { event: "abuse_remove_failed", reportId, err: e.message },
        "admin content removal failed",
      );
      return res.status(500).json({ error: "Removal failed: " + e.message });
    }

    db.prepare(
      `UPDATE abuse_reports SET status='removed', reviewed_by=?, reviewed_at=unixepoch() WHERE id=?`,
    ).run(req.user.id, reportId);
    writeAuditLog(
      req.user.id,
      "abuse_remove",
      { reportId, contentType: report.content_type, contentId: report.content_id, removed },
      req,
    );
    res.json({ ok: true, removed });
  },
);

// POST /api/admin/doc/:id/restore — undo a soft-delete (false-report recovery).
app.post(
  "/api/admin/doc/:id/restore",
  apiLimiter,
  requireActiveAccess,
  requireAdmin,
  (req, res) => {
    const docId = parseInt(req.params.id);
    if (!docId) return res.status(400).json({ error: "Invalid doc ID" });
    const r = db
      .prepare("UPDATE docs SET removed_at=NULL WHERE id=?")
      .run(docId);
    if (r.changes === 0) {
      return res.status(404).json({ error: "Doc not found" });
    }
    writeAuditLog(req.user.id, "abuse_restore", { docId }, req);
    res.json({ ok: true });
  },
);

// ── Quiz routes (all gated behind requireActiveAccess) ────────────────────────
app.post("/api/quiz", quizLimiter, requireActiveAccess, async (req, res) => {
  const { topic, count = 5 } = req.body;
  if (!topic) return res.status(400).json({ error: "topic required" });
  const result = await generateQuiz(resolveProvider(req.user), topic, count);
  res.json(result);
});

app.post("/api/summary", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "" } = req.body;
  const result = await summarizeTopic(resolveProvider(req.user), unit, topic);
  res.json(result);
});

app.post("/api/summary/download/markdown", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "" } = req.body;
  try {
    const summary = await summarizeTopic(resolveProvider(req.user), unit, topic);
    if (summary.error) {
      return res.status(400).json(summary);
    }
    const markdown = summaryToMarkdown(summary);
    const filename = `${summary.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md`;
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(markdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/summary/download/pdf", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "" } = req.body;
  try {
    const summary = await summarizeTopic(resolveProvider(req.user), unit, topic);
    if (summary.error) {
      return res.status(400).json(summary);
    }
    const pdfStream = await summaryToPDF(summary);
    const filename = `${summary.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    pdfStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/flashcards", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "", count = 10 } = req.body;
  const result = await generateFlashcards(resolveProvider(req.user), unit, topic, count);
  res.json(result);
});

// ── Quiz exports ──────────────────────────────────────────────────────────────
function safeFilename(s, ext) {
  const base = String(s || "export")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "export";
  return `${base}.${ext}`;
}

app.post("/api/quiz/download/markdown", quizLimiter, requireActiveAccess, async (req, res) => {
  const { topic = "", count = 5, title = "" } = req.body;
  if (!topic) return res.status(400).json({ error: "topic required" });
  try {
    const quiz = await generateQuiz(resolveProvider(req.user), topic, count);
    if (quiz.error) return res.status(400).json(quiz);
    const md = quizToMarkdown(quiz, { title: title || `${topic} — Quiz` });
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename(title || topic + "-quiz", "md")}"`,
    );
    res.send(md);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/quiz/download/pdf", quizLimiter, requireActiveAccess, async (req, res) => {
  const { topic = "", count = 5, title = "" } = req.body;
  if (!topic) return res.status(400).json({ error: "topic required" });
  try {
    const quiz = await generateQuiz(resolveProvider(req.user), topic, count);
    if (quiz.error) return res.status(400).json(quiz);
    const pdfStream = await quizToPDF(quiz, { title: title || `${topic} — Quiz` });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename(title || topic + "-quiz", "pdf")}"`,
    );
    pdfStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Flashcards exports ────────────────────────────────────────────────────────
app.post("/api/flashcards/download/markdown", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "", count = 10, title = "" } = req.body;
  try {
    const cards = await generateFlashcards(resolveProvider(req.user), unit, topic, count);
    if (cards.error) return res.status(400).json(cards);
    const md = flashcardsToMarkdown(cards, {
      title: title || `${topic || unit} — Flashcards`,
    });
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename(title || (topic || unit) + "-flashcards", "md")}"`,
    );
    res.send(md);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/flashcards/download/pdf", quizLimiter, requireActiveAccess, async (req, res) => {
  const { unit = "", topic = "", count = 10, title = "" } = req.body;
  try {
    const cards = await generateFlashcards(resolveProvider(req.user), unit, topic, count);
    if (cards.error) return res.status(400).json(cards);
    const pdfStream = await flashcardsToPDF(cards, {
      title: title || `${topic || unit} — Flashcards`,
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeFilename(title || (topic || unit) + "-flashcards", "pdf")}"`,
    );
    pdfStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/detect-topic", apiLimiter, requireActiveAccess, async (req, res) => {
  const { transcript } = req.body;
  // Bound input: detectCurrentTopic only uses the first 300 chars anyway.
  if (typeof transcript !== "string" || transcript.length > 4096) {
    return res.status(400).json({ error: "transcript must be a string under 4KB" });
  }
  const result = await detectCurrentTopic(resolveProvider(req.user), transcript);
  res.json(result || { unit: null, topic: null, confidence: 0 });
});

// ── URL fetch — ingests a URL into the docs knowledge base ────────────────────
app.post("/api/fetch-url", apiLimiter, requireActiveAccess, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });
  if (typeof url !== "string" || url.length > 2000) {
    return res.status(400).json({ error: "url must be a string under 2KB" });
  }
  try {
    const { url: fetchedUrl, content, title } = await fetchUrl(url);
    const stored = storeUrlContent(fetchedUrl, title, content);
    console.log(`🌐  Fetched + indexed: ${title} (${content.length} chars)`);
    res.json({ ok: true, title, chars: content.length, stored });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ── Sessions (multi-tenant: every route owner-scoped) ────────────────────────
// requireSessionOwnership is the gate for all routes that take :id. It loads
// the session scoped to the current user — returning 404 (not 403) if the row
// doesn't exist OR doesn't belong to them. The 404 prevents attackers from
// enumerating which session IDs exist on the system.
function requireSessionOwnership(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "signup_required" });
  }
  const s = getSessionForUser(req.params.id, req.user.id);
  if (!s) {
    return res.status(404).json({ error: "Session not found" });
  }
  req.session = s;
  next();
}

app.post("/api/session", apiLimiter, requireActiveAccess, (req, res) => {
  const id = uuidv4();
  const title =
    req.body?.title ||
    `Session ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`;
  // CRITICAL: pass req.user.id so the session is owned by the creator
  createSession(id, title, req.user.id);
  res.json({ sessionId: id, title });
});

app.get(
  "/api/sessions",
  apiLimiter,
  requireActiveAccess,
  (req, res) => res.json(listSessionsForUser(req.user.id)),
);

app.get(
  "/api/session/:id",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    res.json({ ...req.session, messages: getFullMessages(req.params.id) });
  },
);

app.get(
  "/api/session/:id/stats",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    const stats = getSessionStats(req.params.id);
    if (!stats) return res.status(404).json({ error: "Not found" });
    res.json(stats);
  },
);

app.delete(
  "/api/session/:id",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    deleteSession(req.params.id);
    res.json({ ok: true });
  },
);

app.patch(
  "/api/session/:id/title",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    if (typeof title !== "string" || title.length > 200) {
      return res
        .status(400)
        .json({ error: "title must be a string under 200 chars" });
    }
    updateSessionTitle(req.params.id, title);
    res.json({ ok: true });
  },
);

// ── Export ────────────────────────────────────────────────────────────────────
app.get(
  "/api/session/:id/export/markdown",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    const md = sessionToMarkdown(req.params.id);
    if (!md) return res.status(404).json({ error: "Session not found" });
    const filename = (req.session?.title || "session")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    res.setHeader("Content-Type", "text/markdown");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.md"`,
    );
    res.send(md);
  },
);

app.post(
  "/api/session/:id/export/notion",
  requireActiveAccess,
  requireSessionOwnership,
  async (req, res) => {
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
  },
);

// Transcript-only download — plain text dump of the live lecture transcript,
// no Q&A, no markup. Useful for students who just want the words.
app.get(
  "/api/session/:id/export/transcript",
  requireActiveAccess,
  requireSessionOwnership,
  (req, res) => {
    const txt = sessionToTranscript(req.params.id);
    if (!txt) {
      return res
        .status(404)
        .json({ error: "No transcript captured for this session" });
    }
    const filename = (req.session?.title || "session")
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}_transcript.txt"`,
    );
    res.send(txt);
  },
);

// ── Auto-title using Claude ───────────────────────────────────────────────────
async function autoTitle(sessionId, llm) {
  if (!llm || !llm.apiKey) return;
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
    const { text } = await completeText({
      provider: llm.provider,
      apiKey: llm.apiKey,
      maxTokens: 30,
      temperature: 0,
      system:
        "Generate a concise 4-7 word title for this coding session based on the topics discussed. Return ONLY the title, no punctuation.",
      messages: [{ role: "user", content: sample }],
    });
    const title = text?.trim();
    if (title) updateSessionTitle(sessionId, title);
  } catch (err) {
    console.warn(`[autoTitle] ${err.message}`);
  }
}

// ── Follow-up suggestions — things the student can say/ask next ───────────────
async function getFollowUps(llm, question, answer) {
  if (!llm || !llm.apiKey) return [];
  try {
    const { text } = await completeText({
      provider: llm.provider,
      apiKey: llm.apiKey,
      maxTokens: 150,
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
    });
    const raw = text
      ?.trim()
      .replace(/^```json|^```|```$/gm, "")
      .trim();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.slice(0, 3) : [];
  } catch (err) {
    console.warn(`[getFollowUps] ${err.message}`);
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
app.post("/api/chat", chatLimiter, requireActiveAccess, async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message)
    return res.status(400).json({ error: "sessionId and message required" });
  // Ownership check — session must belong to the authenticated user
  const session = getSessionForUser(sessionId, req.user.id);
  if (!session) return res.status(404).json({ error: "Session not found" });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const send = (event, data) =>
    res.write(`event:${event}\ndata:${JSON.stringify(data)}\n\n`);

  // Resolve the LLM provider for THIS user: their BYOK key → owner free key → none.
  const llm = resolveProvider(req.user);
  if (!llm.ok) {
    send("error", {
      message:
        "No AI provider is configured. Add your own API key in Settings to start generating.",
      action: "add_your_own_key",
    });
    res.end();
    return;
  }

  // 1. Classify
  send("status", { stage: "classifying" });
  const clf = await classify(llm, message);
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
  // Web search uses Anthropic's native web_search tool, so it's only available
  // when the resolved provider is Anthropic (a BYOK-Anthropic user). Free Gemini
  // users fall back to RAG + model knowledge.
  if (needsWebSearch(cleanQuery, hasRag) && llm.provider === "anthropic") {
    try {
      send("status", { stage: "searching" });
      const webResult = await searchWeb(llm.apiKey, cleanQuery);
      if (webResult) {
        webContext = `WEB SEARCH RESULT (real-time):\n${webResult}`;
        usedWebSearch = true;
        // Don't log the query text — it's potentially PII / sensitive.
        log.info({ event: "web_search_used", queryLength: cleanQuery.length }, "web search performed");
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
    const { fullText, usage } = await streamChat(
      {
        provider: llm.provider,
        apiKey: llm.apiKey,
        system: systemPrompt,
        messages: history,
        maxTokens: 700,
      },
      (token) => send("token", { token }),
    );
    fullResponse = fullText;
    if (!fullResponse) {
      send("error", { message: "The model returned an empty response. Try again." });
      res.end();
      return;
    }

    const ms = Date.now() - t0;
    addMessage(sessionId, "assistant", fullResponse, tags, ms, hasRag);

    // Update session tags
    try {
      const existing = JSON.parse(session.tags || "[]");
      const merged = [...new Set([...existing, ...tags])].slice(0, 10);
      updateSessionTags(sessionId, merged);
    } catch (_) {}

    // Token-usage logging — never logs content, only counts + provider/source.
    log.info(
      {
        event: "llm_generate",
        provider: llm.provider,
        source: llm.source,
        inTok: usage.input,
        outTok: usage.output,
        ms,
      },
      "llm generation",
    );

    // Auto-title after enough context
    autoTitle(sessionId, llm).catch(() => {});

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
    getFollowUps(llm, cleanQuery, fullResponse)
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
}

// ── Transcription WebSocket — provider-agnostic ───────────────────────────────
// Swap STT providers by setting TRANSCRIPTION_PROVIDER in .env
// Supported: deepgram, google, google-plugin, aws, azure, whisper, browser
// noServer: true means WSS does NOT bind to the HTTP server automatically.
// We hand-roll the upgrade so we can authenticate the cookie before allowing
// the WebSocket handshake to complete. Otherwise anyone with the URL could
// stream audio through the server's STT key.
const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  // Only intercept /transcribe — pass other upgrades through to Express.
  if (!req.url.startsWith("/transcribe")) {
    socket.destroy();
    return;
  }
  // Parse the cookie header manually (cookie-parser middleware doesn't run
  // for upgrade requests).
  const cookieHeader = req.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("=") || "")];
    }),
  );
  const token = cookies[COOKIE_NAME];
  const user = userFromToken(token);

  if (!user) {
    socket.write(
      "HTTP/1.1 401 Unauthorized\r\n" +
        "Content-Type: application/json\r\n" +
        "Connection: close\r\n\r\n" +
        JSON.stringify({ error: "signup_required" }),
    );
    socket.destroy();
    return;
  }

  // Reject if trial expired and not on a paid plan.
  const trialActive = user.trial_expires_at > Date.now();
  if (user.plan === "trial" && !trialActive) {
    socket.write(
      "HTTP/1.1 402 Payment Required\r\n" +
        "Content-Type: application/json\r\n" +
        "Connection: close\r\n\r\n" +
        JSON.stringify({ error: "trial_expired" }),
    );
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    ws.user = user; // attach authenticated user for message handlers
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (client) => {
  let provider = null;

  try {
    provider = createProviderConnection(client, {
      apiKey: DEEPGRAM_KEY,
      sampleRate: 16000,
      language: "en-US",
      diarize: true,
    });
  } catch (err) {
    client.send(JSON.stringify({ type: "error", message: err.message }));
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
        } else if (msg.type === "save" && msg.sessionId) {
          // Ownership check: only allow transcript writes to sessions owned
          // by the authenticated user attached to this WS at upgrade time.
          const ownedSession = getSessionForUser(msg.sessionId, client.user.id);
          if (ownedSession) {
            addTranscript(msg.sessionId, msg.speaker ?? 0, msg.text);
          } else {
            client.send(
              JSON.stringify({ type: "error", message: "Session not found" }),
            );
          }
        }
      } catch (_) {}
    }
  });

  client.on("close", () => {
    try {
      provider?.stop();
    } catch (_) {}
  });
  client.on("error", (err) => console.error("Client WS error:", err.message));
});

// Sentry Express error handler — must come AFTER all routes and BEFORE any
// other error-handler middleware. No-op if SENTRY_DSN is unset (the init
// above also no-op'd, so the handler is just a passthrough).
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// Final fallback: any unhandled error still gets logged locally even if
// Sentry isn't configured. Keep at the very bottom of the middleware chain.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log.error(
    {
      event: "unhandled_error",
      err: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
    },
    "unhandled express error",
  );
  if (!res.headersSent) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Process-level safety nets — unhandled rejections + uncaught exceptions go to
// Sentry (if configured) AND the local logger. Don't exit on rejections; do
// crash on uncaught exceptions per Node best practice + let Fly restart us.
process.on("unhandledRejection", (reason) => {
  log.error({ event: "unhandled_rejection", reason: String(reason) }, "unhandled promise rejection");
  if (process.env.SENTRY_DSN) {
    try {
      Sentry.captureException(reason);
    } catch (_) {}
  }
});
process.on("uncaughtException", (err) => {
  log.error({ event: "uncaught_exception", err: err.message, stack: err.stack }, "uncaught exception");
  if (process.env.SENTRY_DSN) {
    try {
      Sentry.captureException(err);
    } catch (_) {}
  }
  // Best-effort flush before exit so the event actually reaches Sentry.
  if (process.env.SENTRY_DSN) {
    Sentry.close(2000).finally(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

server.listen(PORT, async () => {
  console.log(`\n⚡  ASIDE v3.1 → http://localhost:${PORT}\n`);
  logProviderStatus();
  logLlmProviderStatus();
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

  // ── Stripe subscriber reconciliation ────────────────────────────────────
  // Webhook delivery is the primary path for keeping plan state in sync, but
  // webhooks can drop (Stripe outage, server restart during delivery, our
  // network blip). This cron re-confirms every user we believe has a paid
  // subscription against Stripe's authoritative state once a day. Cheap,
  // catches drift, no-op if Stripe isn't configured.
  async function reconcileStripeSubscribers() {
    const stripe = getStripe();
    if (!stripe) return; // No keys configured — nothing to reconcile.
    let users;
    try {
      users = listUsersWithSubscription();
    } catch (e) {
      log.error(
        { event: "stripe_reconcile_db_error", err: e.message },
        "could not list subscribed users for reconcile",
      );
      return;
    }
    if (!users.length) {
      log.info(
        { event: "stripe_reconcile_skip", reason: "no_subscribers" },
        "stripe reconcile — no subscribers in DB",
      );
      return;
    }
    let drift = 0;
    for (const u of users) {
      try {
        const sub = await stripe.subscriptions.retrieve(
          u.stripe_subscription_id,
        );
        const status = sub.status;
        const periodEnd = sub.current_period_end || null;
        const plan =
          status === "active" || status === "trialing" ? "paid" : "trial";
        // Compare what Stripe says vs what we have. Only update if drift exists.
        if (
          u.subscription_status !== status ||
          u.subscription_period_end !== periodEnd ||
          u.plan !== plan
        ) {
          drift++;
          updateSubscriptionFromStripe(u.id, {
            subscriptionId: u.stripe_subscription_id,
            status,
            periodEndUnix: periodEnd,
            plan,
          });
          writeAuditLog(u.id, "stripe_reconcile_drift", {
            wasStatus: u.subscription_status,
            nowStatus: status,
            wasPlan: u.plan,
            nowPlan: plan,
          });
          log.info(
            {
              event: "stripe_reconcile_drift",
              userId: u.id,
              wasStatus: u.subscription_status,
              nowStatus: status,
            },
            "stripe reconcile fixed plan drift",
          );
        }
      } catch (e) {
        // Sub might've been deleted at Stripe and we missed the webhook —
        // treat 404 as confirmation we should downgrade.
        if (e?.statusCode === 404 || e?.code === "resource_missing") {
          updateSubscriptionFromStripe(u.id, {
            subscriptionId: u.stripe_subscription_id,
            status: "canceled",
            periodEndUnix: u.subscription_period_end,
            plan: "trial",
          });
          drift++;
          writeAuditLog(u.id, "stripe_reconcile_missing", null);
          log.info(
            { event: "stripe_reconcile_missing", userId: u.id },
            "stripe sub no longer exists, downgraded user",
          );
        } else {
          log.warn(
            { event: "stripe_reconcile_fetch_failed", userId: u.id, err: e.message },
            "could not fetch one subscriber from stripe",
          );
        }
      }
    }
    if (drift > 0) {
      log.info(
        { event: "stripe_reconcile_done", checked: users.length, drift },
        "stripe reconcile complete with drift",
      );
    }
  }
  // Run once 60s after startup (so we don't slow the first request) and then
  // every 24 hours. Errors are caught + logged, never thrown.
  setTimeout(() => {
    reconcileStripeSubscribers().catch((e) =>
      log.error(
        { event: "stripe_reconcile_crash", err: e.message },
        "stripe reconcile crashed",
      ),
    );
  }, 60 * 1000);
  setInterval(() => {
    reconcileStripeSubscribers().catch((e) =>
      log.error(
        { event: "stripe_reconcile_crash", err: e.message },
        "stripe reconcile crashed",
      ),
    );
  }, 24 * 60 * 60 * 1000);
  if (isStripeConfigured()) {
    console.log("💳  Stripe subscriber reconciliation scheduled (daily)\n");
  }
});

// ── Graceful shutdown (SIGTERM from Fly.io / Docker / systemd) ───────────────
// 1. Stop accepting new HTTP connections
// 2. Close WebSocket sessions cleanly
// 3. Checkpoint SQLite WAL so the DB file is consistent on disk
// 4. Close the DB handle
// 5. Exit
//
// Fly.io waits ~25 seconds for SIGTERM compliance before SIGKILL.
let shuttingDown = false;
async function gracefulShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n📡  Received ${signal} — shutting down gracefully…`);
  // Stop accepting new HTTP connections
  server.close(() => {
    console.log("✓ HTTP server closed");
  });
  // Close all WebSocket connections
  try {
    for (const ws of wss.clients) {
      try {
        ws.close(1001, "server shutting down");
      } catch (_) {}
    }
    wss.close();
    console.log("✓ WebSocket server closed");
  } catch (e) {
    console.error("WSS close error:", e.message);
  }
  // Checkpoint WAL — flushes WAL contents back to the main DB file so
  // restarting picks up a consistent state with no recovery work to do.
  try {
    db.pragma("wal_checkpoint(TRUNCATE)");
    console.log("✓ SQLite WAL checkpointed");
  } catch (e) {
    console.error("WAL checkpoint error:", e.message);
  }
  // Close DB
  try {
    db.close();
    console.log("✓ DB closed");
  } catch (e) {
    console.error("DB close error:", e.message);
  }
  console.log("✓ Goodbye");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
