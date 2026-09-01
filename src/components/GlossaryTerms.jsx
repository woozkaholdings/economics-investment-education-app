// ═══════════════════════════════════════════════════════════════════════════
// GLOSSARY TERMS (in-lesson)
//
// The §3.0.3 link from lesson prose to the glossary (backlog item 28). Renders
// under a lesson section as a row of term chips; tapping one reveals that
// term's definition and example in place.
//
// In place, rather than navigating to Reference → Glossary → term: the
// friction §3.0.3 exists to remove is *leaving the lesson*. A learner who has
// to change tabs to find out what "deleveraging" means has already lost the
// paragraph they were reading. The definition shown here is the same
// glossary.js entry the Glossary tab renders, in the reader's own language —
// there is no second copy of the text to drift.
//
// Disclosure semantics: each chip is a button with aria-expanded, and all of a
// section's chips control one shared panel that sits immediately after the
// row, so opening a second term swaps the panel rather than stacking. The
// panel is not a live region — it follows its trigger in DOM order, which is
// where a screen reader looks next.
// ═══════════════════════════════════════════════════════════════════════════

import { useId, useState } from "react";
import { glossary } from "../content/glossary.js";
import Icon from "../components/Icon.jsx";
import { Text } from "./ui.jsx";
import { ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

// `label` overrides the row's caption. The default names a section, which is
// true of every row but one: LessonReader also renders this under the closing
// takeaway/reflection pair, which is not a section, and calling it one there
// would be a small lie in five languages.
export default function GlossaryTerms({ terms, t, lang, label }) {
  const [openTerm, setOpenTerm] = useState(null);
  const panelId = useId();

  // A term that isn't in the glossary is a data bug (check-data.mjs §17 fails
  // the build on it); render nothing rather than an empty chip if one slips in.
  const known = terms.filter((term) => glossary[term]);
  if (known.length === 0) return null;

  const nameOf = (term) => (glossary[term][lang] || glossary[term].en).s || term;
  const open = openTerm && glossary[openTerm] ? glossary[openTerm][lang] || glossary[openTerm].en : null;

  return (
    <div style={{ marginTop: space["3"] }}>
      <Text
        as="span"
        variant="caption"
        color={ink.muted}
        style={{ display: "inline-flex", alignItems: "center", gap: space["1"], fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
      >
        <Icon name="book" size="1em" /> {label || t.lessonTermsLabel}
      </Text>

      <div style={{ display: "flex", flexWrap: "wrap", gap: space["2"], marginTop: space["2"] }}>
        {known.map((term) => {
          const isOpen = openTerm === term;
          return (
            <button
              key={term}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenTerm(isOpen ? null : term)}
              style={{
                display: "inline-flex", alignItems: "center", gap: space["1"],
                // The horizontal padding rises with the height: a 44px-tall pill
                // on 12px of side padding reads as a narrow capsule, and these
                // wrap into rows where the proportion is what the eye reads.
                padding: `${space["1"]}px ${space["4"]}px`,
                minHeight: MIN_TAP,
                borderRadius: radius.full,
                border: `1px solid ${isOpen ? ink.accent : line.strong}`,
                background: isOpen ? surface.accentWash : surface.card,
                color: isOpen ? ink.accent : ink.body,
                fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {nameOf(term)}
            </button>
          );
        })}
      </div>

      {/* Always rendered so aria-controls always resolves to a real element. */}
      <div
        id={panelId}
        style={
          open
            ? {
                marginTop: space["3"],
                padding: space["3"],
                borderRadius: radius.md,
                background: surface.sunken,
                borderLeft: `3px solid ${ink.accent}`,
              }
            : undefined
        }
      >
        {open && (
          <>
            <Text variant="small" color={ink.strong} style={{ fontWeight: 700 }}>
              {open.s || openTerm}
            </Text>
            <Text variant="small" color={ink.body} style={{ marginTop: space["1"] }}>
              {open.f}
            </Text>
            {open.ex && (
              <Text variant="small" color={ink.muted} style={{ marginTop: space["2"], fontStyle: "italic" }}>
                {open.ex}
              </Text>
            )}
          </>
        )}
      </div>
    </div>
  );
}
