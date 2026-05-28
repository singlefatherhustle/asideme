/* ──────────────────────────────────────────────────────────────────────────
 * ASIDE — Cookie notice banner
 * Strictly necessary disclosure only. We use a single essential session
 * cookie (no analytics, no advertising, no tracking) so a consent flow is
 * NOT required under GDPR — but visible disclosure is best practice.
 * Dismissed once, persisted via localStorage, never shown again on that
 * browser. No-op if already accepted.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  const KEY = "aside-cookie-notice-dismissed";

  try {
    if (localStorage.getItem(KEY) === "1") return;
  } catch (e) {
    // localStorage blocked (private mode). Better to show the notice every
    // time than to silently swallow it — fall through.
    console.warn("cookie-notice: localStorage read failed:", e && e.message);
  }

  // Wait for body to be available so we don't error on early-loading pages.
  function render() {
    if (!document.body) {
      // Run again after DOMContentLoaded if body isn't ready yet.
      document.addEventListener("DOMContentLoaded", render, { once: true });
      return;
    }
    // If for some reason we got injected twice, bail.
    if (document.getElementById("asideCookieNotice")) return;

    const wrap = document.createElement("aside");
    wrap.id = "asideCookieNotice";
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", "Cookie notice");
    wrap.style.cssText = [
      "position:fixed",
      "left:50%",
      "bottom:20px",
      "transform:translateX(-50%)",
      "z-index:200",
      "max-width:min(680px, calc(100vw - 32px))",
      "background:#15151a",
      "color:#ede9df",
      "border:0.5px solid rgba(255,255,255,0.12)",
      "border-radius:10px",
      "padding:12px 14px",
      "font-family:'Geist',-apple-system,sans-serif",
      "font-size:13px",
      "line-height:1.5",
      "box-shadow:0 12px 32px -8px rgba(0,0,0,0.5)",
      "display:flex",
      "align-items:center",
      "gap:14px",
      "flex-wrap:wrap",
    ].join(";");

    const text = document.createElement("span");
    text.style.cssText = "flex:1; min-width:240px;";
    text.appendChild(
      document.createTextNode(
        "ASIDE uses a single essential session cookie for sign-in. No tracking, no analytics, no ads. ",
      ),
    );
    const link = document.createElement("a");
    link.href = "/landing/privacy.html";
    link.textContent = "Read privacy →";
    link.style.cssText = "color:#7DDBFF; text-decoration:underline;";
    text.appendChild(link);
    wrap.appendChild(text);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Got it";
    btn.setAttribute("aria-label", "Dismiss cookie notice");
    btn.style.cssText = [
      "background:transparent",
      "color:#ede9df",
      "border:0.5px solid rgba(255,255,255,0.18)",
      "border-radius:7px",
      "padding:6px 14px",
      "font:inherit",
      "font-size:12px",
      "cursor:pointer",
      "transition:border-color 180ms ease, color 180ms ease",
    ].join(";");
    btn.addEventListener("mouseover", () => {
      btn.style.borderColor = "#7DDBFF";
      btn.style.color = "#7DDBFF";
    });
    btn.addEventListener("mouseout", () => {
      btn.style.borderColor = "rgba(255,255,255,0.18)";
      btn.style.color = "#ede9df";
    });
    btn.addEventListener("click", () => {
      try {
        localStorage.setItem(KEY, "1");
      } catch (e) {
        console.warn("cookie-notice: localStorage write failed:", e && e.message);
      }
      wrap.remove();
    });
    wrap.appendChild(btn);

    // Honor light theme — flip the dark surface so it stays readable.
    const isLight =
      document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      wrap.style.background = "#ffffff";
      wrap.style.color = "#2c2725";
      wrap.style.borderColor = "rgba(44,39,37,0.15)";
      btn.style.color = "#2c2725";
      btn.style.borderColor = "rgba(44,39,37,0.2)";
    }

    document.body.appendChild(wrap);
  }

  render();
})();
