// ═══════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
//
// Everything screens are assembled from. Keeping these few and opinionated is
// what makes the clarity rules in LAUNCH_PLAN §3.0 enforceable in one place
// rather than re-litigated on every screen.
// ═══════════════════════════════════════════════════════════════════════════

import { forwardRef } from "react";
import { fill, font, ink, line, radius, shadow, space, surface, type } from "../theme.js";
import Icon from "./Icon.jsx";

// ── Text ──────────────────────────────────────────────────────────────────
// One component for every piece of prose, so hierarchy is chosen from the
// scale rather than invented per call site.
export function Text({ as: Tag = "p", variant = "body", color = ink.body, align, style, children, ...rest }) {
  // Not named `t` — that identifier means the translation object everywhere
  // else in this codebase, and shadowing it here reads as a bug.
  const scale = type[variant];
  return (
    <Tag
      style={{
        margin: 0,
        fontSize: scale.size,
        fontWeight: scale.weight,
        lineHeight: scale.height,
        letterSpacing: scale.spacing,
        color,
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ── Stack ─────────────────────────────────────────────────────────────────
// Vertical rhythm without margin juggling.
export function Stack({ gap = space["3"], style, children, ...rest }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap, ...style }} {...rest}>
      {children}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────
export function Card({ padded = true, style, children, ...rest }) {
  return (
    <div
      style={{
        background: surface.card,
        border: `1px solid ${line.hairline}`,
        borderRadius: radius.lg,
        padding: padded ? space["4"] : 0,
        boxShadow: shadow.raised,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

// ── Note ──────────────────────────────────────────────────────────────────
// A tinted aside. Deliberately restrained: a left rule and a wash, not a
// fully-boxed colour block, so several in a row don't turn into stripes.
const NOTE_TONES = {
  neutral: { wash: surface.sunken, rule: line.strong, label: ink.muted },
  accent: { wash: surface.accentWash, rule: fill.accent, label: ink.accent },
  ok: { wash: surface.okWash, rule: fill.ok, label: ink.ok },
  warn: { wash: surface.warnWash, rule: "#d97706", label: ink.warn },
  bad: { wash: surface.badWash, rule: fill.bad, label: ink.bad },
};

export function Note({ tone = "neutral", label, icon, children, style }) {
  const palette = NOTE_TONES[tone];
  return (
    <div
      style={{
        background: palette.wash,
        borderLeft: `3px solid ${palette.rule}`,
        borderRadius: `${radius.sm}px`,
        padding: `${space["3"]}px ${space["4"]}px`,
        ...style,
      }}
    >
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: space["2"], marginBottom: space["1"], color: palette.label, fontSize: font.caption, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>
          {icon && <Icon name={icon} size="1em" />}
          {label}
        </div>
      )}
      <Text variant="small">{children}</Text>
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────
const BUTTON_VARIANTS = {
  primary: { background: fill.accent, color: ink.onFill, border: "none", boxShadow: shadow.lifted },
  solid: { background: fill.ink, color: ink.onFill, border: "none" },
  outline: { background: surface.card, color: ink.body, border: `1px solid ${line.strong}` },
  quiet: { background: "transparent", color: ink.muted, border: "none" },
};

// Forwards its ref: the first-run notice traps focus on its single button,
// which needs a real node to call .focus() on.
export const Button = forwardRef(function Button(
  { variant = "primary", full, iconRight, iconLeft, style, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: space["2"],
        padding: `${space["3"]}px ${space["4"]}px`,
        borderRadius: radius.md,
        fontSize: font.body,
        fontWeight: 600,
        cursor: "pointer",
        width: full ? "100%" : undefined,
        ...BUTTON_VARIANTS[variant],
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <Icon name={iconLeft} size="1.1em" />}
      {children}
      {iconRight && <Icon name={iconRight} size="1.1em" />}
    </button>
  );
});

// ── PageTitle ─────────────────────────────────────────────────────────────
// Screens open with a plain title, not a coloured banner.
export function PageTitle({ title, subtitle, trailing }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: space["3"], marginBottom: space["4"] }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text as="h2" variant="title" color={ink.strong}>{title}</Text>
        {subtitle && <Text variant="small" color={ink.muted} style={{ marginTop: space["1"] }}>{subtitle}</Text>}
      </div>
      {trailing}
    </div>
  );
}

// ── Segmented ─────────────────────────────────────────────────────────────
// Underlined segments rather than pill buttons — quieter, and it reads as
// "sections of this page" instead of competing with the bottom navigation.
export function Segmented({ items, value, onChange, ariaLabel, idPrefix, panelId }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{ display: "flex", gap: space["4"], borderBottom: `1px solid ${line.hairline}`, marginBottom: space["4"], overflowX: "auto" }}
    >
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`${idPrefix}-${item.key}`}
            aria-selected={active}
            aria-controls={panelId}
            onClick={() => onChange(item.key)}
            style={{
              appearance: "none", background: "none", border: "none",
              padding: `0 0 ${space["3"]}px`,
              marginBottom: -1,
              borderBottom: `2px solid ${active ? fill.accent : "transparent"}`,
              color: active ? ink.accent : ink.muted,
              fontSize: font.small,
              fontWeight: active ? 700 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

// ── ProgressBar ───────────────────────────────────────────────────────────
export function ProgressBar({ value, max, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      style={{ background: line.hairline, borderRadius: radius.full, height: 6, overflow: "hidden" }}
    >
      <div style={{ height: "100%", width: `${pct}%`, background: fill.accent, borderRadius: radius.full, transition: "width 0.45s ease" }} />
    </div>
  );
}

// ── Disclaimer ────────────────────────────────────────────────────────────
// Required by LAUNCH_PLAN §10.1. One component so wording and placement can't
// drift apart between the screens that must show it.
export function Disclaimer({ text, style }) {
  return (
    <Text variant="caption" color={ink.muted} align="center" style={{ padding: `${space["4"]}px ${space["2"]}px`, lineHeight: 1.5, ...style }}>
      {text}
    </Text>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────
export function EmptyState({ icon, children }) {
  return (
    <div style={{ textAlign: "center", padding: `${space["6"]}px ${space["4"]}px`, color: ink.muted }}>
      {icon && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: space["3"], color: line.strong }}>
          <Icon name={icon} size="2rem" />
        </div>
      )}
      <Text variant="small" color={ink.muted}>{children}</Text>
    </div>
  );
}
