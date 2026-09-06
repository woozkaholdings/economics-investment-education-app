#!/usr/bin/env node
// Publish dist/ to the live site, and then PROVE it landed.
//
//   npm run deploy              build inputs must be committed and dist/ fresh
//   npm run deploy -- --dry-run everything except the upload (no token needed)
//
// ═══════════════════════════════════════════════════════════════════════════
// WHY THIS EXISTS.
//
// Owner decision 2026-09-06: automate the deploy. Until then publishing was a
// browser drag of dist/ onto Netlify — a manual step in a procedure whose
// forgotten manual steps are the whole problem. Measured that day: the live
// site was four commits behind main and had been for twelve hours, still
// teaching that a recession is when prices fall. Nobody skipped the step on
// purpose; there was simply nothing that would notice.
//
// So this does not remind anyone. It deploys, and then it runs
// `check-deployed`, and its exit code IS that check's. A deploy that reports
// success without the live site agreeing is the exact failure this repo has
// already had once, and it is not available here: the last thing this script
// does is measure the site it just wrote to.
//
// ⛔ THE TOKEN NEVER ENTERS THE REPO. `src/lib/analyticsConfig.js` ships to
// every visitor and says so in its own header; a Netlify token is the opposite
// kind of secret — it can deploy, rename and delete the site. It is read from
// the NETLIFY_AUTH_TOKEN environment variable, or from `.netlify-token` in the
// repo root, which is gitignored. If that file is ever actually TRACKED by git,
// this script refuses to run rather than treating it as a working setup.
// ═══════════════════════════════════════════════════════════════════════════

import { readFileSync, existsSync, statSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const argv = process.argv.slice(2);
const dryRun = argv.includes("--dry-run");
const say = (s = "") => console.log(s);

function refuse(lines, code = 2) {
  say();
  say("  ⛔ REFUSED — nothing was uploaded.");
  for (const l of lines) say(`     ${l}`);
  process.exit(code);
}

say("deploy — publish dist/ and verify it landed");
say();

// ── The site id, read from README rather than typed ──────────────────────────
// Same rule as check-deployed.mjs: README's "## Deploying" section is the one
// definition of this site. A literal here would be a second copy, and the
// symptom of drift would be this script deploying to a site nobody is using.
const readme = readFileSync(join(ROOT, "README.md"), "utf8");
const deploySection = readme.split(/^## /m).find((s) => s.startsWith("Deploying"));
const siteId = deploySection?.match(/site id `([0-9a-f-]{36})`/)?.[1];
const liveUrl = deploySection?.match(/<(https:\/\/[^>\s]+)>/)?.[1];
if (!siteId || !liveUrl) {
  refuse([
    'README.md\'s "## Deploying" section must name both the site id (as',
    "`site id `<uuid>`>`) and the live URL. One of them is missing, so there is",
    "no unambiguous target to deploy to.",
  ]);
}
say(`  target   ${liveUrl}`);
say(`  site id  ${siteId}`);

// ── CONTROL: is dist/ a clean, current build of HEAD? ────────────────────────
// Deploying is publishing. A stale or dirty dist/ publishes something no commit
// describes, and the whole point of check-deployed is that "what is live" must
// be answerable from the repo.
if (!existsSync(join(DIST, "index.html"))) {
  refuse(["dist/index.html does not exist. Run `npm run build` first."]);
}

const BUILD_INPUTS = ["src", "public", "index.html", "vite.config.js", "package.json"];
const dirty = execFileSync("git", ["status", "--porcelain", "--", ...BUILD_INPUTS], {
  cwd: ROOT,
  encoding: "utf8",
}).trim();
if (dirty) {
  refuse([
    "Build inputs have uncommitted changes, so dist/ is not a build of any commit:",
    ...dirty.split("\n").map((l) => `  ${l}`),
    "Commit them (or stash them) first — `what is live` must name a commit.",
  ]);
}

let newest = { ms: 0, file: null };
const walk = (p) => {
  const abs = join(ROOT, p);
  if (!existsSync(abs)) return;
  const st = statSync(abs);
  if (st.isDirectory()) for (const e of readdirSync(abs)) walk(join(p, e));
  else if (st.mtimeMs > newest.ms) newest = { ms: st.mtimeMs, file: p };
};
for (const p of BUILD_INPUTS) walk(p);
if (newest.ms > statSync(join(DIST, "index.html")).mtimeMs) {
  refuse([
    `${newest.file} is newer than dist/. That build is stale — run \`npm run build\`.`,
  ]);
}
const head = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
  cwd: ROOT,
  encoding: "utf8",
}).trim();
say(`  ✓ dist/ is a clean build of HEAD (${head})`);

