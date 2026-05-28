/**
 * auth.js — minimal email-only signup + 48-hour trial gating.
 *
 * Design philosophy: smallest possible auth surface that satisfies the
 * "free for 48 hours after signup" requirement. No password, no magic link
 * (yet), just email-as-identity backed by an HMAC-signed cookie.
 *
 * To upgrade later: swap the cookie for a real session token, add Stripe
 * subscription status to the user row, and the gate becomes "trial OR paid".
 */
import crypto from "node:crypto";
import { db } from "./db.js";

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("SESSION_SECRET env var required in production");
      })()
    : "dev-only-insecure-secret-do-not-use-in-prod-please");

const TRIAL_HOURS = parseInt(process.env.TRIAL_HOURS || "48", 10);
const DAILY_GENERATION_CAP = parseInt(
  process.env.DAILY_GENERATION_CAP || "30",
  10,
);
const COOKIE_NAME = "aside_session";
const COOKIE_MAX_AGE_DAYS = 30;

// ── Schema (using db.prepare(...).run for each DDL statement) ─────────────────
db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
    id                       INTEGER PRIMARY KEY AUTOINCREMENT,
    email                    TEXT UNIQUE NOT NULL,
    signup_at                INTEGER NOT NULL,
    trial_expires_at         INTEGER NOT NULL,
    plan                     TEXT NOT NULL DEFAULT 'trial',
    daily_calls              INTEGER NOT NULL DEFAULT 0,
    daily_window_at          INTEGER NOT NULL DEFAULT 0,
    email_verified_at        INTEGER,
    verify_token             TEXT,
    verify_token_expires_at  INTEGER,
    stripe_customer_id       TEXT,
    stripe_subscription_id   TEXT,
    subscription_status      TEXT,
    subscription_period_end  INTEGER
  )`,
).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run();

// Idempotent migrations for legacy rows from earlier versions of this schema.
// Each ALTER is wrapped in try/catch so it's a no-op when the column exists.
// Run these BEFORE indexes that depend on the new columns.
const userMigrations = [
  "ALTER TABLE users ADD COLUMN email_verified_at INTEGER",
  "ALTER TABLE users ADD COLUMN verify_token TEXT",
  "ALTER TABLE users ADD COLUMN verify_token_expires_at INTEGER",
  "ALTER TABLE users ADD COLUMN stripe_customer_id TEXT",
  "ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT",
  "ALTER TABLE users ADD COLUMN subscription_status TEXT",
  "ALTER TABLE users ADD COLUMN subscription_period_end INTEGER",
  // session_version bumps invalidate all live cookies for that user.
  // Used by /api/signout for true revocation (otherwise stolen cookies
  // remain valid until cookie maxAge expires, regardless of clearCookie).
  "ALTER TABLE users ADD COLUMN session_version INTEGER NOT NULL DEFAULT 1",
];
for (const sql of userMigrations) {
  try { db.prepare(sql).run(); } catch (_) { /* column exists */ }
}

// Index that references new columns — created after migrations so it works
// on both fresh schemas and upgraded legacy ones.
db.prepare(`CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)`).run();

// ── Cookie signing (HMAC, no third-party deps) ────────────────────────────────
function sign(payload) {
  const json = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(json)
    .digest("base64url");
  return `${json}.${sig}`;
}

function verify(token) {
  if (!token || typeof token !== "string") return null;
  const [json, sig] = token.split(".");
  if (!json || !sig) return null;
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(json)
    .digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(json, "base64url").toString("utf8"));
  } catch (_) {
    return null;
  }
}

// ── User helpers ──────────────────────────────────────────────────────────────
function nowMs() {
  return Date.now();
}

function isValidEmail(s) {
  if (!s || typeof s !== "string" || s.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export function getUserByEmail(email) {
  return db
    .prepare("SELECT * FROM users WHERE email = ? LIMIT 1")
    .get(email.toLowerCase().trim());
}

export function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ? LIMIT 1").get(id);
}

export function getUserByStripeCustomerId(customerId) {
  return db
    .prepare("SELECT * FROM users WHERE stripe_customer_id = ? LIMIT 1")
    .get(customerId);
}

// Used by the reconciliation cron to walk every user we believe has a paid
// subscription and re-confirm the state against Stripe. Catches webhook
// delivery gaps (Stripe outage, our server restart, network blip).
export function listUsersWithSubscription() {
  return db
    .prepare(
      "SELECT * FROM users WHERE stripe_subscription_id IS NOT NULL AND stripe_subscription_id != ''",
    )
    .all();
}

// Trial is tied to the email forever — re-signing up with the same email
// after clearing cookies returns the original user and does NOT reset
// trial_expires_at. This is the "forgot-cookie protection".
export function createOrRefreshUser(email) {
  const e = email.toLowerCase().trim();
  const existing = getUserByEmail(e);
  if (existing) return existing;
  const now = nowMs();
  const trialExpiresAt = now + TRIAL_HOURS * 60 * 60 * 1000;
  db.prepare(
    "INSERT INTO users (email, signup_at, trial_expires_at) VALUES (?, ?, ?)",
  ).run(e, now, trialExpiresAt);
  return getUserByEmail(e);
}

// ── Email verification (magic link) ───────────────────────────────────────────
const VERIFY_TOKEN_TTL_MIN = parseInt(
  process.env.VERIFY_TOKEN_TTL_MIN || "30",
  10,
);

// Generate + persist a verification token for the user. Caller is responsible
// for actually sending the magic-link email (or logging it in dev mode).
export function issueVerifyToken(userId) {
  const token = crypto.randomBytes(24).toString("base64url");
  const expiresAt = nowMs() + VERIFY_TOKEN_TTL_MIN * 60 * 1000;
  db.prepare(
    "UPDATE users SET verify_token = ?, verify_token_expires_at = ? WHERE id = ?",
  ).run(token, expiresAt, userId);
  return token;
}

// Atomic single-use claim of a verify token. Returns user on success, null
// on bad/expired token or token race (e.g., link clicked twice).
export function consumeVerifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const user = db
    .prepare(
      "SELECT * FROM users WHERE verify_token = ? AND verify_token_expires_at > ?",
    )
    .get(token, nowMs());
  if (!user) return null;
  // Atomic: clear token + mark verified in one statement so concurrent
  // requests can't both succeed.
  const result = db
    .prepare(
      `UPDATE users
         SET email_verified_at = ?, verify_token = NULL, verify_token_expires_at = NULL
       WHERE id = ? AND verify_token = ?`,
    )
    .run(nowMs(), user.id, token);
  if (result.changes !== 1) return null;
  return getUserById(user.id);
}

// Email verification is required when REQUIRE_EMAIL_VERIFICATION=true (default
// in production). In development it's optional so the local flow can be tested
// without setting up Resend.
const REQUIRE_VERIFICATION =
  process.env.REQUIRE_EMAIL_VERIFICATION === "true" ||
  (process.env.REQUIRE_EMAIL_VERIFICATION !== "false" &&
    process.env.NODE_ENV === "production");

export function userHasActiveAccess(user) {
  if (!user) return { ok: false, reason: "no_user" };
  // Email verification gate (production-only by default).
  if (REQUIRE_VERIFICATION && !user.email_verified_at) {
    return { ok: false, reason: "email_unverified" };
  }
  // Paid subscriber: check subscription status + period_end.
  if (user.plan === "paid" || user.plan === "team") {
    const subActive =
      user.subscription_status === "active" ||
      user.subscription_status === "trialing";
    const periodOk =
      !user.subscription_period_end ||
      user.subscription_period_end > nowMs() / 1000;
    if (subActive && periodOk) return { ok: true, mode: "paid" };
    // Subscription lapsed — fall through; user becomes 'trial' or 'expired'.
  }
  if (user.plan === "trial" && user.trial_expires_at > nowMs()) {
    return { ok: true, mode: "trial" };
  }
  return { ok: false, reason: "trial_expired" };
}

// ── Subscription sync (called by Stripe webhook handler) ──────────────────────
export function updateSubscriptionFromStripe(
  userId,
  { subscriptionId, status, periodEndUnix, plan = "paid" },
) {
  db.prepare(
    `UPDATE users
       SET stripe_subscription_id = ?,
           subscription_status = ?,
           subscription_period_end = ?,
           plan = ?
     WHERE id = ?`,
  ).run(subscriptionId, status, periodEndUnix, plan, userId);
}

export function attachStripeCustomerId(userId, customerId) {
  db.prepare(
    "UPDATE users SET stripe_customer_id = ? WHERE id = ? AND (stripe_customer_id IS NULL OR stripe_customer_id = '')",
  ).run(customerId, userId);
}

export function downgradeToTrialExpired(userId) {
  // Subscription cancelled — fall back to trial state. If the trial is also
  // expired, the access check will fail on the next request.
  db.prepare(
    `UPDATE users
       SET subscription_status = 'cancelled',
           plan = CASE WHEN trial_expires_at > ? THEN 'trial' ELSE 'expired' END
     WHERE id = ?`,
  ).run(nowMs(), userId);
}

// ── Daily cap (anti-abuse) ────────────────────────────────────────────────────
function rolloverDailyIfNeeded(user) {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = nowMs();
  if (now - user.daily_window_at >= dayMs) {
    db.prepare(
      "UPDATE users SET daily_calls = 0, daily_window_at = ? WHERE id = ?",
    ).run(now, user.id);
    user.daily_calls = 0;
    user.daily_window_at = now;
  }
}

export function consumeDailyCall(user) {
  rolloverDailyIfNeeded(user);
  if (user.daily_calls >= DAILY_GENERATION_CAP) {
    return {
      ok: false,
      reason: "daily_cap",
      remaining: 0,
      cap: DAILY_GENERATION_CAP,
    };
  }
  db.prepare(
    "UPDATE users SET daily_calls = daily_calls + 1 WHERE id = ?",
  ).run(user.id);
  return {
    ok: true,
    remaining: DAILY_GENERATION_CAP - (user.daily_calls + 1),
    cap: DAILY_GENERATION_CAP,
  };
}

// ── Cookie helpers ────────────────────────────────────────────────────────────
function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

export function setSessionCookie(res, user) {
  // Bake session_version into the cookie. /api/signout bumps the version,
  // invalidating every cookie ever issued for this user — including any
  // copies an attacker might have stolen.
  const token = sign({
    email: user.email,
    sub: user.id,
    v: user.session_version || 1,
  });
  res.cookie(COOKIE_NAME, token, buildCookieOptions());
}

export function bumpSessionVersion(userId) {
  db.prepare(
    "UPDATE users SET session_version = session_version + 1 WHERE id = ?",
  ).run(userId);
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function userFromCookie(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return userFromToken(token);
}

// Used by the WebSocket upgrade handler — accepts a raw cookie token string
// (extracted by parsing req.headers.cookie manually since cookie-parser
// middleware does not run for upgrade requests).
//
// Validates session_version: if the user's session_version has been bumped
// since this cookie was issued, the cookie is invalid (revocation).
export function userFromToken(token) {
  if (!token) return null;
  const payload = verify(token);
  if (!payload || !payload.email) return null;
  const user = getUserByEmail(payload.email);
  if (!user) return null;
  // Cookie revocation check: payload.v must match current session_version.
  // Cookies issued before this user signed out (or before any explicit
  // revocation) will fail this check.
  const cookieVersion = payload.v ?? 1;
  const userVersion = user.session_version ?? 1;
  if (cookieVersion !== userVersion) return null;
  return user;
}

// ── Express middleware: require active trial or paid plan ─────────────────────
export function requireActiveAccess(req, res, next) {
  const user = userFromCookie(req);
  if (!user) {
    return res.status(401).json({
      error: "signup_required",
      message:
        "Sign up with your email to start your 48-hour free trial. Generation is gated behind a free account.",
    });
  }
  const access = userHasActiveAccess(user);
  if (!access.ok) {
    if (access.reason === "trial_expired") {
      return res.status(402).json({
        error: "trial_expired",
        message:
          "Your 48-hour free trial has ended. Upgrade to keep generating summaries, quizzes, and flashcards.",
        upgrade_url: "/pricing",
      });
    }
    if (access.reason === "email_unverified") {
      return res.status(403).json({
        error: "email_unverified",
        message:
          "Check your inbox to verify your email before starting your trial.",
      });
    }
    return res.status(401).json({ error: "no_access" });
  }
  const call = consumeDailyCall(user);
  if (!call.ok) {
    return res.status(429).json({
      error: "daily_cap_reached",
      message: `You have used today's quota of ${call.cap} generations. Resets in 24 hours.`,
      cap: call.cap,
    });
  }
  req.user = user;
  req.accessMode = access.mode;
  req.callsRemainingToday = call.remaining;
  res.setHeader("X-Calls-Remaining-Today", String(call.remaining));
  next();
}

