#!/usr/bin/env node
// Automated regression checks for LAUNCH_PLAN.md's blindspot register (§10) and
// the §2.3 "no live-looking market data" rule. Run via `npm run check-blindspot`
// (also chained into `npm test`). Every check here mirrors a grep command that
// AGENT_LOG.md / LAUNCH_READINESS.md previously asked each dev-agent run to type
// out by hand before committing — codified so a run can't forget one, and so a
// content edit that reintroduces a closed issue fails loudly instead of waiting
// for the next manual self-check or weekly review to notice.
//
// This does not replace the per-run adversarial self-check (dev-agent SKILL.md)
// — it only automates the mechanical part (grep-shaped regressions). Judgment
// calls (does new prose *read* like advice, does a framing change need the
// owner) still need a human or an agent reading the actual diff.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failures++;
}
function ok(msg) {
  console.log(`ok: ${msg}`);
}

function walk(dir, exts) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p, exts));
    else if (exts.includes(extname(entry.name))) out.push(p);
  }
  return out;
}

function grepFiles(files, pattern, { excludeSelf = true } = {}) {
  const hits = [];
  for (const f of files) {
    if (excludeSelf && f.endsWith("check-blindspot.mjs")) continue;
    const text = readFileSync(f, "utf8");
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) hits.push(`${f}:${i + 1}: ${lines[i].trim()}`);
      pattern.lastIndex = 0; // reset global-flag regexes between lines
    }
  }
  return hits;
}

const srcFiles = walk(join(ROOT, "src"), [".js", ".jsx"]);
const contentFiles = walk(join(ROOT, "src", "content"), [".js"]);
// Excludes index.js, which only re-exports the five per-language modules and
// carries no content keys of its own.
const localeFiles = walk(join(ROOT, "src", "locales"), [".js"]).filter(
  (f) => /(en|es|ko|zh|ja)\.js$/.test(f),
);
// The v5 prototype is scanned when present but is no longer part of the repo:
// the owner untracked it 2026-08-16 (kept on disk, gitignored — see
// .gitignore's note), so a fresh clone won't have it. The existsSync guard
// already handled that; what follows reports which of the two actually
// happened, because "checked v5 and it was clean" and "there was no v5 to
// check" are different facts and the old message asserted the first either way.
const v5Path = join(ROOT, "economic-cycles-v5.jsx");
const v5Present = existsSync(v5Path);
const allCheckedFiles = [...srcFiles, ...(v5Present ? [v5Path] : [])];

// --- §10.2 Dalio dependency (closed 2026-08-01) ---
//
// README.md is scanned too, added 2026-08-17. It was not, and it carried the
// violation the whole time: "inspired by the framework popularized by Ray
// Dalio and other economists," in the first sentence of the project's
// front-door document, for as long as the file has existed. §10.2 has been
// reported closed since 2026-08-01 on the strength of a check that scanned
// `src/` and the v5 prototype — the two places the rule was already obeyed.
// LAUNCH_PLAN.md §38 even records replacing exactly this sentence pattern
// elsewhere. Found by backlog item 49, which put README under a *different*
// guard (check-data.mjs §26) and read the file properly for the first time.
//
// Only README joins the scan, not the other docs: LAUNCH_PLAN.md and
// LAUNCH_READINESS.md name Dalio while *stating the rule* ("no name-brand
// framing"), and a check that forbids describing its own rule is a check
// nobody can write documentation around.
const readmePath = join(ROOT, "README.md");
{
  const dalioFiles = [...allCheckedFiles, readmePath];
  const hits = grepFiles(dalioFiles, /dalio/i);
  if (hits.length) {
    fail(`§10.2 Dalio dependency reintroduced:\n  ${hits.join("\n  ")}`);
  } else {
    ok(
      v5Present
        ? "§10.2 no Dalio references in src/, README.md or economic-cycles-v5.jsx"
        : "§10.2 no Dalio references in src/ or README.md (economic-cycles-v5.jsx not present — not scanned)",
    );
  }
}

