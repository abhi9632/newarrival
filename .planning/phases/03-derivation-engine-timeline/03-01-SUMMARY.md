# 03-01 Summary

Both tasks complete, nothing cut.

## Task 1: engine and tracer

- `src/lib/profile.ts`: `Profile`, `Subclass`, `Citizenship`, `StateCode` derived from `src/lib/rules.ts` consts; option lists; `EXAMPLE_PROFILES` (student-500-india, skilled-482-italy).
- `src/lib/derive.ts`: pure engine, two `import type` lines only, zero runtime imports. `applies`, `dueDateFor`, `statusFor`, `derive` as specified.
- `src/app/timeline/page.tsx`: client component tracer, one clock read via `en-CA` locale formatting, renders derived obligations with `data-obligation-id`.
- `src/app/page.tsx`: added a `/timeline` anchor beside the existing `#how` anchor.
- All acceptance greps pass: no facet literals or persona names in `derive.ts`, no clock read, no storage/fetch/dangerouslySetInnerHTML, no dash, no advice framing. `npm run build` embeds `data-obligation-id="visa-500-8533-address"` in `.next/server`.

## Task 2: falsifiability check

- `scripts/check-engine.ts`: nine named gates (`engine-01-source`, `engine-01-clock`, `engine-01-derive`, `engine-02-dates`, `engine-03-citizenship`, `engine-04-state`, `time-03-status`, `engine-05-deterministic`, `time-01-order`). Reads the corpus via `readFileSync`/`JSON.parse`, loads the target engine module via dynamic `import()` of a file URL. The two example profiles are hardcoded literals in the script rather than imported from `profile.ts`, because `profile.ts` pulls in `rules.ts`'s JSON import with no import attribute, which Node's native loader rejects outside the Next.js bundler.
- `scripts/fixtures/hardcoded-derive.ts`: re-exports the real helpers, overrides `derive` to branch on subclass `"500"` and ignore citizenship. Correctly rejected.
- `engine-04-state` ran (not skipped): the corpus has 4 tenancy records (RULE-06 not cut), swapping state changes exactly the tenancy module records.
- `DIVERGENCE 14 of 18` between the two example profiles at reference date 2026-09-22: student and skilled sets differ by 14 ids out of a union of 18. Well above the 6-id / half-union thresholds plan 03-03's assumption test reads.
- `tsconfig.json`: added `"scripts"` to `exclude`. `package.json`: added `check:engine` script.

## Commands run

- `node scripts/check-engine.ts` → exits 0, prints `DIVERGENCE 14 of 18` then `OK engine`.
- `node scripts/check-engine.ts scripts/fixtures/hardcoded-derive.ts` → exits 1, `engine-01-source` and `engine-03-citizenship` each fire exactly once (plus `engine-01-derive`, `engine-04-state`, `engine-05-deterministic`, all expected since the fixture ignores citizenship/state/skilled profiles entirely).
- `node scripts/check-rules.mjs` → still `OK 18 records`.
- `npx tsc --noEmit` and `npm run build` → both exit 0.

Nothing from the binding cut order applied; all four cut-order items belong to 03-03.
