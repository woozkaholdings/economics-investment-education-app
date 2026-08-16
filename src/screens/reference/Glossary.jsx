// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY
//
// Backs the clarity rule that no jargon goes undefined (LAUNCH_PLAN §3.0.3).
// Search matches the English key *and* the translated name, so a Korean reader
// can find "수익률 곡선" without knowing it is filed under "Yield Curve".
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import { glossary } from "../../content/glossary.js";
import Icon from "../../components/Icon.jsx";
import { EmptyState, Text } from "../../components/ui.jsx";
import { ink, line, radius, space, surface } from "../../theme.js";
import { KEYS, readArray, writeJSON } from "../../lib/storage.js";
import TermDetail from "./TermDetail.jsx";

export default function Glossary({ t, lang }) {
  const [query, setQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState(null); // null | a glossary key
  const [bookmarks, setBookmarks] = useState(() => readArray(KEYS.glossaryBookmarks));

  const toggleBookmark = (term) => {
    setBookmarks((prev) => {
      const next = prev.includes(term) ? prev.filter((x) => x !== term) : [...prev, term];
      writeJSON(KEYS.glossaryBookmarks, next);
      return next;
    });
  };

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.entries(glossary)
      .map(([term, translations]) => ({ term, entry: translations[lang] || translations.en }))
      .filter(({ term, entry }) =>
        !q || term.toLowerCase().includes(q) || (entry.s || "").toLowerCase().includes(q)
      );
  }, [query, lang]);

  if (selectedTerm && glossary[selectedTerm]) {
    const entry = glossary[selectedTerm][lang] || glossary[selectedTerm].en;
    return (
      <TermDetail
        t={t}
        term={selectedTerm}
        entry={entry}
        isBookmarked={bookmarks.includes(selectedTerm)}
        onToggleBookmark={() => toggleBookmark(selectedTerm)}
        onBack={() => setSelectedTerm(null)}
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

      {entries.length === 0 ? (
        <EmptyState icon="search">{t.glossNoResults}</EmptyState>
      ) : (
        <dl style={{ margin: 0 }}>
          {entries.map(({ term, entry }) => {
            const isBookmarked = bookmarks.includes(term);
            return (
            <div
              key={term}
              role="button"
              tabIndex={0}
              aria-label={isBookmarked ? `${entry.s || term}, ${t.bookmarkedLabel}` : entry.s || term}
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
              <dd style={{ margin: `${space["1"]}px 0 0` }}>
                <Text variant="small" color={ink.muted}>{entry.f}</Text>
              </dd>
              {entry.ex && (
                <dd style={{ margin: `${space["1"]}px 0 0` }}>
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
