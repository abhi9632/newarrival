# rules/systematic-debugging.md

**Core principle: find root cause BEFORE attempting any fix.**

## 4 phases

### 1. Root cause (before ANY fix)
- Read the full error + stack trace. Note file, line, code.
- Reproduce it reliably. Exact steps.
- Check what changed: git diff, recent commits, new deps.

### 2. Pattern analysis
- Find working code that is similar to what is broken.
- Read the reference completely. Do not skim.
- List every difference between working and broken.

### 3. Hypothesis + test
- State: "I think X is the root cause because Y."
- Make the SMALLEST possible change. One variable at a time.
- Did it work? Yes: go to phase 4. No: form a new hypothesis.

### 4. Fix
- Address the root cause only.
- Verify: does the symptom resolve? Does anything else break?
- If 3+ distinct fixes have failed: stop, question the architecture, log in HANDOFF.md Code failures.

## Red flags (return to phase 1 immediately)
- "Quick fix for now"
- "Just try X and see"
- "It's probably X" without evidence
- Each fix reveals a new problem in a different place

## Hackathon note
Time pressure makes guess-and-check feel faster. It is not. Systematic debugging resolves bugs in fewer minutes than the alternative.
