# State: NewArrival

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-09-22)

**Core value:** The derivation must be real and visibly real: changing one input fact must visibly change the correct set of downstream obligations, with each one citing the instrument it came from.
**Current focus:** Phase 1, Foundation, art direction and live URL

## Current Position

| Field | Value |
|---|---|
| Milestone | v1, hackathon demo |
| Phase | 1 of 5, not started |
| Plans complete | 0 of 10 |
| Requirements complete | 0 of 31 |
| Build time remaining | about 5h45m to feature freeze at 19:30 on 2026-09-22 |

## Phase Status

| Phase | Name | Estimate | Status |
|---|---|---|---|
| 1 | Foundation, art direction and live URL | 0.8h | Not started |
| 2 | Verified rules corpus | 1.0h | Not started |
| 3 | Derivation engine and obligation timeline | 1.5h | Not started |
| 4 | The perturbation cascade | 0.8h | Not started |
| 5 | Visual gate and demo readiness | 0.5h | Not started |

## Decisions Carried Into Execution

- Design authority is locked: `design-taste-frontend`, single authority, every screen, then `emil-design-eng` sequentially as a polish pass. Build sessions do not re-derive this.
- Content matrix is locked at 2 subclasses x 2 citizenships x 2 states. A third value of anything is v2 and is refused during v1.
- Deploy happens in Phase 1, not Phase 5.
- Execution is sequential, not parallel waves, because CLAUDE.md caps concurrent subagents at 2.
- GSD generic project research was deliberately skipped. The rules corpus phase carries the real research burden instead, with live source verification.

## Known Risks

1. Phase 2 overruns because verifying live legal figures is slower than writing JSON. Mitigation: the cut order at the bottom of ROADMAP.md, applied from the top.
2. Phase 4, the signature moment, gets compressed if earlier phases slip. Mitigation: cut nice-to-have requirements retroactively from Phases 2 and 3 rather than compressing Phase 4.
3. GSD subagents (`gsd-roadmapper` and friends) are installed on disk but were not registered in the session that planned this, so the roadmap was written inline via the documented fallback. A later session that restarts will have them available.

## Open Questions

None blocking. The three assumptions to test during build are listed in `docs/CONCEPT.md` and are scheduled inside Phases 3 and 4.

---
*Last updated: 2026-09-22 after roadmap creation*
