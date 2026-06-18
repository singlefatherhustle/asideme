# Adding new subjects to the AsideMe library

Drop content in, run one command, it shows up in the library. This is the
playbook for filling out the seed library — CPA, nursing NCLEX, OSHA 30, bar
prep, USMLE, anything — so the library looks diverse on day one.

## TL;DR

```sh
# 1. Make a folder for your subject (any name, no spaces)
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.01-audit
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.02-far
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.03-reg
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.04-bec

# 2. Drop .md files inside each topic folder
cp ~/Downloads/cpa-audit-notes.md  teacher-docs/units/10-cpa_exam_prep/10.01-audit/
cp ~/Downloads/cpa-far-formulas.md teacher-docs/units/10-cpa_exam_prep/10.02-far/

# 3. Re-ingest (only takes a few seconds for text files)
ADMIN_EMAILS=you@example.com npm run reindex   # see "re-ingest" section below

# 4. Library auto-shows the new folder. Done.
```

## How the file path becomes a library folder

AsideMe derives the folder name (the **unit**) and the sub-section name (the
**topic**) from the directory structure:

```
teacher-docs/units/<NN-unit_name>/<N.NN-topic_name>/<file.md>
                    │              │                │
                    │              │                └─ Becomes a doc card in the library
                    │              └─ Becomes a sub-folder (topic) inside the unit
                    └─ Becomes the top-level folder (unit) in the library
```

**Naming convention:**
- The leading `NN-` (numbers + hyphen) is stripped from the display name
- Underscores become spaces
- So `10-cpa_exam_prep` displays as **CPA Exam Prep**
- And `10.01-audit` displays as **audit**

## Renaming the display name later

If you want the library to show something different from the folder name —
e.g. you want **"CPA — Audit (AUD)"** instead of just **"audit"** — run a
one-liner against the database:

```sh
sqlite3 devlisten.db "UPDATE docs SET unit='CPA Exam Prep' WHERE unit='cpa exam prep'"
sqlite3 devlisten.db "UPDATE docs SET topic='Audit (AUD)' WHERE unit='CPA Exam Prep' AND topic='audit'"
```

(This is exactly what we did to turn the auto-derived `georgia licensing` →
`Real Estate (Georgia)` for the trade folders.)

## File format support

| Extension | What it does |
|---|---|
| `.md` | **Best choice.** Markdown is indexed instantly, no API cost. |
| `.txt` | Treated like markdown. |
| `.pdf` | Extracted via Claude Vision (costs a few cents per PDF). Great for handbooks/study guides where you have a PDF and don't want to convert. |
| `.png` / `.jpg` / `.webp` | Extracted via Claude Vision. Use for slide screenshots and infographics. |
| `.js` / `.ts` / `.py` / etc. | Indexed as code (Software Engineering folder only). |

**For maximum bang-for-buck:** convert any PDFs/Word docs you have into
markdown first (using a tool like Pandoc, or just pasting into a markdown
editor). Avoids the per-file Anthropic vision cost.

## Re-ingesting after you add files

The ingest pipeline runs on startup the first time the DB is empty, but new
files need a manual nudge. Two ways:

### Option A — Reindex via admin API (preferred)

If you're an admin (your email is in `ADMIN_EMAILS` env var), POST to:

```sh
curl -X POST https://asideme.app/api/ingest/reindex \
  -H "Cookie: aside_session=<your-session-cookie>"
```

Walks both `teacher-docs/` and `ingested/` and refreshes everything.

### Option B — Restart with empty docs table (nuclear)

```sh
sqlite3 devlisten.db "DELETE FROM docs"
npm start  # auto-reingests everything on first request
```

Don't do this in production once you have user uploads in `ingested/` —
they'd get re-extracted (= API cost) for no reason.

## Subject ideas for filling out the library

Aim for **5–15 docs per subject** for launch. Doesn't have to be exhaustive —
you just want the folder to exist + have enough to demonstrate "yes, AsideMe
knows about this subject."

High-impact additions:

