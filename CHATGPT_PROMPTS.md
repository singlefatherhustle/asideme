# ChatGPT prompts for sourcing ASIDE library content

Two prompts. The first one you paste **once** into ChatGPT's Custom
Instructions (set-and-forget). The second one is your **per-subject
working prompt** — copy-paste it into a new chat for each subject folder
you want to fill out.

Together they get you exam-prep study content, formatted as markdown,
sourced from public-domain / open-licensed material, ready to drop into
`teacher-docs/units/...` and re-ingest.

---

## 1. Custom Instructions (paste once)

Open ChatGPT → click your avatar → **Customize ChatGPT** (or **Custom
Instructions** on older UIs). There are two fields. Paste the matching
block into each.

### Field 1 — "What would you like ChatGPT to know about you?"

```
I'm building ASIDE, a certification-exam-prep web app that lets students ask
questions during live class and generates quizzes, flashcards, and summaries
from indexed study materials. ASIDE is launching soon as a paid product
($9/mo) targeting non-technical exam candidates — real-estate agents,
contractors, HVAC techs, nurses, CPAs, paralegals, OSHA 30 candidates,
project managers, IT cert candidates, and anyone studying for a professional
license or certification.

I'm filling out the seed library — that is, the starter study material that
ships with ASIDE so users see a populated library on day one, before they
upload anything of their own. Each subject lives as a folder of markdown
files in this structure:

  teacher-docs/units/<NN-unit_name>/<N.NN-topic_name>/<file.md>

Examples:
  teacher-docs/units/10-cpa_exam_prep/10.01-audit/risk-model.md
  teacher-docs/units/11-nclex_rn/11.02-pharmacology/cardiac-drugs.md
  teacher-docs/units/12-osha_30_construction/12.04-fall_protection/general-requirements.md

I need study notes — not academic essays, not Wikipedia summaries. The
content should read like a tight 5-minute exam-prep review on a specific
sub-topic. Aim for what a candidate would skim the morning of the exam.

I am NOT licensed to copy from commercial exam-prep providers (Becker,
Kaplan, UWorld, NCLEX Mastery, PrepU, Princeton Review, etc.). Anything you
generate must be paraphrased from public-domain or open-licensed sources,
with the source cited at the bottom of the file. Acceptable sources include:
US government publications, state licensing-board free materials, OpenStax,
public-domain textbooks, CC-licensed Wikipedia content, official exam blueprints
published by certifying bodies, and your own training-data-derived knowledge
of generally-known facts in the field. Anything specific (a rule, statute,
formula, dosage, code section) MUST be tied to a citable source.
```

### Field 2 — "How would you like ChatGPT to respond?"

```
Response format for every study-note request:

1. Output ONE markdown file per response, ready to save as-is.
2. The very first line MUST be a level-1 heading with the topic title (no
   "Here's the file…" preamble, no closing remarks unless I ask).
3. Body length: aim for 250–600 words. Tight bullet points beat long
   paragraphs. Use bold for key terms. Use short ordered lists for processes,
   bulleted lists for facts/rules.
4. Include section headers (## level) when content covers multiple sub-areas
   (e.g. "Statute", "Application", "Common exam scenarios").
5. End every file with a "## Source" section listing 1–3 public-domain or
   open-licensed sources with URLs where possible. Format:
     - <Source title> — <issuing body / publisher> — <URL>
6. If asked about a topic where you're uncertain or where rules vary by
   jurisdiction, say so explicitly with a "⚠ Verify with..." line.
7. Never include copyrighted exam-prep content (Becker, UWorld, Kaplan,
   PrepU, NCLEX Mastery, etc.). If the user asks for content that would
   require copying from such sources, refuse and explain — don't fabricate
   to satisfy the request.
8. Avoid academic preamble ("This document explores...", "In conclusion..."
   etc.). Get straight to the testable content.
9. Use plain English at a 9th-grade reading level. The audience is busy
   adults, not graduate students.
10. When the user gives you a folder path in the request, treat that as
    metadata — DO NOT include the path inside the file content itself. Just
    confirm at the very end of your message: "Save as: <full path>".

When the user asks for "five files on Topic X," output them as five separate
markdown code blocks in one response, each preceded by the filename it
should be saved as. Don't combine them into one file.
```

---

## 2. Per-subject working prompt (paste per chat)

Open a new ChatGPT conversation. Copy this template, fill in the **3 fields
at the top**, and send. ChatGPT will return ready-to-save markdown files.

