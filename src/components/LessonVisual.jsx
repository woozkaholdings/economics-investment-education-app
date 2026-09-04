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

import { useState } from "react";
import { AsymmetryChart, BalanceBand, Bar, BracketStack, CycleChart, GapColumns, GrowthCurve, NestedCycles, OutcomeGrid, PreferenceFlip, ProportionBar, SpendingLoop, SplitBand, TradeoffPlot, YieldCurve } from "./charts.jsx";
import { Segmented, Text } from "./ui.jsx";
import {
  balanceSheetCaption, balanceSheetDescription, balanceSheetFormat, balanceSheetHistory, balanceSheetUnit,
  cycleChartDescription, phaseNames,
  deleveragingAnchors, deleveragingCaption, deleveragingDescription, deleveragingEndLabels,
  deleveragingGoodLabel, deleveragingTitle, deleveragingUglyLabel,
  nestedCyclesCaption, nestedCyclesDescription, nestedCyclesSeriesLabel, nestedCyclesShortLabel,
  nestedCyclesSpanLabel, nestedCyclesTitle,
  spendingLoopCaption, spendingLoopDescription, spendingLoopSteps, spendingLoopTitle,
  trendLabel, yieldCurveDescriptions,
} from "../content/markets.js";
import {
  bracketBands, bracketCaption, bracketColumnLabels, bracketDescription, bracketIncomes,
  bracketRaiseLabel, bracketSummaryLabels, bracketTax, bracketTierLabels, bracketTitle,
  budgetCaption, budgetDescription, budgetLabels, budgetSegments, budgetTitle,
  compoundCaption, compoundDescription, compoundLabels, compoundSeries, compoundTitle, compoundYears,
  flipAxisLabels, flipCaption, flipCrossing, flipDescription, flipMarkerLabel, flipMonths,
  flipSeries, flipSeriesLabels, flipTitle, flipYNorm, flipZoneLabels,
  gapAxisLabel, gapCaption, gapDescription, gapEarners, gapOf, gapRuleLabel, gapSegmentLabels,
  gapTitle,
  incomeKinds,
  lossAxisLabel, lossCaption, lossDescription, lossFelt, lossLabels, lossTitle,
  outcomeCaption, outcomeCells, outcomeColumnLabels, outcomeDescription, outcomeHereLabel,
  outcomeRowLabels, outcomeSpanLabel, outcomeTitle,
  splitCaption, splitCrossing, splitDescription, splitEndLabels, splitInterestShare,
  splitMarkerLabel, splitSamples, splitSegmentLabels, splitTitle,
  tradeCaption, tradeDescription, tradeEndLabels, tradeKindLabels, tradeTitle, tradeUpfrontLabel,
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
// Re-measured 2026-09-04 with the same parser control (it must find 1, 30 and
// 44 and must not find 2, 29 or 31): coverage is economy 7/12, essentials 4/15,
// money 5/17 — 16 of 44,
// 0 orphan ids. Lesson 30 is the first figure added for the reason the path
// itself gives rather than for a track's count: in display order the first
// three lessons a new install meets are 29, 30 and 31, and until this entry
// none of them carried a figure, so the first diagram a new learner ever saw
// was on the fourth screen (§3.2, "the first five minutes"). 29 and 31 are
// still bare and that is a measured decision, not an oversight — see backlog
// item 27 for why neither clears the bar on its own prose.
// Do not quote a coverage count from backlog item 27; re-run the parse.
export const LESSON_VISUALS = {
  // essentials (1/3/7) and money (17/23/27/28/44) — personal finance either way
  1: "budgetSplit",    // Budgeting: Know Where Your Money Goes
  3: "compounding",    // Compound Interest: Money That Makes Money
  7: "taxBrackets",    // Taxes: How Your Paycheck Is Actually Taxed
  12: "mortgageSplit",  // Renting vs. Buying (its "What a Mortgage Payment Is Actually Made Of" section)
  17: "earningsGap",   // Where Did the Raise Go?
  23: "preferenceFlip",// Why 'Later' Never Feels as Real as 'Now'
  27: "lossAsymmetry", // Why Does Losing $50 Hurt More Than Finding $50 Feels Good?
  28: "outcomeGrid",   // Does One Lucky Win Prove You Have a System?
  44: "incomeTradeoff",// The Part the Word "Passive" Leaves Out
  // economy
  30: "spendingLoop", // Credit: The Most Important Part (its "Spending Chain" section)
  34: "deleveragingMix", // Deleveraging: The 4 Tools (its "Beautiful vs Ugly Deleveraging" section)
  32: "cycle",         // The Short-Term Debt Cycle
  33: "nestedCycles",  // The Long-Term Debt Cycle — NOT "cycle"; see charts.jsx's NestedCycles header
  36: "yieldCurve",    // The Yield Curve: Crystal Ball
  37: "balanceSheet",  // QE & QT: The Fed's Power Tools
  38: "cycle",        // The 4 Phases of Economic Cycles
};

const CURVE_TYPES = ["normal", "flat", "inverted", "steep"];

// Which `kind`s are personal-finance figures — drives the note rendered
// below the figure (a plain <Text>, not a figcaption — see the wrapper
// comment in the component). The constant keeps its MONEY_VISUALS name (it is referenced further
// down and in §21's checks); the set spans `essentials` and `money` since the
// 2026-08-19 split, so the name is a label, not a track claim.
const MONEY_VISUALS = new Set(["budgetSplit", "compounding", "taxBrackets", "mortgageSplit", "earningsGap", "preferenceFlip", "lossAsymmetry", "incomeTradeoff", "outcomeGrid"]);

// Figures are US dollars in every language — the lessons' own worked examples
// are written that way, and converting them per locale would make the chart
// disagree with the prose beside it.
const usd = (n) => `$${n.toLocaleString("en-US")}`;

// ── Lesson 36's four curve shapes, as ONE curve ───────────────────────────
//
// This was a 2x2 grid of four static SVGs until 2026-08-31. The grid matched
// the lesson's first section, which is a taxonomy — four named shapes with a
// definition each — so it was not wrong. What it could not do is the thing the
// REST of the lesson is about: the second section says "that gap flipping
// negative", describes the curve inverting in mid-2022 and turning positive
// again in 2024, and the takeaway is "when the yield curve inverts". Four
// panels say "there are four kinds of curve". One curve that changes shape
// says "there is one curve, and it moves" — which is the claim the lesson
// actually makes, and the one prose cannot make on its own.
//
// It is also the app's own stated differentiator finally being built:
// charts.jsx's header has said since it was written that "the point is that a
// reader *sees* a curve invert rather than reading a description of one", and
// LAUNCH_PLAN §3.0.4 names the same example. Measured 2026-08-31 before this
// change: zero of the 14 shipped figures moved at all.
//
// THE TRADE, stated because it is real: the four shapes are no longer visible
// simultaneously here. Two things pay for it. (1) Legibility (§3.0.7) — at
// 375px a 2-up grid gave each curve about 160px of width against a 140x75
// viewBox capped at 64px tall; one curve gets the full column and roughly
// three times the linear size, and the 2Y/10Y/30Y labels scale with it. (2)
// §3.0.1, one idea per screen. The simultaneous comparison still ships
// unchanged in Reference > Market signals, which is the "look it up again
// later" surface where comparison, not motion, is the job.
//
// ZERO new locale keys: the four segment labels are `t.curveNormal` and its
// three siblings, which were already the grid's captions, and the per-shape
// text alternative is `yieldCurveDescriptions`, already five-language content.
function YieldCurveShapes({ t, lang }) {
  const [type, setType] = useState("normal");
  const labels = { normal: t.curveNormal, flat: t.curveFlat, inverted: t.curveInverted, steep: t.curveSteep };

  return (
    <div>
      <Segmented
        items={CURVE_TYPES.map((key) => ({ key, label: labels[key] }))}
        value={type}
        onChange={setType}
        ariaLabel={t.yieldCurveLabel}
        idPrefix="yield-curve"
        panelId="yield-curve-panel"
      />
      {/* The figure is the tab's panel, so the shape a screen reader is told
          about is tied to the tab that selected it. `YieldCurve`'s own
          `role="img"` carries the per-shape description, so the panel is a
          container and deliberately not labeled a second time. */}
      <div id="yield-curve-panel" role="tabpanel" aria-labelledby={`yield-curve-${type}`}>
        <YieldCurve
          type={type}
          label={labels[type]}
          description={yieldCurveDescriptions[type][lang]}
          animated
          maxHeight={190}
        />
      </div>
    </div>
  );
}

export default function LessonVisual({ lessonId, t, lang }) {
  const kind = LESSON_VISUALS[lessonId];
  if (!kind) return null;

  // ⚠️ A <div>, NOT a <figure>, and the reason is measured rather than stylistic.
  // Every one of the twelve primitives in charts.jsx emits its OWN <figure> (and
  // all but CycleChart its own <figcaption>), so wrapping them here put a
  // <figure> whose entire content is one <figure> around all 14 shipped lesson
  // figures — counted live on 2026-09-02, 14 of 14, every one `figures: 2,
  // nested: 1`.
  //
  // The argument for changing it is the app's OWN other chart surface, not a
  // reading of the spec. `Reference > Market Dashboard` renders these same
  // primitives unwrapped — measured the same day: 6 figures, 0 nested — and it
  // ships THIS EXACT NOTE as a plain <p> outside every figure. So lesson figures
  // and dashboard figures disagreed about their own markup while displaying the
  // same component, and this makes the lessons match what already shipped.
  //
  // ⛔ WHAT WAS NOT MEASURED, because it cannot be here. "A screen reader
  // announces two figures and two captions" is HTML-AAM's mapping, not an
  // observation: `read_page` in this environment prints no `figure` role AT ALL,
  // and the control proves that is the tool and not the page — on the Market
  // Dashboard, which has six figures and zero nesting, it prints no `figure`
  // either. Do not upgrade the spec inference into a measurement in a later
  // entry. The DOM structure and the cross-surface inconsistency are the
  // measured facts; the announcement is an inference from them.
  //
  // The note is now adjacent text rather than a figcaption, so it is no longer
  // programmatically tied to the figure — a real if small trade, taken because
  // the alternative (threading a `note` prop through twelve primitives, or
  // appending it to fourteen `caption` props) is a far larger change to markup
  // for a disclaimer the app already renders this way elsewhere. It keeps its
  // position in reading order, immediately after the figure.
  return (
    <div style={{ margin: `${space["5"]}px 0 0` }}>
      {kind === "cycle" && (
        <CycleChart
          phaseNames={phaseNames[lang]}
          trendLabel={trendLabel[lang]}
          description={cycleChartDescription[lang]}
        />
      )}

      {/*
        The only figure here whose subject is a RATIO OF TWO TIMESCALES — and
        the only one that exists because another figure was WRONG for its
        lesson rather than absent from it. Lessons 32, 33 and 38 all rendered
        `cycle` until 2026-09-04, byte-identically; `CycleChart` labels four
        phase dots that are lesson 38's vocabulary, and lesson 33's own prose
        carries one of the four in all five languages. Lesson 33 states both
        spans it needs — "every 5-8 years" and "75-100 years" — in adjacent
        sentences and asks the reader to divide them; see charts.jsx.
      */}
      {kind === "nestedCycles" && (
        <NestedCycles
          title={nestedCyclesTitle[lang]}
          seriesLabel={nestedCyclesSeriesLabel[lang]}
          shortLabel={nestedCyclesShortLabel[lang]}
          spanLabel={nestedCyclesSpanLabel[lang]}
          colors={[graph.blue, graph.amber, graph.neutral]}
          labelInks={[ink.accent, ink.warn, ink.muted]}
          description={nestedCyclesDescription[lang]}
          caption={nestedCyclesCaption[lang]}
        />
      )}

      {/*
        The only figure here whose subject is a CLOSED LOOP. Lesson 30 writes
        its own claim as a line of arrows and has to write its first term
        twice and then say "and so on", because a sentence cannot join its end
        to its beginning. Everything this component renders except the text
        alternative is a verbatim substring of that lesson in the same
        language — see markets.js and `check-data.mjs` §64.
      */}
      {kind === "spendingLoop" && (
        <SpendingLoop
          title={spendingLoopTitle[lang]}
          steps={spendingLoopSteps[lang]}
          caption={spendingLoopCaption[lang]}
          description={spendingLoopDescription[lang]}
        />
      )}

      {/*
        The only figure here whose subject is a TWO-SIDED BOUND. Lesson 34's
        takeaway writes it as one sentence with a "but" in the middle — "Print
        enough money to offset deflation, but not so much you cause
        hyperinflation" — and a sentence cannot show that its floor and its
        ceiling are two ends of the same dial with the good outcome between
        them. The two outer zones carry the SAME label on purpose; see
        charts.jsx and `check-data.mjs` §69.
      */}
      {kind === "deleveragingMix" && (
        <BalanceBand
          title={deleveragingTitle[lang]}
          zones={[
            { label: deleveragingUglyLabel[lang], anchor: deleveragingAnchors[lang][0], good: false },
            { label: deleveragingGoodLabel[lang], anchor: deleveragingAnchors[lang][1], good: true },
            { label: deleveragingUglyLabel[lang], anchor: deleveragingAnchors[lang][2], good: false },
          ]}
          endLabels={deleveragingEndLabels[lang]}
          caption={deleveragingCaption[lang]}
          description={deleveragingDescription[lang]}
        />
      )}

      {kind === "yieldCurve" && <YieldCurveShapes t={t} lang={lang} />}

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
        The only figure here whose two parts are COMPLEMENTARY. Lesson 12
        writes the pattern as two snapshots ("early payments are mostly
        interest, and later payments are mostly principal") and then locates
        the changeover in a sentence of its own — "roughly two-thirds of the
        way through its term" — and prose cannot put that position next to the
        midpoint it is being contrasted with. The boundary is handed the share
        FUNCTION rather than a sampled series, so the crossing the marker sits
        on and the curve it sits under are the same arithmetic; see
        moneyVisuals.js for the derivation and `check-data.mjs` §70.
      */}
      {kind === "mortgageSplit" && (
        <SplitBand
          title={splitTitle[lang]}
          samples={splitSamples}
          share={splitInterestShare}
          crossing={splitCrossing}
          segmentLabels={splitSegmentLabels[lang]}
          markerLabel={splitMarkerLabel[lang]}
          endLabels={splitEndLabels[lang]}
          colors={[graph.blue, graph.green]}
          labelInks={[ink.accent, ink.ok]}
          description={splitDescription[lang]}
          caption={splitCaption[lang]}
        />
      )}

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
          yNorm={flipYNorm}
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

      {/*
        Both columns are read off `gapEarners` — including the column labels,
        which are the earnings themselves formatted by `usd`. Typing
        "$120,000" as a label beside a column sized from a separate constant is
        how a figure comes to disagree with itself, and §21 already had to guard
        that shape once on lesson 7.
      */}
      {kind === "earningsGap" && (
        <GapColumns
          title={gapTitle[lang]}
          columns={gapEarners.map((e) => ({ label: usd(e.earns), total: e.earns, gap: gapOf(e) }))}
          segmentLabels={gapSegmentLabels[lang]}
          ruleLabel={gapRuleLabel[lang]}
          axisLabel={gapAxisLabel[lang]}
          colors={[graph.blue, graph.green]}
          labelInks={[ink.accent, ink.ok]}
          formatValue={usd}
          description={gapDescription[lang]}
          caption={gapCaption[lang]}
        />
      )}

      {/*
        The only figure here whose dots are ORDINAL. `incomeKinds` carries the
        ranks and the two prose sentences they come from; the plot is handed
        them in array order, so the horizontal ordering is the data's own and
        cannot drift away from `moneyVisuals.js` by an edit here.
      */}
      {kind === "incomeTradeoff" && (
        <TradeoffPlot
          title={tradeTitle[lang]}
          points={incomeKinds.map((k, i) => ({ key: k.key, label: tradeKindLabels[lang][i], upfront: k.upfront }))}
          endLabels={tradeEndLabels[lang]}
          upfrontLabel={tradeUpfrontLabel[lang]}
          colors={{ rail: graph.neutral, dot: graph.blue }}
          description={tradeDescription[lang]}
          caption={tradeCaption[lang]}
        />
      )}

      {kind === "outcomeGrid" && (
        <OutcomeGrid
          title={outcomeTitle[lang]}
          columnLabels={outcomeColumnLabels[lang]}
          rowLabels={outcomeRowLabels[lang]}
          cells={outcomeCells}
          spanLabel={outcomeSpanLabel[lang]}
          hereLabel={outcomeHereLabel[lang]}
          colors={{ rule: graph.neutral, dot: graph.neutral, here: graph.blue }}
          description={outcomeDescription[lang]}
          caption={outcomeCaption[lang]}
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
          unit={balanceSheetUnit[lang]}
          data={balanceSheetHistory.map((d) => ({ label: d.label[lang], value: d.value }))}
          colors={[graph.neutral, graph.green, graph.red, graph.green, graph.red]}
          height={90}
          formatValue={balanceSheetFormat}
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
      <div style={{ marginTop: space["2"] }}>
        <Text as="span" variant="caption" color={ink.muted}>
          {MONEY_VISUALS.has(kind) ? t.illustrationNote : t.scenarioNote}
        </Text>
      </div>
    </div>
  );
}