export function publicUser(user) {
  if (!user) return null;
  rolloverDailyIfNeeded(user);
  const now = nowMs();
  const trialRemainingMs = Math.max(0, user.trial_expires_at - now);
  const subActive =
    (user.plan === "paid" || user.plan === "team") &&
    (user.subscription_status === "active" ||
      user.subscription_status === "trialing");
  return {
    email: user.email,
    signupAt: user.signup_at,
    plan: user.plan,
    emailVerified: !!user.email_verified_at,
    subscriptionStatus: user.subscription_status || null,
    subscriptionPeriodEnd: user.subscription_period_end || null,
    trialExpiresAt: user.trial_expires_at,
    trialRemainingMs,
    trialRemainingHours: Math.ceil(trialRemainingMs / (60 * 60 * 1000)),
    trialActive: trialRemainingMs > 0 && !subActive,
    dailyCap: DAILY_GENERATION_CAP,
    dailyCallsUsed: user.daily_calls,
    dailyCallsRemaining: Math.max(0, DAILY_GENERATION_CAP - user.daily_calls),
  };
}

// ── Per-email magic-link rate limit (anti-inbox-bombing) ──────────────────────
// signupLimiter in server.js rate-limits by IP. This complements it with a
// per-email cap so a single attacker can't fire 20 magic links at one victim's
// inbox by varying the source IP.
const PER_EMAIL_MAGIC_LINK_CAP = parseInt(
  process.env.PER_EMAIL_MAGIC_LINK_CAP || "5",
  10,
);
const PER_EMAIL_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const recentMagicLinks = new Map(); // email → [timestamps]

