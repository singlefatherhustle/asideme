/* AsideMe — Service Worker
 *
 * Read-only offline strategy (Tier 1):
 *   • App shell  → cache-first, refreshed on each new SW version.
 *   • Doc bodies (/teacher-docs/**, /ingested/**) → stale-while-revalidate
 *     so users can browse the Library offline; cache updates in background.
 *   • API + WebSocket  → network-only. Generation needs the backend; if
 *     offline we fall through to the network's error so the UI shows the
 *     offline state instead of stale generation results.
 *
 * Bump SW_VERSION when shipping shell changes so old caches get purged.
 * The __SW_VERSION__ literal is replaced at serve-time with a content hash
 * of this file, so every change auto-invalidates the cache. (server.js)
 */
// cache rev: 2026-06-18c — STT sample-rate fix + lighter doc warmup; bumping
// this comment changes the file hash, forcing all clients onto a fresh service
// worker and purging stale caches from earlier broken builds.
const SW_VERSION = "__SW_VERSION__";
const SHELL_CACHE = `${SW_VERSION}-shell`;
const DOCS_CACHE = `${SW_VERSION}-docs`;
const PAGES_CACHE = `${SW_VERSION}-pages`;

// Files that must be cached on install. Keep this list short — everything
// else trickles in via runtime caching.
//
// Both / (landing) and /app (the app shell) are precached so first-time
// installed users get instant load and an offline-capable fallback for both.
const SHELL_ASSETS = [
  "/",
  "/app",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/mark.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-512.png",
  "/icons/apple-touch-icon-180.png",
  "/landing/landing.css",
  "/landing/landing.js",
];

// ── Install: precache the app shell ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll is atomic — any 404 fails the install, which is what we want.
      await cache.addAll(SHELL_ASSETS);
      // Take over open pages on next reload without waiting for tab close.
      self.skipWaiting();
    })(),
  );
});

// ── Activate: clean up stale caches from previous versions ───────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(SW_VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

// ── Strategy helpers ─────────────────────────────────────────────────────────

/**
 * Stale-while-revalidate: serve the cached copy immediately; in the background,
 * refresh the cache. The user sees something instant, the next view is fresh.
 */
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const networkFetch = fetch(req)
    .then((res) => {
      // Only cache successful, basic-origin responses
      if (res.ok && (res.type === "basic" || res.type === "default")) {
        // clone before caching — body is single-use
        cache.put(req, res.clone()).catch(() => {});
      }
      return res;
    })
    .catch(() => null);
  return cached || (await networkFetch) || new Response("Offline", { status: 503 });
}

/**
 * Network-first for HTML navigations: prefer fresh, fall back to cache.
 * Lets us deploy UI changes without forcing offline users to wait, but
 * still serves the app shell when offline.
 */
async function networkFirstHTML(req) {
  const cache = await caches.open(PAGES_CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (_) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Last-resort: pick the right shell. App routes fall back to /app, the
    // marketing surface falls back to /.
    const url = new URL(req.url);
    const isAppRoute =
      url.pathname === "/app" ||
      url.pathname.startsWith("/app/") ||
      url.pathname === "/index.html";
    const shellKey = isAppRoute ? "/app" : "/";
    const shell = await caches.match(shellKey);
    if (shell) return shell;
    return new Response("Offline", { status: 503 });
  }
}

/**
 * Cache-first for hashed/static shell assets. They never change at the
 * same URL during a session, so we save a round-trip.
 */
async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone()).catch(() => {});
    return res;
  } catch (_) {
    return new Response("Offline", { status: 503 });
  }
}

// ── Fetch routing ────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // never cache mutations

  const url = new URL(req.url);

  // Only handle same-origin requests; let everything else go through normally.
  if (url.origin !== self.location.origin) return;

  // API + WebSocket upgrade traffic → bypass entirely.
  // The UI surfaces offline state on its own when navigator.onLine is false
  // or these fetches reject.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/ws") ||
    url.pathname.startsWith("/health") ||
    url.pathname.startsWith("/ready") ||
    url.pathname.startsWith("/metrics")
  ) {
    return;
  }

  // HTML navigations → network-first so UI deploys propagate fast.
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(networkFirstHTML(req));
    return;
  }

  // Doc content (teacher-docs + ingested) → stale-while-revalidate so the
  // Library works offline once a doc has been viewed once.
  if (
    url.pathname.startsWith("/teacher-docs/") ||
    url.pathname.startsWith("/ingested/")
  ) {
    event.respondWith(staleWhileRevalidate(req, DOCS_CACHE));
    return;
  }

  // Static shell (icons, svg, manifest, css/js if any) → cache-first.
  event.respondWith(cacheFirst(req, SHELL_CACHE));
});

// ── Message channel for manual cache warmup ──────────────────────────────────
// The page can send { type: "warmup-docs", paths: [...] } after the doc list
// loads to pre-populate the offline cache. Best-effort, ignores failures.
self.addEventListener("message", (event) => {
  const msg = event.data;
  if (!msg || msg.type !== "warmup-docs" || !Array.isArray(msg.paths)) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(DOCS_CACHE);
      await Promise.all(
        msg.paths.map(async (p) => {
          try {
            const r = await fetch(p, { cache: "no-store" });
            if (r.ok) await cache.put(p, r.clone());
          } catch (_) {
            // ignore — best effort
          }
        }),
      );
    })(),
  );
});
