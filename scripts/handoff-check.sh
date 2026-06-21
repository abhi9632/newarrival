#!/usr/bin/env bash
# Stop hook: blocks session end if HANDOFF.md or AGENTS.md Task Queue is out of sync.
set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

input="$(cat || true)"

# Prevent infinite loop if stop_hook_active is set
if printf '%s' "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

# Non-blocking warnings
[ -f HANDOFF.md ]              || echo "WARNING: HANDOFF.md is missing." >&2
[ -f docs/session-archive.md ] || echo "WARNING: docs/session-archive.md is missing." >&2
[ -f design-system/README.md ] || echo "WARNING: design-system/README.md is missing." >&2

[ -f HANDOFF.md ] || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Skip if uncommitted changes exist (mid-task)
if [ -n "$(git status --porcelain)" ]; then
  exit 0
fi

head_hash="$(git rev-parse HEAD)"
head_subject="$(git log -1 --pretty=%s HEAD)"

# Skip if the last commit message already contains the sync marker
case "$head_subject" in
  *HANDOFF_SYNCED_COMMIT*) exit 0 ;;
esac

# Check AGENTS.md Task Queue for abandoned in-progress tasks
if [ -f AGENTS.md ]; then
  # Find any in-progress tasks that have no Claimed By name (orphaned)
  # Also extract the task ID for a helpful warning message
  orphan_task=$(grep -E '\|[[:space:]]*in-progress[[:space:]]*\|[[:space:]]*\|' AGENTS.md 2>/dev/null \
    | awk -F'|' '{gsub(/[ \t]/,"",$2); print $2}' | head -1 || true)
  if [ -n "$orphan_task" ]; then
    {
      echo "WARNING: Task ${orphan_task} is in-progress with no Claimed By name (orphaned)."
      echo "Before ending this session:"
      echo "  - If you finished the task: bash scripts/complete-task.sh ${orphan_task}"
      echo "  - If you did not finish: set Status back to available and clear Claimed By, then commit."
    } >&2
    # Non-blocking -- warn only, do not exit 2 (task state is recoverable)
  fi

  # Find tasks claimed by someone but status is not in-progress (inconsistent state)
  if grep -qE '\|[[:space:]]*(available|blocked|done)[[:space:]]*\|[[:space:]]*[^|[:space:]][^|]*\|' AGENTS.md 2>/dev/null; then
    {
      echo "WARNING: AGENTS.md has a task with a Claimed By name but status is not in-progress."
      echo "Clean up the Task Queue before ending this session."
    } >&2
  fi
fi

# Extract synced hash -- accepts 'none' or a real hash
synced_raw="$(grep -oE 'HANDOFF_SYNCED_COMMIT:[[:space:]]*[a-zA-Z0-9_().-]+' HANDOFF.md | head -1 | awk -F':[[:space:]]*' '{print $2}' || true)"

# If marker is 'none' or missing entirely, skip the sync check on first session
if [ -z "$synced_raw" ] || [ "$synced_raw" = "none" ] || [[ "$synced_raw" == *"("* ]]; then
  exit 0
fi

if [ "$head_hash" != "$synced_raw" ]; then
  {
    echo "HANDOFF.md is out of sync."
    echo "HEAD is $head_hash but marker shows '${synced_raw}'."
    echo "Update HANDOFF.md (Quick resume + Current state + Session log),"
    echo "set HANDOFF_SYNCED_COMMIT to $head_hash, then commit."
  } >&2
  exit 2
fi

exit 0
