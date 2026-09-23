# rules/frontend-design.md -- RULE 0 and the design pipeline

Every visual decision in this repo goes through one pipeline of five stages. Each stage
has exactly one owner skill. Skills from different stages run in sequence, never loaded
together. This file is the routing table: when a design decision comes up, find its
stage here and use that stage's skill, nothing else.

## Why it is built this way (two failures, two fixes)

1. **Stacking made slop.** Four design skills were loaded inside 58 seconds last event
   (`frontend-design`, `design-taste-frontend`, `impeccable`, `awwwards`). Each is a
   complete opinionated system; stacked, they averaged into the default look and the page
   was rejected as "AI slop". Fix: ONE visual authority per pass.
2. **One authority alone made it dead.** The next build used `design-taste-frontend`
   alone and came out clean but inert: a heading, a paragraph, two buttons, a three-step
   list. taste is mostly a subtraction engine (about 60 checks that remove AI tells);
   passing all of them yields tidy, not alive. Nothing in it demands a concept, a signature
   moment, or motion choreography. `awwwards` supplies exactly those, but as a visual
   authority it fights taste on stack, cursor, imagery and motion. Fix: use awwwards for
   what taste lacks (concept, signature spec, craft pass, measured audit) at the stages
   where it does not pick visuals, and keep one visual authority.
3. **awwwards as a spec writer only made it tidy, not award-level.** mock_3 (2026-09) ran
   awwwards for D0 and D4 while taste built every screen. The result passed every gate
   and still read as a competent product page: small type, one moving thing, a plain
   inner page with native selects. The human rejected it. Fix: `awwwards` is now the
   default authority for anything a judge or client sees, and the **Awwwards floor**
   below is a hard gate with a pre-built kit (`design-system/motion-kit.css`), so a
   minimal brief still produces kinetic type, a scroll scene, pointer response and
   crafted states without anyone asking for them.
4. **Self-review passes what an independent reviewer fails.** The same mock_3 pass went
   through my own gate, then `visual-gate-reviewer` failed it on stacked stations,
   a headline promising four facts over three controls, a hairline crossing labels and a
   form-first inner page. Fix: the reviewer runs on every judge-facing screen, on fresh
   screenshots taken after the last fix, before the human sees it.

---

## The pipeline

| Stage | When | Owner (invoke with the Skill tool) | Writes | Must not |
|---|---|---|---|---|
| **D0 Concept + signature spec** | Ideation CONVERGE, before T1 | `awwwards`, Phase 0 and Phase 2 only (`references/02-concept.md`, `05-motion.md` Signature moment) | `docs/CONCEPT.md`: concept sentence, register, Signature moment spec | Pick fonts, palette or stack |
| **D1 Art direction** | T1 | ONE visual authority (table below; `awwwards` by default) | `design-system/README.md`: Art direction block, motion tokens, tokens; imports `design-system/motion-kit.css` | Load a second authority |
| **D2 Build** | Every UI task | The same authority, via `design-system/README.md`. Tools on demand (below) | Components that meet the Awwwards floor | Invent values not in the tokens |
| **D3 Craft + motion** | Once a screen's layout is on screen | `awwwards` Phase 4 (`references/09-transitions.md`, `10-interactions.md`), then `emil-design-eng` (mandatory), `animate` per motion decision, then `rules/craft-and-delight.md` | Motion, states, craft details, haptic map, easter egg | Change palette, type or layout |
| **D4 Audit gate** | Every judge-facing screen, not only at freeze | Visual gate + Awwwards floor (below) + measured `awwwards` `15-audit.md` checks + `01-scoring.md` self-score + `impeccable` detector + `design-taste-frontend` as a subtraction lens only + `visual-gate-reviewer` | Gate log in `design-system/README.md` | Redesign; findings go back to D2/D3 |

A second pass is allowed and encouraged: a screen that fails D4 goes back to D2 or D3
with the same authority. Rule 0 locks the direction once; it never forbids improving it.

### D1: choosing the one visual authority

