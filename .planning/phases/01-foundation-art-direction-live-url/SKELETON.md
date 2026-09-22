# Walking Skeleton, NewArrival

**Phase:** 1
**Generated:** 2026-09-22

## Capability Proven End-to-End

A visitor opening the public Vercel production URL on a phone, with no local setup, sees a
designed intro moment that states the derivation problem and carries the legal disclaimer.

That is the whole stack for this project. There is no deeper layer to reach.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js App Router, TypeScript, Tailwind | Locked in `DAY1.md` EVENT CONFIG. Fastest path to a live URL on the chosen host, no new framework to learn against a 19:30 freeze. |
| Data layer | Static JSON in the repo, read at build time or imported directly by client components | Scope mode is `prototype`. The concept's hard constraint forbids any external API call at demo time, so a network dependency the demo cannot survive is not worth any feature. |
| Database | **None. Deliberate, not deferred.** | The product collects four dropdown values held in client state and no personal identifier. There is nothing to persist, nothing to protect and nothing to restore, which is also why there is no auth. A database would add a failure mode on stage and buy nothing. |
| Backend / API routes | **None.** All derivation is pure client-side functions over the static corpus. | Same reason. It also makes the "this is auditable" pitch literal: the rules are a file in the repo a judge could open. |
| Auth | **None.** | No account, no personal identifier, nothing to gate. |
| Deployment target | Vercel, git-connected to `abhi9632/newarrival`, production on `main` | Locked in EVENT CONFIG. Connected in Phase 1 rather than Phase 5 because a past event deployed in the final five minutes under time pressure. Every push from Phase 2 onward produces a reviewable live URL. |
| Directory layout | `src/app/` for routes, `src/app/globals.css` as the single token file, static rules JSON under `src/data/` from Phase 2, pure derivation functions under `src/lib/` from Phase 3 | One screen exists in Phase 1. Feature folders would be structure for a codebase that does not exist yet. |
| Design system | `design-system/README.md` is the single authority record: Art direction block first, tokens after. No component library. | Rule 0 in `CLAUDE.md`. Tokens live in `src/app/globals.css`; the README is the human-readable contract every later phase reinforces. |
| Testing | No test framework in Phase 1. Verification is `npm run build` plus greps over the build output and the live URL. | A 50 minute phase budget. Phase 3 adds one runnable check that two profiles produce different derived obligation sets, which is the assertion that actually protects the pitch. |
| Linting | No eslint or prettier config. | Not in scope for this phase and it burns budget. |

## Stack Touched in Phase 1

- [x] Project scaffold (Next.js App Router, TypeScript, Tailwind, build pipeline)
- [x] Routing, one real route at `/`
- [ ] Database, **not applicable**. This project has no database by design, so there is no read
      or write to prove. Recording an invented database step here to satisfy a template would
      make the skeleton lie about the architecture. See the Data layer and Database rows above.
- [x] UI, the intro moment rendered from locked design tokens with one interactive affordance
- [x] Deployment, live on the Vercel production URL, redeploying on every push to `main`

## Out of Scope (Deferred to Later Slices)

Explicit, so no later phase re-litigates Phase 1's minimalism:

- Any form, input, select or intake control. Phase 3, requirement INTAKE-02.
- The rules corpus and its validation script. Phase 2.
- The derivation engine and the obligation timeline. Phase 3.
- The perturbation cascade and its motion pass. Phase 4.
- A component library, a shared layout abstraction, a design-system component tree. There is one
  screen; the second arrives in Phase 3 and abstraction can wait for it.
- A test framework, CI, linting config, Storybook.
- Accounts, auth, persistence, analytics, any server route, any live external API call.
- The Ledger, the dollar quantification. Deliberately v2.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering the
architectural decisions above.

- Phase 2: the verified rules corpus lands as static JSON under `src/data/`, every record
  carrying its instrument, source URL and check date, with a validation script that fails on a
  record missing any of the three.
- Phase 3: four facts in, a dated and sourced obligation timeline out, derived by pure functions
  under `src/lib/` over that corpus. The intro moment's `#how` anchor becomes the route into the
  intake.
- Phase 4: the perturbation cascade. Changing the course end date recomputes the timeline in one
  legible animated pass, diffed against the previous derived state, resettable.
- Phase 5: visual gate at 375 and 1280 across every screen, the em dash sweep, and the final
  deploy carrying the finished build.
