// ═══════════════════════════════════════════════════════════════════════════
// PARENT GUIDE
//
// A "teach your kids" tool for an adult — NOT a child-facing mode. That
// framing is a legal requirement, not a style choice: a child-directed app
// changes its COPPA classification, its store privacy category, and what it
// may show (LAUNCH_PLAN §10.3, closed — do not reopen).
//
// Concretely: the copy addresses the parent, there are no child accounts, and
// no advertising may ever appear on or near this screen.
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { kidsContent } from "../../content/kidsContent.js";
import { Note, Segmented, Stack, Text } from "../../components/ui.jsx";
import { ink, line, space } from "../../theme.js";

const AGE_BANDS = ["5-8", "9-12", "13-17"];

export default function ParentGuide({ t, lang }) {
  const [band, setBand] = useState(AGE_BANDS[0]);
  const content = kidsContent[band];
  const labels = { "5-8": t.kidsAges58, "9-12": t.kidsAges912, "13-17": t.kidsAges1317 };

  return (
    <div>
      {/* Addresses the parent — this is what keeps the feature parent-facing. */}
      <Note tone="neutral" style={{ marginBottom: space["4"] }}>{t.kidsParentIntro}</Note>

      <Segmented
        items={AGE_BANDS.map((a) => ({ key: a, label: labels[a] }))}
        value={band}
        onChange={setBand}
        ariaLabel={t.kidsAgeGroupLabel}
        idPrefix="age-band"
        panelId="age-band-panel"
      />

      <div id="age-band-panel" role="tabpanel" aria-labelledby={`age-band-${band}`}>
        <Text as="h2" variant="heading" color={ink.strong} style={{ marginBottom: space["3"] }}>
          {content.title[lang]}
        </Text>

        <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {content.lessons.map((lesson, i) => (
            <li key={lesson.en} style={{ display: "flex", gap: space["3"], padding: `${space["3"]}px 0`, borderBottom: `1px solid ${line.hairline}` }}>
              <Text as="span" variant="small" color={ink.muted} style={{ fontWeight: 700, flexShrink: 0 }}>
                {i + 1}
              </Text>
              <Text variant="small">{lesson[lang]}</Text>
            </li>
          ))}
        </ol>

        <Stack gap={space["3"]} style={{ marginTop: space["4"] }}>
          <Note tone="ok" label={t.kidsActivity} icon="users">{content.activity[lang]}</Note>
          <Note tone="accent" label={t.kidsParentTip} icon="info">{content.parentTip[lang]}</Note>
        </Stack>
      </div>
    </div>
  );
}
