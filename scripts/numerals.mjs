// Money amounts stated in prose, read out of any of the app's five languages.
// Shared by check-data.mjs §21 (lesson 7's bracket caption), §53 (lesson 17's
// earnings-gap figure) and §61 (this module's own controls).
//
//   WHY THIS EXISTS. Every figure-vs-prose check in this repo anchors a
//   figure's numbers to the lesson that states them, and until now every one
//   of them did it with `body.includes("50,000")`. That reads English. It
//   also reads Spanish, because `es` keeps Western thousands separators. It
//   reads NOTHING in ko/zh/ja, which group by myriads: lesson 17's $50,000 is
//   `5만 달러`, `5万美元`, `5万ドル`, and an `includes` scan for "50,000"
//   returns zero on all three. Backlog item 127 filed that as the trap it is:
//   **the false negative is indistinguishable from the figures being absent**,
//   so the honest choices were en-only (what §53 shipped) or this module.
//
//   THE SHAPE OF THE DECISION item 127 left open. §54(e) solved the same
//   problem for lesson 44 by anchoring on WORDS instead — each language's own
//   term for each category — which needs no normalizer at all. That works
//   there because lesson 44 states no numbers. Lesson 17's claim IS its
//   numerals ($50,000/$45,000 and $120,000/$115,000 having the same $5,000
//   gap), so there is nothing else to anchor to and the normalizer is the
//   only shape that covers the four non-English languages.
//
//   WHAT IT DELIBERATELY DOES NOT DO. No Chinese numeral characters
//   (五千), no Japanese readings, no written-out English ("fifty thousand").
//   The corpus uses Arabic digits everywhere — measured 2026-08-29 across all
//   five languages of lesson 17 — and a wider net is a bigger surface to be
//   wrong on with no instance to justify it. If a translator ever writes
//   五千, the check fails loudly rather than passing quietly, which is the
//   right direction to be wrong in.

// Myriad and thousand markers, by multiplier. `억/亿/億` are here because the
// corpus reaches $120,000 today and a lesson about lifetime earnings would
// reach 억 tomorrow; they cost one line and no ambiguity.
export const UNITS = {
  "천": 1e3, "千": 1e3,
  "만": 1e4, "万": 1e4, "萬": 1e4,
  "억": 1e8, "亿": 1e8, "億": 1e8,
  "조": 1e12, "兆": 1e12,
};

const CHUNK = /(\d[\d,]*(?:\.\d+)?)\s*([천千만万萬억亿億조兆]?)/g;

// A THOUSANDS-SEPARATED MANTISSA NEVER TAKES A MYRIAD UNIT, and this line is
// the whole reason the module was measured against the corpus before it was
// trusted. Korean `만` is both the myriad marker and the particle meaning
// "only", and the two are the same character after a number. Lesson 7's
// Korean caption says `$4,000만 30% 구간에` — "only the $4,000 reaches the 30%
// band" — which a naive parser reads as 4,000 × 10,000 and then reports the
// caption as MISSING $4,000. That is a false negative dressed as a finding.
//
// Measured over the whole content corpus 2026-08-29: 58 digit-runs are
// followed by a unit character. 57 are genuine myriad amounts and NOT ONE of
// them carries a comma (`5만`, `4.5万`, `11万5千`, and the Korean market
// copy's `$6000억`/`$950억`); the single false one is the caption above, and
// it does. So the comma separates the two cleanly. It is also the right rule
// on its own terms: myriad grouping and thousands grouping are two systems,
// and no language here writes a token in both at once.
//
// Note what this rule is NOT: a currency-prefix rule. `$` looks like it should
// mark a Western-formatted amount and it does not — `$6000억` is $600 billion
// in the Korean markets copy. That was the first rule tried and the corpus
// refuted it.
const GROUPED = /,/;

// A group is a positional decomposition — `4만 5천`, `11万5千`, `4.5万` — and
// the rule that makes it one rather than two numbers is STRICTLY DESCENDING
// UNITS. That is the whole guard against greedy summing: `5만 4만` is two
// separate amounts (50,000 and 40,000), not 90,000, and `3 100` is 3 and 100,
// not 3,100. A chunk with no unit can only ever stand alone. §61 asserts both
// of those refutations directly, because a parser that sums whatever it sees
// would pass every presence test in this repo for the wrong reason.
export function amountsIn(text) {
  const found = new Set();
  if (typeof text !== "string" || text.length === 0) return found;

  let group = null;   // { total, lastMult, end }
  const flush = () => {
    if (group && Number.isFinite(group.total)) found.add(group.total);
    group = null;
  };

  CHUNK.lastIndex = 0;
  for (let m; (m = CHUNK.exec(text)) !== null; ) {
    const value = Number(m[1].replace(/,/g, ""));
    const unit = GROUPED.test(m[1]) ? "" : m[2];
    const mult = unit ? UNITS[unit] : 1;
    if (!Number.isFinite(value)) { flush(); continue; }

    const joins = group !== null
      && unit !== ""                                        // unit-less chunks stand alone
      && group.lastMult > 1                                 // and cannot be extended
      && mult < group.lastMult                              // strictly descending
      && /^\s*$/.test(text.slice(group.end, m.index));      // adjacent, whitespace only

    if (joins) {
      group.total += value * mult;
      group.lastMult = mult;
      group.end = m.index + m[0].length;
    } else {
      flush();
      group = { total: value * mult, lastMult: mult, end: m.index + m[0].length };
    }
  }
  flush();
  return found;
}

// Two-sided specimens, exercised by check-data.mjs §61 as EXACT set equality
// rather than containment — a parser that returns extra amounts is as broken
// as one that misses them, and containment cannot tell the two apart.
//
// The first four are the real strings this module was built to read: they are
// lesson 17's own figures as each language actually writes them (measured
// 2026-08-29). The last three are the refutations.
export const SPECIMENS = [
  { note: "en/es — Western grouping, $ and % alongside", text: "Only the top $10,000 is new, and only the $4,000 above $50,000 reaches the 30% band", expect: [10000, 4000, 50000, 30] },
  { note: "ko — myriad with a space inside the decomposition", text: "4만 5천 달러이고, 11만 5천 달러이며, 5천 달러입니다", expect: [45000, 115000, 5000] },
  { note: "zh — decimal myriad, no separator", text: "4.5万美元、11.5万美元和5千美元", expect: [45000, 115000, 5000] },
  { note: "ja — compound myriad, no space", text: "4万5千ドル、11万5千ドル、5千ドル", expect: [45000, 115000, 5000] },
  { note: "REFUTATION — equal units do not decompose, they are two amounts", text: "5만 4만", expect: [50000, 40000] },
  { note: "REFUTATION — ascending units do not decompose either", text: "5천 4만", expect: [5000, 40000] },
  { note: "REFUTATION — a unit-less number never joins a group", text: "3 100 그리고 1,050", expect: [3, 100, 1050] },
  { note: "REFUTATION — Korean `만` after a comma-grouped amount is the particle \"only\", not a myriad", text: "그중 $50,000를 넘는 $4,000만 30% 구간에", expect: [50000, 4000, 30] },
  { note: "and the same character without a comma IS the myriad — the Korean markets copy's own figure", text: "월 $6000억 규모", expect: [600000000000] },
];
