// ═══════════════════════════════════════════════════════════════════════════
// JARGON CANDIDATES — the residual check-data.mjs §17b cannot see
//
// `npm run jargon` (on demand; NOT part of `npm test`, and deliberately so —
// see WHY THIS IS NOT A CHECK below).
//
// §17b proves every use of a *glossary term* in all 40 lessons is either
// chipped or listed in `deliberatelyUnlinked`. Its own scope note says what
// that zero does not mean: a jargon word with **no glossary entry** is
// invisible to it, so "0 unexplained" reads on §3.0.3 as "the terms we have
// definitions for are all handled" — not "no undefined jargon". Backlog item
// 60 is that residual. This script is the instrument for it.
//
// WHAT IT DOES. Extracts candidate terms from a track's English lesson text
// three ways — acronyms, capitalised multi-word phrases used mid-sentence,
// and an n-gram sweep ending on a finance head noun — then subtracts every
// surface form already in glossary.js and ranks what is left by how many
// lessons use it. Reach across lessons is the signal that matters: a term used
// in one lesson is usually defined by that lesson (curation rule 2), while a
// term used in four and defined in one is the forward-reference shape item 60
// actually found.
//
// WHY THIS IS NOT A CHECK, and must not be turned into one. Its output is a
// *candidate* list, ~85% of which is ordinary compositional English ("savings
// account", "monthly payment", "lose value") that needs no definition at all.
// Deciding which candidate is real jargon is judgement, and the only way to
// make this blocking would be an allowlist of every acceptable phrase — the
// hand-maintained shape item 58's F10 finding was filed against. So it reports,
// and a human or a run reads it. It exits non-zero for exactly one reason: its
// own CONTROL failed, i.e. the instrument is broken.
//
// THE CONTROL, and why an absence report needs one. This is a measurement
// whose interesting output is a list of things that are missing, and matching
// nothing produces the most reassuring possible answer. So the extractor must
// re-find terms that ARE in the glossary (they should land in the control
// bucket, not the candidate list). Item 57's own measurement first returned 0
// through a bad key path, and was only caught this way. Two probes are pinned
// below because both have been wrong in this repo before: a substring matcher
// accepts "Vesting" inside "inVESTing" (§17b's probe), and a naive count
// misses that glossary keys are spaced ("Index Fund", not "IndexFund").
// ═══════════════════════════════════════════════════════════════════════════

import { glossary } from "../src/content/glossary.js";
import { lessons } from "../src/content/lessons.js";
import { lessonContent } from "../src/content/lessonContent.js";

const track = process.argv[2] ?? "money";
if (!["money", "economy", "all"].includes(track)) {
  console.error(`usage: node scripts/jargon-candidates.mjs [money|economy|all]`);
  process.exit(2);
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9%()]+/g, " ").trim();

// ── Glossary surface forms: the key, the key with camel humps split, and the
//    English short name. Same two-form rule §17b's matcher uses.
const glossaryForms = new Set();
for (const [key, entry] of Object.entries(glossary)) {
  glossaryForms.add(norm(key));
  glossaryForms.add(norm(key.replace(/([a-z])([A-Z])/g, "$1 $2")));
  if (entry.en?.s) glossaryForms.add(norm(entry.en.s));
}

// ── Corpus: everything a reader of these lessons actually sees, in English.
const inTrack = lessons.filter((l) => track === "all" || l.track === track);
const docs = [];
for (const lesson of inTrack) {
  const c = lessonContent[lesson.id];
  if (!c) continue;
  const parts = [];
  for (const s of c.sections ?? []) {
    if (s.heading?.en) parts.push(s.heading.en);
    if (s.body?.en) parts.push(s.body.en);
  }
  if (c.takeaway?.en) parts.push(c.takeaway.en);
  if (c.thinkAbout?.en) parts.push(c.thinkAbout.en);
  docs.push({ id: lesson.id, text: parts.join("\n\n") });
}

