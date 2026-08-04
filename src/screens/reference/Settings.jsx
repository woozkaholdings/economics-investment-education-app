// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS & ABOUT
//
// Holds the two presentation controls — appearance and text size — plus the
// permanent home of the disclaimer required by LAUNCH_PLAN §10.1.
//
// Appearance offers System / Light / Dark. "System" is the default and simply
// removes the override so the OS preference applies; see `index.css` for how
// the three resolve.
// ═══════════════════════════════════════════════════════════════════════════

import { FONT_SCALE_STEPS, THEME_MODES, fill, ink, line, radius, space, surface } from "../../theme.js";
import { Card, Disclaimer, Text } from "../../components/ui.jsx";

// A row of equal-width choices sharing radio semantics.
function ChoiceRow({ label, options, value, onChange }) {
  return (
    <div>
      <Text variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700, marginBottom: space["2"] }}>
        {label}
      </Text>
      <div role="radiogroup" aria-label={label} style={{ display: "flex", gap: space["2"] }}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={opt.ariaLabel || opt.label}
              onClick={() => onChange(opt.value)}
              style={{
                flex: 1,
                padding: `${space["3"]}px ${space["2"]}px`,
                borderRadius: radius.md,
                border: `1.5px solid ${active ? fill.accent : line.strong}`,
                background: active ? surface.accentWash : surface.card,
                color: active ? ink.accent : ink.muted,
                fontWeight: active ? 700 : 500,
                fontSize: opt.fontSize || "0.875rem",
                cursor: "pointer",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Settings({ t, fontScale, setFontScale, themeMode, setThemeMode }) {
  const themeLabels = { system: t.themeSystem, light: t.themeLight, dark: t.themeDark };

  return (
    <div>
      <Card style={{ marginBottom: space["4"] }}>
        <Text variant="body">{t.aboutBody}</Text>
      </Card>

      <Card style={{ marginBottom: space["4"], display: "flex", flexDirection: "column", gap: space["5"] }}>
        <ChoiceRow
          label={t.themeLabel}
          value={themeMode}
          onChange={setThemeMode}
          options={THEME_MODES.map((mode) => ({ value: mode, label: themeLabels[mode] }))}
        />

        <ChoiceRow
          label={t.fontSizeLabel}
          value={fontScale}
          onChange={setFontScale}
          options={FONT_SCALE_STEPS.map((step) => ({
            value: step.value,
            label: "Aa",
            ariaLabel: `${Math.round(step.value * 100)}%`,
            fontSize: step.sample,
          }))}
        />
      </Card>

      <Disclaimer text={t.disclaimer} />
    </div>
  );
}