export function canIssueMagicLinkFor(email) {
  const e = email.toLowerCase().trim();
  const now = nowMs();
  const hits = (recentMagicLinks.get(e) || []).filter(
    (t) => now - t < PER_EMAIL_WINDOW_MS,
  );
  if (hits.length >= PER_EMAIL_MAGIC_LINK_CAP) {
    return { ok: false, retryAfterMs: hits[0] + PER_EMAIL_WINDOW_MS - now };
  }
  hits.push(now);
  recentMagicLinks.set(e, hits);
  // Periodic cleanup so the map doesn't grow unbounded.
  if (recentMagicLinks.size > 10000) {
    for (const [k, ts] of recentMagicLinks.entries()) {
      const fresh = ts.filter((t) => now - t < PER_EMAIL_WINDOW_MS);
      if (fresh.length === 0) recentMagicLinks.delete(k);
      else recentMagicLinks.set(k, fresh);
    }
  }
  return { ok: true, remaining: PER_EMAIL_MAGIC_LINK_CAP - hits.length };
}

export {
  isValidEmail,
  COOKIE_NAME,
  TRIAL_HOURS,
  DAILY_GENERATION_CAP,
  REQUIRE_VERIFICATION,
  VERIFY_TOKEN_TTL_MIN,
  PER_EMAIL_MAGIC_LINK_CAP,
};
