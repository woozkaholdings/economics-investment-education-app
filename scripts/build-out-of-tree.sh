#!/usr/bin/env bash
# `npm run build`, with the dependencies installed OUTSIDE this repo's folder.
#
# Usage:
#   BIN_DIR="$(scripts/bootstrap-node.sh)"; export PATH="$BIN_DIR:$PATH"
#   scripts/build-out-of-tree.sh                  # build, then mirror the result into ./dist
#   scripts/build-out-of-tree.sh --no-copy-back   # build, leave ./dist alone
#
# Progress goes to stderr; the last line on stdout is always the dist/
# directory holding the build. The working copy lives in
# $ECYCLES_BUILD_DIR (default: $HOME/.cache/ecycles-build) and `npm ci` only
# re-runs there when package.json, package-lock.json or the Node CPU changes.
#
# WHY THIS EXISTS (2026-09-10): this repo sits in an iCloud-synced folder that
# an x86_64 Mac and an arm64 Mac share, and node_modules/ syncs along with it.
# Vite loads native rollup and esbuild binaries built for ONE CPU, so whichever
# Mac installed last breaks the other one's build -- and rebuilding in place
# only moves the breakage across the sync. Measured 2026-09-10 on the arm64
# Mac: node_modules/ held only @rollup/rollup-darwin-x64 and an
# @esbuild/darwin-x64 whose bin/ was empty, so `npm run build` failed under
# both CPUs. scripts/bootstrap-node.sh detects that state and points here.
# The bytes do not depend on the CPU: the same day, an arm64 out-of-tree build
# of HEAD reproduced the synced dist/ file for file, entry bundle identical.
#
# Inputs copied = check-deployed.mjs's BUILD_INPUTS plus the lockfile. The
# script refuses to run if that list changes without this one changing too.
set -euo pipefail

log() { echo "[build-out-of-tree] $*" >&2; }

copy_back=1
for arg in "$@"; do
  case "$arg" in
    --no-copy-back) copy_back=0 ;;
    *) log "Unknown argument: ${arg}"; exit 1 ;;
  esac
done

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
WORK="${ECYCLES_BUILD_DIR:-$HOME/.cache/ecycles-build}"

INPUTS=(src public index.html vite.config.js package.json)
expected='const BUILD_INPUTS = ["src", "public", "index.html", "vite.config.js", "package.json"];'
if ! grep -qxF "${expected}" "${REPO}/scripts/check-deployed.mjs"; then
  log "check-deployed.mjs no longer declares exactly: ${expected}"
  log "Update INPUTS and that expected line here to match it, then re-run."
  exit 2
fi

command -v npm >/dev/null 2>&1 || {
  log "npm is not on PATH. Run: BIN_DIR=\"\$(scripts/bootstrap-node.sh)\"; export PATH=\"\$BIN_DIR:\$PATH\""
  exit 2
}

case "${WORK}" in /*) ;; *) WORK="$(pwd)/${WORK}" ;; esac
# A work dir inside the repo, or anywhere iCloud syncs, recreates the problem.
# Checked BEFORE anything is created, against both the as-written and the
# symlink-resolved form of each synced root.
for synced in "${REPO}" "$HOME/Documents" "$HOME/Desktop" "$HOME/Library/Mobile Documents"; do
  for root in "${synced}" "$(cd "${synced}" 2>/dev/null && pwd -P || true)"; do
    [ -n "${root}" ] || continue
    case "${WORK}/" in
      "${root}"/*) log "Refusing work dir ${WORK}: it is inside ${root}. Set ECYCLES_BUILD_DIR elsewhere."; exit 2 ;;
    esac
  done
done
mkdir -p "${WORK}"

for p in "${INPUTS[@]}"; do
  if [ -d "${REPO}/${p}" ]; then
    rsync -a --delete "${REPO}/${p}/" "${WORK}/${p}/"
  else
    rsync -a "${REPO}/${p}" "${WORK}/${p}"
  fi
done
rsync -a "${REPO}/package-lock.json" "${WORK}/package-lock.json"

cpu="$(node -p 'process.platform + "-" + process.arch')"
stamp="$(cat "${REPO}/package.json" "${REPO}/package-lock.json" | shasum -a 256 | cut -d' ' -f1)-${cpu}"
if [ -d "${WORK}/node_modules" ] && [ "$(cat "${WORK}/.deps-stamp" 2>/dev/null || true)" = "${stamp}" ]; then
  log "Dependencies in ${WORK} already match this lockfile on ${cpu}."
else
  log "Installing dependencies in ${WORK} for ${cpu} (npm ci)..."
  (cd "${WORK}" && npm ci --no-audit --no-fund) >&2
  echo "${stamp}" > "${WORK}/.deps-stamp"
fi

(cd "${WORK}" && npm run build) >&2

if [ "${copy_back}" -eq 1 ]; then
  rsync -a --delete "${WORK}/dist/" "${REPO}/dist/"
  log "Mirrored ${WORK}/dist/ into ${REPO}/dist/."
  echo "${REPO}/dist"
else
  echo "${WORK}/dist"
fi