// Head nouns that make a phrase financial rather than ordinary. Not a term
// list — a *shape* filter, so a new lesson's vocabulary is picked up without
// this file being edited.
const HEADS = new Set([
  "fund", "funds", "account", "accounts", "rate", "rates", "ratio", "insurance",
  "interest", "score", "scores", "premium", "premiums", "deductible", "loan",
  "loans", "debt", "credit", "tax", "taxes", "return", "returns", "yield",
  "bond", "bonds", "stock", "stocks", "fee", "fees", "income", "payment",
  "payments", "balance", "match", "contribution", "contributions", "dividend",
  "dividends", "principal", "equity", "asset", "assets", "portfolio",
  "inflation", "budget", "capital", "gain", "gains", "allocation", "annuity",
  "escrow", "beneficiary", "amortization", "underwriting",
]);

const STOP = new Set(["the", "a", "an", "your", "his", "her", "their", "this",
  "that", "these", "those", "of", "in", "on", "for", "and", "or", "to", "it",
  "she", "he", "they", "you", "one", "some", "most", "many", "each", "every",
  "at", "by", "with", "from", "as", "is", "was", "if", "but", "so", "not",
  "when", "what", "how", "why", "who", "which", "than", "then", "into"]);

// Single words worth reporting on their own. A bare head noun is otherwise too
// generic to mean anything ("debt", "credit"), but these are terms in
// themselves.
const STANDALONE = /^(deductible|premium|beneficiary|annuity|escrow|dividends?|equity|principal)$/i;

const hits = new Map(); // normalised -> { display, lessons: Set, count }
const record = (term, id) => {
  const n = norm(term);
  if (!n || n.length < 3) return;
  if (!hits.has(n)) hits.set(n, { display: term, lessons: new Set(), count: 0 });
  const h = hits.get(n);
  h.lessons.add(id);
  h.count += 1;
};

