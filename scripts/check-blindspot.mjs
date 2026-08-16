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
{
  const hits = grepFiles(allCheckedFiles, /dalio/i);
  if (hits.length) {
    fail(`§10.2 Dalio dependency reintroduced:\n  ${hits.join("\n  ")}`);
  } else {
    ok(
      v5Present
        ? "§10.2 no Dalio references in src/ or economic-cycles-v5.jsx"
        : "§10.2 no Dalio references in src/ (economic-cycles-v5.jsx not present — not scanned)",
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
  const hits = patterns.flatMap((p) => grepFiles([...contentFiles, ...localeFiles], p));
  if (hits.length) {
    fail(`§10.1 investment-advice-adjacent language reintroduced:\n  ${hits.join("\n  ")}`);
  } else {
    ok("§10.1 no advice-adjacent language (en/es/ko/zh/ja) in src/content/ or src/locales/");
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
  ].filter(existsSync);
  const monthYear =
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+20\d{2}\b/i;
  const hits = grepFiles(teachingFiles, monthYear);
  if (hits.length) {
    fail(`§2.3 a "Month YYYY"-shaped date appears in teaching copy (reads as live/current):\n  ${hits.join("\n  ")}`);
  } else {
    ok("§2.3 no live-looking dates in src/content/{markets,economicSignals,sectors,moneyVisuals}.js");
  }
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
