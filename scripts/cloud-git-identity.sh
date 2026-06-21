#!/usr/bin/env bash
# DEPRECATED -- superseded by the Claude Code project Setup Script.
# Git identity (user.name, user.email) is now set in the Setup Script that
# runs before every session. This file is kept only so the SessionStart hook
# reference in .claude/settings.json does not 404.
# It is a no-op and will be removed once the hook reference is cleaned up.
echo "cloud-git-identity.sh: identity managed by Setup Script -- no action taken."
exit 0
