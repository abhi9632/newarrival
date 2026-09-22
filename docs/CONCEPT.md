# CONCEPT.md

**LOCKED 2026-09-22 13:05 AEST.** Refinements edit this file in place. Never create a second concept file.

Product name: **NewArrival**

## Problem statement (1 sentence)

Every obligation and entitlement a new arrival to Australia has is fully determined by four facts (visa subclass, citizenship, arrival date, state), but no single agency derives them, so people miss dated deadlines, breach visa conditions by accident, and pay for things they were legally exempt from.

## Persona

Priya, 24, landed in Melbourne 9 days ago on a subclass 500 student visa, citizen of India, course starts in 3 weeks. She has a passport and an enrolment letter, and no TFN, no bank account, no lease. She has already paid a private site $89 for a TFN that the ATO issues free. She does not know that condition 8533 gives her 7 days from arrival to notify her address, that her 48 hour per fortnight work limit is a rolling window rather than a weekly one, or that her course end date is the anchor for a 485 graduate visa window she has not heard of.

Secondary persona, same engine, different output: Marco, 31, subclass 482 Skills in Demand, Italian citizen, arrived with a partner. Italy has a Reciprocal Health Care Agreement with Australia, so his Medicare position is materially different from Priya's, and the app must visibly say so.

## Solution concept (3 sentences max)

NewArrival is a live model of your legal status in Australia, not a checklist: you give it four facts and it derives a dated, sourced obligation timeline that belongs only to you. Because it is a model rather than a list, you can perturb it, drag your course end date, drop to part time study, change state, and every downstream obligation, deadline and entitlement recomputes and recolours in front of you. Every item on the timeline carries the named legal instrument and the .gov.au source it came from, so the app is auditable rather than asking to be trusted.

## Demo narrative (1 sentence: "judge watches X happen")

The judge watches Priya's timeline get built from four dropdowns in ten seconds, then watches a single drag of her course end date cascade into six changed obligations across three different agencies, live, with no page reload.

## Signature wow moment

**The Perturbation.** A "what if" rail sits alongside the timeline. The judge drags the course end date three months earlier and the entire timeline reflows and recolours in one animated pass: the 485 graduate visa application window slides and turns amber because it now opens during semester, the 8105 work hour cap lifts for the recognised break and its card visibly unlocks, OSHC cover now ends before the visa does so that card turns red with a computed gap in days, and the tax return deadline stays put while everything around it moves. One gesture, six consequences, three agencies. No other team's checklist can do that, because a checklist has nothing to recompute.

## Design authority (from rules/frontend-design.md choice table)

`design-taste-frontend`, single authority, for every screen.

Which row: "Product UI, dashboard, forms, multi-step app screens", whose default preference is `design-taste-frontend`. This concept is not dense data or admin tooling, it has a real product surface: an intro moment that frames the problem before any mechanism appears, a profile intake with genuine craft, and a timeline that is the emotional centre of the product rather than a table. `frontend-design` is explicitly the wrong pick here, it is the fallback for briefs with no product-surface moment anywhere, and this brief is mostly product surface.

Sequence per `rules/frontend-design.md`: `design-taste-frontend` locks art direction and layout, then `emil-design-eng` runs as a separate sequential polish pass on easing, hover and press states, and interruption behaviour. `animate` is allowed for the Perturbation cascade only, after the static layout is on screen, never loaded alongside the authority.

## What each role sees that the others do not

There is one human role in V1, the new arrival. Differentiation is by profile, not by role, and that distinction is the product. Making two profiles produce visibly different apps is a V1 requirement, not a nice to have, because it is the proof that the engine derives rather than templates.

- Subclass 500 student (Priya, India): sees the 8105 work hour cap, 8202 enrolment and progress, 8501 OSHC, 8533 address notification, and the 485 graduate visa window. Does not see any Medicare pathway.
- Subclass 482 Skills in Demand (Marco, Italy): sees Reciprocal Health Care Agreement Medicare eligibility, employer sponsorship obligations and the consequence of leaving that employer, and a permanent residence pathway. Does not see any study condition or work hour cap.
- Same subclass, different citizenship: the RHCA countries branch changes the health module alone while the rest of the timeline holds, which is the cleanest on-stage proof that the engine is real.
- Same profile, different state: the tenancy module swaps bond authority, bond cap and rent-in-advance rules, and nothing else moves.

