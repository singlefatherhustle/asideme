// crypto-util.js — AES-256-GCM encryption for at-rest secrets (BYOK API keys).
//
// Keys are encrypted before they touch the database and decrypted only in-process,
// per request, inside the LLM provider resolver. The encryption key is derived from
// KEY_ENC_SECRET (env, never committed). Decryption fails loud on a wrong key or a
// tampered ciphertext (GCM auth-tag mismatch) — it never returns garbage or plaintext.
import crypto from "crypto";

const SECRET = process.env.KEY_ENC_SECRET || "";
const MIN_SECRET_LEN = 16;

function deriveKey() {
  if (!SECRET || SECRET.length < MIN_SECRET_LEN) {
    throw new Error(
      `KEY_ENC_SECRET missing or too short (need >= ${MIN_SECRET_LEN} chars). ` +
        "Set it in .env to enable encrypted BYOK key storage."
    );
  }
  // SHA-256 yields a stable 32-byte key for AES-256 from any-length secret.
  return crypto.createHash("sha256").update(SECRET, "utf8").digest();
}

/**
 * Encrypt a plaintext secret. Returns base64 ciphertext + a fresh random IV and
 * the GCM auth tag, all to be stored alongside each other.
 * @param {string} plaintext
 * @returns {{ enc: string, iv: string, tag: string }}
 */
export function encryptSecret(plaintext) {
  if (typeof plaintext !== "string" || plaintext.length === 0) {
    throw new Error("encryptSecret: plaintext must be a non-empty string");
  }
  const key = deriveKey();
  const iv = crypto.randomBytes(12); // 96-bit nonce, recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    enc: enc.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

/**
 * Decrypt a secret produced by encryptSecret. Throws on a missing field, a wrong
 * key, or a tampered ciphertext — callers must catch and treat as "no key".
 * @param {{ enc: string, iv: string, tag: string }} parts
 * @returns {string} plaintext
 */
export function decryptSecret({ enc, iv, tag } = {}) {
  if (!enc || !iv || !tag) {
    throw new Error("decryptSecret: missing enc/iv/tag");
  }
  const key = deriveKey();
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const dec = Buffer.concat([
    decipher.update(Buffer.from(enc, "base64")),
    decipher.final(), // throws on auth-tag mismatch
  ]);
  return dec.toString("utf8");
}

/** True when KEY_ENC_SECRET is configured well enough to store BYOK keys. */
export function isEncryptionConfigured() {
  return Boolean(SECRET) && SECRET.length >= MIN_SECRET_LEN;
}
