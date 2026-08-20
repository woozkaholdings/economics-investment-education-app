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
  // `ageDays` is never *rendered* here (backlog item 44). This screen states
  // the absolute date the figures were taken and never phrases it as "N days
  // ago"; a relative age would be a second rendering of the same fact with its
  // own way of being wrong. The freshness *decision* is `isStale`. It is read
  // below purely as a predicate — "could the freshness rule parse this date at
  // all?" — which is a different question from how old the date is.
  const { status, data, ageDays, isStale, isSample } = useMarketData();
  const [window, setWindow] = useState("3m");

  if (status === "loading") {
    return <EmptyState icon="chart">…</EmptyState>;
  }

  // Two different failures used to share one sentence (backlog item 79): "no
  // file on this deployment at all" and "a file whose date is too far from
  // today to trust" both read as `Market data isn't available right now.`,
  // separated only by a parenthetical date. Neither a reader nor an owner
  // debugging a deploy could tell them apart, and the date attached
  // grammatically to the unavailability — "isn't available right now (As of
  // 2026-08-14)" says the outage is from that date, when the truth is the
  // opposite: the *data* is from then, and today is why it is not shown.
  //
  // The stale sentence says "too far from today" rather than "too old" on
  // purpose. `isStale` is true in BOTH directions — a file stamped more than
  // FUTURE_TOLERANCE_DAYS ahead of the device's clock lands here too, and
  // useMarketData.js explains why that is a real state rather than a nicety.
  // Verified live at `asOf: 2026-09-30`, which rendered a date 41 days in the
  // future; "too old" would have been a false statement on that screen.
  //
  // A date is only named when the freshness rule could actually read it.
  // `ageDays` is null when `asOf` is missing or malformed, and a date we
  // cannot parse is not one we can say anything true about — that case falls
  // back to "unavailable", which is exactly what it is.
  if (status === "unavailable" || !data || isStale) {
    const datedStale = isStale && Number.isFinite(ageDays) && data?.asOf;
    return (
      <EmptyState icon="chart">
        {datedStale ? t.dataStaleTemplate.replace("{date}", data.asOf) : t.dataUnavailable}
      </EmptyState>
    );
  }

  const bySymbol = Object.fromEntries(data.sectors.map((s) => [s.symbol, s]));
  // A window with no figure cannot be ranked, so it sorts to the bottom — but
  // it is sorted by the same `Number.isFinite` test the row below renders by,
  // not by `?? -Infinity`. The two disagreed: `??` passes a NaN straight into
  // the subtraction, which makes the comparator return NaN for that pair and
  // leaves the order undefined, while the row still drew it as "—".
  const rank = (v) => (Number.isFinite(v) ? v : -Infinity);
  const ranked = [...sectors].sort(
    (a, b) => rank(bySymbol[b.symbol]?.change?.[window]) - rank(bySymbol[a.symbol]?.change?.[window]),
  );

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
            // Three states, not two. A missing figure is not a decline: the
            // daily job's `pctChange` returns null when a symbol's history is
            // shorter than the window (scripts/fetch-market-data.mjs), so a
            // sector can legitimately have 1M/3M and no 6M, and `formatPercent`
            // renders it "—". Under the old `positive ? ok : bad` that "—" was
            // drawn in the same loss-red as a real fall, next to a trend icon,
            // at the bottom of a list ordered by performance — three signals
            // saying "worst of the eleven" about a number nobody has. Muted
            // says what is true: no reading for this window.
            const tone = !Number.isFinite(change) ? ink.muted : change >= 0 ? ink.ok : ink.bad;

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

                <div style={{ display: "flex", alignItems: "center", gap: space["1"], flexShrink: 0, color: tone }}>
                  <Icon name="chart" size="0.9em" />
                  <Text as="span" variant="small" color={tone} style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
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
