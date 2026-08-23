// ═══════════════════════════════════════════════════════════════════════════
// REFERENCE — a hub, not a tab strip
//
// Genuinely look-it-up material, grouped honestly rather than as a "More"
// drawer of leftovers (LAUNCH_PLAN §3.1): the glossary, the market-signals
// explainer, the sector screen, the parent guide, and settings/about.
//
// REDESIGNED 2026-08-17 against UIUX/ (Vocabulary iOS, "Explore topics").
// This screen used to be a five-item `Segmented` strip. Five is where that
// control breaks down: at 375px the row scrolled horizontally, so two of the
// five sections were off-screen and undiscoverable unless you thought to swipe
// a strip that gives no affordance for swiping. Vocabulary fronts a much
// larger library the same way and does not use tabs for it — it opens on a
// grid of destinations, each with an icon and a one-line description, and
// pushes the section you pick.
//
// What changed from the reference, and why:
//   • Vocabulary's cards carry bespoke isometric illustrations. There is no
//     art budget here, so `Tile` leans on the existing icon set instead.
//   • Its grid is a *browse* surface with a promo banner and lock badges on
//     paid categories. Nothing here is locked or sold, so those are dropped
//     rather than mimicked — a lock badge over free content would be a lie.
//   • Its search pill floats over the grid, searching every topic. Search here
//     belongs to the glossary (Glossary.jsx owns it) and searching a five-item
//     menu would be theatre, so the pill is not carried over.
//
// A11y note: the old strip was a real `role="tablist"`/`tabpanel` pair. A hub
// that pushes a detail view is not a tab set, so that wiring is gone rather
// than kept as decoration — the tiles are plain buttons, and opening one moves
// focus to the detail's heading, the same pattern LessonReader and TermDetail
// already use for a pushed view.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { Disclaimer, Text, Tile, TileGrid } from "../components/ui.jsx";
import { family, ink, MIN_TAP, space } from "../theme.js";
import Glossary from "./reference/Glossary.jsx";
import MarketSignals from "./reference/MarketSignals.jsx";
import ParentGuide from "./reference/ParentGuide.jsx";
import Sectors from "./reference/Sectors.jsx";
import Settings from "./reference/Settings.jsx";

export default function Reference({ t, lang, fontScale, setFontScale, themeMode, setThemeMode }) {
  // null = the hub itself. Every other value is a pushed section.
  const [section, setSection] = useState(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (!section) return;
    window.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [section]);

  const sections = {
    glossary: {
      label: t.glossTitle, icon: "book", blurb: t.refGlossaryBlurb,
      render: () => <Glossary t={t} lang={lang} />,
    },
    markets: {
      label: t.marketsTitle, icon: "chart", blurb: t.refMarketsBlurb,
      render: () => <MarketSignals t={t} lang={lang} />,
    },
    sectors: {
      label: t.sectorsTitle, icon: "target", blurb: t.refSectorsBlurb,
      render: () => <Sectors t={t} lang={lang} />,
    },
    parents: {
      label: t.kidsTabLabel, icon: "users", blurb: t.refParentsBlurb,
      render: () => <ParentGuide t={t} lang={lang} />,
    },
    about: {
      label: t.aboutTabLabel, icon: "info", blurb: t.refAboutBlurb,
      render: () => (
        <Settings
          t={t}
          fontScale={fontScale} setFontScale={setFontScale}
          themeMode={themeMode} setThemeMode={setThemeMode}
        />
      ),
    },
  };

  // ── a pushed section ──────────────────────────────────────────────────────
  if (section) {
    const current = sections[section];
    return (
      <div>
        <button
          type="button"
          onClick={() => setSection(null)}
          style={{
            display: "inline-flex", alignItems: "center", gap: space["2"],
            background: "none", border: "none", padding: `${space["2"]}px 0`,
            minHeight: MIN_TAP,
            color: ink.muted, fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Icon name="arrowLeft" size="1.1em" /> {t.tabReference}
        </button>

        <h1
          ref={headingRef}
          tabIndex={-1}
          style={{
            margin: `${space["2"]}px 0 ${space["4"]}px`, fontFamily: family.display,
            fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.25,
            letterSpacing: "-0.02em", color: ink.strong, outline: "none",
          }}
        >
          {current.label}
        </h1>

        {current.render()}
      </div>
    );
  }

  // ── the hub ───────────────────────────────────────────────────────────────
  return (
    <div>
      <Text as="h1" variant="display" color={ink.strong}>
        {t.tabReference}
      </Text>
      <Text variant="small" color={ink.muted} style={{ marginTop: space["2"], marginBottom: space["5"] }}>
        {t.refHubSub}
      </Text>

      <TileGrid>
        {Object.entries(sections).map(([key, s]) => (
          <Tile
            key={key}
            icon={s.icon}
            label={s.label}
            sublabel={s.blurb}
            onClick={() => setSection(key)}
          />
        ))}
      </TileGrid>

      {/* §10.1. The hub is a screen a learner can now sit on: before this
          redesign Reference always rendered a sub-screen immediately, so
          whether the disclaimer was visible here depended on which sub-screen
          the tab strip happened to open on — and the default (Glossary) does
          not render one. A menu that leads to market data should carry it in
          its own right. Added to §10.1's list and to check-blindspot.mjs's
          EXPECTED_SURFACES in the same change, which is what that check asks
          for when a surface is added. */}
      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
