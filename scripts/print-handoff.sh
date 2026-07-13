#!/usr/bin/env bash
# SessionStart hook: prints lean HANDOFF summary into context.
# Prints: Quick resume, Current state, ALL Standing blockers, ALL Infra blockers.
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

[ -f HANDOFF.md ] || { echo "WARNING: HANDOFF.md missing" >&2; exit 0; }

echo "===== HANDOFF ====="
awk '
  /^## Quick resume/      { p="full"; next }
  /^## Current state/     { p="full"; next }
  /^## Standing blockers/ { p="bullets"; next }
  /^## Infra & access/    { p="bullets"; next }
  /^## /                  { p=0 }
  p=="full" { print }
  p=="bullets" {
    if (/^[[:space:]]*-[[:space:]]/ && $0 !~ /^[[:space:]]*$/) {
      print
    } else if (/^[[:space:]]*$/) {
      next
    }
  }
' HANDOFF.md
echo "===== END (full: HANDOFF.md) ====="

echo ""
echo "===== ACTION REQUIRED ====="
echo "WAITING FOR HUMAN AUTHORISATION."
echo "Do NOT begin any work. Do NOT read plan files. Do NOT run any scripts."
echo "Wait for the human to run: bash scripts/claim-task.sh <task-id>"
echo "Then wait for the human to paste the builder prompt."
echo "Only then may you proceed to SESSION START steps."
echo "==========================="
exit 0
