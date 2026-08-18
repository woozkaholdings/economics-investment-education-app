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
import { economicSignals } from "../../content/economicSignals.js";
import { BENCHMARK, sectors } from "../../content/sectors.js";
import { formatEconomicReading, formatPercent, useMarketData } from "../../lib/useMarketData.js";
import Icon from "../../components/Icon.jsx";
import { EmptyState, Note, Segmented, Text } from "../../components/ui.jsx";
import { ink, line, space } from "../../theme.js";

const WINDOWS = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
];

export default function Sectors({ t, lang }) {
  // `ageDays` is deliberately not read here (backlog item 44). This screen
  // states the absolute date the figures were taken and never phrases it as
  // "N days ago"; a relative age would be a second rendering of the same fact
  // with its own way of being wrong. The freshness *decision* is `isStale`.
  const { status, data, isStale, isSample } = useMarketData();
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

      {/* `Segmented`'s tabs point `aria-controls` at "sector-list" (ui.jsx),
          so this needs role="tabpanel" the same way ParentGuide.jsx's
          age-band panel already does — without it, a screen reader following
          the tab pattern has no programmatic link from the active "1M"/"3M"/
          "6M" tab to the content it controls. `aria-labelledby` points at
          whichever tab is currently selected, since one panel serves all
          three (there's no separate content per tab, just a re-sort). */}
      <div role="tabpanel" id="sector-list" aria-labelledby={`sector-window-${window}`}>
        {/* Genuinely an <ol>: `ranked` is ordered by relative strength, and each
            row states its own "rank N of M". `role="list"` per check-data.mjs §20. */}
        <ol role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
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
      </div>

      {/* Says outright that the measure is a stand-in, so nobody reads the
          ranking as the product's real relative-strength calculation. */}
      {data.relativeStrength?.provisional && (
        <Note tone="neutral" style={{ marginTop: space["4"] }}>{t.provisionalNotice}</Note>
      )}

      {/* FRED readings the same daily job already fetches (src/lib/marketData/
          fred.js) — each carries its own observation date, since CPI/
          unemployment update monthly while yields update daily; showing one
          shared "as of" for all of them would misstate the monthly ones as
          more current than they are. */}
      {data.economics && (
        <div style={{ marginTop: space["5"] }}>
          <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
            {t.economyNowTitle}
          </Text>
          <ul role="list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {economicSignals.map((signal) => {
              const reading = data.economics[signal.key];
              if (!reading) return null;
              return (
                <li
                  key={signal.key}
                  style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: space["3"], padding: `${space["3"]}px 0`, borderBottom: `1px solid ${line.hairline}` }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="small" color={ink.strong} style={{ fontWeight: 600 }}>
                      {signal.name[lang]}
                    </Text>
                    <Text variant="caption" color={ink.muted} style={{ marginTop: 2 }}>
                      {signal.what[lang]}
                    </Text>
                    <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>
                      {t.asOfTemplate.replace("{date}", reading.date)}
                    </Text>
                  </div>
                  <Text as="span" variant="small" color={ink.strong} style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                    {formatEconomicReading(reading)}
                  </Text>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Text variant="caption" color={ink.muted} style={{ marginTop: space["4"], textAlign: "center" }}>
        {t.disclaimer}
      </Text>
    </div>
  );
}