| Brief | Authority |
|---|---|
| **Default: anything a judge or client sees.** Landing, marketing, pitch site, brand site, and product UI with a landing or hero in front of it | `awwwards`, all phases (0 to 6). It owns concept, type, colour, motion and craft |
| Pure dense data or admin tooling with no landing and no product-surface moment anywhere | `frontend-design` (plugin, enabled in `.claude/settings.json`) |
| The human explicitly asks for a quiet, minimal, no-motion site | `design-taste-frontend` |

One authority per project, not per screen: inner product screens inherit the landing's
tokens, header, controls and motion kit. A second authority on the inner page is how a
jury sees "a stunning hero and an inner page from a different project" (awwwards RED 8).

The pick is locked in `docs/CONCEPT.md` (Design authority field) and copied to the
`Authority:` line of `design-system/README.md`. Build sessions read it; they never re-pick.
If the human names several skills in one message, that is a request for quality, not an
instruction to load them all. Say: "Using <skill> as the design authority for this pass.
Not loading <others> in the same pass: stacked design skills average into defaults."

### What each skill is allowed to be

**Visual authority (one per project):** `awwwards` (default), `frontend-design`, or
`design-taste-frontend` in the rows above.

**Spec input (D0):** `awwwards` Phase 0 and 2, `creative-direction` (tone axes and a
rejection list, optional when the brief is thin).

**Subtraction lens (D4 only, never picks visuals):** `design-taste-frontend`'s pre-flight
check, run against the built screen to strip AI tells (eyebrow spam, centred-everything,
gradient blobs, three equal cards). Findings go back to the awwwards build.

**Tools, called by D2/D3 when the task needs them, never alongside a D1 pass:**

| Need | Skill | Note |
|---|---|---|
| Any motion decision: what animates, curve, duration | `animate` | Pass a concrete question; bare invocation only returns a ready line |
| Gesture, spring, sheet, drag | `apple-design` | Motion sections only. Ignore its system-font and translucent-material advice, the authority owns type and surfaces |
| Toasts | `ask-sonner` | |
| Judged on a phone: viewport, safe area, tap, 16px inputs | `mobile-native` | |
| Landing or pitch copy deck | `landing-page-copy` | Structure only. taste's hero limits win: no trust strip or tagline inside the hero |
| One specific UX, chart, GSAP or stack question | `ui-ux-pro-max` with `--domain` or `--stack` | Lookup only. Command below |
| Accessibility, spacing, contrast floor | `design-standards` | Checklist, sets nothing |
| Choose between 3 to 5 versions of the signature component | `prototype` | Human types `/prototype`; the model cannot invoke it |
| Pick a UI library | `pick-ui-library` | Human types `/pick-ui-library` |

**Auditors (D4, report and route findings back):** `impeccable` (`critique`, `audit`,
`polish`, `bolder`, `animate`, `typeset`, and its detector), `find-animation-opportunities`,
`improve-animations`, `review-animations` (human types `/review-animations`), `awwwards`
references 01, 14, 15.

**Never, in this repo:**
- `high-end-visual-design`, `gpt-taste`: competing authorities with random archetype rolls
  (mandatory eyebrows, everything-animates, purple glass). Not installed by the setup.
- `impeccable` new-work flows (`shape`, `init`, `craft` on a blank surface, `concept-seed`,
  its network calls): they roll their own visual world. Its `PRODUCT.md` / `DESIGN.md`
  are not written; `design-system/README.md` is the single design record.
- `ui-ux-pro-max --design-system` or `--persist`: returns stock palettes and a Google Fonts
  link, and writes into `design-system/`, colliding with the record.
- `site-teardown` output as the direction. It may feed the authority's Reference field.

### Conflicts, decided once so skills do not argue mid-build

- **Motion engine.** CSS first: `design-system/motion-kit.css` (entrances, reveals, page
  progress, hovers) and `design-system/components/scrollProgress.ts` (scroll scenes, one
  `--p` value, native scroll). `motion` (motion/react) for layout and gesture work. GSAP
  with ScrollTrigger only inside the signature component's own leaf, never mixed with
  `motion` in the same tree. Lenis only when the signature is a scrubbed camera or film
  where native scroll visibly stutters; a sticky scene does not need it.
