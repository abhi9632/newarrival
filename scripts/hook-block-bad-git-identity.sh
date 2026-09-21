#!/usr/bin/env bash
# PreToolUse hook (matcher: Bash): blocks `git commit` under the wrong identity.
#
# CLAUDE.md already hand-codes this as a manual step -- "run git config
# user.name before every commit, stop if it's Claude Code". A step that
# relies on the agent remembering it every session gets skipped. This hook
# makes it mechanical: exit 2 blocks the tool call and Claude Code shows
# stderr back to the model.
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

input="$(cat || true)"
command="$(printf '%s' "$input" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"command"[[:space:]]*:[[:space:]]*"//; s/"$//')"

case "$command" in
  *"git commit"*) ;;
  *) exit 0 ;;
esac

name="$(git config user.name 2>/dev/null || true)"
email="$(git config user.email 2>/dev/null || true)"

if [ -z "$name" ] || [ "$name" = "Claude Code" ] || [ "$email" = "claude@anthropic.com" ]; then
  {
    echo "BLOCKED: git identity is missing or set to Claude Code (name='$name' email='$email')."
    echo "Ask the user for their GitHub username and email, then:"
    echo "  git config --global user.name \"<name>\""
    echo "  git config --global user.email \"<email>\""
  } >&2
  exit 2
fi

exit 0
