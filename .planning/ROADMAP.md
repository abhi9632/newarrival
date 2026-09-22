# Roadmap: NewArrival

## Overview

Five phases take NewArrival from an empty repo to a live, demoable model of a new arrival's legal status in Australia. Phase 1 puts a designed intro moment on a public Vercel URL within the first hour, so every push from then on is reviewable by a human on any device. Phase 2 builds the verified rules corpus, the highest-risk work in the project, because every figure must be checked against a live .gov.au source before anything derives from it. Phase 3 is the vertical slice that makes the product real: four dropdowns in, a dated and sourced obligation timeline out, with the derivation engine as pure functions over that corpus. Phase 4 builds the signature moment the entire pitch is aimed at, the perturbation cascade, and tests the concept's stated assumptions while there is still time to act on the answers. Phase 5 closes the visual gate at 375 and 1280 and makes the demo path repeatable.

Total estimate: **4 hours 36 minutes** against **5 hours 45 minutes** of build time, leaving about 69 minutes of slack before the 19:30 feature freeze.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked INSERTED)

- [ ] **Phase 1: Foundation, art direction and live URL** - Scaffold, lock the visual direction, ship the intro moment to Vercel
- [ ] **Phase 2: Verified rules corpus** - The static legal content, every record sourced and dated
- [ ] **Phase 3: Derivation engine and obligation timeline** - Four facts in, a dated sourced timeline out
- [ ] **Phase 4: The perturbation cascade** - The signature moment, plus the assumption checkpoint
- [ ] **Phase 5: Visual gate and demo readiness** - 375 and 1280 verified, demo path repeatable

## Phase Details

### Phase 1: Foundation, art direction and live URL

**Goal**: A public Vercel URL showing a designed intro moment that states the derivation problem, with the art direction locked and recorded before any feature code exists.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Estimate**: 0.8 hours (about 50 minutes)
**Requirements**: INTAKE-01, SRC-04, SHIP-01, SHIP-03

**Success Criteria** (what must be TRUE):
1. A visitor reaching the public Vercel URL sees an intro moment that states the derivation problem in one line before any form or mechanism appears.
2. A visitor sees a plain language disclaimer stating this is not migration or legal advice.
3. `design-system/README.md` opens with a filled Art direction block (Signature, Reference, Anti-reference, Type stance, Colour world) followed by the tokens, and the screen visibly reflects it rather than a default component library look.
4. The lead can open the URL on a phone without any local setup.

**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md: Next.js App Router + TypeScript + Tailwind scaffold at the repo root, intro copy rendering through the real build, Vercel project connected, public production URL live and redeploying on push (SHIP-03)
- [ ] 01-02-PLAN.md: `design-taste-frontend` single-authority pass, Art direction block written ahead of the tokens, intro moment and disclaimer built against them, `emil-design-eng` polish pass and the visual gate at 375 and 1280 (INTAKE-01, SRC-04, SHIP-01)

**Notes**: Rule 0 applies. `design-taste-frontend` is the locked authority from `docs/CONCEPT.md`; this phase does not re-derive the choice. `emil-design-eng` runs after the layout is on screen, sequentially, never alongside. Deploy is in this phase deliberately: a past event deployed in the final five minutes under time pressure.

### Phase 2: Verified rules corpus

**Goal**: A static JSON rules corpus covering both visa subclasses, both citizenships and both states, where every single record carries its named instrument, its source URL, and the date it was verified against the live source.
**Mode:** mvp
**Depends on**: Phase 1
**Estimate**: 1.0 hours (about 60 minutes)
**Requirements**: RULE-01, RULE-02, RULE-03, RULE-04, RULE-05, RULE-06

**Success Criteria** (what must be TRUE):
1. Every record in the corpus has a non-empty instrument name, source URL, and verification date; a check script fails the build if any record is missing one.
2. The corpus encodes subclass 500 conditions 8105, 8202, 8501 and 8533, plus the 485 graduate visa window, each with the date rule that derives its deadline.
3. The corpus encodes subclass 482 sponsorship obligations, the consequence of ceasing employment, and the permanent residence pathway.
4. The corpus encodes the Reciprocal Health Care Agreement branch such that Italy resolves to a different health outcome than India, from data rather than from a code branch.
5. Every figure that will appear on screen was checked against its live source during this phase, not carried forward from memory.

