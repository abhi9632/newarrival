# Phase 1 Brief: NewArrival

Written 2026-09-22. Input: `docs/CONCEPT.md` (LOCKED) plus `DAY1.md` EVENT CONFIG.
This is the planning input for GSD. Do not re-ideate from the raw problem statement.

---

## Step 1: extracted problem fields

| Field | Extracted Value | Confidence |
|-------|----------------|------------|
| Problem statement (1 sentence) | Every obligation and entitlement a new arrival to Australia has is fully determined by four facts (visa subclass, citizenship, arrival date, state), but no single agency derives them, so people miss dated deadlines, breach visa conditions by accident, and pay for things they were legally exempt from. | HIGH |
| Affected user / customer segment | International students and skilled migrants in their first 12 months in Australia. Roughly 700k student visa holders plus skilled migrant intake, all facing the same derivation problem. | HIGH |
| Current pain (what breaks today) | Rules live on a dozen sites that do not know each other exists: Home Affairs (visa conditions), ATO (TFN, tax residency, levy), Services Australia (Medicare, RHCA), state tenancy authorities (bond caps), private OSHC insurers, banks. None knows the user's visa subclass, so none can tell them which rules are theirs. Result: missed dated deadlines, accidental visa breach, and paying for things they were exempt from. | HIGH |
| Target persona (who the demo is for) | Priya, 24, subclass 500 student, Indian citizen, landed Melbourne 9 days ago, no TFN, no bank account, no lease, already paid $89 for a free TFN. Secondary: Marco, 31, subclass 482, Italian citizen, whose RHCA status makes his health module materially different. | HIGH |
| Proposed solution direction | A live client side model of the user's legal status. Four facts in, a dated and sourced obligation timeline out. Because it is a model and not a list, the user can perturb any input fact and watch every downstream obligation recompute and recolour. | HIGH |
| Key screens / flows needed | (1) Intro moment framing the derivation problem. (2) Four-field profile intake. (3) The timeline, the product centre, dated obligation cards grouped by agency with source citations. (4) The "what if" perturbation rail attached to the timeline. (5) A profile switch that swaps Priya for Marco to prove derivation. | MEDIUM |
| Data needed (what to mock) | A static rules corpus in JSON: visa conditions per subclass (500: 8105, 8202, 8501, 8533; 482: sponsorship obligations, PR pathway), RHCA country list, per-state tenancy rules (VIC, NSW bond authority, bond cap, rent in advance cap), tax obligations (TFN, residency test, return deadline, Medicare levy exemption), OSHC and Medicare eligibility logic. Every record carries a source URL, the instrument name, and the date it was checked. | HIGH |
| Demo narrative (1 sentence) | The judge watches Priya's timeline get built from four dropdowns in ten seconds, then watches a single drag of her course end date cascade into six changed obligations across three different agencies, live, with no page reload. | HIGH |
| Rubric criterion each feature serves | Intro moment: Problem clarity, Presentation. Profile intake: Problem clarity. Derivation engine + timeline: Solution quality, Feasibility. Perturbation rail: Solution quality, UX polish, Presentation. Source citations: Feasibility, Solution quality. Profile switch: Solution quality, Presentation. Visual system + motion: UX polish. | HIGH |
| Assumptions to test during build | Four dropdowns produce a timeline that feels personal rather than generic; the perturbation cascade reads as one legible event rather than noise; the 500 and 482 timelines diverge obviously to a judge who knows nothing about Australian visas. Full list in `docs/CONCEPT.md`. | HIGH |
| Brand / product context | None provided. Product name NewArrival. No client, no existing brand. | HIGH |
| Any provided assets (logo, colours, fonts) | None. | HIGH |
| Team size + roles | Solo: Abhi (@abhi9632) as lead and QA, Claude as sole developer. One machine, Windows 11. No task queue, per CLAUDE.md IDENTITY section (queue is for 3+ parallel sessions). | HIGH |
| Any teammate preferences or constraints | Model routing: Sonnet for components against an existing pattern, Opus for anything new or cross-cutting. Push directly to main, never a branch, never a PR. Commit and push after every completed unit of work. | HIGH |

