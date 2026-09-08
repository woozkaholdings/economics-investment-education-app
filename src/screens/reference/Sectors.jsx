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
import { formatEconomicReading, formatPercent, priceSourceName, useMarketData } from "../../lib/useMarketData.js";
import Icon from "../../components/Icon.jsx";
import { EmptyState, Note, Segmented, Text } from "../../components/ui.jsx";
import { ink, line, space } from "../../theme.js";

const WINDOWS = [
  { key: "1m", label: "1M" },
  { key: "3m", label: "3M" },
  { key: "6m", label: "6M" },
];

// ═══════════════════════════════════════════════════════════════════════════
// The §10.1 disclaimer is a property of THIS SCREEN, not of one of its states.
//
// Until 2026-09-08 the string was rendered once, at the bottom of the success
// branch, behind two earlier `return`s. Measured on the built app that day, at
// 320px: with `market.json` fresh the screen ends "Educational content only —
// not personalized investment, legal, or tax advice…"; with the SAME build and
// an `asOf` of 2026-08-25, the whole screen is one sentence about the data
// being too old and the disclaimer is GONE. Same for a missing or unparseable
// file, and for the loading frame.
//
// That is not a hypothetical state. `STALE_AFTER_DAYS` is 4 and publishing
// follows a push that nothing owns (backlog O-5), so this is what every
// visitor meets whenever the daily file stops reaching the live host.
//
// ⚠️ `check-blindspot.mjs`'s §10.1 surface check greps this file for the
// rendered string and passed throughout — which is the blind spot LAUNCH_PLAN
// §10.1 already records about this very file, one level up: it was written to
// match the string rather than the `<Disclaimer>` component, and a grep for a
// string still cannot see which branch the string is in. A source guard that
// could is a parser, not a regex; the durable fix is structural, so there is
// now exactly ONE `{t.disclaimer}` in this file and no branch can leave
// without passing through it.
// ═══════════════════════════════════════════════════════════════════════════
function ScreenFrame({ t, children }) {
  return (
    <div>
      {children}
      <Text variant="caption" color={ink.muted} style={{ marginTop: space["4"], textAlign: "center" }}>
        {t.disclaimer}
      </Text>
    </div>
  );
}

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
    return (
      <ScreenFrame t={t}>
        <EmptyState icon="chart">{t.loadingLabel}</EmptyState>
      </ScreenFrame>
    );
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
      <ScreenFrame t={t}>
        <EmptyState icon="chart">
          {datedStale ? t.dataStaleTemplate.replace("{date}", data.asOf) : t.dataUnavailable}
        </EmptyState>
      </ScreenFrame>
    );
  }

  const bySymbol = Object.fromEntries(data.sectors.map((s) => [s.symbol, s]));
  // Sorted by the SAME number each row prints on its badge —
  // `relativeStrength.rank` — because until 2026-08-25 it was not (backlog
  // item 104). The list sorted by `change[window]`, the raw return for the
  // selected tab, while every row was labeled "#N of 11" from the
  // window-independent WJ measure. Measured against the shipped
  // `public/data/market.json` (asOf 2026-08-24): the default 3M tab rendered
  // badges 1, 3, 4, 2, 7, 5, 6, 10, 8, 9, 11 and the 6M tab OPENED on #10.
  // A list may have one ordering, and it has to be the one it prints.
  //
  // Sorting by rank does NOT make the three tabs identical, which is the
  // reason this was the affordable fix rather than the expensive one: the
  // percentage each row reports is still `change[window]`, so 1M/3M/6M keep
  // showing genuinely different numbers. Only the order stops moving — and
  // the order was never the window's to own, since the WJ score is computed
  // across WJ_PERIODS (10/30/60 bars) and has no window.
  //
  // A sector with no rank cannot be placed in a ranking. `computeRelativeStrength`
  // drops any symbol with less than MIN_BARS of history and numbers only what
  // survives — so `of` is the count of RANKED sectors, not always eleven, and
  // an unranked row has no `rank` at all. Those sort to the bottom on
  // +Infinity: the same "unrankable goes last" rule the old return-based sort
  // applied, kept on purpose rather than inherited by accident.
  const rankOf = (sector) => {
    const r = bySymbol[sector.symbol]?.relativeStrength?.rank;
    return Number.isFinite(r) ? r : Infinity;
  };
  const ranked = [...sectors].sort((a, b) => rankOf(a) - rankOf(b));

  const benchChange = data.benchmark?.change?.[window];

  return (
    <ScreenFrame t={t}>
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
          three. What the tab changes is the RETURN each row reports, not the
          order — the order is the relative-strength rank and is the same on
          all three (item 104). */}
      <div role="tabpanel" id="sector-list" aria-labelledby={`sector-window-${window}`}>
        {/* The sort key, said out loud. Every row carries two numbers — a rank
            and a return — and a reader who is not told which one ordered the
            list will infer it from whichever column happens to look sorted.
            Fixing the comparator (item 104) removes the contradiction; this
            line is what stops the remaining question ("why is +16% below
            +11%?") from being a mystery. */}
        <Text variant="caption" color={ink.muted} style={{ margin: `${space["3"]}px 0 0` }}>
          {t.sectorsSortNote
            .replace("{name}", BENCHMARK.name)
            .replace("{window}", WINDOWS.find((w) => w.key === window).label)}
        </Text>
        {/* What the sort key MEANS, which the line above only names. Measured
            2026-09-02: "relative strength" appears in no lesson, no quiz, no
            glossary entry and no market copy — only here, in this screen's
            three locale strings. Every other figure on this screen carries a
            plain-language line saying what it is (`sectors.what`,
            `economicSignals.what`); the one number that ORDERS the list did
            not, so the reader met the term for the first and only time as an
            unexplained ranking.
            It is explained here rather than as a glossary entry because no
            lesson teaches it: a reader confused by this list is on this
            screen, not in the glossary, and a key no lesson uses would owe
            §17b a chip or an exclusion for nothing.
            The second sentence is the reconciliation the sort note leaves
            open — with the shipped data (asOf 2026-09-01) the biggest return
            in the list sits at rank 2 on the 3M tab and rank 6 on 6M, so a
            reader who assumes the column is the sort key sees a broken list.
            Keep it descriptive: it says what the measure IS, never what to do
            about a sector's place in it (§10.1). */}
        <Text variant="caption" color={ink.muted} style={{ margin: `${space["1"]}px 0 0` }}>
          {t.relativeStrengthNote.replace("{name}", BENCHMARK.name)}
        </Text>
        {/* Genuinely an <ol>: `ranked` is ordered by relative strength, and each
            row states its own "rank N of M". `role="list"` per check-data.mjs §20.
            This sentence was FALSE from the day the screen shipped until
            2026-08-25 — `ranked` was ordered by return — which is why
            check-data.mjs §42 now holds the comparator to it. */}
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
            // (That third signal is history as of 2026-08-25: the list is
            // ordered by rank now, not by return, so a "—" row lands wherever
            // its relative strength puts it. The red and the trend icon were
            // the other two, and muting is still what answers them.)
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

      {/* Credits the price vendor next to the prices, not on a settings screen
          a reader may never open (backlog item 166). Suppressed for fixture
          data — `isSample` already says these are placeholder numbers, and
          crediting a real vendor for them would be false — and suppressed for
          an adapter with no display name, since printing a slug is not a
          credit. */}
      {!isSample && priceSourceName(data.source) && (
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"] }}>
          {t.priceSourceTemplate.replace("{source}", priceSourceName(data.source))}
        </Text>
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

          {/* The economics block is FRED and only FRED — `FRED_SERIES` in
              src/lib/marketData/fred.js is a fixed list of Federal Reserve and
              BLS releases — so this credit is unconditional on the vendor in a
              way the price one above cannot be. Still gated on `isSample`,
              because in fixture mode these readings did not come from FRED. */}
          {!isSample && (
            <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"] }}>
              {t.economicsSourceCredit}
            </Text>
          )}
        </div>
      )}
    </ScreenFrame>
  );
}
