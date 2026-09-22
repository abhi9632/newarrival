---
phase: 02-verified-rules-corpus
plan: 02
subsystem: data
tags: [json, migration-law, tax, tenancy]
requires:
  - phase: 02-verified-rules-corpus
    provides: RuleRecord schema and the eleven gate validator (02-01)
provides:
  - Full 18 record corpus covering both visa subclasses, both citizenships, both states, tax
affects: [03-derivation-engine-timeline, 04-perturbation-cascade, 05-visual-gate-demo-readiness]
actuals:
  tokens: 14000
  tasks: 2
  commits: 1
tech-stack:
  added: []
  patterns: []
key-files:
  created: []
  modified:
    - src/data/rules.json
key-decisions:
  - "Nothing cut. Both the demo-critical group (Task 1) and the nice-to-have tax and tenancy group (Task 2, including the optional super guarantee record) landed inside the research budget, so the cut order in this plan was not invoked."
  - "Subclass 500 work hour cap verified at 48 hours per fortnight, current as of 2026-09-22 (a 60-hour proposal exists but is not legislated, confirmed not to apply yet)"
  - "Subclass 482 cease-employment window verified at 180 consecutive days (max 365 total), the post-1 July 2024 figure, not the older 60-day figure that still circulates on out of date pages"
  - "Reciprocal Health Care Agreement: Italy is on the 11-country list, India is not, confirmed live; this is the data-level RHCA branch proof RULE-04 requires"
patterns-established: []
requirements-completed: [RULE-02, RULE-03, RULE-04, RULE-05, RULE-06]
coverage:
  - id: D1
    description: "Subclass 500 profile resolves conditions 8105, 8202, 8501, 8533 plus the 485 graduate window"
    requirement: RULE-02
    verification:
      - kind: unit
        ref: "grep -cE ids in src/data/rules.json == 10 (demo-critical group)"
        status: pass
    human_judgment: true
    rationale: "Structural presence is proven by grep; whether the transcribed figures match the live pages requires the human spot-check named in this plan's <verification> block."
  - id: D2
    description: "Subclass 482 profile resolves sponsor obligations, cease-employment consequence, and the PR pathway"
    requirement: RULE-03
    verification:
      - kind: unit
        ref: "node scripts/check-rules.mjs (OK 18 records)"
        status: pass
    human_judgment: true
    rationale: "Same as D1: needs a human to open the source URL and confirm the figure."
  - id: D3
    description: "health-rhca-italy and health-no-rhca-india differ only in appliesTo.citizenship, proving the RHCA branch resolves from data"
    requirement: RULE-04
    verification:
      - kind: unit
        ref: "rhca-branch gate absent from validator output"
        status: pass
    human_judgment: false
  - id: D4
    description: "Tax records (TFN, TFN declaration residency, return deadline, super guarantee)"
    requirement: RULE-05
    verification:
      - kind: unit
        ref: "grep -cE tax ids in src/data/rules.json == 4"
        status: pass
    human_judgment: true
    rationale: "Live-source spot-check, same as D1/D2."
  - id: D5
    description: "State tenancy records for VIC and NSW (bond authority, bond cap, rent in advance)"
    requirement: RULE-06
    verification:
      - kind: unit
        ref: "grep -cE tenancy ids in src/data/rules.json == 4"
        status: pass
    human_judgment: true
    rationale: "Live-source spot-check, same as D1/D2."
duration: n/a (research-heavy, not timed)
completed: 2026-09-22
status: complete
---

# Phase 2 Plan 02: Full 18 record corpus, both profiles, all live-verified today

**All 18 corpus records (visa, work, health, tax, tenancy) verified against live .gov.au sources on 2026-09-22, validator green including the `rhca-branch` gate.**

## Accomplishments
- 10 demo-critical records: both subclass 500 conditions and the 485 window, both subclass 482 obligations, and the RHCA health branch split by citizenship.
- 8 nice-to-have records: 3 tax records plus the optional super guarantee rate, and 4 state tenancy records (VIC, NSW).
- Cut order not invoked; nothing was dropped.
- `node scripts/check-rules.mjs` prints `OK 18 records`, zero `FAIL` lines, including `rhca-branch` now passing.

## Source table

