#!/usr/bin/env node
// Byte-exact fingerprint of the working tree's deviation from HEAD.
//
// Ten consecutive dev-agent runs (2026-08-18) each hand-rolled the same first
// question — "has the owner's uncommitted work moved since the last run?" — and
// each answered it with `git diff --shortstat`. That is not an answer: a
// shortstat can coincide across genuinely different trees, a point the eighth
// run of that date already flagged in AGENT_LOG.md. This makes the check exact
// and one command.
//
//   node scripts/owner-tree.mjs                 print the fingerprint
//   node scripts/owner-tree.mjs --expect <hash> exit 0 if unmoved, 1 if moved
//
// FAILS LOUDLY rather than returning a clean-looking hash of nothing. The first
// attempt at this check by hand did exactly that: `git status --porcelain`
// quotes paths containing spaces or non-ASCII bytes, a naive `sed 's/^?? //'`
// leaves the quotes attached, every `shasum` then fails on a filename that does
// not exist, and the pipeline still emits a confident 64-hex digest — of an
// empty stream. Hence `-z`, and hence the unreadable-file hard error below.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const git = (args, enc = 'utf8') =>
  execFileSync('git', args, { encoding: enc, maxBuffer: 1024 * 1024 * 256 });

// Not a git repository (e.g. a `git archive HEAD` control copy) — say so plainly
// rather than dying in a stack trace that looks like a bug in the check itself.
try {
  execFileSync('git', ['rev-parse', '--git-dir'], { stdio: 'ignore' });
} catch {
  console.error(
    'owner-tree: not a git repository (or git is unavailable) — there is no ' +
      'working tree to fingerprint here. Run this from the repo, not from a ' +
      '`git archive` control copy.',
  );
  process.exit(2);
}

// Tracked modifications, as a patch. `--no-ext-diff`/`--no-color` so a user's
// diff config cannot move the fingerprint without the tree moving.
const patch = git(['--no-pager', 'diff', '--no-ext-diff', '--no-color', 'HEAD'], 'buffer');

// Untracked files, NUL-separated so quoting never enters the picture.
const entries = git(['status', '--porcelain', '-z', '-uall'], 'buffer')
  .toString('binary')
  .split('\0')
  .filter(Boolean);
const untracked = entries
  .filter((e) => e.startsWith('?? '))
  .map((e) => Buffer.from(e.slice(3), 'binary'))
  .sort(Buffer.compare);

const h = createHash('sha256');
h.update(patch);
const unreadable = [];
for (const p of untracked) {
  try {
    h.update(p);
    h.update(createHash('sha256').update(readFileSync(p)).digest());
  } catch (err) {
    unreadable.push(`${p.toString()}: ${err.code ?? err.message}`);
  }
}
if (unreadable.length) {
  console.error(
    `owner-tree: cannot read ${unreadable.length} untracked file(s); refusing to ` +
      `print a fingerprint that would silently omit them:\n  ` +
      unreadable.join('\n  '),
  );
  process.exit(2);
}

const fingerprint = h.digest('hex');
const trackedCount = patch.length
  ? git(['--no-pager', 'diff', '--no-ext-diff', '--name-only', 'HEAD']).trim().split('\n').length
  : 0;
const clean = trackedCount === 0 && untracked.length === 0;
const summary = clean
  ? 'tree is CLEAN'
  : `${trackedCount} tracked modified, ${untracked.length} untracked`;

const expectIdx = process.argv.indexOf('--expect');
if (expectIdx !== -1) {
  const expected = (process.argv[expectIdx + 1] ?? '').trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(expected)) {
    console.error('owner-tree: --expect needs a 64-hex sha256');
    process.exit(2);
  }
  if (expected === fingerprint) {
    console.log(`UNMOVED  ${fingerprint}  (${summary})`);
    process.exit(0);
  }
  console.log(`MOVED    ${fingerprint}  (${summary})`);
  console.log(`expected ${expected}`);
  process.exit(1);
}

console.log(`OWNER-TREE ${fingerprint}  (${summary})`);
