# Requirements: NewArrival

**Defined:** 2026-09-22
**Core Value:** The derivation must be real and visibly real: changing one input fact must visibly change the correct set of downstream obligations, with each one citing the instrument it came from.

Every requirement below is tagged with the rubric criterion it serves (from `DAY1.md` EVENT
CONFIG) and with **demo-critical** or **nice-to-have**. Anything that serves no criterion
would be cut; nothing here is in that state.

## v1 Requirements

### Rules corpus (RULE)

The content layer. Highest risk in the project, so it is scoped first and separately.

- [ ] **RULE-01**: Every rule record carries its named legal instrument or agency page, its source URL, and the date it was verified against the live source. *(Feasibility, Solution quality. Demo-critical.)*
- [ ] **RULE-02**: The corpus covers subclass 500 visa conditions (8105 work limit, 8202 enrolment and progress, 8501 health cover, 8533 address notification) and the 485 graduate visa window. *(Solution quality. Demo-critical.)*
- [ ] **RULE-03**: The corpus covers subclass 482 conditions (sponsorship obligations, consequences of ceasing employment, permanent residence pathway). *(Solution quality. Demo-critical.)*
- [ ] **RULE-04**: The corpus covers health cover rules for both citizenships, including the Reciprocal Health Care Agreement branch that applies to Italy and not to India. *(Solution quality. Demo-critical.)*
- [ ] **RULE-05**: The corpus covers tax obligations shared across profiles: TFN, the residency question on the TFN declaration, and the return deadline. *(Solution quality. Nice-to-have.)*
- [ ] **RULE-06**: The corpus covers per-state tenancy rules for VIC and NSW: bond authority, bond cap, and rent in advance cap. *(Solution quality. Nice-to-have.)*

### Profile intake and framing (INTAKE)

- [ ] **INTAKE-01**: User sees an intro moment that states the derivation problem in one line before any form or mechanism appears. *(Problem clarity, Presentation. Demo-critical.)*
- [ ] **INTAKE-02**: User can set visa subclass, citizenship, arrival date and state from four controls on a single screen. *(Problem clarity. Demo-critical.)*
- [ ] **INTAKE-03**: User can load a prefilled example profile in one click without typing anything. *(Presentation. Demo-critical.)*

### Derivation engine (ENGINE)

- [ ] **ENGINE-01**: System derives the applicable obligation set from the four profile facts alone, with no per-profile hardcoded output anywhere in the codebase. *(Solution quality, Feasibility. Demo-critical.)*
- [ ] **ENGINE-02**: System computes an absolute due date for every dated obligation from the arrival date or the course end date. *(Solution quality. Demo-critical.)*
- [ ] **ENGINE-03**: System applies citizenship-conditional rules independently of visa-conditional rules, so changing citizenship alone changes only the health module. *(Solution quality. Demo-critical.)*
- [ ] **ENGINE-04**: System applies state-conditional rules independently of visa-conditional rules, so changing state alone changes only the tenancy module. *(Solution quality. Nice-to-have.)*
- [ ] **ENGINE-05**: Changing any single profile fact recomputes the full obligation set deterministically, with no page reload. *(Solution quality, Feasibility. Demo-critical.)*

### Obligation timeline (TIME)

- [ ] **TIME-01**: User sees derived obligations on a dated timeline ordered by due date. *(Solution quality, UX polish. Demo-critical.)*
- [ ] **TIME-02**: User sees which agency owns each obligation. *(Problem clarity. Demo-critical.)*
- [ ] **TIME-03**: User sees each obligation marked overdue, due soon, or upcoming, computed against the arrival date rather than hardcoded. *(Solution quality, UX polish. Demo-critical.)*
- [ ] **TIME-04**: User can open an obligation to read in plain language what it requires and what happens if it is missed. *(Problem clarity. Demo-critical.)*
- [ ] **TIME-05**: User sees a count of obligations that are overdue or due within seven days. *(Problem clarity, Presentation. Nice-to-have.)*

### Perturbation, the signature moment (WHATIF)

- [ ] **WHATIF-01**: User can change the course end date from a control attached to the timeline. *(Solution quality, Presentation. Demo-critical.)*
- [ ] **WHATIF-02**: User sees the timeline recompute and animate to its new state in a single legible pass rather than a jump cut. *(UX polish, Presentation. Demo-critical.)*
- [ ] **WHATIF-03**: User sees which specific obligations changed, marked against their previous state. *(Solution quality, Presentation. Demo-critical.)*
- [ ] **WHATIF-04**: User can reset the perturbation back to the original profile in one action, so the demo can be re-run. *(Presentation. Demo-critical.)*

### Sourcing and trust (SRC)

- [ ] **SRC-01**: User sees the named legal instrument or agency page for every obligation on screen, not hidden behind a click. *(Feasibility, Solution quality. Demo-critical.)*
- [ ] **SRC-02**: User can open the source URL for any obligation in a new tab. *(Feasibility. Demo-critical.)*
- [ ] **SRC-03**: User sees the date each rule was last checked against its source. *(Feasibility. Nice-to-have.)*
- [ ] **SRC-04**: User sees a plain language disclaimer stating this is not migration or legal advice. *(Feasibility. Demo-critical, and a hard legal constraint.)*

### Visual system and delivery (SHIP)

- [ ] **SHIP-01**: The app carries a distinctive art direction recorded in `design-system/README.md`, not a default component library look. *(UX polish. Demo-critical.)*
- [ ] **SHIP-02**: User can walk the full happy path on a 375px viewport. *(UX polish. Demo-critical.)*
- [ ] **SHIP-03**: User reaches the app at a public Vercel URL. *(Feasibility. Demo-critical.)*
- [ ] **SHIP-04**: User can switch between the two example profiles and see visibly different timelines side by side or in sequence. *(Solution quality, Presentation. Demo-critical.)*

## v2 Requirements

Deferred. Tracked but not in the current roadmap.

### The Ledger (LEDG)

- **LEDG-01**: User sees a single dollar figure covering what they are owed and what they are at risk of
- **LEDG-02**: User can open the figure to see each component with its source
- **LEDG-03**: Components include Medicare levy exemption, the TFN declaration residency question, bond charged above the state cap, and DASP on departure

### Coverage (COVER)

- **COVER-01**: Corpus extends beyond the 2x2x2 matrix to further subclasses, citizenships and states
- **COVER-02**: User can export the timeline as calendar events
- **COVER-03**: User can compare two profiles side by side in a single view

## Out of Scope

| Feature | Reason |
|---------|--------|
| Accounts, auth, persistence | No personal identifier is collected, so there is nothing to protect or restore |
| Any backend, database or server route | Scope mode is `prototype`; every data path is static JSON |
| Any live external API call at demo time | A network dependency the demo cannot survive is not worth any feature |
| LLM or chat interface over the rules | Same reason, plus it scored lowest of 14 sprint candidates on distinctiveness |
| Advice framing ("you should", "you qualify", "we recommend") | Unregistered paid immigration assistance is an offence in Australia |
| A third visa subclass, citizenship or state in v1 | The 2x2x2 matrix already proves derivation; a third value adds content cost with no new proof |
| The Ledger in v1 | Worthless without the derivation engine underneath it, and it would consume v1 build time |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (pending roadmap) | | |

**Coverage:**
- v1 requirements: 29 total
- Mapped to phases: 0
- Unmapped: 29

---
*Requirements defined: 2026-09-22*
*Last updated: 2026-09-22 after initial definition*
