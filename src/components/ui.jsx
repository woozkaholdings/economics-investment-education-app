// ═══════════════════════════════════════════════════════════════════════════
// UI PRIMITIVES
//
// Everything screens are assembled from. Keeping these few and opinionated is
// what makes the clarity rules in LAUNCH_PLAN §3.0 enforceable in one place
// rather than re-litigated on every screen.
// ═══════════════════════════════════════════════════════════════════════════

import { forwardRef } from "react";
import { fill, font, ink, line, MIN_TAP, radius, shadow, space, surface, type } from "../theme.js";
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
        fontFamily: scale.family,
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

// ── SrOnly ────────────────────────────────────────────────────────────────
// Text for assistive technology that no sighted reader sees. It exists so a
// meaning carried only by color or by an `aria-hidden` icon has a second,
// non-visual channel — WCAG 1.4.1 — without the icon growing a caption.
//
// The clip technique rather than App.jsx's `top/left: -9999` off-screen
// pattern, and the difference is deliberate: the skip link must stay
// FOCUSABLE while hidden, so it has to keep a real box and merely sit
// elsewhere. These labels are never focused, so they can be given no box at
// all — which is what keeps them out of `getBoundingClientRect()` sweeps and
// out of the 320px reflow budget. `display: none` and `visibility: hidden`
// would remove them from the accessibility tree too, which is the whole point
// missed.
export const srOnly = {
  position: "absolute",
  width: 1, height: 1,
  padding: 0, margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
};