- **Signature motion is labelled "marketing / explanatory"** in the Signature moment spec.
  That exempts it from the Emil family's 300ms UI cap and "rare moments only" gate, and
  `improve-animations` respects recorded decisions. Everyday UI motion stays under 300ms.
- **Imagery.** No Picsum, no stock on a shipped screen (awwwards wins over taste's
  fallback). Prefer the product itself rendered live as the visual. Where imagery is
  needed, write a detailed image prompt into HANDOFF.md "Infra & access blockers" for the
  human to generate; never spend paid credits on images.
- **Fonts.** The authority picks at D1. If `impeccable`'s detector flags the pair as a
  training-data default, act on it at T1; after T1 the pair is locked.
- **Custom cursor.** Banned unless the Signature moment spec needs it.
- **Eyebrows.** taste's limit: at most one per three sections.

---

## The Awwwards floor -- a hard gate, not a wish list

Every project ships all of these on its judge-facing screens, whatever the brief says.
A minimal brief ("build a site for X") gets them by default; nobody should have to ask.
The kit classes are in `design-system/motion-kit.css`; the scene driver is
`design-system/components/scrollProgress.ts`.

1. **One signature, three inputs.** The single concept mechanism responds to load (a
   choreographed entrance), to the pointer AND touch (hover or drag reads or changes
   something real, e.g. a scrubber that reads out the value under the pointer), and to
   scroll (item 3). Visible in the first 3 seconds at 1280 without clicking, whole, not
   cut by the fold. It shows the product working, never a decorative blob.
2. **Kinetic, big display type that still leaves room for the signature.** Hero headline
   set with `clamp()`, tight tracking, lines rising out of masks (`.mask-line`). Support
   copy and controls follow with `.fade-up` delays: anchor, support, detail, overlapping.
   Size it so the signature is on screen at 1280x800; a bigger headline that pushes the
   signature below the fold is a regression. Every number in the headline matches the
   screen ("four facts" means four visible controls).
3. **One scroll scene, built from the signature itself.** A tall section with a sticky
   stage (`.scene`, `.scene-stage`) where scroll drives the SAME mechanism the hero shows
   (the same diagram, the same object), not a new simplified motif. `beats()` for discrete
   stops. Native scrollbar, a visible progress signal ("Stop 2 of 5"), under 4 viewport
   heights per 3 beats. No two markers or labels closer than about 60px: merge or show
   only the active one. Reduced motion: the beats render as a static list.
4. **Craft kit on.** Page progress line on a sticky header, `.link-sweep` nav links,
   `.nudge` arrows on CTAs, `.row-rule` on any list of links, `.press` on buttons,
   `::selection` and `:focus-visible` in the accent. One `data-reveal` per section group,
   never on the legal line. Any hairline or cursor that crosses text gets a knockout.
5. **One site, not a homepage.** Shared header and footer on every route. The inner page
   leads with its output (the product result), not its form; inputs sit in a compact bar
   using the landing's controls (segmented switches, chips), same display scale, same
   entrance. Native control chrome only where the platform one is genuinely better, and
   then restyled to the chip language.
6. **Sections vary and the page ends on purpose.** At least three layout families
   (e.g. split hero, sticky scene, big-number + index, ink closing band). The last screen
   is a designed closing band with the primary CTA and a footer built at full care.
7. **It feels hand-made.** A haptic map on touch (`design-system/components/haptics.ts`),
   one easter egg that grows out of the concept, and the detail list, all per
   `rules/craft-and-delight.md`.
8. **Contained by default, full bleed on purpose.** One content container on every
   section, backgrounds bleed edge to edge, and only 1 to 3 sections (hero scene, imagery,
   marquee, closing band) run content full width. Data never stretches across the
   viewport; no page is one narrow column. Finder in `rules/craft-and-delight.md`.

Gate evidence for the floor (record in the gate log, measured, never eyeballed):
no horizontal overflow at 320, 375, 1280; the signature whole above the fold at 1280 and
started above it at 375; `prefers-reduced-motion` emulated gives zero running animations
and all scene beats visible; console clean; the scene's last beat reachable at the end of
its scroll; 375 AND 1280 captures of every route, inner pages included; 1440 and 1920
captures of the landing with the layout finder clean; the craft-and-delight log line.

