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

import { AsymmetryChart, Bar, CycleChart, GrowthCurve, ProportionBar, YieldCurve } from "./charts.jsx";
import { Text } from "./ui.jsx";
import {
  balanceSheetCaption, balanceSheetHistory, cycleChartDescription,
  phaseNames, trendLabel,
} from "../content/markets.js";
import {
  budgetCaption, budgetDescription, budgetLabels, budgetSegments, budgetTitle,
  compoundCaption, compoundDescription, compoundLabels, compoundSeries, compoundTitle, compoundYears,
  lossAxisLabel, lossCaption, lossDescription, lossFelt, lossLabels, lossTitle,
} from "../content/moneyVisuals.js";
import { graph, ink, space } from "../theme.js";

// Which lesson gets which diagram. Only lessons whose subject *is* the diagram
// appear here — a chart bolted onto an unrelated lesson would be decoration,
// and decoration is what §3.1.1 set out to remove.
//
// The money entries landed 2026-08-16 (backlog item 27). Before them every
// diagram sat on the economy track, which meant the app's stated differentiator
// (§3.0.4) was absent from the 28 lessons §0 calls the actual product — and
// from lesson 1, the first screen a new install opens.
export const LESSON_VISUALS = {
  // money
  1: "budgetSplit",    // Budgeting: Know Where Your Money Goes
  3: "compounding",    // Compound Interest: Money That Makes Money
  27: "lossAsymmetry", // Why Does Losing $50 Hurt More Than Finding $50 Feels Good?
  // economy
  32: "cycle",         // The Short-Term Debt Cycle
  33: "cycle",         // The Long-Term Debt Cycle
  36: "yieldCurve",    // The Yield Curve: Crystal Ball
  37: "balanceSheet",  // QE & QT: The Fed's Power Tools
  38: "cycle",        // The 4 Phases of Economic Cycles
};

const CURVE_TYPES = ["normal", "flat", "inverted", "steep"];

// Which `kind`s are money-track figures — drives the figcaption note below.
const MONEY_VISUALS = new Set(["budgetSplit", "compounding", "lossAsymmetry"]);

// Figures are US dollars in every language — the lessons' own worked examples
// are written that way, and converting them per locale would make the chart
// disagree with the prose beside it.
const usd = (n) => `$${n.toLocaleString("en-US")}`;

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

      {kind === "budgetSplit" && (
        <ProportionBar
          title={budgetTitle[lang]}
          segments={budgetSegments.map((s, i) => ({ label: budgetLabels[lang][i], value: s.value }))}
          colors={[graph.blue, graph.amber, graph.green]}
          labelInks={[ink.accent, ink.warn, ink.ok]}
          formatValue={usd}
          description={budgetDescription[lang]}
          caption={budgetCaption[lang]}
        />
      )}

      {kind === "compounding" && (
        <GrowthCurve
          title={compoundTitle[lang]}
          xValues={compoundYears}
          series={compoundSeries.map((s, i) => ({ label: compoundLabels[lang][i], values: s.values }))}
          colors={[graph.green, graph.neutral]}
          labelInks={[ink.ok, ink.muted]}
          formatValue={usd}
          description={compoundDescription[lang]}
          caption={compoundCaption[lang]}
        />
      )}

      {kind === "lossAsymmetry" && (
        <AsymmetryChart
          title={lossTitle[lang]}
          axisLabel={lossAxisLabel[lang]}
          bars={[
            { label: lossLabels[lang][0], felt: lossFelt.gain },
            { label: lossLabels[lang][1], felt: lossFelt.loss },
          ]}
          colors={[graph.green, graph.red]}
          labelInks={[ink.ok, ink.bad]}
          description={lossDescription[lang]}
          caption={lossCaption[lang]}
        />
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

      {/*
        Economy diagrams describe market shapes, so they carry the "not live
        market data" note (§2.3). The money diagrams aren't market data at all —
        they plot a lesson's own worked arithmetic — so they carry a note aimed
        at the risk they actually have: that a reader takes an illustrative 6%
        for a return to expect (§10.1).
      */}
      <figcaption style={{ marginTop: space["2"] }}>
        <Text as="span" variant="caption" color={ink.muted}>
          {MONEY_VISUALS.has(kind) ? t.illustrationNote : t.scenarioNote}
        </Text>
      </figcaption>
    </figure>
  );
}