Adjust the file count (default 5) based on how big the subject is. Aim for
5–10 files per topic, 3–6 topics per subject. That's 15–60 files per
subject, which is enough to look real without taking forever to source.

```
Subject (top-level library folder):  CPA Exam Prep
Topic (sub-folder under the subject): Audit (AUD)
Folder path on disk:                  teacher-docs/units/10-cpa_exam_prep/10.01-audit/

Generate 5 study-note markdown files for the topic above, each on a
distinct testable sub-topic that would appear on the actual exam.

For each file:
- Pick a sub-topic that's specific enough to be useful as exam prep (not
  "Auditing" — instead "Audit risk model", "Confirmation procedures",
  "Internal controls — COSO framework", "Going-concern evaluation", etc.)
- Filename: kebab-case, .md, lowercase, no leading numbers
  (e.g. audit-risk-model.md)
- Format per the Custom Instructions: H1 title, 250–600 words, source line
  at the bottom
- Cite public-domain sources only — AICPA published exam blueprints, FASB
  pronouncements, government audit standards (GAO Yellow Book), etc.

After all 5 files, list them as:
  Save as: <path>filename.md

I'll save each one manually then drop the whole folder into ASIDE and
re-ingest.
```

### Example fields to swap in (12 subjects × suggested topics)

Use one of these blocks. Each is ready to paste in place of the 3 fields
above. Customize the topic if you want a different specific sub-folder.

#### CPA Exam Prep
- Folder: `10-cpa_exam_prep`
- Topics: `10.01-audit` (AUD), `10.02-far` (FAR), `10.03-reg` (REG), `10.04-bec` (BEC)
- Sources: AICPA Exam Blueprints, FASB ASC, IRS publications, GAO Yellow Book

#### NCLEX-RN (Nursing)
- Folder: `11-nclex_rn`
- Topics: `11.01-pharmacology`, `11.02-med_surg`, `11.03-maternal_newborn`, `11.04-pediatrics`, `11.05-psych`, `11.06-fundamentals`, `11.07-priority_setting`
- Sources: NCSBN test plan (public), CDC, FDA, NIH, state nurse practice acts

#### OSHA 30 — Construction
- Folder: `12-osha_30_construction`
- Topics: `12.01-fall_protection`, `12.02-electrical`, `12.03-ppe`, `12.04-scaffolds`, `12.05-excavation`, `12.06-hazcom`, `12.07-cranes`
- Sources: 29 CFR 1926 (US Code of Federal Regs — public domain), OSHA fact sheets, NIOSH publications

#### OSHA 30 — General Industry
- Folder: `13-osha_30_general_industry`
- Topics: `13.01-walking_working_surfaces`, `13.02-lockout_tagout`, `13.03-machine_guarding`, `13.04-ppe`, `13.05-hazcom`, `13.06-respiratory`, `13.07-bloodborne_pathogens`
- Sources: 29 CFR 1910, OSHA fact sheets

#### Bar Exam Prep (UBE-focused)
- Folder: `14-bar_exam_prep`
- Topics: `14.01-contracts`, `14.02-torts`, `14.03-criminal_law_procedure`, `14.04-property`, `14.05-evidence`, `14.06-constitutional`, `14.07-civil_procedure`, `14.08-business_associations`
- Sources: Restatements of Law (public summaries), Federal Rules of Evidence/Civil Procedure (public), US Constitution + landmark Supreme Court opinions, NCBE outlines

#### USMLE Step 1
- Folder: `15-usmle_step_1`
- Topics: `15.01-biochemistry`, `15.02-anatomy`, `15.03-physiology`, `15.04-pathology`, `15.05-pharmacology`, `15.06-microbiology`, `15.07-immunology`, `15.08-behavioral_sciences`
- Sources: NIH/NCBI publications, CDC, NLM open textbooks, USMLE content outline (public)

#### PMP / Project Management
- Folder: `16-pmp_pm_prep`
- Topics: `16.01-initiating`, `16.02-planning`, `16.03-executing`, `16.04-monitoring_controlling`, `16.05-closing`, `16.06-agile_methodologies`, `16.07-stakeholder_management`
- Sources: PMI's free content (Talent Triangle, Code of Ethics), PMBOK summaries from open sources, Agile Manifesto (public)

#### CompTIA Security+
- Folder: `17-comptia_security_plus`
- Topics: `17.01-threats_attacks`, `17.02-architecture_design`, `17.03-implementation`, `17.04-operations_incident_response`, `17.05-governance_risk_compliance`
- Sources: NIST publications (SP 800-series — public domain), CompTIA's free objectives document, MITRE ATT&CK framework (public)

