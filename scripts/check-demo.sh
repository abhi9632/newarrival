#!/usr/bin/env bash
# The single command that re-proves demo readiness: the live surface, the visitor
# facing sweeps, and that every visual gate row has the screenshot evidence behind it.
#
# Usage: bash scripts/check-demo.sh
# Exit 0: every section passed. Exit 1: prints exactly what is missing, per section.
set -uo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

FAIL=0

echo "== 1. Live URL =="
URL=$(grep -oE 'https://[a-z0-9.-]+\.vercel\.app' HANDOFF.md 2>/dev/null | head -1)
if [ -z "$URL" ]; then
  echo "  MISSING: no Vercel URL found in HANDOFF.md. This is a known, standing blocker" >&2
  echo "  (GitHub App not authorised on the repo, see docs/manual-actions.md). Section 1" >&2
  echo "  cannot pass until a human completes that authorisation and a deploy exists." >&2
  FAIL=1
else
  CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$URL" 2>/dev/null || echo "000")
  if [ "$CODE" = "200" ] || [ "$CODE" = "304" ]; then
    BODY=$(curl -sSL --max-time 15 "$URL" 2>/dev/null || echo "")
    if echo "$BODY" | grep -q "not migration advice and not legal advice"; then
      echo "  OK: $URL responded $CODE and serves the disclaimer sentence"
    else
      echo "  MISSING: $URL responded $CODE but does not serve the disclaimer sentence." >&2
      echo "  The production alias may point at a stale build." >&2
      FAIL=1
    fi
  else
    echo "  MISSING: $URL responded $CODE (expected 200 or 304)." >&2
    FAIL=1
  fi
fi

echo ""
echo "== 2. Banned dashes =="
if grep -rIn -e "$(printf '\342\200\224')" -e "$(printf '\342\200\223')" src/ >/tmp/check-demo-dashes.$$ 2>/dev/null; then
  echo "  MISSING: banned dash character found in src/:" >&2
  cat /tmp/check-demo-dashes.$$ >&2
  FAIL=1
else
  echo "  OK: no em dash or en dash in src/"
fi
rm -f /tmp/check-demo-dashes.$$

echo ""
echo "== 3. Advice framing =="
if grep -rIniE "you should|you qualify|we recommend" src/ >/tmp/check-demo-advice.$$ 2>/dev/null; then
  echo "  MISSING: advice framing phrase found in src/ (legal constraint, not style):" >&2
  cat /tmp/check-demo-advice.$$ >&2
  FAIL=1
else
  echo "  OK: no advice framing phrase in src/"
fi
rm -f /tmp/check-demo-advice.$$

echo ""
echo "== 4. Secrets =="
SECRET_HIT=0
if grep -rInE "(sk|pk)_(live|test)_[A-Za-z0-9]{12,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{20,}|BEGIN [A-Z ]*PRIVATE KEY" src/ public/ >/tmp/check-demo-secrets.$$ 2>/dev/null; then
  echo "  MISSING: credential shaped string found:" >&2
  cat /tmp/check-demo-secrets.$$ >&2
  SECRET_HIT=1
fi
rm -f /tmp/check-demo-secrets.$$
TRACKED_ENV=$(git ls-files -- '.env*' '*/.env*')
if [ -n "$TRACKED_ENV" ]; then
  echo "  MISSING: git tracks an environment file:" >&2
  echo "$TRACKED_ENV" >&2
  SECRET_HIT=1
fi
if [ "$SECRET_HIT" -eq 0 ]; then
  echo "  OK: no credential shape in src/ or public/, no tracked env file"
else
  FAIL=1
fi

echo ""
echo "== 5. No personal identifier persisted =="
if grep -rInE "localStorage|sessionStorage|indexedDB|document\.cookie" src/ >/tmp/check-demo-storage.$$ 2>/dev/null; then
  echo "  MISSING: browser storage or cookie write found in src/:" >&2
  cat /tmp/check-demo-storage.$$ >&2
  FAIL=1
else
  echo "  OK: no browser storage or cookie write in src/"
fi
rm -f /tmp/check-demo-storage.$$

echo ""
echo "== 6. Gate evidence pairing =="
GATE_LOG="design-system/README.md"
SCREENS="05-intro 05-intake 05-timeline 05-cascade-mid 05-cascade-settled"
EVIDENCED=0
for key in $SCREENS; do
  ROW_PASSING=0
  if grep -qE "^\| .*\($key\) \| yes \| yes \| yes \|" "$GATE_LOG" 2>/dev/null; then
    ROW_PASSING=1
  fi
  PNG_375="docs/visual-gate/${key}-375.png"
  PNG_1280="docs/visual-gate/${key}-1280.png"
  HAS_PNGS=0
  if [ -s "$PNG_375" ] && [ -s "$PNG_1280" ]; then
    HAS_PNGS=1
  fi
  HAS_HEADING=0
  if grep -qE "^### ${key}," "$GATE_LOG" 2>/dev/null; then
    HAS_HEADING=1
  fi

  if [ "$ROW_PASSING" -eq 1 ] && [ "$HAS_PNGS" -eq 0 ]; then
    echo "  MISSING: $key has a passing gate row but no committed screenshot pair" >&2
    FAIL=1
  fi
  if [ "$HAS_PNGS" -eq 1 ] && [ "$HAS_HEADING" -eq 0 ]; then
    echo "  MISSING: $key has both screenshots but no ### $key written judgement" >&2
    FAIL=1
  fi
  if [ "$HAS_PNGS" -eq 1 ] && [ "$HAS_HEADING" -eq 1 ]; then
    EVIDENCED=$((EVIDENCED + 1))
  fi
done
echo "  SCREENS_EVIDENCED $EVIDENCED"

echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "Demo readiness gate passed."
  exit 0
else
  echo "Demo readiness gate FAILED. Fix what is marked MISSING above." >&2
  exit 1
fi
