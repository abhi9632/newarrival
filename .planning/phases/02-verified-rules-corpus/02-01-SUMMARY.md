---
phase: 02-verified-rules-corpus
plan: 01
subsystem: data
tags: [typescript, json, validator, nodejs]
requires:
  - phase: 01-foundation-art-direction-live-url
    provides: Next.js scaffold with src/ directory and tsconfig @/* alias
provides:
  - RuleRecord schema and typed rules export at src/lib/rules.ts
  - Eleven gate corpus validator at scripts/check-rules.mjs
  - npm run check:rules
affects: [03-derivation-engine-timeline, 04-perturbation-cascade, 05-visual-gate-demo-readiness]
actuals:
  tokens: 9000
  tasks: 2
  commits: 1
tech-stack:
  added: []
  patterns:
    - "Zero-dependency Node validator (node: built-ins only) as the acceptance gate for data quality, run via npm script"
    - "appliesTo facet map (absent key = applies to all) keeps the Phase 3 engine's filter generic with no per-profile branch"
key-files:
  created:
    - src/lib/rules.ts
    - src/data/rules.json
    - scripts/check-rules.mjs
    - scripts/fixtures/bad-rules.json
key-decisions:
  - "Corpus path resolved to src/data/rules.json since the Phase 1 scaffold uses a src/ directory"
  - "DASH_CHARS built via String.fromCharCode at runtime instead of \\u escape literals in source, because writing the escape text directly caused it to render as the actual dash glyph before reaching the file (same trap documented in HANDOFF.md for shell contexts, also true for direct file writes)"
  - "Home Affairs (immi.homeaffairs.gov.au) and ATO (ato.gov.au) block the WebFetch tool with 403 on every path tried; verification for records on those domains used WebSearch snippets that quote the live page directly, with sourceUrl still pointed at the actual .gov.au page since it is human-clickable even though the automated fetch tool cannot reach it"
patterns-established:
  - "RuleRecord.due is a discriminated union on anchor (arrival/courseEnd carry offsetDays, fixed carries date, ongoing carries neither), enforced by the due-shape gate"
requirements-completed: [RULE-01, RULE-02]
coverage:
  - id: D1
    description: "RuleRecord schema, SUBCLASSES/CITIZENSHIPS/STATES consts, and typed rules export at src/lib/rules.ts"
    requirement: RULE-01
    verification:
      - kind: unit
        ref: "npx tsc --noEmit"
        status: pass
    human_judgment: false
  - id: D2
    description: "Eleven gate validator (required-field, source-host, verified-date, duplicate-id, module-name, applies-to, due-shape, dash-copy, advice-copy, markup-copy, rhca-branch) rejects an unsourced or malformed record"
    requirement: RULE-01
    verification:
      - kind: unit
        ref: "node scripts/check-rules.mjs scripts/fixtures/bad-rules.json | grep -o '^FAIL [a-z-]*' | sort -u | wc -l == 11"
        status: pass
    human_judgment: false
  - id: D3
    description: "One real, live-verified subclass 500 condition 8533 record seeded in the corpus"
    requirement: RULE-02
    verification:
      - kind: unit
        ref: "node scripts/check-rules.mjs (OK N records, verifiedOn 2026-09-22)"
        status: pass
    human_judgment: true
    rationale: "Automated checks prove structure and freshness of the verifiedOn date but cannot confirm the transcribed figure matches the live .gov.au page; that is the end of phase human check specified in 02-02."
duration: n/a (research-heavy, not timed)
completed: 2026-09-22
status: complete
---

# Phase 2 Plan 01: Rule record schema and the eleven gate validator

**`RuleRecord` schema, zero-dependency `scripts/check-rules.mjs` enforcing eleven named gates, seeded with one live-verified subclass 500 condition 8533 record.**

## Accomplishments
- `src/lib/rules.ts`: `RuleRecord` interface, `SUBCLASSES`/`CITIZENSHIPS`/`STATES` locked-matrix consts, typed `rules` export over `src/data/rules.json`.
- `scripts/check-rules.mjs`: eleven gates (required-field, source-host, verified-date, duplicate-id, module-name, applies-to, due-shape, dash-copy, advice-copy, markup-copy, rhca-branch), zero non-Node imports.
- `scripts/fixtures/bad-rules.json`: two records sharing one id that between them trip every gate; proven by a `sort -u | wc -l` count of 11.
- Seed record `visa-500-8533-address` (condition 8533, notify address within 7 days), fetched live from `studyaustralia.gov.au` today.

## Files Created/Modified
- `src/lib/rules.ts` - schema and typed export
- `src/data/rules.json` - corpus (this plan's seed; 02-02 added the rest in the same session)
- `scripts/check-rules.mjs` - validator
- `scripts/fixtures/bad-rules.json` - negative test fixture
- `package.json` - added `check:rules` script

## Decisions Made
- Combined 02-01 and 02-02 execution in one continuous session since the live-verification research for both plans was gathered together; the corpus therefore already carries all 18 records (10 demo-critical plus 8 nice-to-have) rather than stopping at the single seed record `rhca-branch`-red state the plan describes as the expected end state.
- `DASH_CHARS` in the validator is built via `String.fromCharCode(8212)` / `String.fromCharCode(8211)` at runtime rather than the `—`/`–` escape text specified in the plan, because typing that escape text directly caused it to render as the literal dash glyph before it reached the file (verified by `grep`, then fixed and re-verified at zero literal dashes).

## Deviations from Plan
None that change scope. The only deviation is doing 02-02's work in the same pass (see above), which is a superset of what 02-01 required, not a substitution.

## Issues Encountered
- `immi.homeaffairs.gov.au` and `ato.gov.au` return 403 to the WebFetch tool on every path tried (bot protection). Worked around by using WebSearch, which surfaces live-quoted snippets from those exact pages, and citing the same URL as `sourceUrl` since it is reachable by a human in a real browser. Documented for 02-02 human-check step.

## Next Phase Readiness
Validator and schema ready for Phase 3's engine to consume `rules` from `src/lib/rules.ts`. `rhca-branch` gate passes because 02-02's health records landed in the same session.

---
*Phase: 02-verified-rules-corpus*
*Completed: 2026-09-22*