#### Real Estate — non-Georgia states (one folder per state)
- Folder: `18-real_estate_<state>` (e.g. `18-real_estate_florida`, `18-real_estate_texas`, `18-real_estate_california`)
- Topics: mirror the GA structure — `xx.01-license_classes`, `xx.02-agency_fiduciary`, `xx.03-contracts_money`, `xx.04-federal_compliance`, `xx.05-state_specific`
- Sources: state real-estate commission publications (almost all are public), state-published license handbooks, federal Fair Housing Act, RESPA

#### NAPLEX (Pharmacy)
- Folder: `19-naplex_pharmacy`
- Topics: `19.01-pharmacology`, `19.02-calculations`, `19.03-compounding`, `19.04-pharmacy_law`, `19.05-clinical_practice`
- Sources: FDA, NIH, USP general chapters (public summaries), state pharmacy boards, NABP exam blueprint

#### Series 7 / Series 63 (FINRA securities)
- Folder: `20-finra_series_7` or `20-finra_series_63`
- Topics: `xx.01-equities`, `xx.02-bonds`, `xx.03-options_derivatives`, `xx.04-customer_accounts`, `xx.05-regulations_recordkeeping`
- Sources: FINRA rules (public), SEC publications, US Treasury Department resources

#### Cosmetology
- Folder: `21-cosmetology`
- Topics: `21.01-sanitation_infection_control`, `21.02-skin_theory`, `21.03-hair_theory_chemistry`, `21.04-nail_care`, `21.05-state_laws_business`
- Sources: state cosmetology board publications, CDC infection-control guidelines, FDA cosmetic regulations

---

## 3. Workflow once you have ChatGPT output

After ChatGPT gives you 5 markdown files for a topic:

```sh
# 1. Make the folder
mkdir -p teacher-docs/units/10-cpa_exam_prep/10.01-audit

# 2. For each file ChatGPT returned, save with the filename it told you
#    (use your editor of choice — VS Code, Cursor, vim, whatever)

# 3. After saving the batch (one topic at a time, or all of them at once):
cd /Users/beatdump/Downloads/devlisten-v3
# Restart the server OR hit the admin reindex endpoint (see ADD_CONTENT.md)

# 4. Open the library in ASIDE — your new folder should be there.
#    If the auto-derived name looks ugly, rename it in the DB:
sqlite3 devlisten.db "UPDATE docs SET unit='CPA Exam Prep' WHERE unit='cpa exam prep'"
```

## 4. Quality bar — what's good enough to ship

A study note is "good enough" if:

- ✅ A candidate could read it in 3-5 minutes and learn one specific
  testable thing
- ✅ The source line at the bottom is a real, citable, public-domain URL
- ✅ It doesn't read like an essay (no "In this document we will...")
- ✅ It doesn't copy any commercial exam-prep content
- ✅ Specific facts (formulas, statutes, dosages) are cited inline or
  flagged for verification

A study note is **NOT** good enough if:

- ❌ It's generic encyclopedia content with no exam focus
- ❌ It quotes >2 sentences verbatim from any single source (even
  public-domain — long verbatim quotes look lazy)
- ❌ The cited source is a paywalled / commercial site
- ❌ It includes specific cited rules without a verifiable citation

You don't have to read every word ChatGPT generates. Spot-check 1 in 5 for
the source-citation quality and pass on the rest. Bad files can be removed
later via `UPDATE docs SET removed_at = unixepoch() WHERE id = N`.

## 5. Cost expectations

ChatGPT subscription pricing is flat — generate as much as you want.

If you instead use the OpenAI API directly:
- GPT-4o output: ~$0.01 per 500-word file
- 100 files (full launch library across 4 subjects): ~$1
- Use cheaper models (gpt-4o-mini) for first-pass generation: ~$0.10 for the
  same 100 files

This is cheap. Don't optimize cost; optimize quality + time.

---

## Closing note

The Custom Instructions block is the highest-leverage thing here. Paste it
once and every future conversation auto-applies the format, citation, and
copyright rules. From there, each subject is ~5 minutes of prompting +
~10 minutes of saving files. A whole subject folder is ~1 hour, batched.

You can fill out a respectable 4-subject library in an evening. The
"day-one diverse library" outcome is much closer than the to-do list makes
it look.
