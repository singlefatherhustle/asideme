/**
 * billing.js — Stripe integration for ASIDE.
 *
 * Exposes:
 *   - getStripe()                  → lazy-init Stripe client (or null if not configured)
 *   - createCheckoutSession(...)   → returns Checkout URL for /api/checkout
 *   - createPortalSession(...)     → returns billing-portal URL for /api/billing-portal
 *   - verifyWebhookSignature(...)  → throws on bad signature
 *   - syncSubscriptionEvent(...)   → maps Stripe events to our users table
 *
 * Configuration via env:
 *   STRIPE_SECRET_KEY        sk_test_... or sk_live_...
 *   STRIPE_WEBHOOK_SECRET    whsec_... (from `stripe listen` or dashboard)
 *   STRIPE_PRICE_ID          price_... (monthly Pro plan)
 *   STRIPE_PRICE_ID_ANNUAL   price_... (optional annual plan)
 *   APP_URL                  base URL for success / cancel redirects
 */
import Stripe from "stripe";
import {
  attachStripeCustomerId,
  updateSubscriptionFromStripe,
  downgradeToTrialExpired,
  getUserByEmail,
  getUserByStripeCustomerId,
  getUserById,
} from "./auth.js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const STRIPE_PRICE_ID_ANNUAL = process.env.STRIPE_PRICE_ID_ANNUAL;
const APP_URL = process.env.APP_URL || "http://localhost:3001";

let stripe = null;
if (STRIPE_SECRET_KEY) {
  stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });
}

export function isStripeConfigured() {
  return !!stripe && !!STRIPE_PRICE_ID;
}

export function getStripe() {
  return stripe;
}

export async function createCheckoutSession(user, { interval = "month" } = {}) {
  if (!isStripeConfigured()) {
    throw new Error(
      "Stripe is not configured — set STRIPE_SECRET_KEY and STRIPE_PRICE_ID env vars.",
    );
  }
  const price =
    interval === "year" && STRIPE_PRICE_ID_ANNUAL
      ? STRIPE_PRICE_ID_ANNUAL
      : STRIPE_PRICE_ID;
  // Reuse an existing customer if we have one, otherwise let Stripe create
  // one from the email and we'll capture the ID in the webhook.
  const sessionConfig = {
    mode: "subscription",
    line_items: [{ price, quantity: 1 }],
    success_url: `${APP_URL}/app?checkout=success`,
    cancel_url: `${APP_URL}/pricing?checkout=cancelled`,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    customer_email: user.stripe_customer_id ? undefined : user.email,
    customer: user.stripe_customer_id || undefined,
    // metadata is the only reliable link between the Stripe object and our DB
    // user row — we use this in the webhook to find the right user.
    metadata: { user_id: String(user.id), email: user.email },
    subscription_data: {
      metadata: { user_id: String(user.id), email: user.email },
    },
  };
  const session = await stripe.checkout.sessions.create(sessionConfig);
  return session;
}

export async function createPortalSession(user) {
  if (!isStripeConfigured()) {
    throw new Error("Stripe is not configured.");
  }
  if (!user.stripe_customer_id) {
    throw new Error("No Stripe customer for this user yet — purchase first.");
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${APP_URL}/app`,
  });
  return session;
}

// Webhook signature verification — raw body must be the original Buffer Stripe sent.
export function verifyWebhookSignature(rawBody, sigHeader) {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  }
  return stripe.webhooks.constructEvent(rawBody, sigHeader, STRIPE_WEBHOOK_SECRET);
}

// Find the user attached to a Stripe object by:
//   1. metadata.user_id (most reliable — we set this on Checkout)
//   2. stripe_customer_id (for events on existing customers)
//   3. customer email (last-resort fallback)
function findUserForStripeObject(obj) {
  // metadata.user_id
  const metaId = obj?.metadata?.user_id;
  if (metaId) {
    const u = getUserById(parseInt(metaId, 10));
    if (u) return u;
  }
  // stripe_customer_id
  const customerId =
    typeof obj?.customer === "string" ? obj.customer : obj?.customer?.id;
  if (customerId) {
    const u = getUserByStripeCustomerId(customerId);
    if (u) return u;
  }
  // email
  const email =
    obj?.customer_email ||
    obj?.customer_details?.email ||
    obj?.subscriber?.email;
  if (email) {
    const u = getUserByEmail(email);
    if (u) return u;
  }
  return null;
}

// Maps a Stripe event to the appropriate user-row mutation. Idempotent —
// re-processing the same event is safe.
export async function syncSubscriptionEvent(event) {
  const obj = event.data?.object;
  if (!obj) return { handled: false, reason: "no data.object" };
  const user = findUserForStripeObject(obj);

  switch (event.type) {
    case "checkout.session.completed": {
      if (!user) return { handled: false, reason: "no user" };
      const customerId =
        typeof obj.customer === "string" ? obj.customer : obj.customer?.id;
      if (customerId) attachStripeCustomerId(user.id, customerId);
      // The subscription may not be live yet — wait for subscription.created.
      return { handled: true, action: "attached_customer", userId: user.id };
    }
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      if (!user) return { handled: false, reason: "no user" };
      const customerId =
        typeof obj.customer === "string" ? obj.customer : obj.customer?.id;
      if (customerId) attachStripeCustomerId(user.id, customerId);
      const status = obj.status; // 'active' | 'trialing' | 'past_due' | 'canceled' | ...
      const periodEnd = obj.current_period_end || null;
      const plan =
        status === "active" || status === "trialing" ? "paid" : "trial";
      updateSubscriptionFromStripe(user.id, {
        subscriptionId: obj.id,
        status,
        periodEndUnix: periodEnd,
        plan,
      });
      return { handled: true, action: "synced", userId: user.id, status };
    }
    case "customer.subscription.deleted": {
      if (!user) return { handled: false, reason: "no user" };
      downgradeToTrialExpired(user.id);
      return { handled: true, action: "cancelled", userId: user.id };
    }
    case "invoice.payment_failed": {
      if (!user) return { handled: false, reason: "no user" };
      updateSubscriptionFromStripe(user.id, {
        subscriptionId: user.stripe_subscription_id,
        status: "past_due",
        periodEndUnix: user.subscription_period_end,
        plan: "paid",
      });
      return { handled: true, action: "past_due", userId: user.id };
    }
    default:
      return { handled: false, reason: `event.type=${event.type} not handled` };
  }
}
