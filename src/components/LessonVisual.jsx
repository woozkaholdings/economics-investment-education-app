// ═══════════════════════════════════════════════════════════════════════════
// LESSON VISUAL
//
// Puts the interactive diagrams inside the lessons that explain them.
//
// They previously lived only in Reference → Market signals, which meant the
// lesson on the yield curve was pure prose while the actual curve sat three
// taps away. That is backwards: the launch plan calls the diagrams the thing a
// chat window cannot do (§3.0.4), and the research on this category is
// consistent that the visual should *be* the explanation, not an appendix.
//
// Reference keeps its own copy on purpose — there it serves a different job
// (look something up again later), which is not the duplication §3.1 removed.
// ═══════════════════════════════════════════════════════════════════════════

import { Bar, CycleChart, YieldCurve } from "./charts.jsx";
import { Text } from "./ui.jsx";
import {
  balanceSheetCaption, balanceSheetHistory, cycleChartDescription,
  phaseNames, trendLabel,
} from "../content/markets.js";
import { graph, ink, space } from "../theme.js";

// Which lesson gets which diagram. Only lessons whose subject *is* the diagram
// appear here — a chart bolted onto an unrelated lesson would be decoration,
// and decoration is what §3.1.1 set out to remove.
export const LESSON_VISUALS = {
  4: "cycle",         // The Short-Term Debt Cycle
  5: "cycle",         // The Long-Term Debt Cycle
  8: "yieldCurve",    // The Yield Curve: Crystal Ball
  9: "balanceSheet",  // QE & QT: The Fed's Power Tools
  10: "cycle",        // The 4 Phases of Economic Cycles
};

const CURVE_TYPES = ["normal", "flat", "inverted", "steep"];

export default function LessonVisual({ lessonId, t, lang }) {
  const kind = LESSON_VISUALS[lessonId];
  if (!kind) return null;

  return (
    <figure style={{ margin: `${space["5"]}px 0 0` }}>
      {kind === "cycle" && (
        <CycleChart
          phaseNames={phaseNames[lang]}
          trendLabel={trendLabel[lang]}
          description={cycleChartDescription[lang]}
        />
      )}

      {kind === "yieldCurve" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space["2"] }}>
          {CURVE_TYPES.map((type) => (
            <YieldCurve
              key={type}
              type={type}
              label={{ normal: t.curveNormal, flat: t.curveFlat, inverted: t.curveInverted, steep: t.curveSteep }[type]}
            />
          ))}
        </div>
      )}

      {kind === "balanceSheet" && (
        <Bar
          title={t.balanceSheet}
          data={balanceSheetHistory.map((d) => ({ label: d.label[lang], value: d.value }))}
          colors={[graph.neutral, graph.green, graph.red, graph.green, graph.red]}
          height={90}
          caption={balanceSheetCaption[lang]}
        />
      )}

      <figcaption style={{ marginTop: space["2"] }}>
        <Text as="span" variant="caption" color={ink.muted}>{t.scenarioNote}</Text>
      </figcaption>
    </figure>
  );
}