**Design System: OPEN.** No brand assets provided. Choose a distinctive visual identity per
`rules/frontend-design.md`; the default component-library look is a bug. Authority is already
locked in `docs/CONCEPT.md`: `design-taste-frontend`, single authority, every screen, followed
by `emil-design-eng` as a sequential polish pass. T1 does not re-derive this choice.

---

## Step 2: hackathon constraints (hard limits, verbatim)

**Time budget** (from DAY1.md EVENT CONFIG, actual clock times):
- Planning done target: 13:45
- V1 demoable target: 17:00
- FEATURE FREEZE (hard): 19:30
- Demo: 23:30
- Available build time from planning done to freeze: about 5 hours 45 minutes.
- After freeze: V3 polish and P pitch tasks only. No new features.

**Scope: `prototype`.**
- UI prototype only. No real backend. No database. No auth.
- All data static JSON or hardcoded mock objects.
- Target: working, clickable demo that tells a clear story about problem and solution.
- Judges do not test every edge case. They follow the happy path. Build that first.
- "Prototype" scopes the backend, never the visual bar. Mock data and no auth are
  engineering shortcuts, not a licence to ship a bare utility screen. The demo still
  needs to look like a shipped product: a real hero or intro moment, a considered type
  and colour system, imagery where it earns its place, motion with a reason. A screen
  that merely functions reads as an internal wireframe and loses the UX polish criterion.

**Stack:**
- Next.js (App Router) + TypeScript + Tailwind. Chosen Day 1, recorded in EVENT CONFIG.
- Deployment: Vercel, 1-click from repo. Deploy is part of T1, so a live URL exists from
  the first hour rather than being rushed in the final five minutes.
- No new frameworks nobody has used before.
- No platform named by a third party, so no capability verification pass needed.

**Jurisdiction:** Australia. All rules, agencies, visa subclasses and dollar figures must
be traceable to a named real source, checked live during the build, with the check date
recorded next to the value in the data file.

---

## Step 3: judging rubric (from DAY1.md EVENT CONFIG)

No published rubric. Self-run practice event, no organiser, no rules page, no Discord,
no sponsor, so there was nothing to check. Fallback rubric from `SKILL.md` adopted.

| Criterion | Weight | What judges look for |
|---|---|---|
| Problem clarity | equal (20%) | The problem is specific and immediately obvious |
| Solution quality | equal (20%) | The solution actually addresses the problem |
| UX polish | equal (20%) | The demo looks and feels designed, not templated |
| Feasibility | equal (20%) | The approach is realistic and the tech choice is explainable |
| Presentation | equal (20%) | The story is clear and easy to follow in about 3 minutes |

Equal weights mean no criterion can be starved. In particular UX polish is worth exactly
as much as Solution quality, so the visual pass is not optional garnish.

---

## Step 4: hard constraints carried from CONCEPT.md

These are refusals, not preferences. A builder must not reach for these mid-build.

1. No external API call at demo time, ever. No LLM call, no live .gov.au fetch, no third
   party service on stage. Every data path is static JSON in the repo.
2. No legal or migration advice framing. Giving immigration assistance for a fee without
   MARA registration is an offence in Australia. The product cites rules and computes
   dates; it never says "you should", "you qualify" or "we recommend". A plain language
   disclaimer ships in V1, not V3.
3. No unsourced figure, ever. Every amount, hour cap, day count or percentage in the UI
   carries its instrument or agency page, verified live during build, with the date.
4. No personal identifiers collected or persisted. No passport number, no TFN, no visa
   grant number, no name. Profile is four dropdowns in client state. Hence no auth.
5. No em dashes in any visitor-facing copy, label, or on-screen text.
6. Do not build the Ledger (dollar quantification) in V1. It is deferred to V2 and must
   not creep into V1 scope.

**V1 scope matrix, deliberately minimal:** exactly 2 visa subclasses (500, 482), 2
citizenships (India, Italy, chosen because one is RHCA and one is not), 2 states (VIC,
NSW). That is the smallest matrix that proves derivation on stage. A third value of
anything is V2 and is refused during V1.