**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md: Rule record schema and typed corpus entry point, the eleven gate validator that makes an unsourced record uncommittable, proven end to end by one live verified subclass 500 condition
- [ ] 02-02-PLAN.md: Populate and live verify the corpus: subclass 500 conditions and the 485 window, subclass 482 obligations and PR pathway, the RHCA health branch, then tax and state tenancy under the cut order

**Notes**: This is the highest-risk phase and the one most likely to overrun, because verifying real legal figures against live sources is slower than writing JSON. If it runs long, cut RULE-05 (tax) and RULE-06 (tenancy) first; they are tagged nice-to-have. RULE-02, RULE-03 and RULE-04 are demo-critical and cannot be cut, because the two-profile divergence depends on them.

### Phase 3: Derivation engine and obligation timeline

**Goal**: The product becomes real. Four dropdowns produce a dated, sourced, agency-labelled obligation timeline, derived by pure functions over the corpus with no per-profile hardcoded output anywhere.
**Mode:** mvp
**Depends on**: Phase 2
**Estimate**: 1.5 hours (about 90 minutes)
**Requirements**: INTAKE-02, INTAKE-03, ENGINE-01, ENGINE-02, ENGINE-03, ENGINE-04, ENGINE-05, TIME-01, TIME-02, TIME-03, TIME-04, TIME-05, SRC-01, SRC-02, SRC-03, SHIP-04

**Success Criteria** (what must be TRUE):
1. A user sets visa subclass, citizenship, arrival date and state from four controls and sees a dated obligation timeline appear with no page reload.
2. A user switching citizenship from India to Italy, changing nothing else, sees the health module change and sees the rest of the timeline hold.
3. A user switching state from VIC to NSW, changing nothing else, sees the tenancy module change and sees the rest of the timeline hold.
4. Every obligation on screen shows its owning agency, its computed due date, its status as overdue, due soon or upcoming, and its named source with a working link.
5. A user loads either example profile in one click and the two timelines are visibly different to someone who knows nothing about Australian visas.

**Plans**: 3 plans

**Assumption test inside this phase**: after criterion 5 is met, check CONCEPT.md's third assumption, that the 500 and 482 timelines diverge obviously to a lay judge. If they do not, the pitch swaps the two-profile moment for the RHCA health swap, and that decision is recorded in HANDOFF.md before Phase 4 starts.

Plans:
- [ ] 03-01-PLAN.md: The derivation engine as pure functions over the corpus, proven end to end by one rendered obligation, with nine named gates and a deliberately hardcoded engine the same check must reject
- [ ] 03-02-PLAN.md: Four-field intake plus one-click example profiles, all writing one profile state object the engine recomputes from
- [ ] 03-03-PLAN.md: Timeline UI, obligation cards with agency, status, plain-language detail and source citation, the visual gate at 375 and 1280, and the assumption checkpoint recorded before Phase 4

**Notes**: ENGINE-01 is the criterion that makes or breaks the pitch. If any profile's output is hardcoded rather than derived, the product is a styled to-do list and the demo claim is false. A check that asserts two profiles produce different derived sets belongs in 03-01, not at the end.

### Phase 4: The perturbation cascade

**Goal**: The signature moment. Dragging the course end date recomputes the whole timeline in one legible animated pass, with changed obligations marked against their previous state, and resettable so the demo can be re-run.
**Mode:** mvp
**Depends on**: Phase 3
**Estimate**: 0.8 hours (about 50 minutes)
**Requirements**: WHATIF-01, WHATIF-02, WHATIF-03, WHATIF-04

**Success Criteria** (what must be TRUE):
1. A user changes the course end date from a control attached to the timeline and the timeline recomputes with no page reload.
2. The recompute reads as a single legible event with staggered timing and a settled end state, not a jump cut and not visual noise.
3. A user can see which specific obligations changed, marked against their previous state, and the change spans at least three different agencies.
4. A user resets to the original profile in one action and the timeline returns to its starting state.

**Plans**: 2 plans

**Assumption test inside this phase**: check CONCEPT.md's second assumption, that the cascade reads as one legible event rather than noise, from a real screenshot at 375, before this phase is called done. If it fails, fix the timing here rather than deferring it to Phase 5.