// --- §10.1 investment-advice adjacency (closed 2026-08-02) ---
// Non-English equivalents added 2026-08-11 (P-3): the five English-only regexes
// below missed the ~60% of content volume that ships in es/ko/zh/ja (translated
// content lives inline in these same files, one language per line — see
// content/lessonContent.js). Each set targets the same prescriptive-imperative
// shape as its English counterpart ("be bullish", not descriptive "was bullish"),
// checked against current content for false positives before landing.
{
  const patterns = [
    // English
    /best investments\s*:/i,
    /\bbe bullish\b/i,
    /\bbe cautious\b/i,
    /you should (buy|sell|invest)/i,
    /\bwe recommend\b/i,
    // Spanish
    /mejores inversiones\s*:/i,
    /\bs(?:é|ea)\s+alcista\b/i,
    /\bs(?:é|ea)\s+cauteloso\b/i,
    /deber[ií]as?\s+(comprar|vender|invertir)/i,
    /\brecomendamos\b/i,
    // Korean
    /최고의\s*투자\s*[:：]/,
    /낙관적이어야\s?합니다|강세를\s?예상하세요/,
    /신중해야\s?합니다|조심하세요/,
    /(사야|팔아야|투자해야)\s?합니다/,
    /추천합니다|권장합니다/,
    // Chinese
    /最佳投资\s*[:：]/,
    /应该看涨|建议看涨/,
    /应该谨慎/,
    /应该(购买|买入|卖出|投资)/,
    /我们(建议|推荐)/,
    // Japanese
    /最良の投資\s*[:：]|最高の投資\s*[:：]/,
    /強気になるべき|強気を推奨/,
    /慎重になるべき/,
    /(買う|売る|投資する)べきです/,
    /推奨します|お勧めします/,
  ];
  // index.html joins the scan 2026-08-24 (backlog item 98), for the same
  // reason README.md joined §10.2 above: a rule only covers the files it
  // reads. That run put a `description`, an `og:description` and a
  // `twitter:description` into the <head> — user-facing copy that is the
  // first and sometimes only sentence anyone reads about this product, since
  // hash routing makes it the preview for every shared lesson URL — and it
  // sat outside every §10.1 pattern because those scanned src/content and
  // src/locales only. No violation was found there; the gap was the point.
  const adviceFiles = [...contentFiles, ...localeFiles, join(ROOT, "index.html")];
  const hits = patterns.flatMap((p) => grepFiles(adviceFiles, p));
  if (hits.length) {
    fail(`§10.1 investment-advice-adjacent language reintroduced:\n  ${hits.join("\n  ")}`);
  } else {
    ok(`§10.1 no advice-adjacent language (en/es/ko/zh/ja) across ${adviceFiles.length} file(s) in src/content/, src/locales/ and index.html`);
  }
}

// --- §10.1 disclaimer key present and non-empty in every language ---
{
  const missing = [];
  for (const f of localeFiles) {
    const text = readFileSync(f, "utf8");
    const m = text.match(/disclaimer:\s*"([^"]*)"/);
    if (!m || m[1].trim().length === 0) missing.push(f);
  }
  if (missing.length) {
    fail(`§10.1 disclaimer key missing or empty in: ${missing.join(", ")}`);
  } else {
    ok("§10.1 disclaimer key present and non-empty in every locale");
  }
}

// --- §10.1 the disclaimer renders on every surface LAUNCH_PLAN.md §10.1 names ---
//
// Why this exists (item 61/F7, 2026-08-17): §10.1 listed the render surfaces as
// "Home, Learn, Markets and About". `Home.jsx` and `Markets.jsx` were deleted in
// the 2026-08-04 rebuild, so for thirteen days a standing rule that the per-run
// adversarial self-check names *by number* could not be checked as written. The
// check above asserts the disclaimer *key* exists per locale; nothing asserted
// the *surfaces*, which is exactly why this drifted unseen.
//
// It matches the rendered string `t.disclaimer`, deliberately NOT the
// `<Disclaimer>` component: Sectors.jsx renders the same string through a plain
// `<Text>`, so a component-shaped grep reports five surfaces where there are
// six. Item 58's own measurement made that error, and this project has repeatedly
// found that a measurement taken with the instrument that has the blind spot
// cannot detect the blind spot.
{
  const EXPECTED_SURFACES = [
    "src/App.jsx",                              // the first-launch modal
    "src/screens/Learn.jsx",
    "src/screens/LessonReader.jsx",
    "src/screens/Practice.jsx",
    "src/screens/Reference.jsx",                // the hub, added 2026-08-17
    "src/screens/reference/MarketSignals.jsx",
    "src/screens/reference/Sectors.jsx",        // renders the string, not the component
    "src/screens/reference/Settings.jsx",       // the About sub-screen
  ];
  const jsx = srcFiles.filter((f) => f.endsWith(".jsx"));
  const found = new Set(
    grepFiles(jsx, /\{\s*t\.disclaimer\s*\}|text=\{t\.disclaimer\}/)
      .map((h) => h.slice(ROOT.length + 1).split(":")[0]),
  );

  // Self-test the pattern before trusting either direction of the diff. For an
  // absence check a broken regex reads as "nothing renders it", and for the
  // extra-surface half it reads as a pass — §26's lesson, applied here.
  const probe = ["<Disclaimer text={t.disclaimer} />", "<Text>{t.disclaimer}</Text>", "seenDisclaimer: true"];
  const probeHits = probe.filter((l) => /\{\s*t\.disclaimer\s*\}|text=\{t\.disclaimer\}/.test(l));
  if (probeHits.length !== 2) {
    fail(
      `§10.1 the disclaimer-surface pattern is broken — on a fixed probe it should match the component ` +
        `and the bare-string forms and skip the storage key, and it matched ${probeHits.length}. ` +
        `Without this the surface scan silently matches nothing, which reads as a pass.`,
    );
  }

  const missing = EXPECTED_SURFACES.filter((f) => !found.has(f));
  const extra = [...found].filter((f) => !EXPECTED_SURFACES.includes(f));
  if (missing.length) {
    fail(
      `§10.1 the disclaimer no longer renders on: ${missing.join(", ")}. LAUNCH_PLAN.md §10.1 lists ` +
        `these as the surfaces it renders on. Either restore it or change §10.1 and this list together ` +
        `— the register saying one thing and the app doing another is the drift this check exists for.`,
    );
  } else if (extra.length) {
    fail(
      `§10.1 the disclaimer renders on ${extra.join(", ")}, which LAUNCH_PLAN.md §10.1 does not list. ` +
        `Adding a surface is fine and probably good; add it to §10.1's list and to EXPECTED_SURFACES ` +
        `here, so the register keeps describing the app.`,
    );
  } else {
    ok(`§10.1 disclaimer renders on all ${EXPECTED_SURFACES.length} surfaces §10.1 names`);
  }
}

