#!/usr/bin/env bash
# Gate for claiming feature freeze is real, not just declared.
#
# Two past projects had "deploy" and "rehearse" slip silently past the actual
# deadline: one shipped no live URL during judging at all (deploy config landed
# three months later), the other did its pitch-video work in a separate session
# that never touched git. Both were on the demo-prep.md schedule as prose that
# nothing forced anyone to run. This script is that force.
#
# Usage: bash scripts/check-freeze.sh
# Exit 0: freeze conditions met, claim P1-P3 pitch tasks and submission-checklist.md.
# Exit 1: prints exactly what is missing.
set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

FAIL=0

echo "== Live URL =="
URL=$(grep -m1 '| Live URL |' AGENTS.md 2>/dev/null | sed -E 's/^\| Live URL \| *//; s/ *\|$//')
if [ -z "$URL" ] || [[ "$URL" == \[fill* ]]; then
  echo "  MISSING: AGENTS.md 'Live URL' field is still [fill] or empty." >&2
  echo "  Deploy first, then paste the real URL into AGENTS.md IDENTITY table." >&2
  FAIL=1
elif command -v curl >/dev/null 2>&1; then
  CODE=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$URL" || echo "000")
  if [ "$CODE" = "200" ] || [ "$CODE" = "304" ]; then
    echo "  OK: $URL responded $CODE"
  else
    echo "  MISSING: $URL responded $CODE (expected 200)." >&2
    echo "  A URL that doesn't load is the same as no deploy on demo day." >&2
    FAIL=1
  fi
else
  echo "  SKIPPED: no curl on this machine, could not verify $URL responds. Check by hand." >&2
fi

echo ""
echo "== Rehearsal log =="
PITCH="docs/pitch-playbook.md"
if [ -f "$PITCH" ]; then
  RUNS=$(awk '
    /^\| # \| Time \| Result/ { intable = 1; next }
    intable && /^\|---/ { next }
    intable && /^\|/ {
      line = $0
      gsub(/^\| */, "", line)
      split(line, cols, "|")
      gsub(/[ \t]/, "", cols[1])
      if (cols[1] != "" && cols[1] != "#") count++
    }
    intable && !/^\|/ { intable = 0 }
    END { print count+0 }
  ' "$PITCH")
  if [ "${RUNS:-0}" -ge 3 ]; then
    echo "  OK: $RUNS rehearsal runs logged in $PITCH"
  else
    echo "  MISSING: only ${RUNS:-0} rehearsal run(s) logged in $PITCH (need 3+)." >&2
    echo "  Log each timed run in the P3 rehearsal table as you do it." >&2
    FAIL=1
  fi
else
  echo "  MISSING: $PITCH does not exist." >&2
  FAIL=1
fi

echo ""
echo "== HANDOFF.md reflects freeze =="
if grep -qi 'feature.freeze\|feature.complete' HANDOFF.md 2>/dev/null; then
  echo "  OK: HANDOFF.md mentions feature freeze/complete."
else
  echo "  MISSING: HANDOFF.md 'Current state' does not say feature freeze or feature complete." >&2
  echo "  Update it -- the next session (or you, from your phone) needs to see this state." >&2
  FAIL=1
fi

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "Freeze gate passed. Claim P1-P3 (docs/pitch-playbook.md) and then"
  echo "docs/submission-checklist.md. Nothing feature-shaped after this point."
  exit 0
else
  echo "Freeze gate FAILED. Fix what is marked MISSING above before treating this as frozen." >&2
  exit 1
fi
