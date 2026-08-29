// US-English house style: the pattern set, its controls, and a comment
// extractor. Shared by check-data.mjs §55 (learner-visible strings) and §59
// (comment prose and normative Markdown).
//
//   WHY THIS IS ONE MODULE AND NOT TWO COPIES. §55 shipped 2026-08-27 with
//   the patterns inline. Item 141 then found a real gap (`hypothesised`) that
//   a second, separately-maintained copy would have inherited forever — and
//   §55's own history is a list of times one list was fixed while its control
//   list was not (the -ism/-ist derivations, 2026-08-29). One list, one pair
//   of controls, two call sites.
//
//   us-english:allow — this file NAMES British spellings throughout: they are
//   the specimens the net is built from, and every one in its prose is a
//   mention, not a use. §59 reads comment prose, so each block carrying a
//   specimen carries its own marker clause. That is the convention working,
//   not a whole-file exemption — delete a marker and its block is guarded
//   again, which is the property §59's CONTROL C asserts.
//
//   EXTENDING THE NET. Add stems, not suffixes. A generic `-ise` rule flags
//   "exercise", "compromise", "expertise" and "otherwise"; a generic `-re`
//   rule flags "genre" and "mediocre"; `analys[ei]s` flags the correct US
//   nouns "analysis" and "analyses", which is precisely how item 91's own
//   headline count came out wrong in both directions. Every entry below is
//   an explicit stem, and CONTROL C exists to catch the day someone forgets.

export const ALLOW_MARKER = "us-english:allow";

export const BRITISH = [
  [/\b(labour|colour|behaviour|favour|honour|neighbour|rumour|humour|endeavour|flavour|savour|harbour|vapour|armour|valour|odour|parlour|splendour)\w*/gi, "drop the u (labour → labor)"],
  // The suffix set is EXPLICIT, and that is the whole point of this line.
  // Written as `(stem)\w*` — which is how it shipped from 2026-08-27 to
  // 2026-08-29 — every stem here is also a prefix of a correct US noun or
  // adjective, so the net flagged 19 of them: `capitalis` swallows
  // "capitalism"/"capitalist", `realis` swallows "realism"/"realistic",
  // `criticis` "criticism", `organis` "organism"/"organist", `specialis`
  // "specialist", `apologis` "apologist", `stylis` "stylish"/"stylistic".
  // In an app that TEACHES economics, the first lesson to use the word
  // "capitalism" would have failed the build and told its author to write
  // "capitalize" — a check instructing someone to corrupt correct content.
  // CONTROL C is the guard for exactly this and could not see it, because
  // its US list held no -ism/-ist/-ic derivation; both halves are fixed
  // together, and the words above are now IN that list.
  // Only real British inflections follow an -ise stem, so name them:
  [/\b(organis|realis|recognis|specialis|minimis|maximis|prioritis|normalis|summaris|apologis|criticis|utilis|capitalis|localis|stylis|tokenis|standardis|memoris|categoris|penalis|sterilis)(e|es|ed|ing|er|ers|ation|ations|ational|able)\b/gi, "-ise/-isation → -ize/-ization"],
  // "analyses" is deliberately ABSENT: it is the correct US plural of
  // "analysis" AND the British third-person verb, spelled identically. It
  // cannot be classified without reading the sentence, and CONTROL C below
  // failed on exactly this when the pattern was first written with `es` in
  // it. Flagging the two unambiguous verb forms is the honest coverage.
  // us-english:allow — "analyse" is named above, not used.
  [/\banalys(e|ed|ing)\b/gi, "analyse → analyze (the nouns analysis/analyses are correct US; \"analyses\" is ambiguous and is deliberately not flagged)"],
  [/\bemphasis(e|ed|es|ing)\b/gi, "emphasise → emphasize (the noun emphasis is correct US)"],
  // `hypothesis` gets the `emphasise` treatment for the same reason and by
  // the same trap (item 141, added 2026-08-29): as a bare `-ise` stem it
  // would flag the correct US plural "hypotheses". Only the verb forms are
  // unambiguous, so only the verb forms are named. us-english:allow — the
  // two stems named just above are specimens.
  [/\bhypothesis(e|ed|es|ing)\b/gi, "hypothesise → hypothesize (the noun hypothesis/hypotheses is correct US)"],
  [/\b(centre|calibre|spectre|lustre|sombre|meagre|theatre)s?\b/gi, "-re → -er"],
  [/\b\w*(metre|litre|fibre)s?\b/gi, "-re → -er (metre → meter, and the same for kilometre etc.)"],
  [/\b(defence|offence|licence|pretence)s?\b/gi, "-ce → -se"],
  [/\bpractis(e|ed|es|ing)\b/gi, "practise → practice (US uses practice for both noun and verb)"],
  [/\b(travell|cancell|modell|labell|fuell|signall|marvell|counsell|jewell|levell)\w*/gi, "single the l (cancelled → canceled)"],
  [/\bprogramme\b/gi, "programme → program"],
  [/\bcheques?\b/gi, "cheque → check"],
  [/\b(whilst|amongst)\b/gi, "whilst → while, amongst → among"],
  [/\b(enrol|instalment|skilful|fulfil)(?!l)\w*/gi, "double the l (enrol → enroll, fulfil → fulfill)"],
  [/\bjudgement\w*/gi, "judgement → judgment"],
  [/\bcatalogue\w*/gi, "catalogue → catalog"],
  [/\b(ageing|storey|sceptic\w*|moustache|aluminium|sulphur|kerb|tyres?)\b/gi, "assorted British forms"],
];

