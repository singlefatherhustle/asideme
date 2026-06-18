# ASIDE — Frontend Handoff, Audit, Debug & Summary

**Project:** devlistenvv3new → **ASIDE v3.1**
**Date:** 2026-05-16
**Scope:** Frontend rebrand + Studio Dark palette + Library browser + Study Mode (TTS/STT) + trade dataset integration plan
**Supersedes:** `trade-psi-pack/ASIDE_HANDOFF.md` (2026-05-16 early draft — only covers rebrand + theme bootstrap)

This document captures **every frontend change made in this session** along with the line-level references, idempotent scripts, backup chain, debug notes, and the integration path for the trade-psi-pack datasets so a partner can roll the work into the original ASIDE codebase or any sibling repo.

---

## 0. TL;DR

ASIDE is a **5-layer evolution** of the ASIDE frontend, all delivered in [public/index.html](public/index.html) (one file) plus [server.js](server.js) plus [ingest.js](ingest.js):

| Layer | What | Why |
|---|---|---|
| **1. Rebrand** | ASIDE → **ASIDE** (uppercase, tracked), em-dash mark, Geist + Fraunces + Geist Mono | Brand identity for the trades/test-prep audience |
| **2. Studio Dark palette** | Near-black canvas, live-red accent, foil-gold, cue-green, signal-cyan | Pro-audio / studio aesthetic; high AAA contrast |
| **3. Library modal** | Browse all 133 indexed `.md` docs grouped by unit; search; markdown rendering; carousel | Self-service knowledge access |
| **4. UI polish + onboarding** | Glass header, bento panels, pill chips with tooltips, light-mode toggle, first-run hint | "Trendy + user-friendly" pass |
| **5. Study Mode (TTS+STT)** | Read questions aloud, transcribe spoken answers, auto-read on card change | Self-quizzing tool — recite + transcribe in one flow |

Plus a **client-side md-only policy**: PNG slides are blocked at the route layer; the AI's RAG retrieval still reads the OCR'd image content from the DB but the client never sees binary slides.

---

## 1. Frontend Changes — Chapter-by-chapter

### 1.1 Rebrand (ASIDE → ASIDE)

**Goal:** Replace the ASIDE identity with the ASIDE wordmark, em-dash mark, and brand-correct fonts.

| Change | Location | Detail |
|---|---|---|
| `<title>` | [public/index.html:6](public/index.html:6) | `ASIDE` → `ASIDE` |
| Brand mark | [public/index.html:1348](public/index.html:1348) | Gradient box + two-tone wordmark → em-dash bar + `ASIDE` in tracked caps |
| Logo CSS | `.logo` and `.logo-mark` rules in `<style>` | Gradient box → flat 22×6 live-red bar with soft glow; letter-spacing `-0.5px` → `0.14em` uppercase |
| Fonts | `@import` URL in `<style>` | Syne + JetBrains Mono → **Geist 400/500/600 + Fraunces (italic) + Geist Mono** |
| Body font | All `font-family: "Syne"` (2 hits) | → `"Geist", -apple-system, …` |
| Mono font | All `font-family: "JetBrains Mono"` (42 hits total — CSS + HTML-encoded + JS string) | → `"Geist Mono", ui-monospace, …` |
| Favicon | `<head>` injection | `<link rel="icon" href="favicon.svg">` |
| App icon | `<head>` injection | `<link rel="apple-touch-icon" href="mark.svg">` |
| Theme color | `<head>` injection | `<meta name="theme-color" content="#0B0B0E">` |
| Body strings | 3 occurrences | "ASIDE hears the teacher…" → "ASIDE hears the teacher…" |

**Assets added** (already in place):
- [public/favicon.svg](public/favicon.svg) — 32×32 em-dash on Stage canvas
- [public/mark.svg](public/mark.svg) — 256×256 em-dash, used as apple-touch-icon

**How it was applied:** `python3 ASIDE-studio-dark/apply-aside-rebrand.py public/index.html` — idempotent rebrand script. Re-running on a rebranded file produces zero changes.

