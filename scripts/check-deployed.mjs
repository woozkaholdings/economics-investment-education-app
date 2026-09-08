#!/usr/bin/env node
// Is the LIVE SITE serving this tree, or is it serving something older?
//
//   npm run check-deployed                 compare the live site to ./dist
//   npm run check-deployed -- --identify     also say WHICH commit is live,
//                                            and list what a learner is missing
//
// ⛔ NOT wired into `npm test`, deliberately — same reason as
// `scripts/check-analytics.mjs`: it makes a network call, so it is neither
// offline nor deterministic, and `npm test` must keep passing on a fresh clone
// with no network. This is a deploy-time and review-time instrument, not a
// build gate.
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS EXISTS.
//
// Until 2026-09-05 there was nowhere for a fix to go except `main`, so merging
// WAS shipping and every instrument in this repo could honestly certify the
// tree. On 2026-09-05 the app went live at a URL that is updated by hand, and
// that stopped being true — but nothing else changed. `npm test` (8 checks),
// `check-blindspot`, `check-claims`, `refresh-readiness` all still read the
// working tree, and NOT ONE OF THEM CAN SEE THE DEPLOYED ARTIFACT.
//
// So the app can be correct in the repo and wrong on the web indefinitely,
// with every check green while it happens. Measured 2026-09-06, that is not
// hypothetical: the live site was six commits behind `main` and was still
// teaching that a recession is when prices fall — a factual economics error
// fixed in the repo the day before. Five other learner-visible fixes were
// sitting behind it, including a screen-reader defect and 15 truncated quiz
// explanations.
//
// This same class had already bitten four days earlier — the og:image card
// shipped in the repo and shared links unfurled as text stubs for a day — and
// was fixed as an INCIDENT (that run redeployed) rather than as a class (it
// did not ask what would notice next time). Six commits later it recurred.
// This script is the answer to "what would notice next time".
//
// ═══════════════════════════════════════════════════════════════════════════
// WHAT IT COMPARES, AND WHY IT IS NOT JUST THE ENTRY BUNDLE.
//
// Vite content-hashes every file under assets/, so the ENTRY BUNDLE's filename
// is a fingerprint of the whole module graph: change any lesson, component or
// content module and its chunk is renamed, the entry that imports it changes,
// and its own hash changes with it. One filename comparison therefore covers
// all of `src/`.
//
// ⚠️ It does NOT cover `public/`. Those files are copied to the deploy root
// UNHASHED and are not imported by the entry bundle, so an entry-only check is
// blind to exactly the failure that opened this class: `og-card.png` landing in
// the repo while every shared link kept unfurling a stub. So the unhashed root
// files are compared by sha256 as well.
//
// ONE EXCEPTION, and it is deliberate: `data/market.json` is regenerated daily
// by the owner's scheduled job, so it diverges from any given build by design.
// Its age is REPORTED and never fails the verdict — a guard that goes red every
// day for an expected reason is a warning nobody reads, which is the failure
// mode this repo has already paid for once.
//
// ═══════════════════════════════════════════════════════════════════════════
// THE CONTROLS ARE THE LOAD-BEARING PART. READ BEFORE TRUSTING A PASS.
//
// A green result here means "the live site serves this tree". Four separate
// ways exist to get that green while measuring nothing, so each is checked
// first and each one REFUSES A VERDICT (exit 2) rather than passing:
//
//   1. A CATCH-ALL HOST. A nonexistent asset path must return 404. If a host,
//      proxy or captive portal answers 200 to everything, then a 200 for the
//      real bundle proves nothing. (This is the control the 2026-09-05 deploy
//      verification used by hand; it is automated here.)
//   2. A PAGE THAT IS NOT THE APP. A Netlify site with visitor access set to
//      Private serves a LOGIN PAGE with HTTP 200 — which passes control 1. So
//      the live HTML must actually contain a Vite-shaped module entry, or
//      there is nothing here to compare and the verdict is refused.
//   3. A STALE `dist/`. Comparing the live site to a `dist/` built three
//      commits ago compares two old things and calls them agreed. `dist/` must
//      be newer than every build input.
//   4. A DIRTY TREE. `dist/` built from uncommitted edits is not a build of
//      HEAD, so "the live site matches HEAD" would be unsupported either way.
//
// EXIT CODES  0 = live serves this tree · 1 = DIVERGED · 2 = no verdict.
//
// ⚠️ WHICH COMMIT IS DEPLOYED — this CAN be answered, and the paragraph here
// until 2026-09-06 said it could not. That paragraph was right that a built
// artifact carries no commit id and that nothing records the deploy, and right
// to refuse a deploy-time ledger (one more manual step in a procedure whose
// forgotten manual steps are the entire reason this file exists). It was wrong
// about the conclusion: Vite content-hashes the entry bundle, so the artifact
// is already a fingerprint of the tree that built it. `--identify` rebuilds
// recent commits until one reproduces the live bundle byte for byte. Nobody has
// to have written anything down.
//
// It was not an idle error. The weekly review of 2026-09-06 had to answer this
// question by hand, took the last deploy off a run-log headline, and named the
// wrong commit — reporting six undeployed commits when there were four, and
// listing as "still missing" a fix that was live. That is what a claim about
// the live site is worth when it is inferred from the repo instead of measured
// against the site.
// ═══════════════════════════════════════════════════════════════════════════

