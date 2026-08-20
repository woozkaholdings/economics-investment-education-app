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
  warn: { wash: surface.warnWash, rule: fill.warn, label: ink.warn },
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

// ═══════════════════════════════════════════════════════════════════════════
// PATTERNS ADAPTED FROM THE UIUX/ REFERENCE SET (2026-08-17)
//
// The owner collected ~30 Mobbin screens from Buddy, Duolingo, Quizlet and
// Vocabulary and asked for the app to be redesigned against them. These four
// primitives are the transferable half of that set — the shapes, not the
// branding. Each records which screen it came from and what had to change,
// because "we copied Quizlet" is not a design rationale a later run can check.
//
// Nothing here introduces a colour. Every surface, ink and fill below is an
// existing token, so `check-data.mjs` §28's contrast assertions still cover
// this code without needing new pairs.
// ═══════════════════════════════════════════════════════════════════════════

// ── IconTile ──────────────────────────────────────────────────────────────
// A rounded-square tinted icon holder. From Buddy's "How can we help?" goal
// grid, where every option is a soft-tinted glyph rather than a bare icon —
// and from its selected state, which saturates the tile instead of adding a
// tick. Adapted: Buddy tints each option a different hue, which would break
// this app's one-accent rule (theme.js), so tone is semantic here — accent for
// "interactive", ok for "done", neutral for "inert".
const TILE_TONES = {
  accent: { wash: surface.accentWash, ink: ink.accent },
  ok: { wash: surface.okWash, ink: ink.ok },
  warn: { wash: surface.warnWash, ink: ink.warn },
  neutral: { wash: surface.sunken, ink: ink.muted },
};

export function IconTile({ icon, tone = "accent", size = 40, filled = false, children }) {
  const palette = TILE_TONES[tone] ?? TILE_TONES.accent;
  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: size, height: size, flexShrink: 0,
        borderRadius: size >= 40 ? radius.md : radius.sm,
        background: filled ? fill.accent : palette.wash,
        color: filled ? ink.onFill : palette.ink,
      }}
    >
      {children ?? <Icon name={icon} size={`${Math.round(size * 0.5)}px`} />}
    </span>
  );
}

// ── Tile ──────────────────────────────────────────────────────────────────
// A tappable card for a two-column grid: icon tile, label, optional sublabel,
// optional lock. From Vocabulary's "Explore topics" hub, which fronts a large
// reference library with four quick tiles and a grid of category cards rather
// than a row of tabs. Adapted: Vocabulary's cards carry full illustrations,
// which this app has no art budget for, so the icon tile carries the weight.
export function Tile({ icon, label, sublabel, locked = false, onClick, style, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      style={{
        display: "flex", flexDirection: "column", alignItems: "flex-start", gap: space["3"],
        textAlign: "left", width: "100%",
        background: surface.card,
        border: `1px solid ${line.hairline}`,
        borderRadius: radius.lg,
        boxShadow: shadow.raised,
        padding: space["4"],
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.55 : 1,
        fontFamily: "inherit",
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <IconTile icon={icon} tone={locked ? "neutral" : "accent"} />
        {locked && <span style={{ color: ink.muted, display: "flex" }}><Icon name="lock" size="0.95em" /></span>}
      </span>
      <span style={{ minWidth: 0 }}>
        <Text as="span" variant="small" color={ink.strong} style={{ display: "block", fontWeight: 700 }}>
          {label}
        </Text>
        {sublabel && (
          <Text as="span" variant="caption" color={ink.muted} style={{ display: "block", marginTop: 2 }}>
            {sublabel}
          </Text>
        )}
      </span>
    </button>
  );
}

// ── TileGrid ──────────────────────────────────────────────────────────────
// Two columns at every width this app supports (APP_MAX_WIDTH is 460).
export function TileGrid({ children, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: space["3"], ...style }}>
      {children}
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────────────
// A vertical rail of numbered stages with a connector between them. From the
// "how your free trial works" timelines in Vocabulary and Quizlet — the one
// piece of a paywall worth keeping, because it answers "what happens next"
// before the user has to find out by waiting.
//
// Adapted: this app sells nothing, so there are no dates and no billing step.
// It explains the spaced-review schedule instead, which was previously
// invisible — a learner could answer a question and had no way to know it was
// coming back, or when. `done` strikes a step through the way Vocabulary marks
// "Install the app" as already complete.
export function Steps({ items, style }) {
  return (
    <ol role="list" style={{ listStyle: "none", margin: 0, padding: 0, ...style }}>
      {items.map((step, i) => {
        const last = i === items.length - 1;
        return (
          <li key={step.title} style={{ position: "relative", paddingLeft: 44, paddingBottom: last ? 0 : space["4"] }}>
            {!last && (
              <span
                aria-hidden="true"
                style={{ position: "absolute", left: 15, top: 34, bottom: 0, width: 2, background: line.hairline }}
              />
            )}
            <span style={{ position: "absolute", left: 0, top: 0 }}>
              <IconTile icon={step.icon} size={32} tone={step.done ? "ok" : "accent"} />
            </span>
            <Text
              variant="small"
              color={step.done ? ink.muted : ink.strong}
              style={{ fontWeight: 700, textDecoration: step.done ? "line-through" : "none" }}
            >
              {step.title}
            </Text>
            <Text variant="caption" color={ink.muted} style={{ marginTop: 2 }}>
              {step.body}
            </Text>
          </li>
        );
      })}
    </ol>
  );
}

// ── ResumeCard ────────────────────────────────────────────────────────────
// From Quizlet's home screen, whose "Jump back in" card names the set you were
// in, shows its progress, and puts Continue on the card itself. This app's
// equivalent card said only "Continue Learning" over a 4/40 counter, so the
// one question a returning learner has — *what* am I continuing? — was
// answered only by scrolling the path.
//
// Adapted: Quizlet carousels several in-progress sets with page dots. There is
// exactly one place to resume here (the path is sequential), so the carousel
// is dropped and the space goes to the lesson title instead.
export function ResumeCard({ eyebrow, title, meta, progressValue, progressMax, progressLabel, action, onAction }) {
  return (
    <Card style={{ padding: space["4"] }}>
      <Text variant="caption" color={ink.accent} style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {eyebrow}
      </Text>
      <Text variant="heading" color={ink.strong} style={{ marginTop: space["2"] }}>
        {title}
      </Text>
      {meta && (
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>
          {meta}
        </Text>
      )}
      <div style={{ marginTop: space["4"] }}>
        <ProgressBar value={progressValue} max={progressMax} label={progressLabel} />
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"] }}>
          {progressLabel}
        </Text>
      </div>
      <Button full iconRight="arrowRight" onClick={onAction} style={{ marginTop: space["4"] }}>
        {action}
      </Button>
    </Card>
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
