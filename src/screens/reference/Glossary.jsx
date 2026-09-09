// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY
//
// Backs the clarity rule that no jargon goes undefined (LAUNCH_PLAN §3.0.3).
// Search matches the English key *and* the translated name, so a Korean reader
// can find "수익률 곡선" without knowing it is filed under "Yield Curve".
//
// THE LIST IS SORTED FOR THE READER'S LANGUAGE, and that is the only ordering
// this screen has ever had a reason to use. `glossary.js` is in AUTHORING
// order — batches accreted over time (the original macro entries, the
// personal-finance entries item 35 added, then the income types) — and
// until 2026-09-09 the rows rendered in exactly that order in all five
// languages. Measured on the built app that day: 43 rows, `Bond` at 36,
// `Stock` at 35, `401(k)` at 28, and Korean row-for-row identical to English
// because the order came from the English keys. LAUNCH_PLAN §"Reference"
// calls this tab "genuinely look-it-up material"; scanning 43 rows in the
// order someone happened to write them is not lookup.
//
// `Intl.Collator(lang)` rather than `localeCompare` on a bare string, because
// the sort key is the TRANSLATED name and the four non-English locales need
// their own collation, not English's: ko orders by Hangul jamo, zh by pinyin,
// ja puts kana before kanji and orders kanji by reading, es puts Ñ after N.
// Verified in the browser engine on all five before shipping — an ASCII sort
// would have produced Unicode code-point order in three of them, which reads
// as no order at all. `numeric: true` so "401(k)" files as four-oh-one.
// The sort key is `entry.s || term` — what the row actually DISPLAYS — so a
// reader's eye and the ordering agree; the English key stays searchable.
//
// The bookmark toggle on the term detail promises a learner they can mark
// terms "worth revisiting"; the SAVED FILTER above the list is what makes
// revisiting possible. Without it the only trace of a save is a small icon on
// one row of 43, so a saved set could be built and never read back. The chip
// renders only when at least one term is saved — a control that can never do
// anything is worse than no control — and it clears itself if the last
// bookmark is removed while it is on.
//
// Each row's aria-label carries only the term (plus a bookmarked marker), which
// overrides its contents for name computation — so the definition and example
// inside the row would otherwise never reach a screen reader navigating by
// control. aria-describedby points back at them to restore that.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo, useRef, useState } from "react";
import { glossary } from "../../content/glossary.js";
import Icon from "../../components/Icon.jsx";
import { EmptyState, Text } from "../../components/ui.jsx";
import { ink, line, MIN_TAP, radius, space, surface } from "../../theme.js";
import { useDismissOnBack } from "../../lib/deepLink.js";
import { KEYS, readArray, writeJSON } from "../../lib/storage.js";
import TermDetail from "./TermDetail.jsx";