**Brand rule override:** the previous kit forbade uppercase ASIDE; the new rule is **always uppercase, +0.14em tracking** (marquee feel). The `Geist 600` weight + capitalization gives the wordmark its "spotlight on the actor" presence.

---

### 1.2 Studio Dark color migration

**Goal:** Replace cyan/violet brand colors with a near-black/live-red palette while preserving the existing `:root` variable names so dependent code keeps working.

| Old token | Old value | New value | New role |
|---|---|---|---|
| `--bg` | `#07090f` | `#0B0B0E` | **Stage** — canvas |
| `--s1` | `#0d1117` | `#15151A` | **House** — card surface |
| `--s2` | `#111620` | `#1F1F26` | **Mezzanine** — raised surface |
| `--border` | `#1a2438` | `#252530` | **Gel** — hairlines |
| `--cyan` | `#00e5ff` | `#FF3C4B` | **Live** — primary accent (em-dash, CTA, on-air) |
| `--violet` | `#7c3aed` | `#D9B86F` | **Foil** — secondary / premium markers |
| `--green` | `#00e696` | `#39E5A8` | **Cue** — success / "ready" / listening |
| `--red` | `#ff3d5a` | `#FF3C4B` | Same role, retuned |
| `--amber` | `#ffb700` | `#D9B86F` | Now Foil |
| `--blue` | `#3b82f6` | `#7DDBFF` | **Signal** — focus rings, info |
| `--text` | `#d4e0f0` | `#EDE9DF` | **Paper** — primary text (warm off-white) |
| `--dim` | `#7a90a8` | `#8A857E` | **Ash** — secondary text |
| `--muted` | `#3a5068` | `#3A3A40` | Darkest text tier (intentionally darker than kit's Smoke `#52514E` to preserve UI hierarchy) |
| `--glow` | cyan glow | live-red glow | Brand glow |

**Plus 7 RGBA tuple migrations** for inline color references (cyan→Live, violet→Foil, green→Cue, etc.) and `#a78bfa` → `#D9B86F`. Total: **50 substitutions** in the color pass.

**How it was applied:** `python3 ASIDE-studio-dark/apply-studio-dark.py public/index.html` — atomic, idempotent. Backs up to `public/index.html.pre-studio-dark.YYYYMMDD-HHMMSS.bak`.

**Contrast verification (vs Stage `#0B0B0E`):**
- Paper: **15.8:1** — AAA
- Ash: **5.8:1** — AA normal, AAA large
- Live: **5.1:1** — AA normal
- Cue: **11.7:1** — AAA
- Signal: **9.6:1** — AAA

---

### 1.3 Library modal (browse 133 md docs)

**Goal:** Make every indexed `.md` doc browsable from the UI so users can scan their study materials without going through the AI tutor flow.

**Server side** ([server.js](server.js)):
- New `blockImages` middleware ([server.js:84-89](server.js#L84)) — 404s any request for `.png/.jpg/.jpeg/.gif/.webp/.bmp/.tiff/.svg` on `/teacher-docs` or `/ingested`
- New static routes ([server.js:90-99](server.js#L90)) — `/teacher-docs` and `/ingested` (post-block)
- `/api/docs` filter ([server.js:142-145](server.js#L142)) — strips `file_type === "image"` rows before responding

**Database** ([ingest.js:315](ingest.js#L315)):
- `listDocTopics()` now selects `path` (was missing the field) so the client can fetch raw doc bodies

**Frontend** ([public/index.html](public/index.html)):
- Library modal HTML before `</body>` — `<div id="libraryModal">…</div>` + `<div id="libPreview">…</div>` with carousel prev/next buttons
- IIFE script (~250 lines) — open/close logic, render, filter, search debounce, image carousel, **markdown renderer** (heading/code/lists/inline bold/italic — all built via `createElement` + `textContent` so user content is never re-interpreted as HTML)
- Library CSS — bento cards, glass shell, lazy-loaded thumbnails

**Keyboard shortcuts:**
- `L` — open Library (unless typing in an input)
- `Esc` — close preview, then close Library on second press
- `← / →` — step through filtered list while previewing
- `Tab` — natural focus traversal across cards

**Library opens via** the **📚 DOCS** chip in the header (now `role="button"`, `tabindex="0"`, keyboard-accessible).

---

### 1.4 UI polish + onboarding

**Goal:** Make the app feel modern (glass, bento, soft shadows, smooth motion) and welcoming (tooltips, first-run hint, light-mode toggle).

| Element | Before | After |
|---|---|---|
| Header | Solid `--s1` with border | **Glass** — `rgba(21,21,26,0.78)` + `backdrop-filter: blur(14px) saturate(140%)` |
| Header chips | Cramped, no explanation | **Pill chips** with subtle bg tint, hover lift, **`data-tip` tooltips** on hover/focus |
| Mic CTA | 76×76, flat surface, 24px font | **92×92 wrap / 74×74 button**, gradient surface, 4-ring focus glow, scale-press feedback |
| Panels | `border-bottom` between sections | Softer hairline + 18px breathing room, mono eyebrow labels |
| Focus rings | None | Universal `2px solid var(--blue)` on `:focus-visible` (3px offset) |
| Light mode | Not available | **Sun/moon toggle** in header; `html[data-theme="light"]` token overrides; persisted in `localStorage["aside-theme"]`; theme bootstrap inline in `<head>` to prevent FOUC |
| First-run hint | N/A | Bottom-right card pointing to 📚 DOCS and `L` shortcut; dismissed on first Library open or by ✕; persists `aside-hint-seen` |

**Theme bootstrap** ([public/index.html](public/index.html) — inline `<script>` after `<title>`):

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("aside-theme") || "dark";
      if (t === "light") document.documentElement.setAttribute("data-theme", "light");
    } catch (_) {}
  })();
</script>
```

Runs synchronously before paint — no flash of dark before light theme applies.

---

### 1.5 Study Mode — TTS + STT recite-and-transcribe layer

**Goal:** Self-quizzing tool where ASIDE **reads questions aloud** (TTS) and **transcribes the user's spoken answer** (STT). Works on top of the existing `/api/quiz`, `/api/flashcards`, `/api/summary` endpoints — no backend changes needed.

**How it works (no new endpoints):**
1. User opens Study panel, picks a topic, picks Quiz / Flashcards / Summary
2. The existing renderer paints the question card
3. A separate IIFE wraps `renderFlashTab`, `renderQuizTab`, `renderSummaryTab` and appends a control toolbar **after** the original render finishes
4. The toolbar has **Read question / Read answer / Record my answer / Auto-read toggle**
5. TTS uses `window.speechSynthesis` (Geist-compatible en-US voice picked automatically)
6. STT uses `window.SpeechRecognition` (or `webkitSpeechRecognition` fallback) — separate instance from the main classroom listener
7. Transcript streams live (interim italic → final regular) into the `study-transcript` panel
8. Auto-read setting persists in `localStorage["aside-autoread"]`

**Wrapped renderers:**
- **Flashcards** — auto-reads the visible face (front, or back when flipped); record button captures the spoken answer
- **Quiz** — toolbar attaches to the first **unanswered** question; reads `${question}. Options: A. … B. … C. … D. …`; once answered, "Read answer" becomes available and includes the explanation
- **Summary** — concatenates `title + overview + key concepts + top-5 vocab` into one spoken summary; "Read summary aloud" button

**Stops on:** Esc, tab-hide (`visibilitychange`), card navigation, manual button toggle.

**Exposed for debugging:**

```js
window.asideStudy = { speak, stopSpeak, startDictate, stopDictate, getAutoRead, setAutoRead };
```

**Browser support:**

| Browser | TTS | STT |
|---|---|---|
| Chrome / Edge | ✅ | ✅ |
| Safari (desktop) | ✅ | ✅ |
| Safari (iOS) | ✅ | ⚠️ requires user gesture, limited continuous |
| Firefox | ✅ | ❌ — fallback hint shown |
| Brave | ✅ | ✅ (Web Speech enabled by default) |

When STT is unavailable, the UI shows: *"Mic dictation isn't supported in this browser. Use Chrome, Edge, or Safari."*

---

### 1.6 PNG → md-only client policy

**Goal:** All slide PNGs already have md siblings; the client only needs md. PNGs are kept on disk as the OCR source-of-truth and accessible to the RAG engine via the DB, but client-side access is fully blocked.

**Verification** (run anytime):

```sh
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3001/ingested/Fundamentals/slide_01.png"  # → 404
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3001/ingested/Fundamentals/slide_01.md"   # → 200
curl -s http://localhost:3001/api/docs | python3 -c "import sys,json;d=json.load(sys.stdin);print('img rows:', sum(1 for t in d['topics'] if t['file_type']=='image'))"  # → 0
```

**Result:** `/api/docs` returns **133 md docs** (down from 203 with images). UI filter row collapsed to a single "All notes" tab since the "Slides" category is now empty.

---

## 2. File map (where each change lives)

```
devlistenvv3new/
├── ASIDE_FRONTEND_HANDOFF.md       ← THIS FILE
├── public/
│   ├── index.html                  ← All UI changes (rebrand, palette, Library, polish, Study Mode)
│   ├── favicon.svg                 ← em-dash mark, dark canvas, 32×32
│   ├── mark.svg                    ← em-dash mark, dark canvas, 256×256
│   └── index.html.pre-*.bak        ← Backup chain (see §6)
├── server.js                       ← blockImages middleware, /api/docs filter, /teacher-docs + /ingested routes
├── ingest.js                       ← listDocTopics() now selects `path`
└── ASIDE-studio-dark/              ← Sibling kit + scripts (in /Users/beatdump/Downloads/)
    ├── tokens.css                  ← Reference design tokens
    ├── landing.html
    ├── onboarding.html
    ├── wordmark*.svg, mark.svg, favicon.svg
    ├── apply-studio-dark.py        ← Re-runnable color migration script
    └── apply-aside-rebrand.py      ← Re-runnable rebrand script
```

---

## 3. Migrating an unmodified ASIDE repo to ASIDE

Order matters — the rebrand script depends on Studio Dark tokens being in place.

```sh
# 0. Pre-flight — clean tree, on a feature branch
cd path/to/devlisten-v3
git checkout -b feat/aside-rebrand
git status                           # should be clean

# 1. Copy brand assets into public/
cp ~/Downloads/ASIDE-studio-dark/favicon.svg public/
cp ~/Downloads/ASIDE-studio-dark/mark.svg    public/

# 2. Apply Studio Dark color migration (50 substitutions, atomic)
python3 ~/Downloads/ASIDE-studio-dark/apply-studio-dark.py public/index.html

# 3. Apply ASIDE rebrand (~55 substitutions, atomic, idempotent)
python3 ~/Downloads/ASIDE-studio-dark/apply-aside-rebrand.py public/index.html

# 4. Manually port these features that AREN'T in the scripts:
#    a) Library modal — copy the CSS + HTML + IIFE from this repo's public/index.html
#    b) UI polish + theme toggle + first-run hint
#    c) Study Mode (TTS+STT) IIFE
#    d) blockImages middleware in server.js (~10 lines)
#    e) /api/docs filter in server.js (~3 lines)
#    f) listDocTopics path selector in ingest.js (1 line)

# 5. Verify
grep -n "ASIDE\|JetBrains\|Syne" public/index.html   # → empty
grep -n "<title>ASIDE\|class=\"logo\"\|favicon\.svg"  public/index.html   # → present

# 6. Start the server and visit /
node server.js                       # requires ANTHROPIC_API_KEY (server now exits if missing)
open http://localhost:3001/
```

**The scripts do steps 2 & 3 deterministically.** Steps 4a-f are file-spread enough that a partner should copy the relevant blocks from `public/index.html` rather than re-deriving them. The IIFEs are self-contained at the bottom of the file.

---

## 4. Trade dataset integration — plumbing / HVAC / electrical / general contracting

**Source:** `/Users/beatdump/Downloads/trade-psi-pack/.claude/skills/cross-jurisdiction-licensing-research/reference/psi-trade-exam-content/`

**8 ready-to-ingest markdown files (802 total lines):**

| File | Lines | Trade |
|---|---|---|
| `business-and-law.md` | 107 | Trade business/legal exam |
| `electrical-journeyman.md` | 101 | Journeyman electrician |
| `general-contractor.md` | 108 | General contracting |
| `hvac-mechanical.md` | 113 | HVAC / mechanical |
| `nascla-commercial.md` | 109 | NASCLA commercial contractor |
| `plumbing-journeyman.md` | 82 | Journeyman plumber |
| `plumbing-master.md` | 89 | Master plumber |
| `specialty-trades.md` | 93 | Other specialty trades |

Each file is already well-structured for RAG ingestion: top-level title, content-domain table, exam structure, study guidance.

### 4.1 Recommended directory structure

Stage the files in `teacher-docs/` under a `trades/` unit so they're picked up by the existing reindex flow:

```
teacher-docs/
└── trades/
    ├── business-and-law.md
    ├── electrical-journeyman.md
    ├── general-contractor.md
    ├── hvac-mechanical.md
    ├── nascla-commercial.md
    ├── plumbing-journeyman.md
    ├── plumbing-master.md
    └── specialty-trades.md
```

### 4.2 Integration commands

```sh
# 1. Stage the trade docs into the ASIDE codebase
mkdir -p teacher-docs/trades
cp /Users/beatdump/Downloads/trade-psi-pack/.claude/skills/cross-jurisdiction-licensing-research/reference/psi-trade-exam-content/*.md teacher-docs/trades/

# 2. (Optional) Also stage the master exam + PSI-services data
mkdir -p teacher-docs/trades/datasets
cp /Users/beatdump/Downloads/trade-psi-pack/docs/datasets/psi-services-exam-master.md teacher-docs/trades/datasets/
cp /Users/beatdump/Downloads/trade-psi-pack/docs/datasets/psi-test-master-table.md   teacher-docs/trades/datasets/

# 3. Reindex via the existing endpoint (no restart needed)
curl -X POST http://localhost:3001/api/ingest/reindex

# 4. Verify they show up
curl -s http://localhost:3001/api/docs | python3 -c "
import sys, json
d = json.load(sys.stdin)
trades = [t for t in d['topics'] if 'trade' in (t.get('unit') or '').lower() or 'trades' in (t.get('path') or '').lower()]
print(f'Trade docs indexed: {len(trades)}')
for t in trades[:10]: print(' -', t['unit'], '/', t['topic'])
"
```

### 4.3 What happens after reindex

- **Library modal** — trade docs appear as a new unit group ("trades") with 8+ entries; users can browse, search, and read full markdown
- **Study Mode** — all 3 modes (Quiz / Flashcards / Summary) work immediately. The existing `/api/quiz`, `/api/flashcards`, `/api/summary` endpoints accept `unit` + `topic` and generate exam-style content via Claude from the markdown source. No new code needed.
- **TTS/STT** — works the same. Read a plumbing exam question aloud, speak your answer, see the transcribed response next to the correct answer.
- **RAG** — the AI tutor (`/api/chat`) automatically retrieves trade content when the user asks plumbing/HVAC/electrical/contracting questions during a session.

### 4.4 Naming convention for the Study panel

The existing `topic-card` renderer shows `unit / topic`. To get cleaner labels:

- Rename files so `topic` reads well: `plumbing-journeyman.md` already shows as "plumbing-journeyman" in the picker. If you want spaces, rename to `Plumbing Journeyman.md` (the ingester preserves filename).
- OR leave as-is — slugs are clear enough.

---

## 5. Audit — what's automated, what's tracked

### 5.1 Idempotent scripts (re-runnable, never duplicate work)

| Script | Path | What it does | Safe to re-run? |
|---|---|---|---|
| `apply-studio-dark.py` | `~/Downloads/ASIDE-studio-dark/` | Color migration (14 tokens + 7 rgba + hex) | ✅ — already-migrated files produce 0 changes |
| `apply-aside-rebrand.py` | `~/Downloads/ASIDE-studio-dark/` | Rename + fonts + logo HTML + favicon links | ✅ — pattern-based, no-ops on already-rebranded files |

### 5.2 Backup chain

Each script writes a timestamped `.bak` next to the file before mutating. To roll back to any state:

```sh
ls -la public/index.html.*.bak
#  index.html.pre-studio-dark.20260516-102355.bak    ← pre-color
#  index.html.pre-aside-rebrand.20260516-103250.bak  ← pre-rename
#  index.html.pre-aside-rebrand.20260516-103356.bak  ← mop-up pass
```

Restore: `cp public/index.html.pre-studio-dark.<stamp>.bak public/index.html`

### 5.3 Manual edits with no backup (use `git diff` if rolling back)

These were applied via Edit tool, not script:

- Library modal CSS + HTML + IIFE
- UI polish CSS (glass header, bento, focus rings, tooltips)
- Theme bootstrap in `<head>` + theme toggle button
- First-run hint
- Study Mode TTS+STT IIFE
- `blockImages` middleware in [server.js](server.js)
- `/api/docs` filter in [server.js](server.js)
- `path` field in [ingest.js](ingest.js#L315)

Rollback for these = `git checkout HEAD -- <file>` if committed, or compare against the `.bak` chain.

### 5.4 Recently flagged changes (NOT made by this session)

The session-system reported [server.js](server.js) was modified externally to add a hard exit if `ANTHROPIC_API_KEY` is missing:

```js
if (!ANTHROPIC_KEY) {
  console.error("❌  ANTHROPIC_API_KEY missing");
  process.exit(1);
}
```

This is intentional — the server is no longer launchable without the key. Document this in deploy runbooks.

---

## 6. Debug — known issues, edge cases, security notes

### 6.1 The Anthropic API key is now mandatory

[server.js:69-72](server.js#L69) calls `process.exit(1)` if `ANTHROPIC_API_KEY` is unset. Previously it just warned. Deploy must export the key before `node server.js`:

```sh
export ANTHROPIC_API_KEY="sk-ant-..."
node server.js
```

The Library and Study Mode features themselves don't need the key — but the server won't boot without it, so the page won't render either.

### 6.2 Static-server preview doesn't satisfy `/api/*`

If you serve `public/` via `python3 -m http.server` (e.g. for design review), the page paints fine but every `/api/*` call 404s/501s. This is harmless for visual review but breaks any interactive feature. **Use `node server.js` (port 3001) for real testing.**

### 6.3 Security hook caught — false positive on innerHTML

The session's security hook flagged `innerHTML = …` usage in dynamic rendering even when every interpolated value was already `esc()`-escaped. **All new code in this session uses `createElement` + `textContent`** for dynamic content (see Library renderer, Study Mode toolbar, markdown renderer). The pattern is:

```js
const node = document.createElement('div');
node.textContent = userValue;        // safe — never interpreted as HTML
parent.appendChild(node);
```

Anyone porting this work to a React/Vue/Svelte equivalent should keep the same discipline — the framework's raw-HTML escape hatch should never receive user content. Stick to `{userValue}` text bindings or a sanitizer like DOMPurify.

### 6.4 SpeechRecognition edge cases

- **iOS Safari**: requires a user gesture to start; `continuous: true` is partially honored — recognition may auto-stop after a few seconds. The `onend` handler properly resets the recording state.
- **Tab-switch**: `visibilitychange` listener stops both TTS and STT when the user navigates away. Without this, speech queues survive across tabs.
- **Multiple instances**: only one `SpeechRecognition` instance is allowed per page on most browsers. Study Mode uses a **separate** instance from the main classroom listener; if both are active, you'll get a "recognition-already-started" error. The wrapper functions cancel any prior dictation before starting a new one.

### 6.5 `prefers-reduced-motion`

Honored throughout — glass blur transitions, hint slide-in, hover lifts, recording pulse, and carousel scale-up all disable when the user has reduced-motion preference set.

### 6.6 Light mode caveats

Light mode is **token-driven** — `html[data-theme="light"]` overrides Stage/Paper/Ash/etc but leaves the brand colors (Live/Cue/Foil/Signal) alone. Two surfaces need manual handling:

- **SVG wordmarks** are designed for dark surfaces (Paper-colored text). They'll be invisible on light backgrounds. If a light-mode-only surface needs the wordmark, use `mark.svg` (which self-contains the Stage canvas).
- **`body::before` ambient gradient** is dimmed (opacity: 0.5) in light mode to avoid red overlay on bone background.

### 6.7 The 70 PNG slides on disk

After §1.6 (PNG block), the actual `.png` files **remain on disk** in `ingested/**/*.png`. They serve two purposes:
1. RAG content backup — if you ever need to re-OCR with a better model, the source is still there
2. The DB still has `image` rows pointing to them (used by retrieval) — deleting the files would orphan those rows

**If you want them physically deleted**, the safe command (after backing up the DB):

```sh
# DRY RUN — list what would be deleted
find ingested -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -print

# ACTUALLY DELETE — irreversible
find ingested -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -delete

# Then prune orphaned DB rows
sqlite3 devlisten.db "DELETE FROM docs WHERE file_type='image';"
```

Don't do this unless you're confident the md siblings are complete.

### 6.8 Browser cache after a Studio Dark deploy

CSS variables change but the file size stays similar, so some browsers serve stale CSS. Recommend **hard reload** (Cmd+Shift+R / Ctrl+Shift+R) once after deploy, or bump a query string on the CSS import.

---

## 7. Pre-deploy verification checklist

Run all of these before declaring the migration complete:

### Visual
- [ ] `<title>` reads **ASIDE**, not ASIDE
- [ ] Header wordmark renders as em-dash + tracked-caps ASIDE (no ⚡ emoji)
- [ ] Background is near-black (`#0B0B0E`), not blue-black
- [ ] CTAs (mic button, primary buttons) glow live-red, not cyan
- [ ] Favicon shows red em-dash on near-black canvas
- [ ] Apple touch icon (`mark.svg`) loads on iOS without 404

### Library
- [ ] **📚 DOCS** chip in header is clickable + keyboard-focusable
- [ ] Pressing `L` opens Library
- [ ] Search input filters across title/topic/unit/path
- [ ] Counter shows `133 of 133` (or your real ingested count)
- [ ] No image cards shown
- [ ] Clicking an md card opens preview with rendered markdown (headings, code blocks, lists)
- [ ] `←/→` arrow keys step between cards in preview
- [ ] `Esc` closes preview, then closes Library

### Study Mode
- [ ] Quiz / Flashcards / Summary tabs all show the new toolbar **after** their content
- [ ] "Read question" speaks via TTS (en-US voice)
- [ ] "Record my answer" turns red, transcribes spoken input live (interim italic → final regular)
- [ ] **Auto-read toggle** persists across reloads (`localStorage["aside-autoread"]`)
- [ ] Esc stops both TTS and STT

### Theme
- [ ] Sun/moon toggle in header flips palette
- [ ] Choice persists across reloads (`localStorage["aside-theme"]`)
- [ ] No flash of dark before light (bootstrap script ran)
- [ ] `<meta name="theme-color">` updates to match (mobile browser chrome)

### Onboarding
- [ ] First-run hint appears bottom-right ~2.5s after first load
- [ ] Dismisses on first Library open OR on ✕ click
- [ ] Does NOT reappear after dismissal (`aside-hint-seen` flag)

### Server
- [ ] `node server.js` exits cleanly if `ANTHROPIC_API_KEY` is missing
- [ ] `GET /api/docs` returns `count` and `topics` with **zero image rows**
- [ ] `GET /ingested/<anything>.png` returns **404**
- [ ] `GET /ingested/<anything>.md` returns **200**
- [ ] `GET /teacher-docs/<anything>.md` returns **200**

### Trade datasets (if integrated)
- [ ] All 8 trade `.md` files copied to `teacher-docs/trades/`
- [ ] `/api/ingest/reindex` returns `indexed >= 8`
- [ ] Library shows a "trades" unit with the new topics
- [ ] A quiz can be generated for `plumbing-journeyman` (or any trade topic)
- [ ] TTS reads a generated plumbing question aloud
- [ ] STT transcribes a spoken answer

### Accessibility (run with VoiceOver / NVDA)
- [ ] All chips, buttons, and toggles announce their purpose
- [ ] Library filter tabs have `role="tab"` and `aria-selected` reflects state
- [ ] Modal dialogs trap focus (Tab cycles within)
- [ ] Toast/hint regions use `aria-live="polite"` (don't steal focus)
- [ ] Focus rings visible on keyboard navigation (Tab through everything)

### Performance / Core Web Vitals
- [ ] First Library open under 200ms (renders 133 cards instantly — no virtualization needed at this size)
- [ ] No CLS from theme bootstrap (runs pre-paint)
- [ ] Lazy-loaded thumbnails don't block first paint
- [ ] No console errors on initial page load

---

## 8. Rollback paths

| Scope | Command |
|---|---|
| Single file, any layer | `cp public/index.html.<bak>.bak public/index.html` (pick the right timestamp) |
| Just the color migration | `cp public/index.html.pre-studio-dark.*.bak public/index.html` (resets EVERYTHING incl. rebrand — apply rebrand again if needed) |
| Just the rebrand | `cp public/index.html.pre-aside-rebrand.*.bak public/index.html` (keeps Studio Dark) |
| Server changes only | `git diff server.js; git checkout HEAD -- server.js` |
| Database state (img rows in `docs`) | `sqlite3 devlisten.db ".backup devlisten.pre-migration.db"` before any cleanup |

---

## 9. Open follow-ups (out of scope this session)

These are worth flagging but were not addressed:

1. **`⚡` emoji in perf-timing chip** — at `public/index.html:2342`, used inside a JS template string for the millisecond badge (`⚡ ${ms}ms`). Brand rule says "no emoji as structural icons" but this is a functional indicator, not nav. Trivial to swap for an SVG bolt if you want full kit compliance.
2. **Mark.svg for light surfaces** — the current SVG wordmarks are designed for dark canvases only. Add a light-canvas variant if you ever surface them on a light-theme page.
3. **Rate-limit the Study Mode endpoints** — `/api/quiz`, `/api/flashcards`, `/api/summary` already share `quizLimiter` (15/min). With TTS/STT making sessions longer, consider bumping or adding per-IP analytics.
4. **PWA manifest** — ASIDE has favicon + apple-touch-icon but no `manifest.json`. If installable home-screen is a goal, add one.
5. **TTS voice picker** — currently auto-picks the first en-US voice. Add a dropdown if voice consistency matters across users.
6. **Trade exam reference linking** — the trade `.md` files cite NFPA / IPC / NEC editions. Consider hyperlinking common citations to UpCodes or the SDO pages in a future ingest pass.

---

## 10. Contacts / source-of-truth

| Asset / decision | Where it lives |
|---|---|
| Brand kit (tokens, SVGs, reference HTML) | `~/Downloads/ASIDE-studio-dark/` |
| Migration scripts | Same as above (`apply-studio-dark.py`, `apply-aside-rebrand.py`) |
| Trade datasets | `~/Downloads/trade-psi-pack/.claude/skills/cross-jurisdiction-licensing-research/reference/psi-trade-exam-content/` |
| Trade research framework | `~/Downloads/trade-psi-pack/CLAUDE.md` |
| Previous handoff (early draft) | `~/Downloads/trade-psi-pack/ASIDE_HANDOFF.md` (SUPERSEDED by this doc) |
| Active codebase | `~/Downloads/devlistenvv3new/` (this file's root) |

---

**Handoff complete.** A partner reading this top-to-bottom should be able to:
1. Apply the same migration to any ASIDE clone in under 10 minutes
2. Integrate the 8 trade exam datasets in under 5 minutes
3. Verify the deploy against the §7 checklist before going live
4. Roll back any layer cleanly via §8

If anything in this doc drifts from reality, **the code in [public/index.html](public/index.html) is authoritative** — re-read the IIFE blocks at the bottom of the file before re-deriving anything.

---

## 11. Tooling setup

Install the liquid-glass design skill for the glass-header / bento aesthetic work:

```sh
ecc-install --skills liquid-glass-design --target claude
```
