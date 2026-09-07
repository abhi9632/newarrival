#!/usr/bin/env bash
# Stop hook: blocks session end if HANDOFF.md was not updated this session.
#
# The old version required HANDOFF_SYNCED_COMMIT to equal HEAD. That is a
# chicken-and-egg: you cannot know HEAD until after you commit, so every
# session ended with commit -> edit marker -> commit again. Evidence from the
# last event: commits named "docs: bump HANDOFF_SYNCED_COMMIT" and "docs: sync
# HANDOFF for session 14, HANDOFF_SYNCED_COMMIT to 8fa1d27". One wasted round
# trip per session, every session.
#
# New gate: HEAD's commit must touch HANDOFF.md. One commit, no marker dance.
set -euo pipefail
cd "${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

input="$(cat || true)"
if printf '%s' "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

[ -f HANDOFF.md ] || { echo "WARNING: HANDOFF.md is missing." >&2; exit 0; }
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Orphaned task rows (in-progress with no owner). Warn only, never block.
if [ -f AGENTS.md ]; then
  orphan_task=$(grep -E '\|[[:space:]]*in-progress[[:space:]]*\|[[:space:]]*\|' AGENTS.md 2>/dev/null \
    | awk -F'|' '{gsub(/[ \t]/,"",$2); print $2}' | head -1 || true)
  if [ -n "$orphan_task" ]; then
    echo "WARNING: Task ${orphan_task} is in-progress with no Claimed By name." >&2
    echo "  Finished it?     bash scripts/complete-task.sh ${orphan_task}" >&2
    echo "  Did not finish?  set Status back to available, clear Claimed By, commit." >&2
  fi
fi

# Mid-task with uncommitted work: warn loudly, do not block.
# Uncommitted work is what gets lost when a session dies on a rate limit.
if [ -n "$(git status --porcelain)" ]; then
  echo "NOTE: uncommitted changes present. Commit and push before this session ends --" >&2
  echo "      uncommitted work is lost if the session hits a token or rate limit." >&2
  exit 0
fi

# Unpushed commits: warn. Local-only commits died with sessions last event.
upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
if [ -n "$upstream" ]; then
  ahead="$(git rev-list --count "${upstream}..HEAD" 2>/dev/null || echo 0)"
  if [ "$ahead" != "0" ]; then
    echo "WARNING: ${ahead} commit(s) not pushed. Run: git push origin main" >&2
  fi
fi

# The gate: did the last commit touch HANDOFF.md?
# --first-parent + git log handles root commits and merge commits, which
# diff-tree silently reports as empty.
if git log -1 --format= --name-only --first-parent HEAD 2>/dev/null | grep -qx 'HANDOFF.md'; then
  exit 0
fi

# Opt-out for trivial sessions that changed nothing worth handing off.
if git log -1 --pretty=%B HEAD | grep -qi 'no-handoff'; then
  exit 0
fi

{
  echo "HANDOFF.md was not updated in the last commit."
  echo "Update Quick resume + Current state + a Session log row, then amend or commit."
  echo "Keep the summary under 60 lines -- it is injected into every session start."
  echo "If this session genuinely changed nothing worth handing off, put 'no-handoff'"
  echo "in the commit message."
} >&2
exit 2