The liveliness bar that preceded this (signature in 3s, hero as thesis, visual world
beyond type, choreographed entrances, varied sections) is folded into items 1, 2 and 6.

Fixing a screen that misses the floor is a D3 pass with the same authority, in this
order: `find-animation-opportunities` for the list, `awwwards` Phase 4 checklist,
`impeccable bolder` scoped to the hero, then `emil-design-eng`. Not a new authority.

---

## GSD boundary -- GSD plans and executes, the pipeline designs

GSD's own UI flow (`/gsd-ui-phase`, UI-SPEC, `gsd-ui-checker`, the 6-pillar
`gsd-ui-auditor`) makes design decisions of its own: at most 4 font sizes and 2 weights,
a fixed 4/8/16/24/32/48/64 spacing set, a 60/30/10 colour split, a shadcn preset prompt.
Those silently override the authority. So:

- `bash scripts/ensure-skills.sh` (setup and every SessionStart) pins in
  `.planning/config.json`: `workflow.ui_phase`, `ui_safety_gate`, `ui_review` = false, and
  `agent_skills.gsd-executor` includes `global:emil-design-eng`. Commit the change.
- Do not run `/gsd-ui-phase` or `/gsd-ui-review`. The visual gate below replaces them.
- A GSD executor on any UI task: read `design-system/README.md` first (binding), invoke the
  skill on its `Authority:` line, build, then run D3. If a PLAN.md states a visual value
  that contradicts `design-system/README.md`, the README wins; log it as a deviation.
- A phase whose ROADMAP entry touches a screen gets its D3 and D4 inside the phase, not
  deferred to "polish day".

---

## Handoff -- design state travels in the repo

A collaborator must be able to pick up any screen mid-pipeline with the same skills.

- Skills: the pinned copies in `design-skills/` install on every machine through
  `scripts/ensure-skills.sh` (Setup Script and SessionStart hook). `frontend-design` comes
  from `.claude/settings.json` `enabledPlugins`. Nobody installs design skills by hand.
- State: `design-system/README.md` keeps the **Pipeline state** table: each screen, the
  stage it reached, the skill that ran last, and the next stage. Update it in the same
  commit as the UI work.
- HANDOFF.md Current state carries one line: `Design: authority <x>; <screen> at D<n>; next <skill>`.
- The next session reads those two, runs `ensure-skills.sh` output check, and continues at
  the next stage with the named skill. It never restarts at D1.

---

## Rule 0 process (T1)

1. Read `docs/CONCEPT.md`: Design authority, concept sentence, Signature moment spec (D0).
   If the spec is missing, run D0 now (`awwwards` Phase 0 and 2) before anything visual.
2. State the authority in one line. Invoke it with the brief and the Signature spec as input.
3. Write the **Art direction** block into `design-system/README.md` before tokens.
4. Write motion tokens (durations, one easing family) and the other tokens.
5. Build the signature component first, alone, and screenshot it. It is the riskiest
   thing on the page. (Human may run `/prototype` for 3 variants here.)
6. Fill the Pipeline state table. Commit and push.

## Art direction block (required fields)

`design-system/README.md` opens with:

