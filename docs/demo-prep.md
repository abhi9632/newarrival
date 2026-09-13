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
2. **Live demo** (90s): click through the primary flow live -- no slides, just the product
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
