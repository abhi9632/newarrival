#!/usr/bin/env bash
# SessionStart hook: prints a SHORT HANDOFF summary into context.
#
# Hard cap: 60 lines. Last event this hook injected 16KB into every single
# session start, before any work happened. That cost is paid on every session,
# including ones that only needed a one-line fix. If the summary hits the cap,
# HANDOFF.md is too long -- prune it, do not raise the cap.
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

[ -f HANDOFF.md ] || { echo "WARNING: HANDOFF.md missing" >&2; exit 0; }

MAXLINES=60

summary() {
  awk '
    /^## Quick resume/       { p="full"; next }
    /^## Current state/      { p="full"; next }
    /^## Standing blockers/  { p="bullets"; next }
    /^## Infra & access/     { p="bullets"; next }
    /^## /                   { p=0 }
    p=="full"    { print }
    p=="bullets" { if (/^[[:space:]]*-[[:space:]]/) print }
  ' HANDOFF.md
}

echo "===== HANDOFF (max ${MAXLINES} lines -- full file: HANDOFF.md) ====="
summary | head -n "$MAXLINES"

total=$(summary | wc -l)
if [ "$total" -gt "$MAXLINES" ]; then
  echo "..."
  echo "[HANDOFF summary is ${total} lines, over the ${MAXLINES}-line budget."
  echo " Prune Quick resume and Current state down to the live state only.]"
fi
echo "===== END ====="
exit 0
