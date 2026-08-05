// ═══════════════════════════════════════════════════════════════════════════
// REFERENCE
//
// Genuinely look-it-up material, grouped honestly rather than as a "More"
// drawer of leftovers (LAUNCH_PLAN §3.1): the glossary, the market-signals
// explainer, the parent guide, and settings/about.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { Segmented, Text } from "../components/ui.jsx";
import { ink, space } from "../theme.js";
import Glossary from "./reference/Glossary.jsx";
import MarketSignals from "./reference/MarketSignals.jsx";
import ParentGuide from "./reference/ParentGuide.jsx";
import Sectors from "./reference/Sectors.jsx";
import Settings from "./reference/Settings.jsx";

export default function Reference({ t, lang, fontScale, setFontScale, themeMode, setThemeMode }) {
  const [section, setSection] = useState("glossary");

  const sections = {
    glossary: { label: t.glossTitle, render: () => <Glossary t={t} lang={lang} /> },
    markets: { label: t.marketsTitle, render: () => <MarketSignals t={t} lang={lang} /> },
    sectors: { label: t.sectorsTitle, render: () => <Sectors t={t} lang={lang} /> },
    parents: { label: t.kidsTabLabel, render: () => <ParentGuide t={t} lang={lang} /> },
    about: {
      label: t.aboutTabLabel,
      render: () => (
        <Settings
          t={t}
          fontScale={fontScale} setFontScale={setFontScale}
          themeMode={themeMode} setThemeMode={setThemeMode}
        />
      ),
    },
  };

  return (
    <div>
      <Text as="h1" variant="display" color={ink.strong} style={{ marginBottom: space["4"] }}>
        {t.tabReference}
      </Text>

      <Segmented
        items={Object.entries(sections).map(([key, s]) => ({ key, label: s.label }))}
        value={section}
        onChange={setSection}
        ariaLabel={t.tabReference}
        idPrefix="ref-tab"
        panelId="ref-panel"
      />

      <div id="ref-panel" role="tabpanel" aria-labelledby={`ref-tab-${section}`}>
        {sections[section].render()}
      </div>
    </div>
  );
}