// Spec-spelled identifiers that contain a British-looking substring and can
// never be "corrected". `aria-labelledby` is an ARIA attribute name: it is
// spelled by the specification, it appears 30 times in this repo, and 11 of
// those are inside comment prose, where §59 would otherwise flag every one.
// This is a token deletion, not a widened pattern — the word `labelled` on
// its own still fails, which CONTROL B asserts. us-english:allow — that
// word is the named specimen, not a use.
const SPEC_IDENTIFIERS = /aria-labelledby/gi;

export function scan(text) {
  const clean = text.replace(SPEC_IDENTIFIERS, " ");
  const found = [];
  for (const [re, advice] of BRITISH) {
    re.lastIndex = 0;
    const m = clean.match(re);
    if (m) found.push({ words: [...new Set(m)], advice });
  }
  return found;
}

// Every pattern is exercised against a form it must catch. Per-pattern rather
// than one specimen sentence: item 91 lost three passes to a net that was
// clean only because it had no rule for the family it was missing.
export const MUST_CATCH = [
  "labour", "colour", "behaviour", "favour", "honoured", "neighbouring",
  "organised", "capitalisation", "specialised", "analyse", "emphasised",
  "realise", "criticised", "utilisation", "organisational", "recognisable",
  "hypothesised", "hypothesising", "normalised", "normalising",
  "centre", "theatre", "kilometre", "fibre", "defence", "licence",
  "practising", "cancelled", "labelled", "programme", "cheque", "whilst",
  "enrol", "fulfil", "judgement", "catalogue", "ageing", "sceptical",
];

// us-english:allow — this paragraph and the list below NAME British forms;
// that is what a control list is.
// The expensive half. Item 91 shipped a net whose lookbehind matched US
// "colored", and item 91's predecessor over-counted by flagging "analysis"
// and "analyses". Both would have been caught here.
export const MUST_NOT_CATCH = [
  "labor", "color", "colored", "behavior", "favor", "honored", "neighboring",
  "organized", "analysis", "analyses", "emphasis", "center", "theater",
  "meter", "fiber", "defense", "license", "practice", "practices",
  "canceled", "labeled", "program", "check", "while", "among", "enroll",
  "fulfill", "judgment", "catalog", "aging", "skeptical", "exercise",
  "compromise", "expertise", "otherwise", "surprise", "franchise",
  "genre", "mediocre", "acre", "four", "hour", "your", "flour",
  // The -ism/-ist/-ic derivations. Added 2026-08-29 with the suffix fix
  // above, because this list is what makes that fix a property rather
  // than a promise: every one of these was flagged by the shipped net,
  // and this list — whose entire job is to catch a stem widened into a
  // suffix rule — contained no word of this shape to catch them with.
  "capitalism", "capitalist", "capitalists", "realism", "realist",
  "realistic", "realistically", "criticism", "criticisms", "organism",
  "organisms", "organist", "specialist", "specialists", "apologist",
  "stylish", "stylist", "stylistic", "stylistically",
  // The nouns whose plurals are one keystroke from the verb forms above
  // (item 141). "hypotheses" is to `hypothesise` what "analyses" is to
  // `analyse`: correct US, and unclassifiable without reading the sentence.
  // us-english:allow — both stems are named here, not used.
  "hypothesis", "hypotheses", "normalization", "normalized",
];

