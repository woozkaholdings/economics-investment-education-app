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

import { AsymmetryChart, Bar, BracketStack, CycleChart, GrowthCurve, PreferenceFlip, ProportionBar, YieldCurve } from "./charts.jsx";
import { Text } from "./ui.jsx";
import {
  balanceSheetCaption, balanceSheetDescription, balanceSheetHistory,
  cycleChartDescription, phaseNames, trendLabel, yieldCurveDescriptions,
} from "../content/markets.js";
import {
  bracketBands, bracketCaption, bracketColumnLabels, bracketDescription, bracketIncomes,
  bracketRaiseLabel, bracketSummaryLabels, bracketTax, bracketTierLabels, bracketTitle,
  budgetCaption, budgetDescription, budgetLabels, budgetSegments, budgetTitle,
  compoundCaption, compoundDescription, compoundLabels, compoundSeries, compoundTitle, compoundYears,
  flipAxisLabels, flipCaption, flipCrossing, flipDescription, flipMarkerLabel, flipMonths,
  flipSeries, flipSeriesLabels, flipTitle, flipZoneLabels,
  lossAxisLabel, lossCaption, lossDescription, lossFelt, lossLabels, lossTitle,
} from "../content/moneyVisuals.js";
import { graph, ink, space, surface } from "../theme.js";

// Which lesson gets which diagram. Only lessons whose subject *is* the diagram
// appear here — a chart bolted onto an unrelated lesson would be decoration,
// and decoration is what §3.1.1 set out to remove.
//
// The personal-finance entries landed 2026-08-16 (backlog item 27). Before
// them every diagram sat on the economy track, which meant the app's stated
// differentiator (§3.0.4) was absent from the 28 lessons §0 called the actual
// product at the time — and from lesson 1, which was then the first screen a
// new install opened. Both framings have since moved: economy leads as of
// 2026-08-18 (a new install now opens on lesson 29) and the 2026-08-19
// essentials split re-tracked 1-15, so of the five personal-finance ids below
// 1/3/7 are `essentials` and 23/27 are `money`.
//
// Measured 2026-08-27 with a parser control, because backlog item 27's own
// status line still reads "money is 4/28" and that stopped being true at the
// track split: coverage is economy 5/12, essentials 3/15, money 2/17. Lesson
// 23 is the fifth personal-finance figure and the second on the `money` track
// — the track LAUNCH_PLAN.md §0 has called the product since the 2026-08-18
// reversal, and the one that had a single diagram across seventeen lessons.
export const LESSON_VISUALS = {
  // essentials (1/3/7) and money (23/27) — personal finance either way
  1: "budgetSplit",    // Budgeting: Know Where Your Money Goes
  3: "compounding",    // Compound Interest: Money That Makes Money
  7: "taxBrackets",    // Taxes: How Your Paycheck Is Actually Taxed
  23: "preferenceFlip",// Why 'Later' Never Feels as Real as 'Now'
  27: "lossAsymmetry", // Why Does Losing $50 Hurt More Than Finding $50 Feels Good?
  // economy
  32: "cycle",         // The Short-Term Debt Cycle
  33: "cycle",         // The Long-Term Debt Cycle
  36: "yieldCurve",    // The Yield Curve: Crystal Ball
  37: "balanceSheet",  // QE & QT: The Fed's Power Tools
  38: "cycle",        // The 4 Phases of Economic Cycles
};

const CURVE_TYPES = ["normal", "flat", "inverted", "steep"];

// Which `kind`s are personal-finance figures — drives the figcaption note
// below. The constant keeps its MONEY_VISUALS name (it is referenced further
// down and in §21's checks); the set spans `essentials` and `money` since the
// 2026-08-19 split, so the name is a label, not a track claim.
const MONEY_VISUALS = new Set(["budgetSplit", "compounding", "taxBrackets", "preferenceFlip", "lossAsymmetry"]);

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
              description={yieldCurveDescriptions[type][lang]}
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

      {/*
        Every number below is derived from `bracketTiers` + `bracketIncomes`,
        never written out here. The diagram's claim is that the layers under the
        old income line are unchanged, and two hand-typed stacks can drift apart
        while each still looks plausible — so both come out of one function, and
        `check-data.mjs` §21 asserts the property rather than trusting it.
      */}
      {kind === "taxBrackets" && (() => {
        const before = bracketBands(bracketIncomes.before);
        const after = bracketBands(bracketIncomes.after, bracketIncomes.before);
        const raise = bracketIncomes.after - bracketIncomes.before;
        const kept = raise - (bracketTax(after) - bracketTax(before));
        return (
          <BracketStack
            title={bracketTitle[lang]}
            columns={[
              { label: bracketColumnLabels[lang][0], total: bracketIncomes.before, bands: before },
              { label: bracketColumnLabels[lang][1], total: bracketIncomes.after, bands: after },
            ]}
            tierColors={[graph.blue, graph.green, graph.amber]}
            tierLabels={bracketTierLabels[lang]}
            raiseLabel={bracketRaiseLabel[lang]}
            summary={[
              {
                label: bracketSummaryLabels[lang][0],
                value: `${usd(bracketIncomes.before - bracketTax(before))} → ${usd(bracketIncomes.after - bracketTax(after))}`,
              },
              { label: bracketSummaryLabels[lang][1], value: `${usd(kept)} / ${usd(raise)}` },
            ]}
            description={bracketDescription[lang]}
            caption={bracketCaption[lang]}
          />
        );
      })()}

      {/*
        Unlike the four figures above, this one's x-axis is not a quantity —
        it is a vantage point, and the two ends of it are the lesson's own two
        paragraphs. The crossing is solved in `moneyVisuals.js` and passed in
        rather than found among the sampled months, so the marker sits where
        the preference actually reverses and not at the nearest sample.
      */}
      {kind === "preferenceFlip" && (
        <PreferenceFlip
          title={flipTitle[lang]}
          xValues={flipMonths}
          series={flipSeries().map((s, i) => ({ label: flipSeriesLabels[lang][i], values: s.values }))}
          crossing={flipCrossing()}
          colors={[graph.amber, graph.green]}
          labelInks={[ink.warn, ink.ok]}
          zones={flipZoneLabels[lang]}
          zoneColors={[surface.okWash, surface.warnWash]}
          zoneEdges={[graph.green, graph.amber]}
          markerLabel={flipMarkerLabel[lang]}
          axisLabels={flipAxisLabels[lang]}
          description={flipDescription[lang]}
          caption={flipCaption[lang]}
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
          description={balanceSheetDescription[lang]}
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
