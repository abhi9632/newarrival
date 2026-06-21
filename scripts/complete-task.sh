#!/usr/bin/env bash
# Mark a task as done and automatically unblock any tasks whose dependencies
# are now fully satisfied.
#
# Usage: bash scripts/complete-task.sh <task-id>
# Example: bash scripts/complete-task.sh T1
# Example: bash scripts/complete-task.sh V1a
#
# What this script does:
#   1. Pulls latest main
#   2. Checks the task is currently in-progress
#   3. If the task has a "blocked on human action" note, prompts for confirmation
#   4. Marks the task as done, clears Claimed By
#   5. Scans every blocked task -- if ALL dependencies are done, flips to available
#   6. Commits and pushes the updated AGENTS.md
set -euo pipefail

TASK_ID="${1:-}"

if [ -z "$TASK_ID" ]; then
  echo "Usage: bash scripts/complete-task.sh <task-id>" >&2
  echo "Example: bash scripts/complete-task.sh T1" >&2
  echo "Example: bash scripts/complete-task.sh V1a" >&2
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

# Step 2: check the task exists and is in-progress
if ! grep -qiE "^\\|[[:space:]]*${TASK_ID}[[:space:]]*\\|" AGENTS.md; then
  echo "ERROR: Task ${TASK_ID} not found in AGENTS.md." >&2
  exit 1
fi

task_line=$(grep -iE "^\\|[[:space:]]*${TASK_ID}[[:space:]]*\\|" AGENTS.md | head -1)
status_val=$(echo "$task_line" | awk -F'|' '{gsub(/ /,"",$5); print $5}' | sed 's/(.*//')

if [[ "$status_val" != "in-progress"* ]]; then
  echo "ERROR: Task ${TASK_ID} is '$status_val' -- only in-progress tasks can be completed." >&2
  exit 1
fi

# Step 3: if the task involves a manual/human step, prompt for confirmation
if echo "$task_line" | grep -qi "human action\|manual\|browser\|physical device\|oauth"; then
  echo ""
  echo "=================================================================="
  echo "  ${TASK_ID} requires a manual human step."
  echo "=================================================================="
  echo ""
  echo "Task description:"
  echo "$task_line" | awk -F'|' '{print "  " $3}' | sed 's/^  [ ]*/  /'
  echo ""
  echo "Have you fully completed the manual step above? (yes/no)"
  read -r answer
  if [[ "$answer" != "yes" && "$answer" != "y" ]]; then
    echo ""
    echo "Aborting. Come back and run this script once the manual step is done."
    exit 0
  fi
fi

# Step 4 + 5: mark done, clear Claimed By, unblock dependents
python3 - "$TASK_ID" <<'PYEOF'
import re, pathlib, sys

task_id = sys.argv[1]
path = pathlib.Path('AGENTS.md')
lines = path.read_text().splitlines(keepends=True)

def parse_row(line):
    m = re.match(r'^\s*\|\s*([TV]\d+[a-z]?)\s*\|', line)
    if not m:
        return None
    parts = [p.strip() for p in line.split('|')]
    if len(parts) < 6:
        return None
    tid = parts[1].strip()
    raw_deps = parts[3].strip()
    deps = [d.strip() for d in re.split(r'[,\s]+', raw_deps) if re.match(r'[TV]\d+[a-z]?', d.strip())]
    status = re.sub(r'\s*\(.*?\)', '', parts[4]).strip()
    return tid, deps, status

# Build status map
task_status = {}
for l in lines:
    r = parse_row(l)
    if r:
        task_status[r[0]] = r[2]

# Mark our task done
task_status[task_id] = 'done'

def all_deps_done(deps):
    return all(task_status.get(d, '') == 'done' for d in deps)

unblocked = []
for l in lines:
    r = parse_row(l)
    if r:
        tid, deps, status = r
        if status == 'blocked' and deps and all_deps_done(deps):
            unblocked.append(tid)
            task_status[tid] = 'available'

# Rewrite lines
out = []
for line in lines:
    r = parse_row(line)
    if r:
        tid, deps, status = r
        if tid == task_id:
            line = re.sub(r'\bin-progress\b', 'done', line)
            # Clear Claimed By column
            parts = line.rstrip('\n').split('|')
            if len(parts) >= 6:
                parts[5] = ' '
                line = '|'.join(parts) + '\n'
        elif tid in unblocked:
            line = re.sub(r'\bblocked\b', 'available', line)
    out.append(line)

path.write_text(''.join(out))

print(f'{task_id} marked done.')
if unblocked:
    print(f'Automatically unblocked: {" ".join(unblocked)}')
else:
    print('No tasks newly unblocked.')
PYEOF

# Step 6: commit and push
git add AGENTS.md
git commit -m "chore: ${TASK_ID} done -- auto-unblock dependents"

if ! git push origin main; then
  echo "" >&2
  echo "PUSH FAILED: conflict with remote. Resetting..." >&2
  git reset --hard HEAD~1
  git pull --rebase origin main
  echo "" >&2
  echo "Please re-run: bash scripts/complete-task.sh ${TASK_ID}" >&2
  exit 1
fi

echo ""
echo "Done. AGENTS.md updated and pushed."
echo "Run: bash scripts/next-task.sh to see what just unlocked."
