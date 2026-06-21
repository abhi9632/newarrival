# /start — Begin a coding session

Load project context and orient for development work.

## Steps

1. Read `HANDOFF.md` in full — understand current state, last completed work, next task, blockers, and any known failures.
2. Read `CLAUDE.md` — confirm non-negotiables, git workflow, and rules index.
3. Confirm orientation in one short paragraph:
   - Active branch
   - Last completed task
   - What you are about to work on next
   - Any active blockers
4. State which rules files apply to the upcoming task based on the RULES INDEX in CLAUDE.md:
   - UI work? Confirm Rule 0: `frontend-design` + `design-taste-frontend` MUST run before any markup or styles.
   - Security-relevant work? Confirm `rules/security.md` will be read before proceeding.
   - Form or data work? Confirm `rules/data-and-forms.md` applies.
   - Component work? Confirm `rules/quality.md` applies.
5. Wait for [CLIENT]'s instruction before writing any code.

> Do NOT pre-load any rules files at this stage — they load on demand mid-task once the task type is confirmed.
> Rule acknowledgement in step 4 is mandatory — never skip it.
> Do NOT summarise the entire project history — one short orientation paragraph only.