// ── Comment extraction ──────────────────────────────────────────────────────
//
//   us-english:allow — the specimen words quoted below are named, not used.
//
//   §59 reads comment PROSE, never code and never string values. That
//   distinction is the whole safety argument for the section: the checker's
//   own probe words ("labour", "colour", "cheque") live in string literals
//   and array entries a few hundred lines from here, and a net that read
//   source text as a flat blob would fail the build on its own test corpus.
//
//   So this is a real tokenizer, not a `/^\s*\/\//` grep: it tracks string
//   literals (all three quote styles) and regex literals so that a `//`
//   inside either is not a comment. CONTROL B in §59 plants both shapes.
//
//   A BLOCK is a run of consecutive `//` lines — BLANK `//` lines
//   included — or one `/* */`. Keeping the blank ones is not cosmetic: the
//   marker sits in the paragraph that explains why a spelling is correct,
//   which is rarely the same paragraph as the spelling itself. The marker an
//   earlier run placed at check-data.mjs §32 is 8 lines below the quotation
//   it exempts, with two bare `//` lines between them, and a first draft of
//   this function dropped those — which split the run in two and left the
//   quotation unexempted while the marker sat in a block with nothing in it.
//   The cost is stated rather than hidden: a marker's scope reaches to the
//   end of its comment run, so two paragraphs a reader thinks of as separate
//   share one exemption. §59's CONTROL C pins the other boundary — the
//   exemption must NOT survive a line of code.
export function commentBlocks(src) {
  const raw = [];
  let i = 0, line = 1, state = "code", buf = "", bufLine = 1, prevSig = "", quote = "";
  // Blank `//` lines are pushed so a run stays contiguous through them;
  // blocks that turn out to be blank all through are dropped after merging.
  const push = (kind) => { if (kind === "line" || buf.trim()) raw.push({ line: bufLine, text: buf, kind }); buf = ""; };
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (state === "code") {
      if (c === "\n") { line++; i++; continue; }
      if (c === "/" && d === "/") { state = "line"; bufLine = line; i += 2; continue; }
      if (c === "/" && d === "*") { state = "block"; bufLine = line; i += 2; continue; }
      if (c === '"' || c === "'" || c === "`") { state = "str"; quote = c; i++; continue; }
      // A `/` starts a regex literal only where a value may begin. After an
      // identifier, `)` or `]` it is division. Getting this wrong the other
      // way would swallow the rest of the file as a regex.
      if (c === "/" && (prevSig === "" || /[=(,:[!&|?{};+\-*%^~<>]/.test(prevSig))) { state = "re"; i++; continue; }
      if (!/\s/.test(c)) prevSig = c;
      i++; continue;
    }
    if (state === "str") {
      if (c === "\\") { if (src[i + 1] === "\n") line++; i += 2; continue; }
      if (c === "\n") line++;
      if (c === quote) { state = "code"; prevSig = "x"; }
      i++; continue;
    }
    if (state === "re" || state === "recls") {
      if (c === "\\") { i += 2; continue; }
      if (c === "\n") { line++; state = "code"; i++; continue; }
      if (state === "re" && c === "[") { state = "recls"; i++; continue; }
      if (state === "recls" && c === "]") { state = "re"; i++; continue; }
      if (state === "re" && c === "/") { state = "code"; prevSig = "x"; }
      i++; continue;
    }
    if (state === "line") {
      if (c === "\n") { push("line"); line++; state = "code"; i++; continue; }
      buf += c; i++; continue;
    }
    if (state === "block") {
      if (c === "*" && d === "/") { push("block"); state = "code"; i += 2; continue; }
      if (c === "\n") line++;
      buf += c; i++; continue;
    }
  }
  if (state === "line" || state === "block") push(state);

  // Merge runs of consecutive `//` lines into one block.
  const out = [];
  for (const r of raw) {
    const prev = out[out.length - 1];
    if (prev && prev.kind === "line" && r.kind === "line" && r.line === prev.endLine + 1) {
      prev.text += "\n" + r.text;
      prev.endLine = r.line;
      continue;
    }
    out.push({ line: r.line, endLine: r.line, text: r.text, kind: r.kind });
  }
  return out.filter((b) => b.text.trim());
}
