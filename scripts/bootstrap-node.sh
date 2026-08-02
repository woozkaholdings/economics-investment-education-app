#!/usr/bin/env bash
# Fetches (and caches) a pinned, portable Node.js runtime for local build
# verification in sandboxed execution environments that have no system
# Node/npm in PATH. Never installs anything system-wide and never touches
# this repo.
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
set -euo pipefail

NODE_VERSION="20.18.1"
CACHE_DIR="${NODE_CACHE_DIR:-$HOME/.cache/ecycles-node}"

log() { echo "[bootstrap-node] $*" >&2; }

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
