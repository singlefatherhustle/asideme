/* ────────────────────────────────────────────────────────────────────────
 * AsideMe — Landing page interactions
 *   • Scroll-reveal via IntersectionObserver
 *   • Cursor-tracked radial light on tiles (the ::before spotlight)
 *   • Subtle 3D tilt on cards (respect prefers-reduced-motion)
 *   • Theme toggle (synced with localStorage key the app already uses)
 *   • Hero parallax on mark-3d
 * ──────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Scroll reveal ─────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add("in"));
  }

  // ── Cursor-driven spotlight + 3D tilt on bento tiles ──────────────────
  // Sets CSS vars --mx / --my (used by the .tile::before spotlight) and
  // applies a small perspective transform for a 3D feel. Bypassed when
  // reduced motion is on or pointer is coarse (mobile/touch).
  const coarsePointer =
    window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const tiltable = document.querySelectorAll(".tile");

  if (!reduceMotion && !coarsePointer && tiltable.length) {
    tiltable.forEach((tile) => {
      let rect = null;
      let raf = 0;

      const onMove = (e) => {
        if (!rect) rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width) * 100;
        const yPct = (y / rect.height) * 100;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          tile.style.setProperty("--mx", xPct + "%");
          tile.style.setProperty("--my", yPct + "%");
          // Subtle tilt — max ~6deg
          const rx = ((y - rect.height / 2) / rect.height) * -6;
          const ry = ((x - rect.width / 2) / rect.width) * 6;
          tile.style.transform = `perspective(900px) rotateX(${rx.toFixed(
            2,
          )}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`;
          raf = 0;
        });
      };

      const onEnter = () => {
        rect = tile.getBoundingClientRect();
      };
      const onLeave = () => {
        tile.style.transform = "";
        tile.style.removeProperty("--mx");
        tile.style.removeProperty("--my");
        rect = null;
      };

      tile.addEventListener("mouseenter", onEnter);
      tile.addEventListener("mousemove", onMove);
      tile.addEventListener("mouseleave", onLeave);
    });
  }

  // ── Hero mark-3d parallax on cursor (gentle, ±10deg) ──────────────────
  const mark = document.querySelector(".mark-3d");
  const heroStage = document.querySelector(".hero-stage");
  if (!reduceMotion && !coarsePointer && mark && heroStage) {
    let stageRect = null;
    let raf = 0;
    const updateRect = () => {
      stageRect = heroStage.getBoundingClientRect();
    };
    updateRect();
    window.addEventListener("resize", updateRect, { passive: true });

    document.addEventListener(
      "mousemove",
      (e) => {
        if (!stageRect) return;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const cx = stageRect.left + stageRect.width / 2;
          const cy = stageRect.top + stageRect.height / 2;
          const dx = (e.clientX - cx) / window.innerWidth;
          const dy = (e.clientY - cy) / window.innerHeight;
          const rx = (-dy * 12).toFixed(2);
          const ry = (dx * 16).toFixed(2);
          // Keep the existing float animation by setting it via CSS variables.
          // We use --tilt-x / --tilt-y, applied as an inline transform.
          mark.style.transform = `translateY(0px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          raf = 0;
        });
      },
      { passive: true },
    );
  }

  // ── Theme toggle ──────────────────────────────────────────────────────
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const setTheme = (t) => {
      if (t === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.setAttribute("data-theme", "dark");
      }
      try {
        localStorage.setItem("aside-theme", t);
      } catch (_) {}
      // Sync browser chrome
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", t === "light" ? "#F4F1EA" : "#0B0B0E");
    };

    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") || "dark";
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ── Animate marquee speed adapt to reduced motion ─────────────────────
  if (reduceMotion) {
    document.querySelectorAll(".marquee-track").forEach((el) => {
      el.style.animation = "none";
    });
  }

  // ── Smooth-scroll for in-page anchors (handles cross-page anchors too) ─
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  });

  // ── 48-hour trial signup ──────────────────────────────────────────────
  const signupForm = document.getElementById("trialSignup");
  const signupEmail = document.getElementById("trialEmail");
  const signupStatus = document.getElementById("trialStatus");
  if (signupForm && signupEmail) {
    // If already signed up + trial active, surface that
    fetch("/api/me", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (data.user && data.user.trialActive) {
          signupStatus.textContent =
            "You're signed in as " +
            data.user.email +
            " — " +
            data.user.trialRemainingHours +
            "h left in your trial.";
          signupStatus.className = "signup-status is-success";
        }
      })
      .catch(() => {});

    // Age-gate UX: clear the error state on the age-line as soon as the
    // user ticks the box, so the page doesn't keep yelling at them.
    const ageCheckbox = document.getElementById("trialAge");
    const ageLine = ageCheckbox?.closest(".signup-ageline");
    if (ageCheckbox && ageLine) {
      ageCheckbox.addEventListener("change", () => {
        if (ageCheckbox.checked) ageLine.classList.remove("is-error");
      });
    }

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = signupEmail.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        signupStatus.textContent = "Enter a valid email address.";
        signupStatus.className = "signup-status is-error";
        return;
      }
      // Hard age gate — Terms + Privacy require 18+. Block submission until
      // confirmed. Highlight the line in red so the user sees what's missing.
      if (ageCheckbox && !ageCheckbox.checked) {
        if (ageLine) ageLine.classList.add("is-error");
        signupStatus.textContent =
          "Please confirm you're 18 or older to continue.";
        signupStatus.className = "signup-status is-error";
        ageCheckbox.focus();
        return;
      }
      signupStatus.textContent = "Sending you a verification link…";
      signupStatus.className = "signup-status";
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) {
          signupStatus.textContent = data.message || "Signup failed.";
          signupStatus.className = "signup-status is-error";
          return;
        }
        // "Check your inbox" — build via createElement so we never set
        // innerHTML on a server-provided string.
        while (signupStatus.firstChild)
          signupStatus.removeChild(signupStatus.firstChild);
        const check = document.createElement("div");
        check.textContent =
          "✓ Check your inbox at " + email + " for the verification link.";
        signupStatus.appendChild(check);
        if (data.verifyLink) {
          // Dev mode — surface the magic link so it can be clicked manually.
          const devLine = document.createElement("div");
          devLine.style.marginTop = "8px";
          devLine.style.fontSize = "11px";
          devLine.appendChild(document.createTextNode("Dev mode — verify: "));
          const a = document.createElement("a");
          a.href = data.verifyLink;
          a.style.color = "var(--cyan)";
          a.style.textDecoration = "underline";
          a.textContent = data.verifyLink.slice(0, 60) + "…";
          devLine.appendChild(a);
          signupStatus.appendChild(devLine);
        }
        signupStatus.className = "signup-status is-success";
        // Disable the form to prevent re-submission.
        signupEmail.disabled = true;
        const submitBtn = signupForm.querySelector("button[type=submit]");
        if (submitBtn) submitBtn.disabled = true;
      } catch (err) {
        signupStatus.textContent = "Network error: " + (err.message || err);
        signupStatus.className = "signup-status is-error";
      }
    });
  }

  // ── PWA install — hero "↓ Install desktop app" button ─────────────────
  // Chrome/Edge/Brave fire `beforeinstallprompt` once the manifest + an
  // active service worker + icon criteria are met. We register the SW here
  // (lazily, after first paint) so first-time landing-page visitors qualify
  // without having to visit /app first. Safari has no beforeinstallprompt;
  // we keep the button visible and dispatch a platform-specific help toast.
  (function installCTA() {
    const btn = document.getElementById("installBtn");
    if (!btn) return;

    // Hide on already-installed standalone instances.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (isStandalone) return;

    let deferredPrompt = null;
    const ua = navigator.userAgent || "";
    const isAppleWebKit =
      /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;

    // Lazy-register the SW so beforeinstallprompt can fire here too.
    // Deferred via requestIdleCallback to keep first-paint clean.
    const registerSW = () => {
      if (!("serviceWorker" in navigator)) return;
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((err) => {
        // SW failure is non-blocking — landing still works without it.
        console.warn("Landing SW registration failed:", err && err.message);
      });
    };
    if (document.readyState === "complete") {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(registerSW, { timeout: 3000 });
      } else {
        setTimeout(registerSW, 1500);
      }
    } else {
      window.addEventListener(
        "load",
        () => {
          if (typeof requestIdleCallback === "function") {
            requestIdleCallback(registerSW, { timeout: 3000 });
          } else {
            setTimeout(registerSW, 1500);
          }
        },
        { once: true },
      );
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      btn.hidden = false;
    });

    // Safari never fires beforeinstallprompt — surface the button anyway so
    // Mac/iOS users see an install path. Click delivers the platform hint.
    if (isAppleWebKit) {
      btn.hidden = false;
    }

    // Tiny inline toast — kept local to the landing page so we don't have
    // to import the app's announce() helper.
    function toast(msg, color) {
      try {
        const el = document.createElement("div");
        el.setAttribute("role", "status");
        el.style.cssText =
          "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
          "background:#15151a;color:#fff;border:1px solid " +
          (color || "#444") +
          ";border-radius:8px;padding:10px 14px;font-family:Geist,sans-serif;" +
          "font-size:13px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.4);" +
          "max-width:min(420px,92vw);text-align:center";
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4500);
      } catch (err) {
        console.warn("toast failed:", err && err.message);
      }
    }

    btn.addEventListener("click", async () => {
      if (deferredPrompt) {
        try {
          deferredPrompt.prompt();
          const choice = await deferredPrompt.userChoice;
          deferredPrompt = null;
          if (choice && choice.outcome === "accepted") {
            toast("✓ Installing AsideMe…", "#5BE9B9");
          }
          btn.hidden = true;
        } catch (err) {
          console.warn("Install prompt failed:", err && err.message);
          deferredPrompt = null;
        }
        return;
      }
      if (isIOS) {
        toast("Tap Share → Add to Home Screen to install", "#7DDBFF");
      } else if (isAppleWebKit) {
        toast("Safari → File → Add to Dock to install", "#7DDBFF");
      } else {
        toast("Use your browser's address-bar install icon", "#7DDBFF");
      }
    });

    window.addEventListener("appinstalled", () => {
      btn.hidden = true;
      deferredPrompt = null;
      toast("✓ AsideMe installed", "#5BE9B9");
    });
  })();
})();