## Hard constraints (never do this, even if it would work)

- **No external API call at demo time, ever.** No LLM call, no live .gov.au fetch, no third party service on stage. Scope is `prototype`, every data path is static JSON in the repo. A network dependency the demo cannot survive is not worth any feature.
- **No legal or migration advice framing.** In Australia, giving immigration assistance for a fee without MARA registration is an offence. The product surfaces cited rules and computes dates from them, it never says "you should", "you qualify" or "we recommend". Copy uses "your visa condition 8105 says" with the source next to it. A visible plain language disclaimer ships in V1, not V3.
- **No unsourced figure, ever.** Any dollar amount, hour cap, day count or percentage that appears in the UI must carry the named instrument or agency page it came from, checked during build against the live source, with the date checked. A wrong number here is worse than a missing feature, because the entire pitch is "this is auditable".
- **No personal identifiers collected or persisted.** No passport number, no TFN, no visa grant number, no name required. The profile is four dropdowns held in client state. This is also why there is no auth and no account.
- **No em dashes** in any visitor-facing copy, labels, or on-screen text.
- **Do not build the Ledger in V1.** The dollar quantification (finalist B from the sprint) is deliberately deferred to V2 and must not creep into V1 scope.

## Why it wins each rubric criterion

- Problem clarity: the intro moment states the derivation problem in one line and the persona is concrete and dated, a real person 9 days off a plane with a deadline in 4 days. A judge understands it before the product loads.
- Solution quality: it is the actual shape of the problem. The obligations genuinely are a derivation from four facts, so a model that derives them is the correct solution rather than a convenient one, and the two profile comparison proves the derivation is real.
- UX polish: single design authority locked at concept time, an intro moment before any mechanism, and one signature animated cascade with a reason to exist. `emil-design-eng` polish pass and the visual gate at 375 and 1280 before any screen is called done.
- Feasibility: pure client side derivation over static JSON, Next.js on Vercel, deployed in T1 so a live URL exists from the first hour. Nothing in the critical path can fail on stage. The tech choice explains itself in one sentence.
- Presentation: the 3 minute script writes itself, 20 seconds of problem, 10 seconds building the timeline, 40 seconds on the Perturbation, 30 seconds switching to Marco to prove derivation, close on the sourcing. One flow, one gesture, no feature tour.

## Top 2 risks + mitigation

1. **The rules engine sprawls past the freeze.** Modelling all of Australian migration, tax, health and tenancy law is unbounded, and the temptation is to add one more subclass. Mitigation: V1 covers exactly two visa subclasses (500 and 482), two citizenships (India and Italy, chosen because one is RHCA and one is not), and two states (VIC and NSW). That is the smallest matrix that proves derivation on stage. Any third value of anything is V2 and is refused during V1.
2. **A wrong legal figure on stage destroys the credibility the whole pitch rests on.** Mitigation: a dedicated sourcing pass before V1 is called done, every figure checked against the live .gov.au page with the date recorded in the data file next to the value, and the source rendered in the UI. Anything that cannot be sourced in the time available is cut rather than guessed.

## Assumptions to test during build

- That a four dropdown intake produces a timeline rich enough to feel personal rather than generic. If it does not, the fix is a fifth fact (arrival date is the likeliest), not a longer form.
- That the Perturbation cascade reads as a single legible event rather than visual noise. Needs staggered timing and a settled end state, tested on a real screenshot at 375 before it is called done.
- That the 500 and 482 timelines diverge enough side by side to be obvious to a judge who knows nothing about Australian visas. If they do not, the two profile moment is cut from the pitch and replaced with the RHCA health module swap, which diverges more sharply.
- That current figures hold as of 2026-09-22: the subclass 500 work limit of 48 hours per fortnight, the superannuation guarantee rate, and the RHCA country list including Italy. All three must be verified against the live source during the data task, never carried forward from memory.

## Deferred, do not build in V1

**The Ledger (sprint finalist B), V2.** One dollar figure covering what you are owed and what you are at risk of: the Medicare levy exemption for people not eligible for Medicare, the tax residency box wrongly ticked on a TFN declaration, bond charged above the state cap, and DASP on departure. It is the emotional payload the simulator earns, and it is worthless without the engine underneath it, which is why the engine ships first.