- **Authority**: the one D1 skill.
- **Concept**: the D0 sentence, "This is about X; it feels Y because Z".
- **Signature**: the one element a judge remembers after 30 demos, concrete ("the capacity
  dial that resizes the board live"), never abstract ("bold and modern").
- **Signature moment spec**: trigger, phases with timing, input, fallback, mobile version,
  reduced-motion version, what a judge sees in the first 3 seconds.
- **Reference**: one named real-world visual reference and what is taken from it.
- **Anti-reference**: the default look this must not resemble.
- **Type stance**: display face, body face, and why this pairing for this subject.
- **Colour world**: the world in one line, not a hex list. Safe blue/purple SaaS is a
  rejected default.
- **Motion stance**: engine, easing family, where motion is allowed.
- **Haptic map**: the events that buzz and which pattern (`tick`, `tap`, `success`, `warn`).
- **Easter egg**: trigger, reward, and why it fits the concept.

Every later builder reads this block and reinforces the Signature. That is what makes
separate sessions produce one site instead of five.

---

## THE VISUAL GATE -- no UI task is done without it

1. Run the app. Open the actual screen.
2. Screenshot it at **375** and **1280**.
3. Answer in writing:
   - Does this match the Art direction block, specifically the Signature?
   - Could this be any other team's project with the logo swapped?
   - Would this pass as a paying client's shipped deliverable, or does it read as an
     internal wireframe that happens to work? A plain form, a bare list, or default
     browser controls with tokens swapped in is a wireframe wearing a palette.
   - Judge-facing screens: does it meet all eight items of the Awwwards floor?
   - At 1920, is any section a centred column floating in empty background?
   - Read every visible string. Any process narration or limitation caveat (see below)?
4. Run the detector on the screen's files:
   `node ~/.claude/skills/impeccable/scripts/detect.mjs --json <files>`. Fix red findings.
5. Every judge-facing screen, not only at freeze: the Awwwards floor evidence above
   through Playwright, plus the `01-scoring.md` self-score. Below 7.0 on Design or
   Creativity: back to D3. At freeze, the full `references/15-audit.md` run.
6. Any bad answer means not done. Fix and screenshot again. Then dispatch the
   `visual-gate-reviewer` agent for an independent verdict, and log the line.

Evidence, not intent. Tokens are not evidence. The screenshot is.

Micro-interactions and motion go on the demo-path screens. Everything else stays plain.

---

## Copy on the demo is product copy, never process narration

A prototype can and should have real content: a hero, section copy, a features showcase.
What is banned is **meta-commentary about the build itself, anywhere a judge sees it**:

- Justifying a scope cut or limitation ("we didn't have time for streaks", "heuristic,
  not a hard rule")
- Defensive reassurance about the tool's own correctness ("this really works")
- Narrating the process ("built with Claude Code", "AI-generated", version labels)
- Comparative self-praise ("unlike other solutions")

That material belongs in the pitch, the README or `docs/CONCEPT.md`. Sweep every visible
string before calling a UI task done: does it describe the product, or a decision the
team made building it? Only the first kind ships on screen.

## Non-negotiables for any visual work

- Every state: default, hover, focus-visible, loading, error, empty, success.
- `prefers-reduced-motion` on every animation, with a non-animated equivalent cue.
- Real copy from the persona's world. Never lorem, never placeholder names.
- Readable on a projector: high contrast, key flows legible at 1280x720.
- The signature holds 60fps; no layout shift on load.

---

## Tool commands

```sh
# Anti-pattern detector (offline)
node ~/.claude/skills/impeccable/scripts/detect.mjs --json src/app/page.tsx

# ui-ux-pro-max lookups (never --design-system). Needs Python 3.
python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "scroll pinned timeline" --domain gsap
python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --domain ux
python ~/.claude/skills/ui-ux-pro-max/scripts/search.py "app router" --stack nextjs
```

On Windows where `python` is the Store stub, use a real interpreter path.

## Installing and updating the skills

`bash scripts/ensure-skills.sh` installs every skill in `design-skills/` that this machine
lacks. It runs from the Setup Script and the SessionStart hook, so nobody does it by hand.
To update a pinned skill: install the new version on the lead's machine, copy its folder
over `design-skills/<name>/` (drop `docs/`, `test/`, `node_modules/`), commit, and tell
collaborators to run `bash scripts/ensure-skills.sh --force`.

Sources: `awwwards` SandroHub013/awwwards-skill; `design-taste-frontend`
Leonxlnx/taste-skill; Emil family (`emil-design-eng`, `animate`, `apple-design`,
`ask-sonner`, `mobile-native`, `review-animations`, `improve-animations`,
`find-animation-opportunities`, `animation-vocabulary`, `pick-ui-library`, `prototype`)
emilkowalski/skills; `impeccable` pbakaus/impeccable; `ui-ux-pro-max`
nextlevelbuilder/ui-ux-pro-max-skill; `creative-direction`, `landing-page-copy`,
`design-standards` rampstackco/claude-skills. Native mobile only, install on demand:
`npx skills add emilkowalski/skills --skill animate-expo` / `write-swift`.

## Skill discovery
Before improvising a missing capability: invoke `find-skills` or run `npx skills find "<task>"`.