for (const { id, text } of docs) {
  for (const m of text.matchAll(/\b([A-Z]{2,6}|\d{3}\(k\))\b/g)) record(m[1], id);
  // Capitalised phrases NOT at sentence start — a mid-sentence capital is a
  // decent signal the author is naming a thing rather than starting a clause.
  for (const m of text.matchAll(/[a-z,;)]\s+((?:[A-Z][a-z]+(?:[- ][A-Z][a-z]+)+))/g)) record(m[1], id);
  const words = text.split(/\s+/).map((w) => w.replace(/^[^A-Za-z0-9$%(]+|[^A-Za-z0-9%)]+$/g, ""));
  for (let i = 0; i < words.length; i++) {
    if (!HEADS.has(words[i].toLowerCase().replace(/[^a-z]/g, ""))) continue;
    for (const span of [3, 2, 1]) {
      if (i - span + 1 < 0) continue;
      const gram = words.slice(i - span + 1, i + 1);
      if (gram.some((w) => !w || STOP.has(w.toLowerCase()) || /[.,;:!?"]/.test(w))) continue;
      if (span === 1 && !STANDALONE.test(gram[0])) continue;
      record(gram.join(" "), id);
    }
  }
}

const known = [];
const candidates = [];
for (const [n, h] of hits) {
  const row = { n, display: h.display, lessons: [...h.lessons].sort((a, b) => a - b), count: h.count };
  (glossaryForms.has(n) ? known : candidates).push(row);
}
const byReach = (a, b) => b.lessons.length - a.lessons.length || b.count - a.count;
known.sort(byReach);
candidates.sort(byReach);

// ── Report ────────────────────────────────────────────────────────────────
console.log(`jargon candidates — track "${track}", ${docs.length} lessons, ${hits.size} raw candidates`);
console.log(`glossary: ${Object.keys(glossary).length} entries, ${glossaryForms.size} surface forms\n`);

console.log(`CONTROL — extracted terms that ARE already in the glossary (${known.length}):`);
for (const h of known) console.log(`  ${h.display.padEnd(24)} ${h.lessons.length} lessons, ${h.count}x`);

const REACH = 2;
const USES = 3;
const reported = candidates.filter((h) => h.lessons.length >= REACH || h.count >= USES);
console.log(`\nCANDIDATES not in the glossary, used in >= ${REACH} lessons or >= ${USES}x (${reported.length}):`);
for (const h of reported) {
  console.log(
    `  ${h.display.padEnd(30)} ${String(h.lessons.length).padStart(2)} lessons ${String(h.count).padStart(3)}x   ` +
      `lessons ${h.lessons.join(",")}`,
  );
}
console.log(`\n  (${candidates.length - reported.length} lower-reach candidates suppressed; most are ordinary English)`);
console.log(
  `\nREADING THIS: reach is the signal, and a single-lesson term is usually defined by that lesson\n` +
    `(curation rule 2). The shape to look for is a term used across several lessons and defined in\n` +
    `only one — a reader meeting it earlier gets no definition. Before adding any glossary entry:\n` +
    `read the first use, confirm the prose does not already define it, and remember each entry is\n` +
    `learner-facing copy under §10.1 (what a thing IS, never what to do about it). Do not batch-add\n` +
    `entries to shorten this list — every new key also obliges a chip or an exclusion in §17b.`,
);

// ── Control. The only failure mode this script has is matching nothing.
const problems = [];
if (known.length < 5) {
  problems.push(
    `CONTROL FAILED: the extractor re-found only ${known.length} of the ${Object.keys(glossary).length} ` +
      `glossary terms in lesson prose (expected >= 5). It is probably matching nothing, in which case ` +
      `the candidate list above is meaningless rather than empty.`,
  );
}
// The `en.s` path, guarded as an invariant rather than by a pinned literal.
//
// Two earlier drafts of this control were thrown away, and both failures are
// the point. (1) `glossaryForms.has("index fund")` fired when a space-dropping
// normaliser was injected — but that edit is harmless here (both sides
// normalise identically, so subtraction still works), and a control that fires
// on a harmless edit teaches a future run to delete it. (2) Pinning "Index
// Fund"/"Emergency Fund" on the bucket did not fire on item 57's *real* bug
// (`entry.s` for `entry.en.s`), because glossary keys are already spaced
// display names, so those two subtract fine via the key alone.
//
// What the `en.s` path actually buys is the 9 terms whose short name differs
// from the key — "Premium" → "Insurance Premium", "GDP" → "Gross Domestic
// Product". So: any such term appearing verbatim in the scanned prose must
// land in the control bucket. Self-maintaining, and it fails on the real bug.
// Rebuild the expected surface forms INDEPENDENTLY and assert nothing reported
// below is already one of them. This guards the field path — the failure that
// actually happened — without asserting anything about the extractor's
// vocabulary: a term the extractor never proposes belongs in neither bucket,
// and that is correct, not a leak.
const independentForms = new Set();
for (const [key, e] of Object.entries(glossary)) {
  independentForms.add(norm(key));
  if (e.en && typeof e.en.s === "string") independentForms.add(norm(e.en.s));
}
// Every candidate, not just the ones above the display threshold: the term
// this caught first ("insurance premium") is used once, so filtering on the
// reported list let the real bug through while looking like a working control.
const leaked = candidates.filter((h) => independentForms.has(h.n));
if (leaked.length) {
  problems.push(
    `CONTROL FAILED: ${leaked.length} candidate(s) are already glossary terms — ` +
      `${leaked.map((h) => `"${h.display}"`).join(", ")}. The subtraction set is being built from the ` +
      `wrong field (item 57's bug was reading entry.s for entry.en.s), so terms that ARE defined are ` +
      `being reported as missing.`,
  );
}
if (candidates.some((h) => glossaryForms.has(h.n))) {
  problems.push(`CONTROL FAILED: a candidate is also a glossary surface form — the two buckets leaked.`);
}
if (problems.length) {
  console.error(`\n${problems.map((p) => `✗ ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`\n✓ control: ${known.length} known glossary terms re-found, buckets disjoint.`);
