// ═══════════════════════════════════════════════════════════════════════════
// MARKET SIGNALS
//
// A teaching surface, not a dashboard — it explains shapes and relationships,
// and carries no date and no live-looking figure (LAUNCH_PLAN §2.3). Filed
// under Reference because that is what it is: something you consult to read
// the charts a lesson just introduced.
//
// All copy lives in `content/markets.js`, translated; this file is layout.
// ═══════════════════════════════════════════════════════════════════════════

import { Bar, CycleChart, YieldCurve } from "../../components/charts.jsx";
import { Disclaimer, Note, Stack, Text } from "../../components/ui.jsx";
import {
  balanceSheetCaption, balanceSheetDescription, balanceSheetHistory,
  cycleChartDescription, phaseNames, rateEffects, ratePrinciples, scenario,
  trendLabel, yieldCurveDescriptions,
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

      <Note tone="warn" label={t.currentState} icon="info" style={{ marginBottom: space["5"] }}>
        {scenario[lang]}
      </Note>

      {/* How rate moves have historically related to asset classes */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
        {t.rateHow}
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: space["2"], marginBottom: space["5"] }}>
        {rateEffects.map((asset) => (
          <div key={asset.key} style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.md, padding: space["3"] }}>
            <Text variant="caption" color={ink.strong} style={{ fontWeight: 700, marginBottom: space["2"] }}>
              {asset.name[lang]}
            </Text>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: ink.bad }}>
              <span>{t.ratesRising}</span><span>{asset.rising}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: ink.ok }}>
              <span>{t.ratesFalling}</span><span>{asset.falling}</span>
            </div>
            <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"] }}>
              {asset.note[lang]}
            </Text>
          </div>
        ))}
      </div>

      {/* Yield-curve shapes */}
      <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
        {t.yieldCurveLabel}
      </Text>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space["2"], marginBottom: space["5"] }}>
        {CURVE_TYPES.map((type) => (
          <YieldCurve
            key={type}
            type={type}
            label={curveLabels[type]}
            description={yieldCurveDescriptions[type][lang]}
          />
        ))}
      </div>

      {/* QE / QT */}
      <Stack gap={space["2"]} style={{ marginBottom: space["5"] }}>
        <Note tone="ok" label={t.qeLabel} icon="chart">{t.qeNarrative}</Note>
        <Note tone="bad" label={t.qtLabel} icon="chart">{t.qtNarrative}</Note>
      </Stack>

      <Bar
        title={t.balanceSheet}
        data={balanceSheetHistory.map((d) => ({ label: d.label[lang], value: d.value }))}
        colors={[graph.neutral, graph.green, graph.red, graph.green, graph.red]}
        height={90}
        description={balanceSheetDescription[lang]}
        caption={balanceSheetCaption[lang]}
      />

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

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
