#!/usr/bin/env bash
# Show all tasks that are safe to claim right now, with parallel suggestions.
# No side effects -- read-only. Runs automatically on session start via CLAUDE.md.
#
# Usage: bash scripts/next-task.sh
set -euo pipefail

PY=""
for c in "python3" "python" "py -3"; do
  if $c -c 'import sys' >/dev/null 2>&1; then PY="$c"; break; fi
done
[ -n "$PY" ] || { echo "ERROR: no working Python found (need python3, python, or py -3)" >&2; exit 1; }

cd "$(git rev-parse --show-toplevel)"

git pull --rebase origin main --quiet 2>/dev/null || true

echo ""
echo "============================================"
echo "  TASK QUEUE -- $(date '+%H:%M:%S')"
echo "============================================"

# Resolve session owner: env var > git config > unknown
SESSION_OWNER="${GIT_USER_NAME:-}"
if [ -z "$SESSION_OWNER" ]; then
  SESSION_OWNER=$(git config --global user.name 2>/dev/null || echo "unknown")
fi

$PY - "$SESSION_OWNER" <<'PYEOF'
import re, pathlib, sys

me = sys.argv[1]
path = pathlib.Path('AGENTS.md')
lines = path.read_text().splitlines()

task_status = {}
rows = []
for line in lines:
    m = re.match(r'^\s*\|\s*([TVP]\d+[a-z]?)\s*\|', line)
    if m:
        parts = [p.strip() for p in line.split('|')]
        if len(parts) < 6:
            continue
        tid      = parts[1]
        desc     = parts[2]
        raw_deps = parts[3] if len(parts) > 3 else ''
        status   = re.sub(r'\s*\(.*?\)', '', parts[4]).strip() if len(parts) > 4 else ''
        owner    = parts[5].strip() if len(parts) > 5 else ''
        deps     = [d.strip() for d in re.split(r'[,\s]+', raw_deps) if re.match(r'[TVP]\d+[a-z]?', d.strip())]
        task_status[tid] = status
        rows.append((tid, desc, deps, status, owner))

claimable, in_progress, blocked, done = [], [], [], []

for tid, desc, deps, status, owner in rows:
    unmet = [d for d in deps if task_status.get(d, '') != 'done']
    if status == 'done':
        done.append((tid, desc, owner))
    elif status == 'in-progress':
        in_progress.append((tid, desc, owner))
    elif status == 'blocked' and not deps:
        # ponytail: zero-dep blocked = manual gate (e.g. P1 at feature freeze); only the lead flips it
        blocked.append((tid, desc, ['lead (manual gate)']))
    elif status in ('available', 'blocked'):
        if not unmet:
            claimable.append((tid, desc, owner))
        else:
            blocked.append((tid, desc, unmet))

if claimable:
    print('\n  CLAIMABLE NOW -- pick one:')
    for tid, desc, owner in claimable:
        print(f'    {tid}  {desc[:65]}')
else:
    print('\n  CLAIMABLE NOW: none')

if in_progress:
    print('\n  IN PROGRESS:')
    for tid, desc, owner in in_progress:
        who = f'  [{owner}]' if owner else ''
        print(f'    {tid}  {desc[:60]}{who}')

if blocked:
    print('\n  BLOCKED (waiting on):')
    for tid, desc, unmet in blocked:
        print(f'    {tid}  {desc[:52]}  needs: {", ".join(unmet)}')

if done:
    print('\n  DONE:')
    for tid, desc, owner in done:
        print(f'    {tid}  {desc[:65]}')

# Parallel suggestion
if len(claimable) >= 2:
    print(f'\n  PARALLEL SUGGESTION:')
    print(f'    You ({me}) take {claimable[0][0]} -- teammate takes {claimable[1][0]}')
    if len(claimable) >= 3:
        print(f'    Third teammate takes {claimable[2][0]}')
elif len(claimable) == 1 and in_progress:
    print(f'\n  NOTE: 1 task claimable ({claimable[0][0]}). Others: help person closest to finishing.')
elif not claimable:
    if not rows or all(s in ('blocked', 'available') for _, _, _, s, _ in rows if s != 'done'):
        print('\n  NOTE: Planner may still be filling the queue. Pull again in a few minutes.')

print('')
PYEOF

echo "Claim:    bash scripts/claim-task.sh <task-id>   e.g. bash scripts/claim-task.sh V1a"
echo "Complete: bash scripts/complete-task.sh <task-id> e.g. bash scripts/complete-task.sh V1a"
echo "============================================"
echo ""
