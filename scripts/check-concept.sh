#!/usr/bin/env bash
# Gate between the Ideation Sprint and planning.
# Verifies docs/CONCEPT.md exists, has every required section filled, and is committed.
#
# Usage: bash scripts/check-concept.sh
# Exit 0: concept is locked, planning may start.
# Exit 1: concept is missing or incomplete, run the Ideation Sprint (rules/ideation-sprint.md).
set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

CONCEPT="docs/CONCEPT.md"

if [ ! -f "$CONCEPT" ]; then
  echo "No $CONCEPT." >&2
  echo "Run the Ideation Sprint first: rules/ideation-sprint.md (or the /kickoff command)." >&2
  exit 1
fi

# Guard the one-concept-file rule. A second concept doc caused real confusion last event.
STRAYS=$(ls docs/CONCEPT-*.md docs/concept-*.md 2>/dev/null || true)
if [ -n "$STRAYS" ]; then
  echo "WARNING: extra concept files exist. Fold them into $CONCEPT and delete them:"
  echo "$STRAYS"
fi

# Every section below must exist and carry at least one line of real content.
# HTML comments and placeholder brackets do not count as content.
REQUIRED="Problem statement
Persona
Solution concept
Demo narrative
Signature wow moment
What each role sees
Hard constraints
Why it wins each rubric criterion
risks
Assumptions to test"

MISSING=""
while IFS= read -r section; do
  [ -z "$section" ] && continue
  FILLED=$(awk -v sec="$section" '
    BEGIN { inside = 0; content = 0 }
    /^#/ {
      if (inside) { inside = 0 }
      if (index($0, sec) > 0) { inside = 1; next }
    }
    inside {
      line = $0
      gsub(/<!--.*-->/, "", line)
      gsub(/^[ \t]+|[ \t]+$/, "", line)
      if (line == "" || line ~ /^<!--/ || line ~ /^-->/ || line ~ /^\[.*\]$/) next
      if (line ~ /^[-*0-9.]+$/) next
      content = 1
    }
    END { print content }
  ' "$CONCEPT")
  [ "$FILLED" != "1" ] && MISSING="${MISSING}  - ${section}"$'\n'
done <<< "$REQUIRED"

if [ -n "$MISSING" ]; then
  echo "ERROR: $CONCEPT is not locked. These sections are missing or empty:" >&2
  printf '%s' "$MISSING" >&2
  echo "Finish the Ideation Sprint (rules/ideation-sprint.md) before planning starts." >&2
  exit 1
fi

if ! git ls-files --error-unmatch "$CONCEPT" >/dev/null 2>&1; then
  echo "ERROR: $CONCEPT is complete but not committed. Commit and push it before planning." >&2
  exit 1
fi

if ! git diff --quiet -- "$CONCEPT" 2>/dev/null; then
  echo "WARNING: $CONCEPT has uncommitted edits. Commit them so every session sees the same concept."
fi

echo "Concept locked: $CONCEPT (all required sections filled, tracked in git)."
echo "Planning may start. Next: bash scripts/ensure-gsd.sh, then run the planning skill (SKILL.md)."
exit 0