Plans:
- [ ] 04-01-PLAN.md: Native range perturbation control, a second derived state diffed against a baseline that is never discarded, every card marked as moved, restatused or held, one action reset, and `scripts/check-cascade.mjs` asserting which pinned record ids move and which hold (WHATIF-01, WHATIF-03, WHATIF-04)
- [ ] 04-02-PLAN.md: `animate` pass, sequential and alone, giving a capped staggered cascade inside a 900ms settle budget with a specified reduced motion path, then the assumption checkpoint recorded against a real 375 screenshot with named fallbacks (WHATIF-02)

**Notes**: This phase is what the three-minute pitch is built around. It must land with time left to polish it, which is why it sits before Phase 5 and not at 19:25. If Phase 2 or 3 overran and this phase is at risk, cut nice-to-have requirements from earlier phases retroactively rather than compressing this one.

### Phase 5: Visual gate and demo readiness

**Goal**: The demo is repeatable and the screens pass the visual gate at both viewports, with the live URL carrying the finished build.
**Mode:** mvp
**Depends on**: Phase 4
**Estimate**: 0.5 hours (about 30 minutes)
**Requirements**: SHIP-02

**Success Criteria** (what must be TRUE):
1. A user walks the full happy path (intro, intake, timeline, perturbation, reset, profile switch) on a 375px viewport without a broken layout or an unreachable control.
2. Screenshots at 375 and 1280 exist for every screen, and the written visual gate answer is recorded: could this be any other team's project with the logo swapped, and would this pass as a paying client's shipped deliverable.
3. The public Vercel URL serves the finished build and the happy path works there, not only locally.
4. No em dash appears in any visitor-facing copy, label or on-screen text.

**Plans**: 1 plan

Plans:
- [ ] 05-01: `emil-design-eng` polish pass, mobile verification at 375, visual gate screenshots and written judgement, em dash sweep, final deploy

**Notes**: A generic screen is a bug, not a cosmetic issue. If the gate fails on a screen, that screen gets a fresh single-authority pass, which is explicitly allowed and encouraged. Feature freeze is 19:30; this phase is the last thing that may touch feature code.

## Rubric coverage

Every criterion in `DAY1.md` EVENT CONFIG is served, and none is served only by a trailing phase.

| Criterion | Served by |
|---|---|
| Problem clarity | Phase 1 (intro moment framing the derivation problem), Phase 3 (agency labelling, plain-language detail, overdue count) |
| Solution quality | Phase 2 (the corpus the derivation reads), Phase 3 (the engine itself, and the two-profile divergence), Phase 4 (the cascade proving the model recomputes) |
| UX polish | Phase 1 (art direction locked and on screen in the first hour, not deferred), Phase 4 (the animated cascade), Phase 5 (mobile and the visual gate) |
| Feasibility | Phase 1 (live URL in the first hour), Phase 2 (every figure sourced and dated), Phase 3 (visible citations and links), Phase 5 (it works on the public URL) |
| Presentation | Phase 1 (the opening beat of the pitch), Phase 3 (the profile switch), Phase 4 (the signature moment the pitch is built around), Phase 5 (a repeatable demo path) |

## Schedule against the clock

| Phase | Estimate | Cumulative | Wall clock if started 13:45 |
|---|---|---|---|
| 1 | 0.8h | 0.8h | 14:33 |
| 2 | 1.0h | 1.8h | 15:33 |
| 3 | 1.5h | 3.3h | 17:03 |
| 4 | 0.8h | 4.1h | 17:51 |
| 5 | 0.5h | 4.6h | 18:21 |

Feature freeze 19:30 leaves about 69 minutes of slack. V1 demoable target of 17:00 is met partway through Phase 3, which is the correct place for it: the timeline exists and is derived, the cascade is not yet built.

## Cut order if the clock slips

Cut from the top of this list first. Do not compress Phase 4.

1. RULE-06 and ENGINE-04, the state-conditional tenancy module. The RHCA citizenship branch already proves conditional derivation, so this is the cheapest proof to lose.
2. RULE-05, the tax obligations. Shared across both profiles, so it adds volume rather than divergence.
3. TIME-05, the overdue count badge.
4. SRC-03, the visible last-checked date. The date still lives in the data; it just stops rendering.

Below that line everything is demo-critical and cutting it changes what the pitch can claim.
