// ═══════════════════════════════════════════════════════════════════════════
// SECTORS
//
// Sector performance and relative strength, from the file the daily job
// writes. The prototype showed something similar with hardcoded figures; this
// shows real ones or says plainly that it cannot.
//
// Written for a beginner: the sector's plain-language description leads, the
// ticker is never a headline, and "relative strength" is shown as a rank
// against the benchmark rather than as a bare number, because a rank is
// something a first-time reader can actually act on.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { BENCHMARK, sectors } from "../../content/sectors.js";
import { formatPercent, useMarketData } from "../../lib/useMarketData.js";
import Icon from "../../components/Icon.jsx";
import { EmptyState, Note, Segmented, Text } from "../../components/ui.jsx";
import { ink, line, radius, space, surface } from "../../theme.js";

const WINDOWS = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
];

export default function Sectors({ t, lang }) {
  const { status, data, ageDays, isStale, isSample } = useMarketData();
  const [window, setWindow] = useState("3m");

  if (status === "loading") {
    return <EmptyState icon="chart">…</EmptyState>;
  }

  // A missing file or a job that stopped running both land here. Showing the
  // last known numbers without saying how old they are is the one thing §2.3
  // forbids.
  if (status === "unavailable" || !data || isStale) {
    return (
      <EmptyState icon="chart">
        {t.dataUnavailable}
        {isStale && data?.asOf ? ` (${t.asOfTemplate.replace("{date}", data.asOf)})` : ""}
      </EmptyState>
    );
  }

  const bySymbol = Object.fromEntries(data.sectors.map((s) => [s.symbol, s]));
  const ranked = [...sectors].sort((a, b) => {
    const ca = bySymbol[a.symbol]?.change?.[window];
    const cb = bySymbol[b.symbol]?.change?.[window];
    return (cb ?? -Infinity) - (ca ?? -Infinity);
  });

  const benchChange = data.benchmark?.change?.[window];

  return (
    <div>
      {isSample && (
        <Note tone="warn" icon="info" style={{ marginBottom: space["4"] }}>
          {t.sampleDataNotice}
        </Note>
      )}

      {/* Freshness is stated before any number is shown. */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space["3"], marginBottom: space["3"] }}>
        <Text as="span" variant="caption" color={ink.muted}>
          {t.asOfTemplate.replace("{date}", data.asOf)}
        </Text>
        {Number.isFinite(benchChange) && (
          <Text as="span" variant="caption" color={ink.muted}>
            {BENCHMARK.name} {formatPercent(benchChange)}
          </Text>
        )}
      </div>

      <Segmented
        items={WINDOWS.map((w) => ({ key: w.key, label: w.label }))}
        value={window}
        onChange={setWindow}
        ariaLabel={t.sectorsTitle}
        idPrefix="sector-window"
        panelId="sector-list"
      />

      <ol id="sector-list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {ranked.map((sector) => {
          const row = bySymbol[sector.symbol];
          const change = row?.change?.[window];
          const rs = row?.relativeStrength;
          const positive = Number.isFinite(change) && change >= 0;

          return (
            <li
              key={sector.symbol}
              style={{ display: "flex", alignItems: "flex-start", gap: space["3"], padding: `${space["3"]}px 0`, borderBottom: `1px solid ${line.hairline}` }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text variant="small" color={ink.strong} style={{ fontWeight: 600 }}>
                  {sector.name[lang]}
                </Text>
                <Text variant="caption" color={ink.muted} style={{ marginTop: 2 }}>
                  {sector.what[lang]}
                </Text>
                {rs && (
                  <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>
                    {t.relativeStrengthLabel}: {t.rankTemplate.replace("{rank}", rs.rank).replace("{of}", rs.of)}
                    {" · "}
                    {t.vsBenchmark.replace("{name}", BENCHMARK.name)}
                  </Text>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: space["1"], flexShrink: 0, color: positive ? ink.ok : ink.bad }}>
                <Icon name="chart" size="0.9em" />
                <Text as="span" variant="small" color={positive ? ink.ok : ink.bad} style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {formatPercent(change)}
                </Text>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Says outright that the measure is a stand-in, so nobody reads the
          ranking as the product's real relative-strength calculation. */}
      {data.relativeStrength?.provisional && (
        <Note tone="neutral" style={{ marginTop: space["4"] }}>{t.provisionalNotice}</Note>
      )}

      <Text variant="caption" color={ink.muted} style={{ marginTop: space["4"], textAlign: "center" }}>
        {t.disclaimer}
      </Text>
    </div>
  );
}
