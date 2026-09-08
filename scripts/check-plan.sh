#!/usr/bin/env bash
# Verify the GSD plan file for a phase exists before a builder writes code.
# Run this after claiming a task, before touching any code. Read-only.
#
# The GSD plan file is the real specification for a task. The AGENTS.md task
# description is only a summary. Builders must read the plan file before building.
#
# Usage: bash scripts/check-plan.sh <phase-number>   (T1=1, V1x=2, V2x=3, V3=4)
set -euo pipefail

PHASE="${1:-}"
if [ -z "$PHASE" ]; then
  echo "Usage: bash scripts/check-plan.sh <phase-number>" >&2
  echo "Phase map: T1=1, V1x=2, V2x=3, V3=4" >&2
  exit 1
fi

cd "$(git rev-parse --show-toplevel)"

# GSD zero-pads phase dirs (02-..., 04-...). Accept "2" or "02".
PADDED=$(printf '%02d' "$PHASE" 2>/dev/null || echo "$PHASE")
PHASE_DIR=$(ls -d .planning/phases/${PADDED}-* .planning/phases/${PHASE}-* 2>/dev/null | head -1 || true)

PLAN_FILE=""
[ -n "$PHASE_DIR" ] && PLAN_FILE=$(ls "$PHASE_DIR"/*-PLAN.md 2>/dev/null | head -1 || true)

if [ -n "$PLAN_FILE" ] && [ -f "$PLAN_FILE" ]; then
  echo "Plan file(s) found for phase ${PHASE}:"
  ls "$PHASE_DIR"/*-PLAN.md
  echo ""
  echo "Read the plan file fully before writing any code. It is your specification."
  exit 0
fi

echo "ERROR: No GSD plan file for phase ${PHASE}." >&2
echo "Looked under .planning/phases/${PADDED}-*/ for *-PLAN.md and found none." >&2
echo "" >&2
if bash "$(dirname "$0")/ensure-gsd.sh" --check >/dev/null 2>&1; then
  echo "This phase has not been planned. Run:" >&2
  echo "  /gsd-plan-phase ${PHASE}" >&2
  echo "Wait for it to finish, commit the .planning/ files, then re-run:" >&2
  echo "  bash scripts/check-plan.sh ${PHASE}" >&2
else
  echo "GSD is not installed on this machine either, so /gsd-plan-phase does not exist here." >&2
  echo "Install it first:" >&2
  echo "  bash scripts/ensure-gsd.sh" >&2
  echo "then run /gsd-plan-phase ${PHASE} and re-run this check." >&2
fi

echo "" >&2
echo "A missing plan file does not stop a build. Say so in one line, then build from" >&2
echo "docs/CONCEPT.md plus the AGENTS.md task description, and log the assumption in" >&2
echo "HANDOFF.md. See CLAUDE.md, SESSION START." >&2
exit 1
