# docs/demo-prep.md -- Day 2 demo preparation

## Feature freeze schedule
| Time | Action |
|---|---|
| T-3h | Run through full demo flow. Note every broken interaction. |
| T-2h | Fix critical bugs only. Nothing new. |
| T-1h | FREEZE features. Deploy final build. Confirm public URL works. |
| T-30m | Rehearse pitch (3 min max). Assign speaking parts. |
| T-10m | Open the app on a real device. Confirm it loads. |

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

## Pitch structure (3 minutes)
1. **Problem** (30s): one specific IAG customer pain point, told as a human story
2. **Solution** (30s): what we built and how it solves it
3. **Demo** (90s): click through the primary flow live -- no slides, just the product
4. **Feasibility** (30s): how this could work in production at IAG scale

## Judge scoring areas (anticipated)
- Problem clarity and relevance to IAG
- UX polish and flow quality
- Technical execution quality
- Business viability and scalability
- Team communication and presentation

## What judges will click
Assume judges will: click every button, try to break a form, resize the window, use it on their phone. Every visible state must be intentional.