| Subject | Suggested topics | Typical exam |
|---|---|---|
| **CPA Exam Prep** | Audit (AUD), Financial (FAR), Regulation (REG), Business (BEC) | Uniform CPA Exam |
| **Nursing — NCLEX-RN** | Pharmacology, Med-Surg, Maternal/Newborn, Pediatrics, Psych, Fundamentals | NCLEX-RN |
| **OSHA 30 — Construction** | Fall protection, Electrical, PPE, Scaffolds, Excavation, HazCom | OSHA 30-hour card |
| **OSHA 30 — General Industry** | Walking surfaces, Lockout/tagout, Machine guarding, PPE | OSHA 30-hour card |
| **Bar Exam Prep** | Contracts, Torts, Crim Law, Property, Evidence, Constitutional, Civil Pro | UBE / state bar |
| **USMLE Step 1** | Biochem, Anatomy, Physiology, Pathology, Pharmacology, Micro/Immuno | USMLE Step 1 |
| **PMP / Project Management** | Initiating, Planning, Executing, Monitoring, Closing, Agile | PMP / CAPM |
| **CompTIA Security+** | Threats, Architecture, Implementation, Operations, Governance | SY0-701 |
| **Real Estate — non-GA states** | One folder per state, mirror the GA structure | State realtor license |
| **NAPLEX (Pharmacy)** | Pharmacology, Calculations, Compounding, Law | NAPLEX |
| **Series 7 / Series 63** | Equities, Bonds, Derivatives, Customer accounts, Regulations | FINRA |
| **Cosmetology / Esthetician** | Sanitation, Skin theory, Hair theory, Chemicals, Business | State cosmetology |

Each one expands the library's apparent breadth — even a single 5-doc folder
makes a CPA student feel "this is for me" instead of bouncing.

## Where to get content

You won't be writing all of this from scratch. Options:

1. **Open-content sources** that allow re-use:
   - OpenStax (free college textbooks, CC-licensed)
   - Public domain government publications (OSHA, IRS, state-board PDFs)
   - Wikipedia exam-prep articles (CC BY-SA — credit + link is OK)
   - Some state licensing boards publish their own study materials for free
2. **Your own notes** if you've taken any of these exams
3. **Have AsideMe help you** — once it's live, you can paste in your own
   handbook and have AsideMe generate summaries, then save those summaries
   back as study docs. Self-bootstrapping.

**Don't:** copy from copyrighted exam-prep companies (Becker, UWorld, Kaplan)
without licensing. That's exactly what the DMCA process exists to handle —
and being on both sides of a DMCA notice is a bad look.

## Worked example — adding a small CPA folder

```sh
# 1. Make the directory tree
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.01-audit
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.02-far
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.03-reg

# 2. Drop 3-5 markdown files in each topic. Pick any 5-paragraph topic
#    summaries you have or can generate.
cat > teacher-docs/units/10-cpa_exam_prep/10.01-audit/audit-risk-model.md <<'EOF'
# Audit Risk Model

The audit risk model relates the auditor's overall risk to three components:

Audit Risk = Inherent Risk × Control Risk × Detection Risk

Inherent risk and control risk together are called the "risk of material
misstatement" (RMM). Detection risk is what the auditor controls by adjusting
the nature, timing, and extent of substantive procedures.

...
EOF

# 3. Re-ingest
ADMIN_EMAILS=you@beatdump.com npm start &
# wait for server to come up, then:
curl -X POST -b "aside_session=<your-cookie>" http://localhost:3001/api/ingest/reindex

# 4. (Optional) Rename auto-derived display name
sqlite3 devlisten.db "UPDATE docs SET unit='CPA Exam Prep' WHERE unit='cpa exam prep'"

# Done. Library now shows "CPA Exam Prep" as a top-level folder with
# Audit, FAR, and REG as sub-sections.
```

## What you don't have to worry about

- **Privacy/security** — uploaded docs go through the same path-traversal
  protection and size cap as user uploads (25 MB max, basename validation).
- **Search** — the keyword index picks up new docs the moment they land.
- **Backups** — daily Fly volume snapshots include everything.
- **Format conversion** — the ingest pipeline auto-handles markdown, PDF,
  images, and a handful of code formats.

## When in doubt

Read `ingest.js` lines 66–86 — that's `parseMeta()`, the function that
decides how a file path becomes a library folder. It's 20 lines and the
single source of truth.
