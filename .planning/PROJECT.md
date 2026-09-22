# NewArrival

## What This Is

NewArrival is a live client side model of a person's legal status in Australia. A new arrival gives it four facts (visa subclass, citizenship, arrival date, state) and it derives a dated, sourced timeline of every obligation and entitlement those facts produce, across Home Affairs, the ATO, Services Australia and state tenancy authorities. Because it is a model and not a checklist, any input fact can be perturbed and every downstream obligation recomputes in front of the user.

## Core Value

The derivation must be real and visibly real: changing one input fact must visibly change the correct set of downstream obligations, with each one citing the instrument it came from. If that works, nothing else matters. If it does not, the product is a styled to-do list.

## Requirements

### Validated

(None yet, ship to validate)

### Active

- [ ] A four field profile intake derives a full obligation timeline with no page reload
- [ ] Every obligation card cites its instrument and source URL, with the date checked
- [ ] Changing the course end date cascades correct changes across at least three agencies
- [ ] Two different profiles (500/India/VIC and 482/Italy/NSW) produce visibly different timelines
- [ ] An intro moment frames the derivation problem before any mechanism appears
- [ ] The whole happy path is walkable in under three minutes on a live Vercel URL

### Out of Scope

- The Ledger, dollar quantification of what you are owed or at risk of, deferred to V2 because it is worthless without the derivation engine underneath it and would consume V1 build time
- Any third visa subclass, citizenship or state beyond the locked 2x2x2 matrix, because the matrix is already the smallest set that proves derivation and a third value adds content cost with no new proof
- Accounts, auth, persistence, because no personal identifier is collected, so there is nothing to protect or restore
- Any backend, database or server route, because scope mode is `prototype` and every data path is static JSON
- Any live external API call, because a network dependency the demo cannot survive is not worth any feature
- Advice framing ("you should", "you qualify", "we recommend"), because unregistered paid immigration assistance is an offence in Australia

## Context

- Source of truth for the concept is `docs/CONCEPT.md`, locked 2026-09-22 after a 90 minute ideation sprint. Planning does not re-ideate; it reads the concept as given.
- Event facts (rubric, scope mode, stack, freeze and demo times) live in `DAY1.md` EVENT CONFIG and nowhere else.
- This is a self-run practice hackathon. No organiser, no published rubric, so the `SKILL.md` fallback rubric was adopted: Problem clarity, Solution quality, UX polish, Feasibility, Presentation, equal weight.
- The domain is Australian migration, tax, health and tenancy administration. The engineering is easy; the content correctness is the hard part and the entire credibility of the pitch rests on it.
- Design authority is already locked at concept time: `design-taste-frontend`, single authority, every screen, followed by `emil-design-eng` as a sequential polish pass. Build sessions use that pick, they do not re-derive it.
- Solo team: Abhi as lead and QA, Claude as sole developer. No task queue, per the CLAUDE.md rule that the queue is for three or more parallel sessions.

## Constraints

- **Timeline**: about 5 hours 45 minutes of build time, planning done 13:45 to feature freeze 19:30 on 2026-09-22. Demo 23:30. Anything not demoable by freeze does not exist.
- **Tech stack**: Next.js App Router, TypeScript, Tailwind, deployed to Vercel. Chosen because it is the fastest path to a live URL and needs no new framework.
- **Scope**: `prototype`. No backend, no database, no auth, all data static JSON. This scopes the backend only, never the visual bar.
- **Correctness**: no figure appears in the UI without its named instrument or agency page and the date it was checked. A wrong legal number is worse than a missing feature because the pitch is "this is auditable".
- **Legal**: no advice framing, and a plain language disclaimer ships in V1, not V3. Unregistered paid immigration assistance is an offence in Australia.
- **Privacy**: no personal identifiers collected or persisted, so no auth and no storage.
- **Writing**: no em dashes in any visitor-facing copy, label or on-screen text.
- **Agents**: maximum 2 concurrent subagents, per CLAUDE.md. A past event lost six agents' work to one rate limit.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build the Simulator (perturbation model), defer the Ledger (dollar counter) | Both scored top 2 in the sprint and share one engine. The model is the defensible idea; the money is the payload it earns. Engine first. | Pending |
| Lock the content matrix at 2 subclasses x 2 citizenships x 2 states | Smallest set that proves derivation on stage. Bounds the unbounded part of the problem, which is the top build risk. | Pending |
| `design-taste-frontend` as sole design authority, `emil-design-eng` as a sequential polish pass | Stacking design skills averages strong opinions into the default look; that produced a rejected page at a past event. One authority per pass. | Pending |
| Skip GSD generic project research (stack, features, architecture, pitfalls) | The stack is already locked in EVENT CONFIG and the only real unknown is Australian legal content, which generic project research does not cover. That content becomes its own roadmap phase with live source verification instead. | Pending |
| Sequential plan execution rather than parallel waves | CLAUDE.md caps concurrent agents at 2 and GSD wave parallelization can exceed that. Sequential is the safe read of the cap for a solo session. | Pending |
| Deploy to Vercel during the first phase, not the last | A past event deployed in the final five minutes under time pressure. Deploying first makes every push produce a reviewable live URL. | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. "What This Is" still accurate? Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check, still the right priority?
3. Audit Out of Scope, reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-22 after initialization*
