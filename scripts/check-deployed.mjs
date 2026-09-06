#!/usr/bin/env node
// Is the LIVE SITE serving this tree, or is it serving something older?
//
//   npm run check-deployed                 compare the live site to ./dist
//   npm run check-deployed -- --since 5d6893c   also list what is undeployed
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
// ⚠️ ONE THING THIS CANNOT DO, stated so nobody looks for it. It cannot tell
// you WHICH commit is deployed. A built artifact carries no commit id, and
// nothing records the deploy. `--since <ref>` will list what is undeployed if
// you can supply the last deployed commit yourself, but the script cannot
// discover it. Recording it at deploy time was considered and left out: it
// would be one more manual step in a procedure whose manual steps being
// forgotten is the entire reason this file exists.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
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

// ── Fetch the live document, then CONTROL 2 ──────────────────────────────────
say(`  live     → GET ${origin}/`);
const liveDoc = await get(`${origin}/`);
if (liveDoc.status === null) noVerdict([`Could not fetch the site root: ${liveDoc.error}`]);
if (liveDoc.status !== 200) noVerdict([`The site root returned HTTP ${liveDoc.status}, not 200.`]);
const liveHtml = liveDoc.buf.toString("utf8");

const ENTRY_RE = /<script[^>]+type="module"[^>]+src="\.?\/?(assets\/index-[A-Za-z0-9_-]+\.js)"/;
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

if (liveEntry !== localEntry) {
  const liveBytes = await get(`${origin}/${liveEntry}`);
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
  const liveBytes = await get(`${origin}/${liveEntry}`);
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

// ── Verdict ──────────────────────────────────────────────────────────────────
if (problems.length === 0) {
  say(`  ✅ The live site is serving this tree (HEAD ${head}).`);
  process.exit(0);
}

say("  ❌ DIVERGED — the live site is NOT serving this tree.");
say();
for (const p of problems) say(`     • ${p}`);
say();

const since = flag("since");
if (since) {
  try {
    const log = execFileSync(
      "git",
      ["log", "--oneline", `${since}..HEAD`, "--", "src/", "public/", "index.html"],
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
    say(`  Commits touching build inputs since ${since}:`);
    for (const l of log.split("\n").filter(Boolean)) say(`     ${l}`);
    say();
  } catch {
    say(`  (--since ${since} is not a commit this repo knows.)`);
    say();
  }
}

say("  To fix: `npm run build`, then drag dist/ onto the project's Deploys page");
say("  in Netlify (README.md § Deploying › To publish an update). Re-run this");
say("  check afterwards — it is the verification step, not a substitute for one.");
if (!since) {
  say();
  say("  `--since <last deployed commit>` lists what a learner is missing, if you");
  say("  know it. Nothing records the deploy, so this script cannot find it out.");
}
process.exit(1);