export default function Glossary({ t, lang }) {
  const [query, setQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null); // null | a glossary key
  const [savedOnly, setSavedOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState(() => readArray(KEYS.glossaryBookmarks));

  // TermDetail moves focus to its own heading on open (its useEffect), but
  // closing it unmounts the row-list button that had focus, so the browser
  // drops focus to <body> and a keyboard/screen-reader user loses their place
  // in the list — the open direction is handled app-wide (LessonReader,
  // TermDetail itself); the close direction wasn't. rowRefs + returnFocusTerm
  // restore focus to the row that was activated.
  const rowRefs = useRef({});
  const [returnFocusTerm, setReturnFocusTerm] = useState(null);

  // Back closes the term detail before it leaves the Reference tab. It runs
  // the same close path as the on-screen button, focus restore included, so a
  // keyboard user who backs out lands on the row they opened.
  useDismissOnBack(selectedTerm !== null, () => {
    setReturnFocusTerm(selectedTerm);
    setSelectedTerm(null);
  });

  useEffect(() => {
    if (selectedTerm === null && returnFocusTerm) {
      rowRefs.current[returnFocusTerm]?.focus();
      setReturnFocusTerm(null);
    }
  }, [selectedTerm, returnFocusTerm]);

  // Removing the last bookmark happens on the term detail, so the list comes
  // back with the filter still on and nothing to show. Clear it rather than
  // render an empty list under a "Saved (0)" chip.
  useEffect(() => {
    if (savedOnly && bookmarks.length === 0) setSavedOnly(false);
  }, [savedOnly, bookmarks]);

  const toggleBookmark = (term) => {
    setBookmarks((prev) => {
      const next = prev.includes(term) ? prev.filter((x) => x !== term) : [...prev, term];
      writeJSON(KEYS.glossaryBookmarks, next);
      return next;
    });
  };

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    const collator = new Intl.Collator(lang, { numeric: true });
    return Object.entries(glossary)
      .map(([term, translations]) => ({ term, entry: translations[lang] || translations.en }))
      .filter(({ term }) => !savedOnly || bookmarks.includes(term))
      .filter(({ term, entry }) =>
        !q || term.toLowerCase().includes(q) || (entry.s || "").toLowerCase().includes(q)
      )
      .sort((a, b) => collator.compare(a.entry.s || a.term, b.entry.s || b.term));
  }, [query, lang, savedOnly, bookmarks]);

  if (selectedTerm && glossary[selectedTerm]) {
    const entry = glossary[selectedTerm][lang] || glossary[selectedTerm].en;
    return (
      <TermDetail
        t={t}
        term={selectedTerm}
        entry={entry}
        isBookmarked={bookmarks.includes(selectedTerm)}
        onToggleBookmark={() => toggleBookmark(selectedTerm)}
        onBack={() => {
          setReturnFocusTerm(selectedTerm);
          setSelectedTerm(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={{ position: "relative", marginBottom: space["4"] }}>
        <span aria-hidden="true" style={{ position: "absolute", left: space["3"], top: "50%", transform: "translateY(-50%)", color: ink.muted, display: "flex" }}>
          <Icon name="search" size="1.1em" />
        </span>
        <input
          type="search"
          aria-label={t.glossSearch}
          placeholder={t.glossSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: `${space["3"]}px ${space["3"]}px ${space["3"]}px 40px`,
            borderRadius: radius.md,
            border: `1px solid ${line.strong}`,
            background: surface.card,
            color: ink.strong,
            fontSize: "1rem",
          }}
        />
      </div>

      {bookmarks.length > 0 && (
        <div style={{ display: "flex", marginTop: `-${space["2"]}px`, marginBottom: space["4"] }}>
          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((v) => !v)}
            style={{
              display: "inline-flex", alignItems: "center", gap: space["1"],
              padding: `${space["1"]}px ${space["4"]}px`,
              minHeight: MIN_TAP,
              borderRadius: radius.full,
              border: `1px solid ${savedOnly ? ink.accent : line.strong}`,
              background: savedOnly ? surface.accentWash : surface.card,
              color: savedOnly ? ink.accent : ink.body,
              fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon name="bookmark" size="1em" style={savedOnly ? { fill: "currentColor" } : undefined} />
            {t.glossSavedFilter.replace("{n}", bookmarks.length)}
          </button>
        </div>
      )}

      {entries.length === 0 ? (
        <EmptyState icon="search">{t.glossNoResults}</EmptyState>
      ) : (
        <dl style={{ margin: 0 }}>
          {entries.map(({ term, entry }, i) => {
            const isBookmarked = bookmarks.includes(term);
            const defId = `gloss-def-${i}`;
            const exId = `gloss-ex-${i}`;
            return (
            <div
              key={term}
              ref={(el) => { rowRefs.current[term] = el; }}
              role="button"
              tabIndex={0}
              aria-label={isBookmarked ? `${entry.s || term}, ${t.bookmarkedLabel}` : entry.s || term}
              aria-describedby={entry.ex ? `${defId} ${exId}` : defId}
              onClick={() => setSelectedTerm(term)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedTerm(term);
                }
              }}
              style={{ padding: `${space["3"]}px 0`, borderBottom: `1px solid ${line.hairline}`, cursor: "pointer" }}
            >
              <dt style={{ display: "flex", alignItems: "center", gap: space["1"] }}>
                <Text as="span" variant="small" color={ink.strong} style={{ fontWeight: 700 }}>
                  {entry.s || term}
                </Text>
                {isBookmarked && (
                  <Icon name="bookmark" size="0.9em" style={{ fill: "currentColor", color: ink.accent }} />
                )}
              </dt>
              <dd id={defId} style={{ margin: `${space["1"]}px 0 0` }}>
                <Text variant="small" color={ink.muted}>{entry.f}</Text>
              </dd>
              {entry.ex && (
                <dd id={exId} style={{ margin: `${space["1"]}px 0 0` }}>
                  <Text variant="small" color={ink.muted} style={{ fontStyle: "italic" }}>
                    {entry.ex}
                  </Text>
                </dd>
              )}
            </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
