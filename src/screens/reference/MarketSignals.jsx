// ═══════════════════════════════════════════════════════════════════════════
// MARKET SIGNALS
//
// A teaching surface, not a dashboard — it explains shapes and relationships,
// and carries no date and no live-looking figure (LAUNCH_PLAN §2.3). Filed
// under Reference because that is what it is: something you consult to read
// the charts a lesson just introduced.
//
// All copy lives in `content/markets.js`, translated; this file is layout.
//
// ── GLOSSARY CHIPS (2026-10-30) ───────────────────────────────────────────
// Each section ends in the lessons' own term row (`GlossaryTerms`, §3.0.3),
// for the same reason the lessons have it: a reader who has to leave this
// screen to find out what a yield curve is has lost the card they were
// reading. Measured on the built app that day: the rendered screen used ten
// glossary terms — GDP, inflation, interest rates, stocks, bonds, growth
// stocks, the yield curve, QE, QT, recessions — and defined none of them,
// while the lessons chip every term on first use. M0/M1/M2 get no chip
// because the money-supply list right here IS their definition.
// Each term is chipped once, in the section that uses it first, and the row
// keeps the lessons' "Terms in this section" label, which is true here too:
// every row sits inside the section it lists, right under the text that uses
// the terms (the first one in the screen's opening, under the <h1>). A key missing from
// `glossary.js` renders no chip, silently, so a renamed key must be updated
// here as well as in `lessonTerms.js`.
// ═══════════════════════════════════════════════════════════════════════════

import { Bar, CycleChart, YieldCurve } from "../../components/charts.jsx";
import GlossaryTerms from "../../components/GlossaryTerms.jsx";
import { Disclaimer, Note, Stack, Text } from "../../components/ui.jsx";
import {
  balanceSheetCaption, balanceSheetDescription, balanceSheetFormat, balanceSheetHistory, balanceSheetUnit,
  cycleChartDescription, moneyAggregates, moneySupplyCaption, phaseNames,
  rateEffects, ratePrinciples, scenario, trendLabel, yieldCurveDescriptions,
} from "../../content/markets.js";
import { graph, ink, line, radius, space, surface } from "../../theme.js";

const CURVE_TYPES = ["normal", "flat", "inverted", "steep"];

