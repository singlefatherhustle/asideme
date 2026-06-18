/**
 * email.js — transactional email via Resend.
 *
 * Behavior:
 *   - RESEND_API_KEY set → real send via Resend
 *   - RESEND_API_KEY unset → log the email body to the console (dev mode).
 *     Magic links printed to the console can be clicked manually.
 *
 * The fallback to console-logging makes local development possible without
 * any third-party signups. In production, RESEND_API_KEY is required.
 */
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "AsideMe <noreply@asideme.app>";
const APP_URL = process.env.APP_URL || "http://localhost:3001";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

if (!RESEND_API_KEY && process.env.NODE_ENV === "production") {
  console.warn(
    "⚠  RESEND_API_KEY not set — email verification + transactional emails will be logged to stdout only.",
  );
}

export async function sendMagicLink(email, token) {
  const link = `${APP_URL}/verify?token=${encodeURIComponent(token)}`;
  const subject = "Verify your email to start your AsideMe trial";
  const text =
    `Hi —\n\n` +
    `Click to verify your email and start your 48-hour AsideMe free trial:\n\n` +
    `${link}\n\n` +
    `This link expires in 30 minutes. If you didn't request this, ignore.\n\n` +
    `— AsideMe`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0a0a0a">
      <h1 style="font-size:24px;margin:0 0 18px">Verify your email</h1>
      <p>Click below to verify and start your 48-hour AsideMe free trial:</p>
      <p style="margin:24px 0">
        <a href="${link}" style="display:inline-block;background:#FF3C4B;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:500">
          Verify and start trial →
        </a>
      </p>
      <p style="color:#6b6660;font-size:13px">
        This link expires in 30 minutes. If you didn't request this, ignore.
      </p>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0"/>
      <p style="color:#9a948d;font-size:12px">AsideMe — live coding-class assistant</p>
    </div>
  `;
  if (!resend) {
    console.log(`\n📧 [DEV] Magic link for ${email}:\n   ${link}\n`);
    return { ok: true, dev: true, link };
  }
  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject,
      text,
      html,
    });
    if (result.error) {
      console.error("Resend send error:", result.error);
      return { ok: false, error: result.error.message };
    }
    return { ok: true, id: result.data?.id };
  } catch (err) {
    console.error("Resend exception:", err.message);
    return { ok: false, error: err.message };
  }
}
