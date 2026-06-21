# rules/verification-before-completion.md

**Core principle: evidence before claims, always.**

## The gate (run before EVERY completion claim)

1. What command proves this is done?
2. Run it. Fresh. In full.
3. Read the complete output and exit code.
4. Does the output confirm the claim?
   - Yes: make the claim WITH the evidence.
   - No: state the actual status WITH the evidence.

## Common claim requirements

| Claim | Requires |
|---|---|
| Feature works | Demo it in the running app |
| Bug fixed | Reproduce original symptom: now passes |
| Build passes | Build command: exit 0 |
| Component renders | Visual check at 375px + 1280px |
| Session complete | HANDOFF.md updated + HANDOFF_SYNCED_COMMIT set |

## Red flags (stop immediately)
- Using "should", "probably", "seems to"
- About to commit without verifying
- Moving to the next feature before confirming the current one works end-to-end
- Trusting a subagent's "success" report without checking

## Hackathon note
Judges will click every button. "Should work" is not a demo. Run it, see it, THEN say it is done.
