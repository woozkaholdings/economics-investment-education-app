#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════
# CLEAN-TREE CHECK — run `npm test` against a pristine copy of the repo.
#
# WHY THIS IS A SCRIPT AND NOT A PARAGRAPH. `npm test` runs against the
# WORKING tree, so while the owner has an in-flight change the suite can be
# red for reasons that have nothing to do with your edit, and you cannot tell
# the two apart by reading the failure. The control is a pristine copy of a
# committed tree. That recipe lived in AGENT_LOG.md's Environment note as five
# lines of prose for six weeks and was WRONG TWICE:
#
#   * it carried a `cp economic-cycles-v*.jsx` step that had been deleted from
#     one copy of the recipe and not the other, and that step is the only
#     known way to make this suite fail on a clean tree (it makes six
#     `path-ok` markers in check-data.mjs §26 resolve, so all six report
#     "stale — that path exists now" and the exemption count lands at 13
#     against an expected 20);
#   * and after that was fixed, the surviving block still did not run: it
#     used `$SCRATCH`, which nothing defines, and `tar -x -C` does not create
#     its destination.
#
# Both were found by executing the prose, not by reading it. Prose cannot
# drift from what runs if there is no prose — so this file IS the recipe now,
# and the Environment note points here.
#
# ⛔ NEVER copy an untracked file into the copy. §26's exemptions exist
# *because* a clone does not have those paths; putting them back falsifies
# every marker at once. That is the whole failure above.
#
# USAGE
#   npm run clean-tree                  # git archive HEAD (§26's filesystem fallback)
#   npm run clean-tree -- --clone       # real git clone   (§26's primary git-index path)
#   npm run clean-tree -- --ref <sha>   # any commit-ish, or with archive any tree-ish
#
# The two modes are not interchangeable and both are worth having: an archive
# copy is NOT a git repo, so §26 falls back to walking the filesystem there,
# while a clone exercises the index path the owner's tree uses. A green
# archive run is evidence about the fallback only.
#
# EXIT STATUS is `npm test`'s, unpiped and unfiltered. On success the copy is
# deleted; on failure it is KEPT and its path printed, so the failure can be
# read where it happened.
# ═══════════════════════════════════════════════════════════════════════════
set -euo pipefail

MODE=archive
REF=HEAD
while [ $# -gt 0 ]; do
  case "$1" in
    --clone)   MODE=clone ;;
    --archive) MODE=archive ;;
    --ref)     REF="${2:?--ref needs a commit-ish}"; shift ;;
    -h|--help) sed -n '/^# USAGE/,/^#   npm run clean-tree -- --ref/p' "$0" | sed 's/^# \{0,2\}//'; exit 0 ;;
    *)         echo "clean-tree: unknown argument '$1'" >&2; exit 2 ;;
  esac
  shift
done

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

# The symlink below is load-bearing and was itself found by a control failing
# rather than by reading imports: check-data.mjs reaches src/lib/deepLink.js,
# which imports react, so a copy without node_modules dies with
# ERR_MODULE_NOT_FOUND. The scripts are not dependency-free.
[ -d "$REPO/node_modules" ] || { echo "clean-tree: $REPO/node_modules is missing — run npm install first" >&2; exit 2; }

# `git clone` can only check out a COMMIT, so a bare tree-ish — the shape a
# negative control uses, since it can be built with `git write-tree` without
# touching a single ref — is archive-only. Checked here so the error names the
# other mode instead of arriving from git as "Cannot switch branch to a
# non-commit".
if [ "$MODE" = clone ] && ! git rev-parse -q --verify "$REF^{commit}" >/dev/null 2>&1; then
  echo "clean-tree: --clone needs a commit-ish; '$REF' is not one. Use the default archive mode for a tree-ish." >&2
  exit 2
fi

DEST="$(mktemp -d "${TMPDIR:-/tmp}/clean-tree.XXXXXX")"
# The copy is removed on EVERY exit path except a suite that actually ran and
# failed — including the ones `set -e` takes, which is how the first version
# left a directory behind when `--clone --ref <tree>` aborted mid-setup.
KEEP=0
cleanup() { [ "$KEEP" = 1 ] || rm -rf "$DEST"; }
trap cleanup EXIT

if [ "$MODE" = clone ]; then
  git clone -q "$REPO" "$DEST/tree"
  git -C "$DEST/tree" checkout -q "$REF"
else
  mkdir -p "$DEST/tree"                       # tar -x -C does NOT create it
  git archive "$REF" | tar -x -C "$DEST/tree"
fi

# A symlink, never `cp -R`: copying node_modules is slow enough to time out.
ln -sfn "$REPO/node_modules" "$DEST/tree/node_modules"

echo "clean-tree: mode=$MODE ref=$REF dir=$DEST/tree"
echo

set +e
( cd "$DEST/tree" && npm test )
STATUS=$?
set -e

echo
if [ "$STATUS" -eq 0 ]; then
  echo "clean-tree: PASS (mode=$MODE ref=$REF) — copy removed."
else
  KEEP=1
  echo "clean-tree: FAIL exit=$STATUS (mode=$MODE ref=$REF) — copy KEPT at $DEST/tree"
fi
exit "$STATUS"
