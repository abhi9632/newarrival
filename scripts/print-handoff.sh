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
exit 0