import {
  readFileSync,
  existsSync,
  statSync,
  readdirSync,
  mkdtempSync,
  symlinkSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const TIMEOUT_MS = 20000;

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1] ?? "";
};

const say = (s = "") => console.log(s);
const sha = (buf) => createHash("sha256").update(buf).digest("hex");

// Files under dist/ that ship unhashed and whose drift the entry bundle cannot
// see. Value is null for "compare bytes exactly", or a note for the exemption.
const MARKET_DATA = "data/market.json";

function noVerdict(lines) {
  say();
  say("  ⛔ NO VERDICT — the instrument cannot support a result either way.");
  for (const l of lines) say(`     ${l}`);
  process.exit(2);
}

async function get(url, { method = "GET" } = {}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method, signal: ac.signal, redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, buf, url: res.url };
  } catch (err) {
    return {
      status: null,
      error: err?.name === "AbortError" ? `timed out after ${TIMEOUT_MS}ms` : String(err?.message || err),
    };
  } finally {
    clearTimeout(timer);
  }
}

// ── ONE DEFINITION OF THE ORIGIN ─────────────────────────────────────────────
// README.md's "## Deploying" section, exactly as check-data.mjs §38 reads it.
// A literal typed here would be a third copy of the host name, and the symptom
// of drift would be this script confidently checking a site nobody is using.
const readme = readFileSync(join(ROOT, "README.md"), "utf8");
const deploySection = readme.split(/^## /m).find((s) => s.startsWith("Deploying"));
const liveUrl = deploySection?.match(/<(https:\/\/[^>\s]+)>/)?.[1];
if (!liveUrl) {
  noVerdict([
    'README.md\'s "## Deploying" section names no <https://…> URL, so there is no',
    "live site to compare against. That section is the single definition of this",
    "site's origin (check-data.mjs §38 asserts index.html against it too).",
  ]);
}
const origin = liveUrl.replace(/\/+$/, "");

say(`check-deployed — ${origin}`);
say();

// ── CONTROL 3 & 4: is dist/ a fresh build of a clean HEAD? ───────────────────
if (!existsSync(join(DIST, "index.html"))) {
  noVerdict(["dist/index.html does not exist. Run `npm run build` first."]);
}

// ⚠️ Deliberately conservative. `package.json` is a build input because a
// dependency bump is one — which also means editing an npm SCRIPT trips the
// staleness check even though it cannot change a single byte of the bundle.
// That is the intended direction of the error: it costs a one-second rebuild,
// and the alternative (guessing which package.json edits matter) risks
// comparing the live site against a build that predates a real change.
const BUILD_INPUTS = ["src", "public", "index.html", "vite.config.js", "package.json"];
function newestMtime(p, acc = { ms: 0, file: null }) {
  const abs = join(ROOT, p);
  if (!existsSync(abs)) return acc;
  const st = statSync(abs);
  if (st.isDirectory()) {
    for (const e of readdirSync(abs)) newestMtime(join(p, e), acc);
  } else if (st.mtimeMs > acc.ms) {
    acc.ms = st.mtimeMs;
    acc.file = p;
  }
  return acc;
}
const newestInput = BUILD_INPUTS.reduce((acc, p) => newestMtime(p, acc), { ms: 0, file: null });
const distMs = statSync(join(DIST, "index.html")).mtimeMs;
if (newestInput.ms > distMs) {
  noVerdict([
    `dist/ is STALE: ${newestInput.file} is newer than dist/index.html`,
    `(${new Date(newestInput.ms).toISOString()} vs ${new Date(distMs).toISOString()}).`,
    "Comparing the live site to an old build compares two old things and calls",
    "them agreed. Run `npm run build` and re-run this check.",
  ]);
}

let dirty = "";
try {
  dirty = execFileSync("git", ["status", "--porcelain", "--", ...BUILD_INPUTS], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
} catch {
  dirty = "";
}
if (dirty) {
  noVerdict([
    "Build inputs have uncommitted changes, so dist/ is not a build of HEAD and",
    '"the live site matches HEAD" cannot be supported in either direction:',
    ...dirty.split("\n").slice(0, 6).map((l) => `  ${l}`),
  ]);
}

const head = execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
say(`  dist/ is a clean build of HEAD (${head}).`);
say();

// ── CONTROL 1: a nonexistent path must 404 ───────────────────────────────────
const controlPath = "/assets/index-checkDeployedControl000.js";
say(`  control  → GET ${controlPath}`);
say("             a path that cannot exist, which MUST return 404");
const control = await get(`${origin}${controlPath}`);
if (control.status === null) {
  noVerdict([
    `The control request failed: ${control.error}`,
    "No network, no verdict. Nothing below would mean anything.",
  ]);
}
if (control.status !== 404) {
  noVerdict([
    `The control returned HTTP ${control.status}, expected 404.`,
    "Something is answering for paths that do not exist — a catch-all host, a",
    "proxy, or a captive portal. A 200 for the real bundle would prove nothing.",
  ]);
}
say("             ✓ HTTP 404 — 200s below are real files");
say();

// How a Vite build names itself in the served HTML. Declared here rather than
// beside its first use below, because the retired-origin probe that follows
// needs the same test: "is what is answering actually this app?"
const ENTRY_RE = /<script[^>]+type="module"[^>]+src="\.?\/?(assets\/index-[A-Za-z0-9_-]+\.js)"/;

// ── RETIRED ORIGINS: a host we walked away from must actually be gone ────────
//
// Every check in this repo points at ONE origin — the canonical URL in
// README.md § Deploying — which is the right single definition and is also a
// blind spot with a shape: the moment the project moves hosts, the OLD host
// stops being watched by anything, while a copy of the app keeps answering on
// it. "Retired" is a decision; it is not a measurement.
//
// Measured 2026-09-07, the day after the Netlify → GitHub Pages move: the
// canonical origin returned 404 and the retired one returned 200 with a real
// Vite bundle (`index-B1mndoLB.js`, a day old). The two authoritative docs had
// already split — README.md described Netlify in the past tense while
// LAUNCH_PLAN.md §10.10 still said the app is live there, and LAUNCH_PLAN.md
// was the one telling the truth. The learner-visible failure this exists to
// catch: a reader follows the canonical link and gets a 404, while the only
// copy of the app that answers is one the project believes it deleted, serving
// a build that is out of date and that nothing in this repo can see.
//
// Origins are declared in README.md, not here, for the same reason the
// canonical one is: a literal typed into a script is a second copy of a host
// name, and the symptom of drift is a check confidently watching nothing.
// Marker, one per line, anywhere in the file:
//
//     <!-- retired-origin: https://example.example.app — why it was retired -->
//
// The reason is required. A bare URL is a claim with no author.
// Parsed in two steps on purpose. A single regex that REQUIRES the em dash
// would silently skip a marker whose reason is missing — the one malformed
// marker most likely to be written — and a check that ignores what it cannot
// parse is a check that passes for the wrong reason.
const RETIRED_RE = /<!--\s*retired-origin:\s*([^]*?)-->/g;
const retired = [...readme.matchAll(RETIRED_RE)].map((m) => {
  const [url, ...rest] = m[1].split("—");
  return {
    origin: url.trim().replace(/\/+$/, ""),
    reason: rest.join("—").trim().replace(/\s+/g, " "),
  };
});
const retiredServing = [];
if (retired.length) {
  say(`  retired  → ${retired.length} origin(s) declared in README.md must no longer serve this app`);
  for (const r of retired) {
    if (!/^https:\/\/[^\s/]+$/.test(r.origin)) {
      say(`             ⚠ "${r.origin}" is not an origin (expected https://host, no path).`);
      say("               Marker: <!-- retired-origin: https://host — why it was retired -->");
      continue;
    }
    if (!r.reason) {
      say(`             ⚠ ${r.origin} — marker gives no reason; add one after the em dash`);
    }
    const root = await get(`${r.origin}/`);
    if (root.status === null) {
      say(`             ✓ ${r.origin} does not answer (${root.error})`);
      continue;
    }
    if (root.status !== 200) {
      say(`             ✓ ${r.origin} returns HTTP ${root.status}`);
      continue;
    }
    // It answers 200. That means nothing until a path which cannot exist is
    // shown to 404 — a parked domain, a proxy or a captive portal answers 200
    // to everything, and would otherwise be read as "still serving the app".
    const ctl = await get(`${r.origin}${controlPath}`);
    if (ctl.status !== 404) {
      say(`             ⚠ ${r.origin} answers HTTP 200, but so does a path that cannot`);
      say(`               exist (control: HTTP ${ctl.status ?? ctl.error}). No verdict for this origin.`);
      continue;
    }
    const entry = root.buf.toString("utf8").match(ENTRY_RE)?.[1];
    if (!entry) {
      say(`             ⚠ ${r.origin} answers HTTP 200 with ${root.buf.length} bytes that carry no`);
      say("               Vite entry bundle — something is there, but it is not this app.");
      continue;
    }
    say(`             ✗ ${r.origin} is STILL SERVING this app (${entry})`);
    retiredServing.push(`${r.origin} is declared retired in README.md (${r.reason}) and is still serving the app (${entry}).`);
  }
  say();
}

// ── Fetch the live document, then CONTROL 2 ──────────────────────────────────
say(`  live     → GET ${origin}/`);
const liveDoc = await get(`${origin}/`);
if (liveDoc.status === null) noVerdict([`Could not fetch the site root: ${liveDoc.error}`]);
if (liveDoc.status !== 200) noVerdict([`The site root returned HTTP ${liveDoc.status}, not 200.`]);
const liveHtml = liveDoc.buf.toString("utf8");

const liveEntry = liveHtml.match(ENTRY_RE)?.[1];
if (!liveEntry) {
  noVerdict([
    "The live document carries no Vite module entry (assets/index-<hash>.js), so",
    "there is nothing here to compare. The likely cause is that it is not the app:",
    "a Netlify site whose visitor access is Private serves a LOGIN page with HTTP",
    "200, which passes the 404 control above. Check Project configuration ›",
    `General › Visitor access. Served ${liveDoc.buf.length} bytes from ${liveDoc.url}.`,
  ]);
}
const localHtml = readFileSync(join(DIST, "index.html"), "utf8");
const localEntry = localHtml.match(ENTRY_RE)?.[1];
if (!localEntry) {
  noVerdict([
    "dist/index.html carries no Vite module entry either, so the extraction this",
    "check depends on no longer matches what the build emits. Fix ENTRY_RE.",
  ]);
}
say(`             ✓ entry bundle referenced: ${liveEntry}`);
say();

// ── THE VERDICT: app code ────────────────────────────────────────────────────
const problems = [];
say("  ── app code ──────────────────────────────────────────────────────────");
say(`     live  ${liveEntry}`);
say(`     local ${localEntry}`);

// Fetched once and kept: `--identify` below compares candidate builds against
// these exact bytes, so a name match is never taken for a content match.
const liveBytes = await get(`${origin}/${liveEntry}`);
const liveEntryBuf = liveBytes.status === 200 ? liveBytes.buf : null;

if (liveEntry !== localEntry) {
  const localBytes = readFileSync(join(DIST, localEntry));
  const sizes =
    liveBytes.status === 200
      ? `${liveBytes.buf.length} b live vs ${localBytes.length} b local`
      : `local ${localBytes.length} b`;
  say(`     ✗ DIFFERENT (${sizes})`);
  problems.push(
    "The deployed bundle is not built from this tree. Vite content-hashes the " +
      "entry, so a different name is proof — not an inference — that the live " +
      "site is serving different code from `src/`.",
  );
} else {
  if (liveBytes.status !== 200) {
    problems.push(`The entry bundle is referenced but returns HTTP ${liveBytes.status}.`);
    say(`     ✗ referenced but returns HTTP ${liveBytes.status}`);
  } else {
    const localBytes = readFileSync(join(DIST, localEntry));
    if (sha(liveBytes.buf) !== sha(localBytes)) {
      say("     ✗ same name, DIFFERENT BYTES — a filename collision or a mangling proxy");
      problems.push("The entry bundle has the expected name but different bytes.");
    } else {
      say(`     ✓ byte-identical (${localBytes.length} b, sha256 ${sha(localBytes).slice(0, 12)}…)`);
    }
  }
}
say();

// ── THE VERDICT: unhashed root files, which the entry bundle cannot see ──────
say("  ── unhashed files (public/) ──────────────────────────────────────────");
const unhashed = [];
(function walk(rel) {
  for (const e of readdirSync(join(DIST, rel || "."))) {
    const r = rel ? `${rel}/${e}` : e;
    if (r === "assets") continue;
    const st = statSync(join(DIST, r));
    if (st.isDirectory()) walk(r);
    else if (r !== "index.html") unhashed.push(r);
  }
})("");

for (const rel of unhashed.sort()) {
  const local = readFileSync(join(DIST, rel));
  const res = await get(`${origin}/${rel}`);
  if (res.status === null) {
    say(`     ? ${rel} — ${res.error}`);
    problems.push(`${rel} could not be fetched.`);
    continue;
  }
  if (rel === MARKET_DATA) {
    // Reported, never fatal. See this file's header: the owner's daily job
    // rewrites this, so it diverges from any given build BY DESIGN.
    let note = `HTTP ${res.status}`;
    try {
      const asOf = JSON.parse(res.buf.toString("utf8")).asOf;
      const localAsOf = JSON.parse(local.toString("utf8")).asOf;
      note = `live asOf ${asOf}, repo asOf ${localAsOf}`;
    } catch {}
    say(`     · ${rel} — ${note} (not part of the verdict: regenerated daily)`);
    continue;
  }
  if (res.status !== 200) {
    say(`     ✗ ${rel} — HTTP ${res.status}, but it is in this build`);
    problems.push(`${rel} is in dist/ and returns HTTP ${res.status} live.`);
  } else if (sha(res.buf) !== sha(local)) {
    say(`     ✗ ${rel} — DIFFERENT (${res.buf.length} b live vs ${local.length} b local)`);
    problems.push(`${rel} differs from this build. Unhashed files are invisible to the entry-bundle check — this is the og-card.png class.`);
  } else {
    say(`     ✓ ${rel} — byte-identical (${local.length} b)`);
  }
}

// index.html, modulo the tags the host injects. ⚠️ Netlify was retired
// 2026-09-07 and GitHub Pages injects NOTHING, so the two filters below
// now match nothing and the comparison is effectively exact. They are kept
// rather than deleted because they cost one pass and would have to be
// rewritten from scratch for the next host that does inject; if they ever
// start stripping something again, the host has changed.
// index.html, modulo the tags the host injects. README § Deploying documents
// exactly what those are for Netlify: one HTML comment and two <meta> tags.
//
// ⚠️ The comment SPANS THREE LINES. The first version of this filter matched
// `<!-- .*netlify.* -->` per line and therefore stripped only the two <meta>
// tags, leaving three comment lines behind and reporting a divergence in
// index.html that was not one. That is a false positive on the one file whose
// drift this check exists to notice, so it is stripped as a BLOCK below and the
// completeness of the strip is proved by a control (`--self-test`) rather than
// asserted. A filter that under-strips turns this guard into a warning nobody
// reads, which is the failure mode the whole file is written against.
const stripInjected = (s) =>
  s
    .replace(/<!--[\s\S]*?-->/g, (c) => (/netlify/i.test(c) ? "" : c))
    .split("\n")
    .filter((l) => !/<meta[^>]+name="(hosting-provider|netlify-deploy)"/.test(l))
    .filter((l) => l.trim() !== "")
    .join("\n")
    .trim();
// ── POSITIVE CONTROL for the strip above (`--self-test`) ─────────────────────
// The negative direction of this whole script is easy to prove: it is red right
// now. The direction that is NOT free is that it can go GREEN — that
// stripInjected() accounts for every difference a healthy deploy produces, so a
// future in-sync deploy will not be reported as diverged.
//
// It is provable today anyway, without waiting for a deploy: neutralize the ONE
// difference that is genuine (the content-hashed entry name, which the app-code
// check above owns) and the two documents must then be identical. If they are,
// every remaining byte of difference was injected hosting metadata and the
// strip is complete. If they are not, the first unaccounted line is printed —
// that line is the false positive this check would have reported.
if (argv.includes("--self-test")) {
  const a = stripInjected(liveHtml);
  const b = stripInjected(localHtml).split(localEntry).join(liveEntry);
  say("  ── self-test: is the injected-tag strip complete? ────────────────────");
  if (a === b) {
    say("     ✓ With the entry hash neutralized, live and local index.html are");
    say("       identical. Every other difference was injected hosting metadata,");
    say("       so an in-sync deploy will compare clean here.");
    process.exit(0);
  }
  const al = a.split("\n");
  const bl = b.split("\n");
  const i = al.findIndex((l, n) => l !== bl[n]);
  say("     ✗ Unaccounted difference — this is a FALSE POSITIVE this check would");
  say("       report against a healthy deploy. First differing line:");
  say(`         live  ${JSON.stringify(al[i] ?? "(end of file)")}`);
  say(`         local ${JSON.stringify(bl[i] ?? "(end of file)")}`);
  process.exit(2);
}

const htmlSame = stripInjected(liveHtml) === stripInjected(localHtml);
say(
  htmlSame
    ? "     ✓ index.html — identical apart from Netlify's injected tags"
    : `     ✗ index.html — differs beyond Netlify's injected tags (${liveHtml.length} b live vs ${localHtml.length} b local)`,
);
if (!htmlSame) {
  problems.push(
    "index.html differs beyond the injected hosting tags — this is where the " +
      "link-preview meta lives, and a stub unfurl is invisible from inside the repo.",
  );
}
say();

// ── WHICH COMMIT IS DEPLOYED (--identify) ────────────────────────────────────
// A built artifact carries no commit id and nothing records the deploy — but it
// does not have to. Vite content-hashes the entry bundle, so the artifact IS a
// fingerprint of the tree that produced it: rebuild candidate commits until one
// reproduces the live bundle BYTE FOR BYTE, and the deployed commit is known
// without anyone having written it down. Opt-in because it costs one build per
// candidate (~1s each).
//
// ⚠️ It matches on bytes, never on the filename. A name match with different
// content is exactly the collision the main check already guards against.
//
// ⚠️ It rebuilds old trees with TODAY's node_modules. If a candidate's
// dependencies differ from what is installed now, its bundle will not reproduce
// and it will be skipped — a silent miss, which is why a failed identification
// says "not identified", never "not deployed".
async function identifyDeployedCommit(liveBuf, localEntryName, limit) {
  if (!liveBuf) {
    say("  (--identify needs the live entry bundle, which did not download.)");
    return null;
  }
  const viteBin = join(ROOT, "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(viteBin)) {
    say("  (--identify needs vite installed; run `npm install`.)");
    return null;
  }

  const shas = execFileSync("git", ["log", "--format=%h", `-${limit}`], {
    cwd: ROOT,
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean);

  // Build one commit into a throwaway tree and return its entry bundle.
  const buildAt = (rev) => {
    const dir = mkdtempSync(join(tmpdir(), "check-deployed-"));
    try {
      // `set -o pipefail` is load-bearing: without it bash reports the exit
      // status of `tar`, and `tar -x` reading a failed `git archive`'s empty
      // stdout exits 0. Measured 2026-09-07: a bad rev gives `fatal: not a
      // valid object name` on stderr, an empty directory, and **exit 0** —
      // so the build below would fail instead, blaming the commit for a
      // failure that was actually this line's.
      execFileSync(
        "bash",
        ["-c", `set -o pipefail; git archive ${rev} | tar -x -C "${dir}"`],
        { cwd: ROOT },
      );
      symlinkSync(join(ROOT, "node_modules"), join(dir, "node_modules"));
      execFileSync(process.execPath, [viteBin, "build"], { cwd: dir, stdio: "ignore" });
      const html = readFileSync(join(dir, "dist", "index.html"), "utf8");
      const name = html.match(ENTRY_RE)?.[1];
      return name ? { name, buf: readFileSync(join(dir, "dist", name)) } : null;
    } catch {
      return null;
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };

  say(`  ── which commit is live? (--identify, up to ${shas.length} candidates) ──`);

  // CONTROL. Rebuilding HEAD in a throwaway tree must reproduce the dist/ built
  // here by `npm run build`. If it does not, this probe cannot recognize ANY
  // commit, and a run of misses would read exactly like "the deploy is ancient".
  const headProbe = buildAt(shas[0]);
  if (!headProbe || headProbe.name !== localEntryName) {
    say(`     ⛔ control FAILED — rebuilding HEAD gave ${headProbe?.name ?? "no build"},`);
    say(`        but dist/ here is ${localEntryName}. The probe cannot recognize a`);
    say("        commit it just built, so a miss below would mean nothing. Not run.");
    return null;
  }
  say(`     ✓ control: a rebuild of HEAD reproduces dist/ (${localEntryName})`);

  for (let i = 0; i < shas.length; i++) {
    const rev = shas[i];
    const built = i === 0 ? headProbe : buildAt(rev);
    if (built && built.buf.equals(liveBuf)) {
      const meta = execFileSync(
        "git",
        ["log", "-1", "--format=%h %ad %s", "--date=format:%Y-%m-%d %H:%M", rev],
        { cwd: ROOT, encoding: "utf8" },
      ).trim();
      say(`     ✓ IDENTIFIED after ${i + 1} probe(s), byte-identical:`);
      say(`       ${meta}`);
      say();
      return rev;
    }
  }
  say(`     ✗ not identified in the last ${shas.length} commits. The deploy may be`);
  say("       older, built from a dirty tree, or built against different deps.");
  say();
  return null;
}

// ── Verdict ──────────────────────────────────────────────────────────────────
if (problems.length === 0 && retiredServing.length === 0) {
  say(`  ✅ The live site is serving this tree (HEAD ${head}).`);
  process.exit(0);
}

// A retired origin that is still up is a separate failure from a canonical
// origin that is behind, and collapsing the two would print "DIVERGED — the
// live site is NOT serving this tree" about a site that is.
if (problems.length === 0) {
  say(`  ⚠️  The canonical site is serving this tree (HEAD ${head}), but a host this`);
  say("     repo has declared RETIRED is still answering with a copy of the app:");
  say();
  for (const r of retiredServing) say(`     • ${r}`);
  say();
  say("  Retiring a host is an action on that host, not a sentence in a document.");
  say("  Until the old site is deleted or unpublished, two versions of this app are");
  say("  reachable, only one of them is watched, and links already shared point at");
  say("  the unwatched one. Delete it, or drop the marker from README.md and say");
  say("  there why it is deliberately being left up.");
  process.exit(1);
}

say("  ❌ DIVERGED — the live site is NOT serving this tree.");
say();
for (const p of problems) say(`     • ${p}`);
for (const r of retiredServing) say(`     • ${r}`);
say();

// What is a learner missing? That needs the last DEPLOYED commit. `--since`
// takes it on trust; `--identify` derives it from the artifact and is the
// reason this no longer has to be supplied by hand.
let since = flag("since");
if (argv.includes("--identify")) {
  const n = Number(flag("limit")) || 40;
  const found = await identifyDeployedCommit(liveEntryBuf, localEntry, n);
  if (found) since = found;
}

if (since) {
  try {
    const log = execFileSync(
      "git",
      ["log", "--oneline", `${since}..HEAD`, "--", "src/", "public/", "index.html"],
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
    const lines = log.split("\n").filter(Boolean);
    say(`  ${lines.length} commit(s) touching build inputs since ${since} —`);
    say("  this is what a learner is not getting:");
    for (const l of lines) say(`     ${l}`);
    say();
  } catch {
    say(`  (--since ${since} is not a commit this repo knows.)`);
    say();
  }
}

say("  To fix: push to `main` — .github/workflows/deploy-pages.yml builds and");
say("  publishes (README.md § Deploying › To publish an update). Re-run this");
say("  check after the workflow finishes: a green Actions run says the job ran,");
say("  not that the site serves this tree, which is what this check measures.");
if (!since) {
  say();
  say("  `--identify` rebuilds recent commits until one reproduces the live bundle");
  say("  byte for byte, then lists exactly what a learner is missing. Nothing has");
  say("  to have recorded the deploy — the artifact identifies itself.");
}
process.exit(1);