export function SrOnly({ children }) {
  return <span style={srOnly}>{children}</span>;
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
// fully-boxed color block, so several in a row don't turn into stripes.
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
  // The bevel is the UIUX/ set's one shared signature the app had not taken:
  // Duolingo bevels the bottom edge, Vocabulary casts a hard offset shadow.
  // A 3px inset bottom edge in `fill.accentDeep` is the restrained version —
  // enough physicality to read as pressable in an adult finance-education app,
  // and it spends a token the design system already declared and never used.
  primary: {
    background: fill.accent,
    color: ink.onFill,
    border: "none",
    boxShadow: `${shadow.bevel}, ${shadow.raised}`,
  },
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
        // The padding alone rendered 42px. `MIN_TAP` is a floor, not a height,
        // so a scaled-up label still grows the button past it.
        minHeight: MIN_TAP,
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
// Screens open with a plain title, not a colored banner.
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
              // Flex-centered rather than relying on the button's default text
              // baseline: `minHeight` makes the box taller than the label, and
              // the label has to sit in the middle of it rather than at the top.
              // `minWidth` matters here more than anywhere else in the app —
              // the Sector screen's period tabs are "1M"/"3M"/"6M", which
              // rendered 19px wide, under even WCAG 2.5.8's 24px AA floor.
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              // `flexShrink: 0` is what makes the container's `overflowX: auto`
              // above actually do its job. A flex item shrinks by default, and
              // these carry `whiteSpace: nowrap` with visible overflow — so
              // instead of the strip scrolling, each button was squeezed below
              // its own label and the text spilled across its neighbors.
              // Measured 2026-08-30 at 320px under 200% browser text zoom, on
              // the Kids age-band strip: three buttons 79.7/84.3/92px wide
              // holding labels that needed 101/107/116px, rendering "Ages 5-8",
              // "Ages 9-12" and "Ages 13-17" overlapping each other. Refusing to
              // shrink lets the strip overflow, which is the behavior the
              // container already asked for.
              flexShrink: 0,
              minHeight: MIN_TAP, minWidth: MIN_TAP,
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
//
// `value` IS CLAMPED INTO [0, max], and the same clamped number drives both the
// fill and `aria-valuenow` — so the bar a sighted learner sees and the value a
// screen reader announces cannot disagree, and neither can leave the track.
//
// Measured live 2026-09-08 at 320px, before this clamp existed, with a
// `ecycles_completed_lessons` holding more ids than the catalog has lessons:
// Learn's ResumeCard rendered `width: 136.364%` on the fill and shipped
// `aria-valuenow="60"` against `aria-valuemax="44"`, which is out of range and
// so invalid ARIA — a screen reader is free to report anything for it. The
// track's own `overflow: hidden` is what kept the spill invisible, which is
// exactly why this was worth fixing rather than leaving: the visual half was
// already being swallowed, so nothing on screen would ever have reported it.
//
// ⚠️ HOW A COUNT GETS AHEAD OF ITS OWN MAXIMUM, because "that cannot happen"
// is what makes this look like dead code. `completeLesson` dedupes and only
// ever writes a real lesson id, so no device in the field can exceed the
// catalog TODAY. It can the day a lesson is removed: `completedLessons`
// persists raw ids and nothing prunes ids that stopped naming a lesson, so a
// returning learner keeps counting one that is gone. This repo has renumbered
// lesson ids once already (`lib/lessonIdMigration.js`) and adds lessons
// routinely. The clamp is here so that change is a content edit and not also
// an accessibility regression; `Learn.jsx` fixes the count itself, which is
// the half that makes the NUMBER right rather than merely in range.
export function ProgressBar({ value, max, label }) {
  const safeMax = max > 0 ? max : 0;
  const shown = Math.min(Math.max(value || 0, 0), safeMax);
  const pct = safeMax > 0 ? (shown / safeMax) * 100 : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={shown}
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
// Nothing here introduces a color. Every surface, ink and fill below is an
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
// Forwards its ref for the same reason `Button` does: Reference.jsx restores
// focus to the tile a learner opened when its pushed section closes, which
// needs a real node to call .focus() on.
export const Tile = forwardRef(function Tile(
  { icon, label, sublabel, locked = false, onClick, style, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
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
});

// ── TileGrid ──────────────────────────────────────────────────────────────
// Two columns at every width this app supports (APP_MAX_WIDTH is 460) — but
// only while two columns actually FIT. The previous `1fr 1fr` promised two
// columns unconditionally, and `1fr` is `minmax(auto, 1fr)`, whose automatic
// minimum is the track's MIN-CONTENT size. So the columns could not shrink
// below the longest word in a tile, and the grid overflowed instead of
// reflowing: measured 2026-08-30 at a 320px viewport under 200% browser text
// zoom, the Reference hub laid out to 408px against a 320px viewport — 88px of
// horizontal scroll on the app's own hub screen (WCAG 1.4.4 Resize Text, AA).
//
// `auto-fit` + an explicit `minmax` floor drops to ONE column the moment two
// no longer fit, and the floor is in `rem` on purpose: browser text zoom scales
// `rem`, so the breakpoint moves with the text rather than with the device.
// The inner `min(..., 100%)` keeps the floor from becoming an overflow of its
// own in a container narrower than the floor itself.
//
// WHY 6.5rem, and not a rounder number. The floor decides WHEN the hub drops to
// one column, so it is chosen to leave today's layout alone and change only the
// sizes that are already broken. At the narrowest supported viewport (320px, so
// 288px of content after `<main>`'s padding, minus this grid's 12px gap) two
// columns survive while `2 x floor + 12 <= 288`. At 6.5rem that is two columns
// at 100%, 115% and 130% — 130% being `FONT_SCALE_STEPS`' own ceiling, so
// nothing reachable through the app's text-size control moves — and one column
// at 150% and 200%, which are exactly the browser-zoom steps that used to
// overflow. Anything from 7rem up would collapse the hub at 130%, and 9rem
// (this fix's first draft) collapsed it at 100%: a density regression on every
// 320px phone, caught by measuring the threshold instead of eyeballing it.
const TILE_MIN = "6.5rem";
export function TileGrid({ children, style }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(${TILE_MIN}, 100%), 1fr))`, gap: space["3"], ...style }}>
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
//
// A struck-through title and a green glyph are both signals a screen reader
// gets nothing from: `text-decoration` is not announced and the glyph is
// `aria-hidden`, so before this label the done step and its two undone
// siblings read out identically, word for word (measured). `doneLabel` puts
// the state in the accessibility tree the same way the Learn path marks a
// completed lesson — `SrOnly` beside the title, not a second visible word.
export function Steps({ items, doneLabel, style }) {
  return (
    // One continuous rail behind every step rather than a connector broken at
    // each icon: the Vocabulary original (UIUX/ "Vocabulary iOS 187") runs a
    // single rounded bar the whole height, which is what makes it read as ONE
    // process instead of three unrelated rows. The tiles become bare glyphs on
    // that rail — the wash moves from the tile to the rail, so no token changes.
    <ol role="list" style={{ position: "relative", listStyle: "none", margin: 0, padding: 0, ...style }}>
      <span
        aria-hidden="true"
        style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 32, borderRadius: radius.full, background: surface.accentWash }}
      />
      {items.map((step, i) => {
        const last = i === items.length - 1;
        return (
          <li key={step.title} style={{ position: "relative", paddingLeft: 44, paddingBottom: last ? 0 : space["4"] }}>
            <span style={{ position: "absolute", left: 0, top: 0, display: "flex", width: 32, height: 32, alignItems: "center", justifyContent: "center", color: step.done ? ink.ok : ink.accent }}>
              <Icon name={step.icon} size="16px" />
            </span>
            <Text
              variant="small"
              color={step.done ? ink.muted : ink.strong}
              style={{ fontWeight: 700, textDecoration: step.done ? "line-through" : "none" }}
            >
              {step.title}
              {step.done && doneLabel && <SrOnly>{" " + doneLabel}</SrOnly>}
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

// ── LoadFailure ───────────────────────────────────────────────────────────
// The one place the app admits a chunk did not arrive (backlog item 96).
// Shared by the lesson reader, the review queue and the ErrorBoundary
// fallback so the three cannot drift apart in wording or in what they offer.
//
// The action is a document reload, not an in-place retry, and that is forced
// rather than chosen: a rejected dynamic import stays errored in the module
// map for the life of the document, so re-calling the same loader fails
// again without touching the network (measured 2026-08-24). `role="alert"`
// because this replaces content the reader was already waiting on.
export function LoadFailure({ t, style }) {
  return (
    <div role="alert" style={{ marginTop: space["4"], ...style }}>
      <Note tone="warn" label={t.loadFailedTitle} icon="info">
        {t.loadFailedBody}
      </Note>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        style={{ marginTop: space["3"] }}
      >
        {t.loadFailedRetry}
      </Button>
    </div>
  );
}

// ── AppError ──────────────────────────────────────────────────────────────
// The fallback for a RENDER crash, as opposed to a chunk that never arrived
// (backlog item 99). Both end in a reload, but they are not the same event and
// must not share wording: `LoadFailure` tells the reader their connection
// dropped, which is actively misleading when the code downloaded perfectly and
// then threw. Same reload action, so `loadFailedRetry` is reused.
//
// Shown by the two ErrorBoundary fallbacks that have no more specific message
// to offer — the root one in `main.jsx` and the per-tab one around App's
// `<main>`. `role="alert"` because it replaces a screen the reader was on.
export function AppError({ t, style }) {
  return (
    <div role="alert" style={{ marginTop: space["4"], ...style }}>
      <Note tone="warn" label={t.appErrorTitle} icon="info">
        {t.appErrorBody}
      </Note>
      <Button
        variant="outline"
        onClick={() => window.location.reload()}
        style={{ marginTop: space["3"] }}
      >
        {t.loadFailedRetry}
      </Button>
    </div>
  );
}
