#!/usr/bin/env bash
# Make sure GSD Core is installed on THIS machine, and install it if it is not.
#
# GSD is never committed to this repo. Its installer writes machine-absolute paths
# into every agent, command and hook file, so a vendored copy is only ever correct on
# the machine that produced it. Each machine installs its own copy instead.
#
# Usage:
#   bash scripts/ensure-gsd.sh            install if missing, then report
#   bash scripts/ensure-gsd.sh --check    report only, exit 1 if missing, install nothing
#
# Safe to run repeatedly. If GSD is already present this does nothing and exits 0.
set -uo pipefail

CHECK_ONLY=0
[ "${1:-}" = "--check" ] && CHECK_ONLY=1

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

# GSD has shipped two command layouts. Accept either.
#   1.13.x and later : .claude/commands/gsd-new-project.md   (flat)
#   earlier          : .claude/commands/gsd/new-project.md   (nested)
gsd_present() {
  [ -f ".claude/commands/gsd-new-project.md" ] || [ -f ".claude/commands/gsd/new-project.md" ]
}

gsd_entry_command() {
  if [ -f ".claude/commands/gsd-new-project.md" ] || [ -f ".claude/commands/gsd/new-project.md" ]; then
    echo "/gsd-new-project"
  fi
}

if gsd_present; then
  echo "GSD Core: installed. Entry command: $(gsd_entry_command)"
  exit 0
fi

if [ "$CHECK_ONLY" = "1" ]; then
  echo "GSD Core: NOT installed in this project." >&2
  echo "Install it with: bash scripts/ensure-gsd.sh" >&2
  exit 1
fi

# --- install path ---

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node is not on PATH, so GSD cannot be installed." >&2
  echo "Install Node 24 or later, then re-run: bash scripts/ensure-gsd.sh" >&2
  exit 1
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo 0)
if [ "$NODE_MAJOR" -lt 24 ] 2>/dev/null; then
  echo "WARNING: Node $(node -v) is below the Node 24 that GSD declares."
  echo "The installer still runs on Node 22 (verified), so continuing."
  echo "If it fails, upgrade Node and re-run this script."
fi

echo "Installing GSD Core for this machine (npx @opengsd/gsd-core@latest --local --claude)..."
npx -y @opengsd/gsd-core@latest --local --claude
INSTALL_EXIT=$?

if [ "$INSTALL_EXIT" -ne 0 ]; then
  echo "" >&2
  echo "ERROR: GSD install failed (exit $INSTALL_EXIT)." >&2
  echo "Planning can still proceed without GSD: see SKILL.md Phase 2, 'If GSD is unavailable'." >&2
  exit "$INSTALL_EXIT"
fi

if gsd_present; then
  echo ""
  echo "GSD Core installed. Entry command: $(gsd_entry_command)"
  echo "New slash commands may not appear until this Claude Code session is restarted."
  echo "If /gsd-new-project is not recognised, restart the session and try again."
  exit 0
fi

echo "ERROR: installer reported success but no GSD command files were written." >&2
echo "Looked for .claude/commands/gsd-new-project.md and .claude/commands/gsd/new-project.md." >&2
exit 1