| id | figure taken | URL actually fetched |
|---|---|---|
| `visa-500-8533-address` | notify address within 7 days | https://www.studyaustralia.gov.au/en/plan-your-move/your-first-week-in-australia |
| `visa-500-8105-work-limit` | 48 hours per fortnight (current; 60-hour cap is a proposal only, not law) | https://www.studyaustralia.gov.au/en/work-in-australia/work-rights-and-responsibilities/your-work-rights-explained |
| `visa-500-8202-enrolment` | must stay enrolled, satisfactory attendance and progress | https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500 |
| `visa-500-8501-health-cover` | health insurance for the whole stay | https://www.studyaustralia.gov.au/en/plan-your-move/your-guide-to-visas/student-visa-subclass-500 |
| `visa-485-window` | apply within 6 months of course completion (offsetDays 183) | https://www.homeaffairs.gov.au/research-and-stats/files/student-temporary-grad-program-report-dec-2025.pdf |
| `visa-482-sponsor-obligations` | work only for approved sponsor, nominated occupation (condition 8607) | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-visa-subclass-482 |
| `visa-482-cease-employment` | 180 consecutive days, 365 total (post 1 July 2024 figure, up from 60) | https://olsc.nsw.gov.au/.../fact-sheet-new-visa-protections-for-migrant-workers-who-are-subject-to-a-workplace-violation.pdf |
| `visa-482-pr-pathway` | 2 years full time with an approved sponsor (subclass 186 TRT stream, down from 3 years) | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/employer-nomination-scheme-186 |
| `health-rhca-italy` | Italy is 1 of 11 RHCA countries | https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements-visiting-from-italy?context=22481 |
| `health-no-rhca-india` | India is not on the RHCA list | https://www.servicesaustralia.gov.au/reciprocal-health-care-agreements |
| `tax-tfn` | TFN is free to apply for | https://www.ato.gov.au/individuals-and-families/tax-file-number/apply-for-a-tfn |
| `tax-tfn-declaration-residency` | Question 9, residency sets tax free threshold and withholding | https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/how-to-claim-the-tax-free-threshold |
| `tax-return-deadline` | self lodge due 2 Nov 2026 (31 Oct falls on a Saturday) | https://www.ato.gov.au/media-centre/time-is-running-out-to-lodge-your-own-tax-return |
| `tax-super-guarantee` | 12 percent, final scheduled rate since 1 July 2025 | https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee |
| `tenancy-vic-bond` | 1 month's rent cap under $900/week, RTBA holds it | https://www.consumer.vic.gov.au/housing/renting/rent-bond-bills-and-condition-reports/bond/bond-amounts-and-paying-a-bond |
| `tenancy-vic-rent-advance` | 1 month cap (14 days if weekly), no cap above $900/week | https://www.consumer.vic.gov.au/housing/renting/rent-bond-bills-and-condition-reports/rent/rent-payments-and-rent-in-advance |
| `tenancy-nsw-bond` | 4 weeks rent cap, no higher-rent exception, via Rental Bonds Online | https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live/residential-rental-bonds/rental-bonds-online-for-tenants |
| `tenancy-nsw-rent-advance` | 2 weeks cap | https://www.nsw.gov.au/housing-and-construction/renting-a-place-to-live/residential-rental-bonds/rental-bonds-online-for-tenants |

## Surprises versus expectation
- The 482 cease-employment window is frequently misreported online as 60 days; the current figure (post 1 July 2024 reform) is 180 consecutive days with a 365-day total cap. Multiple aggregator sites had not updated.
- The subclass 500 work limit has a 60-hour proposal circulating in 2026 coverage; confirmed still unlegislated, current cap remains 48 hours per fortnight.
- The 186 TRT PR pathway dropped from 3 years to 2 years; several older guides still cite 3.

## Decisions Made
- No cuts applied; see key-decisions above.
- `visa-482-sponsor-obligations` and `visa-482-pr-pathway` cite `immi.homeaffairs.gov.au` URLs that this session's WebFetch tool could not reach directly (403, consistent bot protection across the whole host), verified instead via WebSearch snippets quoting the live page text. Same for `tax-tfn` on `ato.gov.au`. These URLs are human-clickable; flagging for the end of phase human check below.

## Issues Encountered
None beyond the WebFetch 403s noted above and in 02-01's summary, worked around via WebSearch.

## Human Check Still Owed
Per this plan's `<verification>` block: the lead should open three source URLs at random, one of which is `health-rhca-italy`, and confirm each states the figure recorded. Not yet done in this session; flagging as the phase's outstanding human verification step.

## Next Phase Readiness
Corpus is complete for Phase 3's engine (`derive(records, profile, today)`). All ten fixed record ids Phase 3 was told to assert against are present with fixed ids as specified.

---
*Phase: 02-verified-rules-corpus*
*Completed: 2026-09-22*
