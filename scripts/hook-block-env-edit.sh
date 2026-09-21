#!/usr/bin/env bash
# PreToolUse hook (matcher: Edit|Write): blocks edits to .env files.
#
# MACHINE HYGIENE already bans hardcoding tokens/keys anywhere, and .gitignore
# already carves .env / .env.* out as sensitive (with .env.example allowed).
# Nothing enforced that at the tool-call level -- this closes the gap: an
# Edit or Write targeting a real .env file gets blocked before it happens.
set -euo pipefail

input="$(cat || true)"
path="$(printf '%s' "$input" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed -E 's/.*"file_path"[[:space:]]*:[[:space:]]*"//; s/"$//')"

base="$(basename "$path" 2>/dev/null || true)"

case "$base" in
  .env|.env.*)
    case "$base" in
      .env.example) exit 0 ;;
    esac
    {
      echo "BLOCKED: direct edit to '$base' via Edit/Write tool."
      echo "Secrets go into the hosting platform's dashboard (Cloudflare/Vercel/etc),"
      echo "not into files an agent writes. If this is local dev config with no real"
      echo "secrets in it, edit it by hand instead."
    } >&2
    exit 2
    ;;
  *) exit 0 ;;
esac
