# docs/demo-prep.md -- demo preparation

Freeze time and demo time are set in DAY1.md EVENT CONFIG. Times below are relative to
that freeze time (T). Pitch tasks (P1-P3) are specified in `docs/pitch-playbook.md` and
become claimable only after freeze.

## Feature freeze schedule
| Time | Action |
|---|---|
| T-3h | Run through full demo flow. Note every broken interaction. |
| T-2h | Fix critical bugs only. Nothing new. |
| T-1h | FREEZE features. Deploy final build. Confirm public URL works. Then run `bash scripts/check-freeze.sh` -- do not treat freeze as real until it exits 0. |
| T-30m | Rehearse pitch (3 min max, see `docs/pitch-playbook.md` P3). Assign speaking parts. Log each run in the P3 rehearsal table. |
| T-10m | Open the app on a real device. Confirm it loads. |
| after demo | `docs/submission-checklist.md` -- the demo working is not the same as being submitted. |

This schedule used to be prose nobody was forced to run. Two past projects both had the
T-1h deploy step and the T-30m rehearsal step slip past the real deadline with nothing
noticing: one shipped no live URL during judging at all, the other did its pitch-video
work in a session that never touched git. `check-freeze.sh` is the difference between
this table being a plan and being checked.

**Post-freeze work still gets committed.** Pitch script, deck, rehearsal notes, deploy
config -- if it isn't in the repo with a HANDOFF.md session-log line, it didn't happen
for the next session, and it didn't happen for you reviewing from your phone.

## Demo checklist (complete before T-1h)
- [ ] Every primary user flow works end-to-end
- [ ] Loading states visible (simulate slow network: Chrome DevTools throttle)
- [ ] Error states visible (disconnect mock, trigger error path)
- [ ] Empty states visible (clear mock data, show empty screen)
- [ ] Mobile layout (375px): no overflow, all buttons tappable
- [ ] Desktop (1280px): no broken layout
- [ ] No console errors (open DevTools during run-through)
- [ ] All text is sentence case -- no ALL CAPS headings
- [ ] No placeholder text or [TODO] visible
- [ ] Public URL deployed and loads from a phone on 4G (not just localhost)

## Pitch structure

Length comes from DAY1.md EVENT CONFIG. The breakdown below is the 3-minute shape;
for a 2-minute slot use the cut-down table in `docs/pitch-playbook.md`.

### 3-minute shape
Full script structure, click-path template, and deck spec: `docs/pitch-playbook.md` (P1, P2).
1. **Hook + problem** (40s): one specific persona pain point, told as a human story
2. **Live demo** (90s): click through the primary flow live -- no slides, just the product.
   Last click before moving on: drag Priya's course end date on `/timeline` to the far
   right, letting her line reach the graduation reveal (`design-system/README.md`
   Easter egg). Land it, do not explain it.
3. **How it works + feasibility** (40s): architecture in plain language, path to production
4. **Close** (10s): memorable line, what you want from judges

## Judge scoring areas
See DAY1.md EVENT CONFIG for the event's actual rubric and weights. This checklist assumes
scoring generally rewards:
- Problem clarity and relevance to the persona
- UX polish and flow quality
- Technical execution quality
- Feasibility and scalability
- Team communication and presentation

## What judges will click
Assume judges will: click every button, try to break a form, resize the window, use it on their phone. Every visible state must be intentional.

## Cold start walk, 375 and 1280

Run 2026-09-23, against a local production build (`next build && next start -p 3100`).
**Not the public Vercel URL.** That deploy is still blocked on GitHub App authorisation
(see `HANDOFF.md` standing blockers and `docs/manual-actions.md`), so `scripts/check-demo.sh`
Section 1 cannot pass until a human completes that click path. Everything below verifies
the build itself is demo ready; it does not stand in for the live URL check.

Resolved route: `/timeline` (the intake and timeline live together there, per plan 03-02;
`/` is the intro moment). Resolved preset ids: `data-profile-preset="student-500-india"` and
`"skilled-482-italy"`, matching plan 03-02. Perturbation control resolved: `input[type="range"]`
inside the What if rail, present and working. Reset control resolved: the button beside it,
`disabled` when the offset is zero.

**Intro, 375.** Cold load of `/`. No leftover state, nothing to reset. Disclaimer renders at
vertical offset 1225px, bounding box `left:0 right:360` inside the 360px document width, no
horizontal scroll. Every control reachable. No console error. PASS.

**Intro, 1280.** Same page, wide viewport. No horizontal scroll, all three explainer columns
visible without scrolling. No console error. PASS.

**Intake, 375 and 1280.** `/timeline` loads with the student preset pre-selected (the page's
initial state), all four controls visible and reachable, no horizontal scroll at either width.
No console error. PASS.

**Both presets, one click each.** Clicked Marco's preset: `aria-pressed` flips to `true`, the
card count changed from 12 to 10 with no page navigation (`location.pathname` stayed
`/timeline`). Clicked Priya's preset to return: loaded correctly. Both single click loads.
PASS.

**Timeline, 375 and 1280.** Student preset, scrolled to the dated heading. Rail visible above
it. No horizontal scroll, no console error. PASS.

**Cascade, mid pass.** Dragged the course end date three months earlier and released, captured
immediately with no settle wait. At 1280 the mid capture is byte distinct from the settled
capture, evidence the pass itself was caught. At 375 the two captures came back byte
identical: the round trip latency of the browser automation tool exceeds the 720ms settle
budget, so by the time the screenshot command reached the page the pass had already finished.
This is a tooling limit of this capture session, not a defect in the cascade; the motion
itself was already verified directly against the DOM (see `design-system/README.md`,
`### Perturbation cascade`) and separately against `prefers-reduced-motion`. Recorded honestly
rather than re-shot to force a difference.

**Cascade, settled.** Both widths: 3 obligations moved, across 4 agencies, summary line
correct, every changed card marked, every held card marked "Held, this date does not move".
Held cards remain fully legible at 375, not dimmed to the point of disappearing. PASS.

**Reset, and the second run.** Pressed reset once. Asserted three results directly against the
DOM rather than by eye: the range control's value returned to `0`, the reset button carries
`disabled` again, and the readout returned to `2027-11-26` (the original course end date).
Then ran the same drag a second time with no page reload: it reproduced the identical 3 moved,
4 agencies result. PASS, and the repeatability requirement is met.

**Console errors across the whole walk:** none. Zero warnings, zero errors, checked with
`browser_console_messages` after the full sequence.

**Horizontal scroll across the whole walk:** none at either width, on any screen.

**Reachability across the whole walk:** every control (both presets, all five intake fields,
the range slider, the reset button, every source link, every details disclosure) was reachable
and interactive at both widths.

