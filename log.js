/**
 * log.js — pino logger with PII redaction.
 *
 * Replaces ad-hoc console.* calls. PII (email, query text, transcript bodies,
 * Stripe customer IDs) is redacted automatically — never logged in cleartext.
 *
 * Usage:
 *   import { log } from "./log.js";
 *   log.info({ userId: 123 }, "signup complete");
 *   log.error({ err }, "Anthropic call failed");
 */
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

// In dev, pretty-print to console. In prod, structured JSON for log shippers.
const transport = isProd
  ? undefined
  : {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss",
        ignore: "pid,hostname",
      },
    };

export const log = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  base: { app: "aside" },
  // PII redaction — these paths anywhere in the log object get replaced with [Redacted].
  redact: {
    paths: [
      "email",
      "*.email",
      "user.email",
      "users.*.email",
      "req.headers.authorization",
      "req.headers.cookie",
      "req.body.email",
      "req.body.message",
      "req.body.query",
      "transcript",
      "*.transcript",
      "query",
      "cleanQuery",
      "message",
      "stripeCustomerId",
      "stripe_customer_id",
    ],
    censor: "[Redacted]",
  },
  transport,
});

// Convenience: shorthand for common patterns.
export const logEvent = (event, fields = {}) =>
  log.info({ event, ...fields }, event);

// Catch-all for legacy `console.log` replacements that don't pass structured data.
// Strips PII from the message itself via regex sweep.
export function safeLog(level, msg, fields = {}) {
  const cleaned = String(msg)
    // emails
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "[email]")
    // Stripe ids
    .replace(/\b(cus|sub|pi|ch|si|ses)_[A-Za-z0-9]{8,}\b/g, "[stripe-id]")
    // long random-looking tokens (verify, session)
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, "[token]");
  log[level](fields, cleaned);
}