// ── The token ────────────────────────────────────────────────────────────────
const TOKEN_FILE = join(ROOT, ".netlify-token");

// If this file is TRACKED, a token is on its way into history. Refuse — do not
// deploy and thereby normalize the setup.
try {
  execFileSync("git", ["ls-files", "--error-unmatch", ".netlify-token"], {
    cwd: ROOT,
    stdio: "ignore",
  });
  refuse([
    "⛔ `.netlify-token` is TRACKED BY GIT. A Netlify token can deploy, rename and",
    "delete this site, and anything committed is in history for good.",
    "Run `git rm --cached .netlify-token`, then treat that token as compromised",
    "and revoke it at https://app.netlify.com/user/applications.",
  ]);
} catch {
  // Not tracked. This is the expected path.
}

let token = process.env.NETLIFY_AUTH_TOKEN?.trim();
let tokenSource = "NETLIFY_AUTH_TOKEN";
if (!token && existsSync(TOKEN_FILE)) {
  token = readFileSync(TOKEN_FILE, "utf8").trim();
  tokenSource = ".netlify-token";
}
if (!token && !dryRun) {
  refuse([
    "No Netlify token. This is the one-time owner setup, and it is deliberately",
    "not something an agent can do for you:",
    "",
    "  1. Create a personal access token at",
    "     https://app.netlify.com/user/applications › Personal access tokens.",
    "  2. Put it in ONE of these, never in a tracked file:",
    "       export NETLIFY_AUTH_TOKEN=<token>      (shell / scheduled-task env)",
    "       echo '<token>' > .netlify-token        (gitignored)",
    "  3. `npm run deploy`.",
    "",
    "⛔ Do not paste the token into a chat, a commit message, or any file under",
    "src/ — everything under src/ ships to every visitor.",
  ]);
}
if (token) say(`  ✓ token from ${tokenSource} (${token.length} chars, not echoed)`);

// ── Zip dist/ ────────────────────────────────────────────────────────────────
const zipPath = join(tmpdir(), `deploy-${Date.now()}.zip`);
execFileSync("bash", ["-c", `cd "${DIST}" && zip -r -q "${zipPath}" .`]);
const zip = readFileSync(zipPath);
rmSync(zipPath, { force: true });
const entry = readFileSync(join(DIST, "index.html"), "utf8").match(
  /assets\/index-[A-Za-z0-9_-]+\.js/,
)?.[0];
say(`  ✓ packed ${zip.length} b (entry ${entry ?? "?"})`);

if (dryRun) {
  say();
  say("  --dry-run: everything above passed; nothing was uploaded.");
  process.exit(0);
}

// ── Upload ───────────────────────────────────────────────────────────────────
say();
say("  uploading…");
const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/zip" },
  body: zip,
});
if (!res.ok) {
  const body = await res.text().catch(() => "");
  refuse([
    `Netlify returned HTTP ${res.status}.`,
    res.status === 401
      ? "401 means the token was rejected — check it is a personal access token for the team that owns this site."
      : body.slice(0, 400),
  ]);
}
const deploy = await res.json();
say(`  ✓ accepted as deploy ${deploy.id}`);

// ── Wait for it to go live ───────────────────────────────────────────────────
// An accepted upload is not a published deploy. Netlify processes it, and the
// old bundle is served until it finishes — so polling here is what makes the
// verification below a test of the NEW deploy rather than a race with it.
const DEADLINE = Date.now() + 180000;
let state = deploy.state;
while (!["ready", "error"].includes(state) && Date.now() < DEADLINE) {
  await new Promise((r) => setTimeout(r, 3000));
  const poll = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys/${deploy.id}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!poll.ok) break;
  state = (await poll.json()).state;
}
say(`  deploy state: ${state}`);
if (state === "error") refuse(["Netlify reported the deploy errored."], 1);
if (state !== "ready") {
  say("  ⚠️ still processing after 180s — verifying anyway; a stale result below");
  say("     means it had not finished, not that the deploy failed.");
}

// ── THE VERDICT IS NOT MINE ──────────────────────────────────────────────────
// This script's exit code is check-deployed's. "I uploaded it" is a claim about
// what this process did; the only claim worth making is about the live site.
say();
say("  verifying with check-deployed…");
say();
try {
  execFileSync(process.execPath, [join(ROOT, "scripts", "check-deployed.mjs")], {
    cwd: ROOT,
    stdio: "inherit",
  });
} catch (err) {
  process.exit(err.status ?? 1);
}
process.exit(0);
