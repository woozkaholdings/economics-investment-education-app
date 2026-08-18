#!/usr/bin/env bash
# Wrapper so the Browser-preview tool's `preview_start` can launch `npm run
# dev` in this sandbox. That tool's process spawn uses a minimal PATH that
# does not include the bootstrapped Node scripts/bootstrap-node.sh installs
# (this environment has no system Node/npm) — a bare "npm" runtimeExecutable
# in .claude/launch.json fails with "Command not found: npm" even though the
# Bash tool's shell (which sources the user's profile) finds it fine. See
# AGENT_LOG.md's Environment note for the full story and the static-build
# workaround this script replaces for the dev-server case specifically.
#
# Resolves its own directory rather than assuming a working directory, so it
# runs the same way regardless of what spawns it or from where.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$("${SCRIPT_DIR}/bootstrap-node.sh")"
export PATH="${BIN_DIR}:${PATH}"
cd "${SCRIPT_DIR}/.."
exec npm run dev
