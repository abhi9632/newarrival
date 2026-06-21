#!/usr/bin/env bash
# Atomically claim a task in the AGENTS.md Task Queue.
#
# Uses a push-rejection as the atomic gate -- the first session to push
# wins the claim. If two sessions try at the same time, the second push
# is rejected by git, the local changes are reset, and the available
# task list is printed so the human can choose a different task.
#
# Usage: bash scripts/claim-task.sh <task-id>
# Example: bash scripts/claim-task.sh T1
# Example: bash scripts/claim-task.sh V1a
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: bash scripts/claim-task.sh <task-id>" >&2
  echo "Example: bash scripts/claim-task.sh T1" >&2
  echo "Example: bash scripts/claim-task.sh V1a" >&2
  exit 1
fi

# Resolve owner: GIT_USER_NAME env var > git config user.name > unknown
OWNER="${GIT_USER_NAME:-}"
if [ -z "$OWNER" ]; then
  OWNER=$(git config --global user.name 2>/dev/null || echo "unknown")
fi

cd "$(git rev-parse --show-toplevel)"

# Step 1: pull latest
git pull --rebase origin main

# Step 2: verify task exists and is available
if ! grep -qiE "^\\|[[:space:]]*${TASK_ID}[[:space:]]*\\|" AGENTS.md; then
  echo "ERROR: Task ${TASK_ID} not found in AGENTS.md." >&2
  exit 1
fi

status_val=$(grep -iE "^\\|[[:space:]]*${TASK_ID}[[:space:]]*\\|" AGENTS.md \
  | awk -F'|' '{gsub(/[ \t]/,"",$5); print $5}' \
  | sed 's/(.*//' | head -1)

if [ "$status_val" != "available" ]; then
  echo "ERROR: Task ${TASK_ID} is '$status_val' -- cannot claim it." >&2
  echo ""
  echo "Tasks available right now:"
  echo ""
  python3 - <<'PYEOF'
import re, pathlib
path = pathlib.Path('AGENTS.md')
lines = path.read_text().splitlines()
task_status = {}
rows = []
for line in lines:
    m = re.match(r'^\s*\|\s*([TV]\d+[a-z]?)\s*\|', line)
    if m:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) < 6:
            continue
        tid = parts[1]
        desc = parts[2]
        raw_deps = parts[3]
        status = re.sub(r'\s*\(.*?\)', '', parts[4]).strip()
        deps = [d.strip() for d in re.split(r'[,\s]+', raw_deps) if re.match(r'[TV]\d+[a-z]?', d.strip())]
        task_status[tid] = status
        rows.append((tid, desc, deps, status))
found = False
for tid, desc, deps, status in rows:
    if status == 'available':
        all_done = all(task_status.get(d, '') == 'done' for d in deps)
        if all_done:
            print(f'  {tid}  {desc[:70]}')
            found = True
if not found:
    print('  No tasks available right now -- all remaining tasks are blocked or in-progress.')
PYEOF
  echo ""
  echo "Run: bash scripts/claim-task.sh <task-id>"
  exit 1
fi

# Step 3: update AGENTS.md
python3 - "$TASK_ID" "$OWNER" <<'PYEOF'
import re, pathlib, sys
task_id, owner = sys.argv[1], sys.argv[2]
path = pathlib.Path('AGENTS.md')
lines = path.read_text().splitlines(keepends=True)
out = []
for line in lines:
    if re.match(r'^\s*\|\s*' + re.escape(task_id) + r'\s*\|', line, re.IGNORECASE):
        line = re.sub(r'\bavailable\b', 'in-progress', line)
        parts = line.rstrip('\n').split('|')
        if len(parts) >= 6:
            parts[5] = ' ' + owner + ' '
            line = '|'.join(parts) + '\n'
    out.append(line)
path.write_text(''.join(out))
PYEOF

git add AGENTS.md
git commit -m "chore: claim ${TASK_ID} -- ${OWNER}"

# Step 4: push -- first session wins, second is rejected
if ! git push origin main 2>/dev/null; then
  echo ""
  echo "====================================================="
  echo "  CLAIM LOST: ${TASK_ID} was taken by another session"
  echo "  a split-second before yours."
  echo "====================================================="
  git reset --hard HEAD~1
  git pull --rebase origin main
  echo ""
  echo "Tasks available right now:"
  echo ""
  python3 - <<'PYEOF'
import re, pathlib
path = pathlib.Path('AGENTS.md')
lines = path.read_text().splitlines()
task_status = {}
rows = []
for line in lines:
    m = re.match(r'^\s*\|\s*([TV]\d+[a-z]?)\s*\|', line)
    if m:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) < 6:
            continue
        tid = parts[1]
        desc = parts[2]
        raw_deps = parts[3]
        status = re.sub(r'\s*\(.*?\)', '', parts[4]).strip()
        deps = [d.strip() for d in re.split(r'[,\s]+', raw_deps) if re.match(r'[TV]\d+[a-z]?', d.strip())]
        task_status[tid] = status
        rows.append((tid, desc, deps, status))
found = False
for tid, desc, deps, status in rows:
    if status == 'available':
        all_done = all(task_status.get(d, '') == 'done' for d in deps)
        if all_done:
            print(f'  {tid}  {desc[:70]}')
            found = True
if not found:
    print('  No tasks available right now -- all remaining tasks are blocked or in-progress.')
PYEOF
  echo ""
  echo "Tell your session which task to claim:"
  echo "  bash scripts/claim-task.sh <task-id>"
  exit 1
fi

echo ""
echo "${TASK_ID} claimed by ${OWNER}. Start building."
echo "When done, run: bash scripts/complete-task.sh ${TASK_ID}"