// --- §10.3 kids content stays parent-facing (closed 2026-08-01, reopened as a
// question 2026-08-04 — this only guards the *current standing rule*, it does
// not resolve the reopened question) ---
{
  const enLocale = join(ROOT, "src", "locales", "en.js");
  const text = readFileSync(enLocale, "utf8");
  const titleMatch = text.match(/kidsTitle:\s*"([^"]*)"/);
  const introMatch = text.match(/kidsParentIntro:\s*"([^"]*)"/);
  if (!introMatch || introMatch[1].trim().length === 0) {
    fail("§10.3 kidsParentIntro missing or empty in src/locales/en.js — parent-facing framing signal is gone");
  } else {
    ok("§10.3 kidsParentIntro present in src/locales/en.js");
  }
  if (titleMatch && /^economics for kids$/i.test(titleMatch[1].trim())) {
    fail(`§10.3 kidsTitle reverted to the old child-facing string: "${titleMatch[1]}"`);
  } else {
    ok("§10.3 kidsTitle is not the old child-facing string");
  }
}

// --- §2.3 Markets tab / teaching content stays dateless (no live-looking
// current date, closed 2026-08-02). Scoped to teaching-copy modules, not the
// daily market-data job's output (public/data/market.json legitimately carries
// a real `asOf` date — that's the documented staleness contract, not a bug). ---
{
  const teachingFiles = [
    join(ROOT, "src", "content", "markets.js"),
    join(ROOT, "src", "content", "economicSignals.js"),
    join(ROOT, "src", "content", "sectors.js"),
    // Added 2026-08-16 with backlog item 27: moneyVisuals.js is teaching copy
    // carrying figures, which is exactly the shape §2.3 guards. It has no dates
    // today — this keeps a future run from introducing one unnoticed.
    join(ROOT, "src", "content", "moneyVisuals.js"),
    // policyScenarios.js (backlog item 34) states inflation and unemployment
    // figures, which is exactly the shape §2.3 guards: a scenario that named
    // a month and year would read as a description of right now rather than
    // as the hypothetical it is.
    join(ROOT, "src", "content", "policyScenarios.js"),
    // The lesson bodies and quiz text, added 2026-08-20 with backlog item 85.
    // This list had been hand-maintained while the §10.1 scan above walks all
    // of src/content — so the largest body of teaching copy in the app, and
    // the part most likely to name a current figure, was the part §2.3 did not
    // watch. The `essentials` track alone covers tax brackets, contribution
    // limits, W-2/1099 thresholds and mortgage costs.
    //
    // Measured clean when this was added: zero "Month YYYY" dates across all
    // 15 lessonContent modules and all 5 quizText modules. The content avoids
    // dated figures deliberately — "up to a set limit" rather than a 401(k)
    // number, "over a threshold" rather than $600 — and this is what keeps
    // that a rule instead of a habit.
    //
    // KNOWN BOUNDARY, stated rather than implied: the pattern below is English
    // month names, so a Spanish "marzo 2026" or a Japanese "2026年3月" would
    // pass. Closing that means a per-language date vocabulary, which is real
    // work and is not what item 85 scoped. This covers the English source the
    // translations are made from, which is where such a figure would enter.
    ...contentFiles.filter((f) => /lessonContent\.|quizText\./.test(f)),
  ].filter(existsSync);
  const monthYear =
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+20\d{2}\b/i;
  const hits = grepFiles(teachingFiles, monthYear);
  if (hits.length) {
    fail(`§2.3 a "Month YYYY"-shaped date appears in teaching copy (reads as live/current):\n  ${hits.join("\n  ")}`);
  } else {
    ok(`§2.3 no live-looking dates in ${teachingFiles.length} teaching-copy modules (markets/economicSignals/sectors/moneyVisuals/policyScenarios + lessonContent + quizText)`);
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
