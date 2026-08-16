// ═══════════════════════════════════════════════════════════════════════════
// TERM DETAIL
//
// A focused, single-term view reached by tapping a Glossary row — the
// term-detail screen the Quizlet/Vocabulary design review called for, plus
// the persistent action bar it called for alongside it: a bookmark toggle
// so a learner can mark terms worth revisiting. There is no existing
// "review queue" concept for glossary terms (the Leitner scheduler in
// src/lib/review.js is keyed by quiz question, not by term), so this is a
// plain localStorage-backed save list, not a plug-in to that system.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";
import Icon from "../../components/Icon.jsx";
import { Button, Card, Text } from "../../components/ui.jsx";
import { ink, space, surface } from "../../theme.js";

export default function TermDetail({ t, term, entry, isBookmarked, onToggleBookmark, onBack }) {
  const headingRef = useRef(null);

  // Same pattern as LessonReader: a term feels like a new page, so reset
  // scroll and move focus to the title for screen-reader users.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [term]);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: space["2"],
          background: "none", border: "none", padding: `${space["2"]}px 0`,
          color: ink.muted, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
        }}
      >
        <Icon name="arrowLeft" size="1.1em" /> {t.backLabel}
      </button>

      <div style={{ padding: `${space["3"]}px 0 ${space["4"]}px` }}>
        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{
            margin: 0, fontSize: "1.5rem", fontWeight: 700,
            lineHeight: 1.25, letterSpacing: "-0.02em", color: ink.strong, outline: "none",
          }}
        >
          {entry.s || term}
        </h1>
      </div>

      <Card style={{ marginBottom: space["4"] }}>
        <Text variant="body" color={ink.body}>{entry.f}</Text>
      </Card>

      {entry.ex && (
        <Card style={{ background: surface.sunken, marginBottom: space["4"] }}>
          <Text variant="small" color={ink.muted} style={{ fontStyle: "italic" }}>
            {entry.ex}
          </Text>
        </Card>
      )}

      <Button
        variant={isBookmarked ? "primary" : "outline"}
        iconLeft="bookmark"
        aria-pressed={isBookmarked}
        onClick={onToggleBookmark}
        full
      >
        {isBookmarked ? t.bookmarkRemove : t.bookmarkAdd}
      </Button>
    </div>
  );
}
