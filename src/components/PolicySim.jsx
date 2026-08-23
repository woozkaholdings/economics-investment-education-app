// ═══════════════════════════════════════════════════════════════════════════
// POLICY SIMULATOR — "Be the Fed Chair"
//
// Backlog item 34. Renders inside the lesson that hosts it, the same way
// LessonVisual does, and renders nothing at all for every other lesson — so
// this is one component and one call site in LessonReader, not a fourth tab.
// §3.1 cut the app to three destinations on purpose, and an interactive piece
// is not a reason to reopen that.
//
// Why a simulator and not another diagram (§3.0.4): a diagram shows a
// mechanism; this lets the learner move one and read what it set off. The
// hosting lesson's last section ends on "there's no equation that resolves the
// trade-off — it's a judgment call," which is an invitation with nothing
// behind it until the reader can actually make the call.
//
// Interaction model, and the two rules it follows:
//
//   1. NO SCORE, NO CORRECT ANSWER. Every lever returns what it sets in
//      motion, including the ones a committee would rarely pick — those are
//      the most instructive, because they show the dial working against both
//      halves of the mandate at once. So the options are *buttons*, not radio
//      inputs: a radiogroup would imply one right choice and one submission.
//      Picking a second lever swaps the panel; nothing is locked in.
//
//   2. THE OUTCOME IS ANNOUNCED, NOT JUST SHOWN. The panel is a live region
//      (`role="status"`, polite) because the text replaces itself in place
//      when a second lever is picked — a sighted reader sees the swap, and
//      without the live region a screen-reader user would not be told it
//      happened. It sits immediately after the buttons in DOM order too, so
//      linear reading lands on it next.
//
// Instrumented with `sim_lever_chosen` (§9.2's "name the event that would
// refute the feature"), which is the measurement behind CLAIMS.md A7 — the
// §3.0.4 bet that interactive content is what a chat window cannot copy. See
// `choose()` below for what fires and, more importantly, what does not.
//
// The content, its §10.1/§2.3 reasoning and the no-numbered-references rule
// all live in content/policyScenarios.js.
// ═══════════════════════════════════════════════════════════════════════════

import { useId, useState } from "react";
import { EVENTS, track } from "../lib/analytics.js";
import { scenariosForLesson } from "../content/policyScenarios.js";
import Icon from "./Icon.jsx";
import { Card, Stack, Text } from "./ui.jsx";
import { ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

function Scenario({ scenario, lessonId, t, lang }) {
  const [chosen, setChosen] = useState(null);
  const panelId = useId();

  const option = scenario.options.find((o) => o.id === chosen) || null;

  // Clearing a lever is undoing an interaction, not having one — so it must
  // not fire. A7's threshold is "did this learner drive the model", and an
  // event that fires on both edges of a toggle answers a different question
  // (how many clicks) while looking like it answers that one. The early
  // return is the guard, and check-data.mjs §13c asserts it stays above the
  // track() call rather than below it.
  //
  // Only ids travel: the lesson, the scenario, and the lever picked. The
  // scenario prose is five-language content, not a measurement, and nothing
  // here identifies a person (see this module's own header in lib/analytics.js).
  function choose(optionId) {
    if (optionId === chosen) {
      setChosen(null);
      return;
    }
    setChosen(optionId);
    track(EVENTS.SIM_LEVER_CHOSEN, { lessonId, scenarioId: scenario.id, optionId });
  }

  return (
    <div>
      <Text variant="caption" color={ink.muted} style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {t.policySimSituation}
      </Text>
      <Text variant="body" color={ink.body} style={{ marginTop: space["1"] }}>
        {scenario.situation[lang]}
      </Text>
      <Text variant="small" color={ink.strong} style={{ margin: `${space["3"]}px 0 ${space["2"]}px`, fontWeight: 700 }}>
        {scenario.question[lang]}
      </Text>

      <div style={{ display: "flex", flexWrap: "wrap", gap: space["2"] }}>
        {scenario.options.map((o) => {
          const isChosen = chosen === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={isChosen}
              aria-controls={panelId}
              onClick={() => choose(o.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: space["1"],
                padding: `${space["2"]}px ${space["4"]}px`,
                minHeight: MIN_TAP,
                borderRadius: radius.full,
                border: `1px solid ${isChosen ? ink.accent : line.strong}`,
                background: isChosen ? surface.accentWash : surface.card,
                color: isChosen ? ink.accent : ink.body,
                fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {o.label[lang]}
            </button>
          );
        })}
      </div>

      {/* Always rendered, so aria-controls always resolves to a real element. */}
      <div
        id={panelId}
        role="status"
        style={
          option
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
        {option && (
          <>
            <Text variant="caption" color={ink.muted} style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {t.policySimOutcome}
            </Text>
            <Text variant="small" color={ink.body} style={{ marginTop: space["1"] }}>
              {option.outcome[lang]}
            </Text>
          </>
        )}
      </div>
    </div>
  );
}

export default function PolicySim({ lessonId, t, lang }) {
  const scenarios = scenariosForLesson(lessonId);
  if (scenarios.length === 0) return null;

  return (
    <Card style={{ marginTop: space["5"] }}>
      <Text
        as="h2"
        variant="heading"
        color={ink.strong}
        style={{ display: "flex", alignItems: "center", gap: space["2"] }}
      >
        <Icon name="target" size="1em" /> {t.policySimTitle}
      </Text>
      <Text variant="small" color={ink.muted} style={{ margin: `${space["1"]}px 0 ${space["5"]}px` }}>
        {t.policySimIntro}
      </Text>

      <Stack gap={space["5"]}>
        {scenarios.map((scenario) => (
          <Scenario key={scenario.id} scenario={scenario} lessonId={lessonId} t={t} lang={lang} />
        ))}
      </Stack>

      <Text variant="caption" color={ink.muted} style={{ marginTop: space["4"] }}>
        {t.policySimNote}
      </Text>
    </Card>
  );
}