export default function MarketSignals({ t, lang }) {
  const curveLabels = {
    normal: t.curveNormal, flat: t.curveFlat, inverted: t.curveInverted, steep: t.curveSteep,
  };

  return (
    <div>
      <Note tone="neutral" style={{ marginBottom: space["4"] }}>{t.scenarioNote}</Note>

      <CycleChart
        phaseNames={phaseNames[lang]}
        trendLabel={trendLabel[lang]}
        description={cycleChartDescription[lang]}
      />

      <Note tone="warn" label={t.currentState} icon="info">
        {scenario[lang]}
      </Note>
      <div style={{ marginBottom: space["5"] }}>
        <GlossaryTerms terms={["GDP", "Inflation"]} t={t} lang={lang} />
      </div>

      {/* The direct push of a rate move on each asset class, all else equal (see markets.js) */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
        {t.rateHow}
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: space["2"] }}>
        {rateEffects.map((asset) => (
          <div key={asset.key} style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.md, padding: space["3"] }}>
            <Text variant="caption" color={ink.strong} style={{ fontWeight: 700, marginBottom: space["2"] }}>
              {asset.name[lang]}
            </Text>
            {/* Each row is a cause and an effect, and BOTH halves have to name
                what they are about. The right half used to be a bare arrow
                ("Rates ↑" opposite "↓"), which left the reader — and any screen
                reader, which announces the two glyphs identically — to guess
                what fell. `responds` supplies the noun, and it differs by asset:
                a bond has a price, cash has a yield, a currency has a value.
                It matters most on the cash and dollar cards, where the two
                arrows point the SAME way and the row otherwise read as a single
                statement about rates rather than as rates → asset.
                The two halves are styled DIFFERENTLY and the asymmetry is the
                fix, not an oversight. `nowrap` on the LEFT half plus `flexWrap`
                on the row is load-bearing, not tidying: at 320px, adding the noun
                pushed "Tasas ↑" onto two lines and stranded the ↑ on its own —
                reintroducing the exact ambiguity this fixes, in the other half of
                the row (measured 2026-09-02: 2 of 12 es labels broke before, 0
                after). The left half is short in all five languages — 83px at the
                worst measured setting, inside a 114px box — so `nowrap` costs it
                nothing.
                The RIGHT half carries `minWidth: 0` INSTEAD of `nowrap`, because
                it is the half that outgrows the card. `nowrap` there could not be
                honored: es "Rendimiento ↑" is 154px of text in a 114px box at 200%
                text zoom, so it spilled 40px past its own card onto the one beside
                it, where `body { overflow-x: hidden }` clips rather than scrolls.
                Measured 2026-09-07 on the built app at a 320px viewport with the
                root font overridden (browser/OS text zoom; the in-app control stops
                at 1.3), on the Efectivo card, the one asset whose noun is YIELD:
                  es 100%/130%  row 114 / content 114  — fits
                  es 150%       row 114 / content 119  — 5px out
                  es 175%       row 114 / content 136  — 22px out
                  es 200%       row 114 / content 154  — 40px out
                en/ko/zh/ja read 0 at every scale, which is the control the es
                numbers are trusted on: same instrument, same screen, same settings.
                `minWidth: 0` lets the flex item drop below its min-content width so
                the body's `overflow-wrap: break-word` (index.css) can break the
                word; the arrow stays attached to the word's tail ("Rendimien" /
                "to ↑"), so the 2026-09-02 property survives. This is the same
                pairing `.ec-bar-label` already uses.
                ⛔ `minWidth: 0` ALONE, with `nowrap` kept, was measured and is a
                TRAP: the span's box shrinks 154 → 114 and the ink does not move —
                one line, `scrollWidth` still 154, still spilling — so a row-level
                geometry probe reads clean while the learner sees the identical
                screen. `overflow-wrap: anywhere` with `nowrap` kept changes
                nothing at all, and a non-breaking space does not pin the arrow
                under `anywhere`, which breaks at one. All three were tried on the
                live page before this line was written. */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: space["2"], fontSize: "0.75rem", color: ink.bad }}>
              <span style={{ whiteSpace: "nowrap" }}>{t.ratesRising}</span><span style={{ minWidth: 0 }}>{asset.responds[lang]} {asset.rising}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: space["2"], fontSize: "0.75rem", color: ink.ok }}>
              <span style={{ whiteSpace: "nowrap" }}>{t.ratesFalling}</span><span style={{ minWidth: 0 }}>{asset.responds[lang]} {asset.falling}</span>
            </div>
            <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"] }}>
              {asset.note[lang]}
            </Text>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: space["5"] }}>
        <GlossaryTerms terms={["Interest Rate", "Stock", "Bond", "Growth Stock"]} t={t} lang={lang} />
      </div>

      {/* Yield-curve shapes */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
        {t.yieldCurveLabel}
      </Text>
      {/* `minmax(0, 1fr)`, not `1fr`. A bare `1fr` is `minmax(auto, 1fr)`, and that `auto`
          minimum is the item's MIN-CONTENT size, so a track that cannot fit its widest
          unbreakable caption grows past its fr share and pushes the grid out of its own
          container — where `body { overflow-x: hidden }` clips it rather than scrolling to it.
          Measured 2026-09-07 on the built app at a 320px viewport, root font overridden
          (browser/OS text zoom; the in-app control stops at 1.3):
            en  200%  tracks 132.1 / 149.7  →  right column clipped by  1.8px
            es  150%                        →                           4.1px
            es  175%                        →                          38.1px
            es  200%  tracks 156.2 / 199.3  →                          75.5px
          ko/zh/ja read 140/140 and clean at every scale — CJK breaks between characters, so
          their min-content is small. That is also the control the es number is trusted on:
          the same instrument on the same screen at the same settings reports zero for three
          languages and 75.5px for one. `es` at the in-app maximum (130%) still fits; this is a
          text-zoom path, WCAG 1.4.4.
          Every other grid in this app already writes the guarded form — charts.jsx's five all
          use `minmax(0, 1fr)`, ui.jsx uses `minmax(min(…, 100%), 1fr)`, and the sibling grid
          above pins an explicit 120px floor. This was the one bare `1fr` under src/, and it is
          the one that clipped. check-data.mjs asserts there is not a second. */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: space["2"] }}>
        {CURVE_TYPES.map((type) => (
          <YieldCurve
            key={type}
            type={type}
            label={curveLabels[type]}
            description={yieldCurveDescriptions[type][lang]}
          />
        ))}
      </div>
      <div style={{ marginBottom: space["5"] }}>
        <GlossaryTerms terms={["Yield Curve"]} t={t} lang={lang} />
      </div>

      {/* QE / QT, and the balance sheet that results from them.
          THE <h2> IS THE POINT OF THIS BLOCK, not decoration. Measured
          2026-09-02 on the built app: this screen's heading rotor read
          `h1 Market Dashboard` then four `h2`s, and between "Yield Curve
          Shapes" and "Money Supply" sat the two QE/QT notes AND the entire
          Fed-balance-sheet figure with no heading of their own — so a reader
          navigating by heading was told the balance-sheet chart is part of
          "Yield Curve Shapes", which it is not. Same defect as the two <h2>s
          added to LessonReader: the previous section's title silently acting
          as a parent for content it does not describe.
          It names all three blocks it owns rather than echoing the notes'
          own labels below ("Quantitative Easing (QE)" / "Quantitative
          Tightening (QT)"), which would announce the same words twice.
          `marginBottom` only, matching the "Yield Curve Shapes" heading:
          the grid above already carries `marginBottom: space["5"]`, so this
          adds a rotor entry without moving anything else on the page.
          The cycle chart and the Illustrative Scenario note ABOVE the first
          <h2> are deliberately left unheaded — they sit between the <h1> and
          the first <h2>, which is the <h1>'s own content and the correct
          description of a screen's opening. */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
        {t.qeQtSection}
      </Text>
      <Stack gap={space["2"]}>
        <Note tone="ok" label={t.qeLabel} icon="chart">{t.qeNarrative}</Note>
        <Note tone="bad" label={t.qtLabel} icon="chart">{t.qtNarrative}</Note>
      </Stack>
      <div style={{ marginBottom: space["5"] }}>
        <GlossaryTerms terms={["QE", "QT"]} t={t} lang={lang} />
      </div>

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

      {/* Money supply — placed directly after QE/QT because that is the
          mechanism which moves the narrowest tier, and a reader who has just
          seen the balance sheet grow is exactly the reader asking "so is there
          more money now?". The caption answers that: not necessarily.

          An <ol>, not a <ul>: unlike the principles below, these three DO have
          an order — each tier is defined in terms of the one before it, and
          reading M2 before M1 does not work. `role="list"` for the same reason
          as every other list here (check-data.mjs §20: WebKit drops list
          semantics when `list-style: none` is set). */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ margin: `${space["5"]}px 0 ${space["3"]}px` }}>
        {t.moneySupply}
      </Text>
      <ol role="list" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {moneyAggregates.map((tier) => (
          <li
            key={tier.key}
            style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.md, padding: space["3"], marginBottom: space["2"] }}
          >
            <Text variant="caption" color={ink.strong} style={{ fontWeight: 700, marginBottom: space["1"] }}>
              {tier.name[lang]}
            </Text>
            <Text variant="small" color={ink.body}>{tier.contains[lang]}</Text>
            <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"] }}>
              {tier.note[lang]}
            </Text>
          </li>
        ))}
      </ol>
      <Note tone="neutral" style={{ marginTop: space["3"] }}>{moneySupplyCaption[lang]}</Note>

      {/* Durable principles */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ margin: `${space["5"]}px 0 ${space["3"]}px` }}>
        {t.ratePrinciples}
      </Text>
      {/* A <ul>, not an <ol>: the six principles have no sequence, ranking or
          dependency between them, and the row marker is a decorative em-dash.
          `role="list"` is not redundant here — WebKit drops list semantics from
          any list carrying `list-style: none`, and every list in this app does
          (see check-data.mjs §20). */}
      <ul role="list" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {ratePrinciples.map((p) => (
          <li key={p.en} style={{ display: "flex", gap: space["3"], padding: `${space["3"]}px 0`, borderBottom: `1px solid ${line.hairline}` }}>
            <span aria-hidden="true" style={{ color: ink.accent, fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>—</span>
            <Text variant="small">{p[lang]}</Text>
          </li>
        ))}
      </ul>
      <GlossaryTerms terms={["Recession"]} t={t} lang={lang} />

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
