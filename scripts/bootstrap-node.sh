#!/usr/bin/env bash
# Answers one question -- "which `bin` directory do I put on PATH to build
# this repo?" -- and answers it by MEASURING the machine rather than by
# assuming which machine it is on. If a system Node that Vite accepts is
# already installed, that one is used; otherwise a pinned, portable runtime
# is downloaded and cached. Never installs anything system-wide, never
# touches this repo.
#
# Usage:
#   BIN_DIR="$(scripts/bootstrap-node.sh)"
#   export PATH="$BIN_DIR:$PATH"
#   npm install && npm run build
#
# All progress/log output goes to stderr; the last line on stdout is
# always the directory to prepend to PATH. The download is cached under
# $NODE_CACHE_DIR (default: $HOME/.cache/ecycles-node) so repeat runs
# (including future scheduled agent runs) don't re-download.
#
# Pass --force-download (or set NODE_BOOTSTRAP_FORCE=1) to ignore a system
# Node and use the pinned one -- e.g. to reproduce a version-specific bug.
#
# WHY THE SYSTEM-NODE PREFERENCE EXISTS (2026-09-06): this script was written
# 2026-08-02 for an environment with no Node at all, and AGENT_LOG.md's
# Environment note asserted that fact in prose. Homebrew installed Node on
# 2026-08-22 and the prose stayed false for 15 days, sending every run to
# download a second, older runtime it did not need. A claim about the
# environment belongs in code that re-measures it, not in a note.
set -euo pipefail

NODE_VERSION="20.18.1"
CACHE_DIR="${NODE_CACHE_DIR:-$HOME/.cache/ecycles-node}"

log() { echo "[bootstrap-node] $*" >&2; }

force_download=0
for arg in "$@"; do
  case "$arg" in
    --force-download) force_download=1 ;;
    *) log "Unknown argument: ${arg}"; exit 1 ;;
  esac
done
if [ "${NODE_BOOTSTRAP_FORCE:-0}" = "1" ]; then
  force_download=1
fi

# Vite's own engine range, read from node_modules/vite/package.json when this
# was written: "^18.0.0 || ^20.0.0 || >=22.0.0". Node 19/21 etc. are odd-series
# releases Vite refuses, so accepting them here would only move the failure.
major_is_supported() {
  case "$1" in
    18|20) return 0 ;;
    ''|*[!0-9]*) return 1 ;;
    *) [ "$1" -ge 22 ] ;;
  esac
}

if [ "${force_download}" -eq 0 ]; then
  if system_node="$(command -v node 2>/dev/null)" \
    && system_npm="$(command -v npm 2>/dev/null)"; then
    system_version="$("${system_node}" --version 2>/dev/null || echo '')"
    system_major="${system_version#v}"
    system_major="${system_major%%.*}"
    if major_is_supported "${system_major}"; then
      system_bin="$(cd "$(dirname "${system_node}")" && pwd)"
      log "Using system Node ${system_version} at ${system_node} (npm: ${system_npm})"
      echo "${system_bin}"
      exit 0
    fi
    log "System Node ${system_version:-<unreadable>} is outside Vite's supported range; falling back to the pinned runtime."
  else
    log "No system node+npm on PATH; falling back to the pinned runtime."
  fi
else
  log "--force-download requested; ignoring any system Node."
fi

os="$(uname -s)"
arch="$(uname -m)"

case "$os" in
  Darwin) platform="darwin" ;;
  Linux) platform="linux" ;;
  *) log "Unsupported OS: $os"; exit 1 ;;
esac

case "$arch" in
  x86_64) node_arch="x64" ;;
  arm64|aarch64) node_arch="arm64" ;;
  *) log "Unsupported architecture: $arch"; exit 1 ;;
esac

dist_name="node-v${NODE_VERSION}-${platform}-${node_arch}"
install_dir="${CACHE_DIR}/${dist_name}"
bin_dir="${install_dir}/bin"

if [ -x "${bin_dir}/node" ]; then
  log "Using cached Node ${NODE_VERSION} at ${install_dir}"
else
  log "No cached Node ${NODE_VERSION} for ${platform}-${node_arch}; downloading..."
  mkdir -p "${CACHE_DIR}"
  tarball="${dist_name}.tar.gz"
  url="https://nodejs.org/dist/v${NODE_VERSION}/${tarball}"
  tmp_download="$(mktemp -d)"
  trap 'rm -rf "${tmp_download}"' EXIT

  curl -fsSL -o "${tmp_download}/${tarball}" "${url}"
  tar -xzf "${tmp_download}/${tarball}" -C "${tmp_download}"
  rm -rf "${install_dir}"
  mv "${tmp_download}/${dist_name}" "${install_dir}"
  log "Installed Node ${NODE_VERSION} to ${install_dir}"
fi

installed_version="$("${bin_dir}/node" --version)"
log "node ${installed_version} ready at ${bin_dir}"

echo "${bin_dir}"
