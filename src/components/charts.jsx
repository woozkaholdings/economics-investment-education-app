// ═══════════════════════════════════════════════════════════════════════════
// CHARTS
//
// Hand-drawn SVG, no charting dependency. These are the app's differentiator
// (LAUNCH_PLAN §3.0.4): the point is that a reader *sees* a curve invert
// rather than reading a description of one.
//
// Color discipline: strokes, fills and dots use `graph` tokens (3:1 is enough
// for non-text graphics); every label uses an `ink` token (4.5:1). Both resolve
// through CSS custom properties, so the charts re-color with the active light
// or dark scheme without any JS.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import { graph, ink, line, radius, space, surface } from "../theme.js";
import { Text } from "./ui.jsx";

// ── Bar ───────────────────────────────────────────────────────────────────
// `description` is the figure's text alternative, and it is not optional in
// practice: the bar heights carry the whole comparison, and the per-bar numbers
// inside the `role="img"` container stop being announced individually once the
// container is one image. §22 of check-data.mjs asserts every call site passes
// one, which is what keeps the unconditional `aria-label` below from silently
// resolving to `undefined`.
// `formatValue` closes the one gap in this file's own convention: `ProportionBar`,
// `GrowthCurve` and `GapColumns` all take one, and `Bar` — the only primitive
// that prints a BARE value with no currency or percent sign around it — did not.
// It defaults to identity rather than to a decimal format, and that default is
// load-bearing: `Practice.jsx`'s Leitner box strip renders question COUNTS
// through this same component (measured 2026-09-02: 7 / 3 / 2 / 0 / 0 under the
// unit "questions"), so a `.toFixed(1)` baked in here would render "7.0
// questions" and "0.0". Precision is a property of the series, not of the chart.
export function Bar({ data, title, unit, colors, height = 140, formatValue = (v) => v, description, caption }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  // `height` is authored in px by all three call sites, but a PIXEL height does not scale with the
  // reader's font-size control — and the column spends its height on the value, the bar track and
  // the label, in that order, so the part that gets squeezed is the bar: the only part carrying
  // the comparison. Measured 2026-08-29 on Reference > Market signals at 320px x 130%: the five
  // Fed-balance-sheet bar tracks rendered **9px tall** inside height={90}, because the 130% value
  // and a three-line 130% label had eaten the rest. That is the same failure mode as the
  // `.ec-bar-track` note in `index.css` — the meaning drawn at a size that cannot carry it —
  // reached through the font-scale axis instead of through flex sizing.
  // Dividing by the 16px root baseline makes the box grow WITH the text: at 100% this is
  // arithmetically the same number of pixels the call sites already got (90 / 16 = 5.625rem =
  // 90px), so the default rendering is unchanged, and at 130% the box grows to 117px instead of
  // holding 90px while its contents grow into it. A caller may still pass a CSS string to opt out.
  const boxHeight = typeof height === "number" ? `${height / 16}rem` : height;
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
          {/* The unit belongs on the FACE of the chart, not only in
              `description`. Measured 2026-09-02 on Reference > Market Dashboard:
              the word "trillions" appeared in the DOM exactly once — inside the
              `role="img"` aria-label below — and nowhere in `innerText`. So a
              screen-reader user was told the bars are trillions of dollars while
              a sighted reader saw a bar labeled "9" under the title "Fed Balance
              Sheet", with the caption ("the shape, not the exact level, is the
              point") declining to say what the level measures. A text
              alternative may restate what is on screen; it must not be the only
              place a fact appears.
              Rendered as its own span rather than appended to `title` so the
              five language strings stay separable, and deliberately OUTSIDE the
              role="img" below so it is not announced twice. `Bar` is the only
              primitive here that prints bare numeric values, which is why the
              prop is on this one and not on the file's other nine figcaptions. */}
          {unit && (
            <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 400 }}>
              {" · "}{unit}
            </Text>
          )}
        </figcaption>
      )}
      {/*
        GEOMETRY LIVES IN `index.css` (`.ec-bar-*`), NOT HERE, and that is the
        one deliberate exception to this file's inline-style habit: below ~356px
        the column layout does not fit, and a media query cannot reach an inline
        style. `index.css`'s BAR CHART LAYOUT block carries the measurement, the
        three fixes that were rejected, and why the breakpoint is 375px.
        Colors stay here as `theme.js` tokens, so there is still exactly one
        source of color truth.

        The two custom properties are the seam. `--ec-bar-pct` is read as a
        HEIGHT in the column layout and as a WIDTH in the narrow row layout —
        which is precisely the switch an inline `height` could not have made.
      */}
      <div role="img" aria-label={description} className="ec-bar-row" style={{ "--ec-bar-box": boxHeight }}>
        {data.map((d, i) => (
          <div key={d.label} className="ec-bar-col">
            <span className="ec-bar-value" style={{ color: ink.body }}>{formatValue(d.value)}</span>
            <div className="ec-bar-track">
              <div className="ec-bar-fill" style={{ "--ec-bar-pct": `${(Math.abs(d.value) / max) * 100}%`, background: colors[i] }} />
            </div>
            <span className="ec-bar-label" style={{ color: ink.muted }}>{d.label}</span>
          </div>
        ))}
      </div>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── YieldCurve ────────────────────────────────────────────────────────────
// The four shapes were authored as four `d` strings. They are stored as four
// y-vectors instead because **all four shared the same x control points**
// (10/40/70/130 — measured off the four `d` strings before this change, with a
// control confirming the four y-vectors were distinct, so the parser was not
// reading one row four times): only the heights ever differed. That makes the
// move from one shape to another a four-number interpolation rather than a
// path-morphing problem, which is what lets `animated` exist at all.
//
// It also removes a failure mode rather than needing a check for one: with a
// single shared `CURVE_XS` there is no longer a per-shape x value that could
// drift and put a curve's bend at the wrong maturity.
const CURVE_XS = [10, 40, 70, 130];
const CURVE_YS = {
  normal: [60, 50, 35, 15],
  flat: [38, 37, 36, 34],
  inverted: [15, 25, 35, 55],
  steep: [70, 55, 30, 5],
};
// Rounded to 2dp so an in-flight frame does not emit a 17-digit float into the
// DOM; the visual difference at this viewBox is well under a pixel.
const curvePath = (ys) =>
  `M${CURVE_XS[0]},${+ys[0].toFixed(2)} Q${CURVE_XS[1]},${+ys[1].toFixed(2)} ${CURVE_XS[2]},${+ys[2].toFixed(2)} T${CURVE_XS[3]},${+ys[3].toFixed(2)}`;

const CURVE_STROKE = { normal: graph.green, flat: graph.amber, inverted: graph.red, steep: graph.blue };
const CURVE_INK = { normal: ink.ok, flat: ink.warn, inverted: ink.bad, steep: ink.accent };

const MORPH_MS = 520;

// index.css's `prefers-reduced-motion` block neutralizes CSS animations and
// transitions with `!important`, and a requestAnimationFrame loop is invisible
// to it. So the preference is read here as well — without this, the one place
// in the app that actually moves would be the one place that ignores the
// setting. Read at the start of each move rather than cached, so a reader who
// changes the OS setting mid-session gets the new behavior on the next tap.
function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;   // no matchMedia (SSR, old browser) — animate, as before
  }
}

// `animated` is opt-in per call site, not a default. Reference > Market signals
// renders all four shapes at once as a static comparison, where nothing ever
// changes `type` and a morph would be dead code; lesson 36 renders ONE curve
// the reader moves between shapes, which is the case this exists for.
//
// `maxHeight` defaults to the four-up grid's 64px so that call site is
// untouched by this prop existing.
export function YieldCurve({ type, label, description, animated = false, maxHeight = 64 }) {
  // The rendered heights, which are not `CURVE_YS[type]` while a move is in
  // flight. `ysRef` tracks the same value so an interruption (a second tap
  // before the first move lands) departs from where the curve visibly IS
  // rather than snapping back to the previous shape's endpoint.
  const ysRef = useRef(CURVE_YS[type]);
  const [ys, setYs] = useState(ysRef.current);

  useEffect(() => {
    const to = CURVE_YS[type];
    const from = ysRef.current;
    const apply = (v) => { ysRef.current = v; setYs(v); };

    if (!animated || prefersReducedMotion() || from.every((v, i) => v === to[i])) {
      apply(to);
      return undefined;
    }

    let raf = 0;
    let start = 0;
    const tick = (now) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / MORPH_MS);
      // easeInOutQuad: the curve leaves and arrives slowly, so the reader's eye
      // is on the shape at both ends rather than on the fastest part.
      const e = p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2;
      // The last frame snaps to the authored vector rather than to the lerp's
      // own p=1 output, so a shape at rest is always byte-identical to the `d`
      // string it was authored as, whether it was arrived at by tapping or by
      // first render.
      if (p < 1) {
        apply(to.map((target, i) => from[i] + (target - from[i]) * e));
        raf = requestAnimationFrame(tick);
      } else {
        apply(to);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [type, animated]);

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["3"], textAlign: "center", margin: 0 }}>
      <svg viewBox="0 0 140 75" style={{ width: "100%", maxHeight }} role="img" aria-label={description || label}>
        <line x1="10" y1="70" x2="130" y2="70" stroke={line.hairline} strokeWidth="1" />
        <line x1="10" y1="5" x2="10" y2="70" stroke={line.hairline} strokeWidth="1" />
        <text x="15" y="68" fill={ink.muted} fontSize="7">2Y</text>
        <text x="60" y="68" fill={ink.muted} fontSize="7">10Y</text>
        <text x="112" y="68" fill={ink.muted} fontSize="7">30Y</text>
        {/* The stroke color belongs to the DESTINATION shape from the first
            frame, not to the shape being left: the color and the label change
            together on tap, and only the geometry travels. Animating the color
            too would put the curve in an unnamed in-between state — a
            yellow-green line that is neither "Normal" nor "Flat" — for half a
            second, which is exactly the ambiguity the four names exist to
            remove. */}
        <path d={curvePath(ys)} fill="none" stroke={CURVE_STROKE[type]} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <figcaption style={{ marginTop: space["2"] }}>
        <Text as="span" variant="caption" color={CURVE_INK[type]} style={{ fontWeight: 700 }}>{label}</Text>
      </figcaption>
    </figure>
  );
}

// ── ProportionBar ─────────────────────────────────────────────────────────
// One number divided into named parts. Used by lesson 1, where a budget *is*
// a division of take-home pay — the bar shows in one glance what the prose
// spends three paragraphs establishing.
export function ProportionBar({ title, segments, colors, labelInks, formatValue, description, caption }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <div role="img" aria-label={description} style={{ display: "flex", width: "100%", height: 28, borderRadius: radius.sm, overflow: "hidden" }}>
        {segments.map((s, i) => (
          <div key={s.label} style={{ width: `${(s.value / total) * 100}%`, background: colors[i], transition: "width 0.5s" }} />
        ))}
      </div>
      <ul role="list" style={{ listStyle: "none", margin: `${space["3"]}px 0 0`, padding: 0, display: "flex", flexWrap: "wrap", gap: `${space["1"]}px ${space["4"]}px` }}>
        {segments.map((s, i) => (
          <li key={s.label} style={{ display: "flex", alignItems: "baseline", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: colors[i], flexShrink: 0, alignSelf: "center" }} />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{s.label}</Text>
            <Text as="span" variant="caption" color={ink.muted}>
              {formatValue(s.value)} · {Math.round((s.value / total) * 100)}%
            </Text>
          </li>
        ))}
      </ul>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── GrowthCurve ───────────────────────────────────────────────────────────
// Two series over the same x-axis, for lesson 3. The whole point of compound
// interest is the *shape* of the divergence, so a straight line and a curve
// from one shared origin is the explanation rather than an illustration of it.
const CURVE_W = 300;
const CURVE_H = 120;
const CURVE_PAD = { left: 6, right: 6, top: 8, bottom: 20 };

// `xSuffix` defaults to empty: the lesson titles above these charts already
// carry the unit ("over 30 years") in all five languages, and abbreviating
// "years" per locale on a two-character axis label reads badly in several.
export function GrowthCurve({ title, xValues, series, colors, labelInks, formatValue, xSuffix = "", description, caption }) {
  const max = Math.max(...series.flatMap((s) => s.values));
  const lastX = xValues[xValues.length - 1];
  const plotW = CURVE_W - CURVE_PAD.left - CURVE_PAD.right;
  const plotH = CURVE_H - CURVE_PAD.top - CURVE_PAD.bottom;
  const px = (x) => CURVE_PAD.left + (x / lastX) * plotW;
  const py = (v) => CURVE_PAD.top + plotH - (v / max) * plotH;

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/* `data-figure`/`data-figure-part` are read by a11y-sweep.js's figureClaims
          probe (backlog item 136), which asserts the three relations this figure's
          own text alternative states: the two series start together, one is drawn
          straight while the other curves, and the gap between them widens. They
          are inert markup — nothing renders differently for their presence. */}
      <svg viewBox={`0 0 ${CURVE_W} ${CURVE_H}`} style={{ width: "100%", height: 132 }} role="img" data-figure="growthCurve" aria-label={description}>
        <line x1={CURVE_PAD.left} y1={py(0)} x2={CURVE_W - CURVE_PAD.right} y2={py(0)} stroke={line.hairline} strokeWidth="1" />
        {xValues.filter((x) => x > 0 && x < lastX).map((x) => (
          <line key={x} x1={px(x)} y1={CURVE_PAD.top} x2={px(x)} y2={py(0)} stroke={line.hairline} strokeWidth="0.5" strokeDasharray="3" />
        ))}
        {series.map((s, i) => (
          <polyline
            key={s.label}
            data-figure-part="series"
            data-figure-index={i}
            points={s.values.map((v, j) => `${px(xValues[j])},${py(v)}`).join(" ")}
            fill="none"
            stroke={colors[i]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {series.map((s, i) => (
          <circle key={s.label} cx={px(lastX)} cy={py(s.values[s.values.length - 1])} r="3.5" fill={colors[i]} />
        ))}
        <text x={CURVE_PAD.left} y={CURVE_H - 6} fill={ink.muted} fontSize="9">0{xSuffix}</text>
        <text x={CURVE_W - CURVE_PAD.right} y={CURVE_H - 6} textAnchor="end" fill={ink.muted} fontSize="9">{lastX}{xSuffix}</text>
      </svg>
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "flex", flexWrap: "wrap", gap: `${space["1"]}px ${space["4"]}px` }}>
        {series.map((s, i) => (
          <li key={s.label} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 14, height: 3, borderRadius: 2, background: colors[i], flexShrink: 0 }} />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{s.label}</Text>
            <Text as="span" variant="caption" color={ink.muted}>{formatValue(s.values[s.values.length - 1])}</Text>
          </li>
        ))}
      </ul>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── AsymmetryChart ────────────────────────────────────────────────────────
// Two bars off a shared zero line, deliberately unequal in length while the
// money they represent is equal. For lesson 27: the asymmetry is the entire
// finding, and a reader who *sees* one bar run twice as far has it immediately.
export function AsymmetryChart({ title, axisLabel, bars, colors, labelInks, description, caption }) {
  const max = Math.max(...bars.map((b) => Math.abs(b.felt)));
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/*
        The zero line is drawn once across the whole plot rather than per
        column: it is a shared axis, and rendering it per bar made it read as
        two unrelated baselines instead of one line the bars are measured from.

        `graph.neutral`, not `line.strong`, and the reason is measured. This
        line is the reference the two bars are read against — the lesson's
        whole finding is that one runs twice as far from it — so it is a
        graphic "required to understand the content" under WCAG 1.4.11 and
        owes 3:1. `line.strong` measures 1.71:1 light / 1.62:1 dark on
        `surface.card`; no `--line-*` token clears 3:1 against any surface in
        either palette, which is why the fix is a different token and not a
        different shade. `graph.neutral` measures 5.24:1 light / 4.47:1 dark
        and is checked on every surface by §28b. `ink.muted` would also clear
        it, at 7.01:1 — and would then out-weigh the data bars it exists to
        measure: rendered, the bars sit at 5.93:1 and 5.75:1, so the line
        wants to be lighter than that, which `graph.neutral` is and
        `ink.muted` is not.
      */}
      <div role="img" data-figure="lossAsymmetry" aria-label={description} style={{ position: "relative", display: "flex", gap: space["4"], height: 150 }}>
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: `1px solid ${graph.neutral}` }} />
        {bars.map((b, i) => {
          const up = b.felt > 0;
          const frac = (Math.abs(b.felt) / max) * 50;
          return (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                {up && <div data-figure-part="bar" data-figure-index={i} style={{ width: "60%", height: `${frac * 2}%`, background: colors[i], borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, transition: "height 0.5s" }} />}
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                {!up && <div data-figure-part="bar" data-figure-index={i} style={{ width: "60%", height: `${frac * 2}%`, background: colors[i], borderRadius: `0 0 ${radius.sm}px ${radius.sm}px`, transition: "height 0.5s" }} />}
              </div>
            </div>
          );
        })}
      </div>
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "flex", gap: space["4"] }}>
        {bars.map((b, i) => (
          <li key={b.label} style={{ flex: 1, textAlign: "center" }}>
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{b.label}</Text>
          </li>
        ))}
      </ul>
      {axisLabel && (
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"], textAlign: "center" }}>{axisLabel}</Text>
      )}
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── PreferenceFlip ────────────────────────────────────────────────────────
// Two perceived-value curves that CROSS, for lesson 23 (present bias). Every
// other figure in this file compares two things; this one plots a reversal,
// which is why it is drawn rather than described: the lesson's prose states the
// flip as two disconnected snapshots ("$50 today beats $65 in a month" / "$50
// in twelve months loses to $65 in thirteen") and has no way to say *when* the
// answer changes in between. The crossing is the lesson.
//
// The reversal is carried by two things: the tinted panel behind the curves,
// which stays readable at any line separation, and the curves themselves.
//
// ⚠️ This comment used to say the near-coincidence of the two curves was "the
// honest shape of hyperbolic discounting, not a drafting failure", and that the
// panel alone carried the decision. Measured in rendered pixels (backlog item
// 137), that was too generous to the drawing: on a linear axis the curves came
// out 1.64px apart under a 2.58px stroke, so they did not render as two nearly
// coincident lines — they rendered as ONE line, over the whole left three
// quarters, which is precisely the stretch the caption calls "the $65 is simply
// the better deal". The curves being CLOSE is the honest shape; the reader
// being unable to tell which one is on top is not, and no amount of panel
// tinting says which option is higher. The `yNorm` prop is where that was
// fixed — see `flipYNorm` in `moneyVisuals.js` for the scale and its cost.
//
// `crossing` arrives already solved by the caller; deriving it from the sampled
// points here would put the marker wherever the sampling happened to be dense.
const FLIP_W = 300;
const FLIP_H = 140;
const FLIP_PAD = { left: 6, right: 6, top: 18, bottom: 22 };

export function PreferenceFlip({ title, xValues, series, crossing, yNorm, colors, labelInks, zones, zoneColors, zoneEdges, markerLabel, axisLabels, description, caption }) {
  const lastX = xValues[xValues.length - 1];
  const plotW = FLIP_W - FLIP_PAD.left - FLIP_PAD.right;
  const plotH = FLIP_H - FLIP_PAD.top - FLIP_PAD.bottom;
  const floorY = FLIP_PAD.top + plotH;
  const px = (x) => FLIP_PAD.left + (x / lastX) * plotW;
  // `yNorm` returns a 0..1 position and belongs to the content module, because
  // the scale is a claim about the data and this file holds no data. The rule
  // it must satisfy is stated and enforced in `check-data.mjs` §50.
  const py = (v) => floorY - yNorm(v) * plotH;
  const flipX = px(crossing);

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${FLIP_W} ${FLIP_H}`} style={{ width: "100%", height: 150 }} role="img" data-figure="preferenceFlip" aria-label={description}>
        {/* The two decision regions, drawn first so everything else sits on top. */}
        <rect x={FLIP_PAD.left} y={FLIP_PAD.top} width={flipX - FLIP_PAD.left} height={plotH} fill={zoneColors[0]} />
        <rect x={flipX} y={FLIP_PAD.top} width={FLIP_W - FLIP_PAD.right - flipX} height={plotH} fill={zoneColors[1]} />
        {/* The plot floor, not a zero line: `py(0)` is undefined on this scale and
            was never labeled as zero anyway. Same pixel it has always been drawn at. */}
        <line x1={FLIP_PAD.left} y1={floorY} x2={FLIP_W - FLIP_PAD.right} y2={floorY} stroke={line.hairline} strokeWidth="1" />
        {/*
          `ink.muted`, not one of the `line` tokens, and the reason is measured.
          The two zone washes measure 1.01:1 against EACH OTHER in BOTH schemes
          — they differ in hue and essentially not at all in luminance,
          so the boundary between them is invisible to anyone not separating
          those hues. That makes this marker the only thing that locates the
          crossing by luminance rather than color, which is exactly the case
          WCAG 1.4.11 is about; `line.strong` measured 1.51:1 on the washes and
          would have been a marker you cannot see on a band you cannot see.
          `ink.muted` measures 6.20/6.26 in light and 6.10/6.06 in dark.
        */}
        <line data-figure-part="marker" x1={flipX} y1={FLIP_PAD.top} x2={flipX} y2={floorY} stroke={ink.muted} strokeWidth="1" strokeDasharray="3 2" />
        <text x={flipX - 4} y={FLIP_PAD.top - 6} textAnchor="end" fill={ink.muted} fontSize="9">{markerLabel}</text>
        {series.map((s, i) => (
          <polyline
            data-figure-part="series"
            data-figure-index={i}
            key={s.label}
            points={s.values.map((v, j) => `${px(xValues[j])},${py(v)}`).join(" ")}
            fill="none"
            stroke={colors[i]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {series.map((s, i) => (
          <circle key={s.label} cx={px(lastX)} cy={py(s.values[s.values.length - 1])} r="3.5" fill={colors[i]} />
        ))}
        <text x={FLIP_PAD.left} y={FLIP_H - 6} fill={ink.muted} fontSize="9">{axisLabels[0]}</text>
        <text x={FLIP_W - FLIP_PAD.right} y={FLIP_H - 6} textAnchor="end" fill={ink.muted} fontSize="9">{axisLabels[1]}</text>
      </svg>
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "flex", flexWrap: "wrap", gap: `${space["1"]}px ${space["4"]}px` }}>
        {series.map((s, i) => (
          <li key={s.label} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 14, height: 3, borderRadius: 2, background: colors[i], flexShrink: 0 }} />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{s.label}</Text>
          </li>
        ))}
      </ul>
      {/*
        No end-of-curve value is printed beside these labels, unlike GrowthCurve.
        There the last point is money; here it is a *perceived* value, and
        rendering it as "$65, a month later — $32.50" reads as a claim that the
        $65 is really $32.50. The y-axis is deliberately unlabeled for the same
        reason: the quantity is "how much it feels worth", which the caption
        says in words and a dollar figure would over-state.

        The zone key is a separate list rather than text inside the bands: the
        right-hand band is under a fifth of the width at every scale the figure
        is drawn at, so a label placed in it would be clipped in all five
        languages. The swatches carry a border because the fills are washes —
        a bare wash square is nearly invisible against the card.
      */}
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "grid", gap: space["1"] }}>
        {zones.map((z, i) => (
          <li key={z} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: radius.sm, background: zoneColors[i], border: `1px solid ${zoneEdges[i]}`, flexShrink: 0 }} />
            <Text as="span" variant="caption" color={ink.muted}>{z}</Text>
          </li>
        ))}
      </ul>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── BracketStack ──────────────────────────────────────────────────────────
// Income sliced into rate layers and filled bottom-up, drawn twice: before a
// raise and after it. For lesson 7, whose own first sentence is "imagine income
// tax as a stack of buckets... money fills them from the bottom up" — prose
// that was already describing a picture the app declined to draw.
//
// Two things carry the teaching and both are structural rather than annotated:
// the columns share one scale and one baseline, so the layers below the old
// income line are visibly the same height in both (a raise cannot re-tax what
// is underneath it); and because the new bands sit on top, the second column's
// extra *height is* the raise, which is why no separate scale bar is needed.
// The dashed outline only names what the height difference already shows.
const STACK_H = 176;

export function BracketStack({ title, columns, tierColors, tierLabels, raiseLabel, summary, description, caption }) {
  const max = Math.max(...columns.map((c) => c.total));
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/*
        `paddingTop` reserves the row the raise label sits in. It is on the
        flex row rather than on the taller column so both columns keep the same
        baseline — the alignment is the argument here, not decoration.
      */}
      {/* `data-figure`/`data-figure-part` feed a11y-sweep.js's figureClaims probe
          (backlog item 136). The claim they carry is the caption's first sentence —
          "below the old income line the two stacks are identical" — which is an
          equality between RENDERED boxes in two different columns, exactly the
          class of claim a source check cannot see. Inert markup. */}
      <div role="img" data-figure="bracketStack" aria-label={description} style={{ display: "flex", alignItems: "flex-end", gap: space["5"], paddingTop: space["5"] }}>
        {columns.map((col, ci) => {
          const raise = col.bands.reduce((sum, b) => sum + (b.isRaise ? b.amount : 0), 0);
          return (
            <div key={col.label} style={{ flex: 1, minWidth: 0 }}>
              <div style={{ position: "relative", height: (col.total / max) * STACK_H }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column-reverse", borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, overflow: "hidden" }}>
                  {col.bands.map((b, i) => (
                    <div key={i} data-figure-part="band" data-figure-column={ci} data-figure-index={i} style={{ height: `${(b.amount / col.total) * 100}%`, background: tierColors[b.tier], minHeight: 2, transition: "height 0.5s" }} />
                  ))}
                </div>
                {raise > 0 && (
                  <>
                    <div
                      aria-hidden="true"
                      style={{ position: "absolute", top: 0, left: -3, right: -3, height: `${(raise / col.total) * 100}%`, border: `2px dashed ${graph.neutral}`, borderRadius: radius.sm, pointerEvents: "none" }}
                    />
                    <Text
                      as="span" variant="caption" color={ink.body}
                      style={{ position: "absolute", bottom: "100%", left: 0, right: 0, marginBottom: space["1"], textAlign: "center", fontWeight: 700 }}
                    >
                      {raiseLabel}
                    </Text>
                  </>
                )}
              </div>
              <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"], textAlign: "center" }}>{col.label}</Text>
            </div>
          );
        })}
      </div>
      <ul role="list" style={{ listStyle: "none", margin: `${space["4"]}px 0 0`, padding: 0, display: "flex", flexDirection: "column", gap: space["1"] }}>
        {tierLabels.map((label, i) => (
          <li key={label} style={{ display: "flex", alignItems: "baseline", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: tierColors[i], flexShrink: 0, alignSelf: "center" }} />
            <Text as="span" variant="caption" color={ink.muted}>{label}</Text>
          </li>
        ))}
      </ul>
      {/*
        A description list, not another legend row: each line is a name and the
        number that answers it, which is what <dt>/<dd> are for. These two lines
        are the lesson's actual claim in numbers, so they must survive being
        read aloud without the chart.
      */}
      <dl style={{ margin: `${space["3"]}px 0 0`, paddingTop: space["3"], borderTop: `1px solid ${line.hairline}` }}>
        {summary.map((row) => (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: space["3"] }}>
            <dt><Text as="span" variant="caption" color={ink.muted}>{row.label}</Text></dt>
            <dd style={{ margin: 0 }}><Text as="span" variant="caption" color={ink.body} style={{ fontWeight: 700 }}>{row.value}</Text></dd>
          </div>
        ))}
      </dl>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── GapColumns ────────────────────────────────────────────────────────────
// Two incomes on ONE shared scale, for lesson 17 (lifestyle inflation). Every
// other figure in this file compares quantities that differ; this one is drawn
// to show two quantities that are IDENTICAL while everything around them is
// not — the lesson's own counterintuitive result, that $50,000 earned against
// $45,000 spent and $120,000 against $115,000 are the same distance from every
// goal the gap funds.
//
// Three things make that undrawable by the obvious arrangement, and all three
// are why this is its own component rather than a `Bar` call:
//
//   1. The scale must be SHARED. Two separately-scaled columns would render
//      the two gaps at different pixel heights while both are $5,000, which is
//      the exact opposite of the claim.
//   2. The gap sits at the BOTTOM of each column. Equal-length segments at
//      different vertical offsets are the one comparison a stacked bar cannot
//      support; on a shared baseline the two bands line up directly.
//   3. The gaps are thin by construction — $5,000 against a $120,000 ceiling
//      is about 4% of the plot — so the reader is not asked to measure them.
//      The rule drawn across both columns at the top of the bands carries the
//      equality; the bands only have to be visible, not measurable.
//
// `graph.neutral` for that rule, for the reason AsymmetryChart's comment sets
// out: it is a reference line the data is read against, so it owes 3:1 under
// WCAG 1.4.11 and no `--line-*` token clears that on any surface in either
// palette. It is checked on every surface by §28b.
export function GapColumns({ title, columns, segmentLabels, ruleLabel, axisLabel, colors, labelInks, formatValue, description, caption }) {
  const max = Math.max(...columns.map((c) => c.total));
  const gapFrac = columns[0].gap / max;
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <div role="img" data-figure="earningsGap" aria-label={description} style={{ position: "relative", display: "flex", gap: space["5"], height: 170, alignItems: "flex-end" }}>
        {columns.map((c) => (
          <div key={c.label} style={{ flex: 1, height: `${(c.total / max) * 100}%`, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ flex: 1, background: colors[0], borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, transition: "height 0.5s" }} />
            <div data-figure-part="gap" style={{ height: `${(c.gap / c.total) * 100}%`, background: colors[1], minHeight: 4 }} />
          </div>
        ))}
        {/*
          Drawn last and positioned against the plot box, not against either
          column, so it is one line at one height rather than two marks that
          happen to agree. That is the assertion the figure is making.
        */}
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: `${gapFrac * 100}%`, borderTop: `1px solid ${graph.neutral}` }} />
      </div>
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "flex", gap: space["5"] }}>
        {columns.map((c) => (
          <li key={c.label} style={{ flex: 1, textAlign: "center" }}>
            <Text as="span" variant="caption" color={ink.strong} style={{ fontWeight: 700 }}>{c.label}</Text>
          </li>
        ))}
      </ul>
      <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"], textAlign: "center" }}>
        {ruleLabel} · {formatValue(columns[0].gap)}
      </Text>
      <ul role="list" style={{ listStyle: "none", margin: `${space["3"]}px 0 0`, padding: 0, display: "flex", flexWrap: "wrap", gap: `${space["1"]}px ${space["4"]}px`, justifyContent: "center" }}>
        {segmentLabels.map((label, i) => (
          <li key={label} style={{ display: "flex", alignItems: "baseline", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: colors[i], flexShrink: 0, alignSelf: "center" }} />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{label}</Text>
          </li>
        ))}
      </ul>
      {axisLabel && (
        <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"], textAlign: "center" }}>{axisLabel}</Text>
      )}
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── TradeoffPlot ──────────────────────────────────────────────────────────
// Four kinds of income on TWO axes, for lesson 44 ("The Part the Word
// 'Passive' Leaves Out"). This is the only figure in the file whose subject is
// the *dimensionality* of a claim rather than a quantity, and that is exactly
// why it is drawn: the lesson's own closing sentence is "Hold both halves at
// once and the picture stops being a ladder and becomes a set of trades", and
// prose physically cannot hold two halves at once. It gives the first axis in
// lesson 43 ("That's the real axis"), the second one lesson later ("the honest
// version of the spectrum has a second axis running the other way"), and then
// asks the reader to superimpose them from memory. One plot is the
// superposition. A ladder is one-dimensional; a trade is not, and the whole
// difference between them is a picture.
//
// ⚠️ BOTH AXES ARE ORDINAL — ranks read off the lessons' prose, never measured
// magnitudes. This is the point on which the figure could most easily start
// lying, so it is spelled out in three places (here, `moneyVisuals.js`'s
// `incomeKinds`, and the visible caption) and asserted by `check-data.mjs` §54:
//   • The horizontal order is stated exactly, and completely, by lesson 43:
//     labor most tightly coupled to your hours, then business, then rent and
//     royalties, then investment "barely coupled to your time at all".
//   • The vertical order is stated by lesson 44 as a TENDENCY — "as income gets
//     less coupled to your hours, it generally demands more of something else
//     up front" — plus one exact claim about a single item, that labor is
//     "the only one of the four you can begin with nothing but yourself".
//     So labor's dot sits ON the rail and the other three are lifted off it;
//     the rise across those three is the lesson's word "generally" and NOT a
//     ranking of business against rent against shares, which the lesson
//     declines to give. No tick, gridline or number appears on that axis,
//     because any of them would promise a precision the prose does not have.
//
// The stems are load-bearing rather than decorative. The rail alone is the
// ladder people already reach for; each stem is what that rung costs before it
// pays anything, so the figure shows the ladder AND the reason it is not one,
// in the same marks.
//
// One color for all four dots, deliberately. The lesson's own conclusion is
// "Neither column is the smart one", and `graph.green`/`graph.red` would
// editorialise a lesson whose entire argument is a refusal to rank — a §10.1
// problem drawn rather than written. `graph.neutral` for the rail and stems
// for the reason `AsymmetryChart`'s comment sets out: they are reference
// geometry the dots are read against, so they owe 3:1 under WCAG 1.4.11, and
// no `--line-*` token clears that on any surface in either palette (§28b/§51).
const TRADE_W = 300;
const TRADE_H = 150;
const TRADE_PAD = { left: 20, right: 20, top: 26, bottom: 30 };

export function TradeoffPlot({ title, points, endLabels, upfrontLabel, colors, description, caption }) {
  const maxUpfront = Math.max(...points.map((p) => p.upfront));
  const plotW = TRADE_W - TRADE_PAD.left - TRADE_PAD.right;
  const plotH = TRADE_H - TRADE_PAD.top - TRADE_PAD.bottom;
  const railY = TRADE_PAD.top + plotH;
  const px = (i) => TRADE_PAD.left + (i / (points.length - 1)) * plotW;
  const py = (u) => railY - (u / maxUpfront) * plotH;

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${TRADE_W} ${TRADE_H}`} style={{ width: "100%", height: 160 }} role="img" data-figure="incomeTradeoff" aria-label={description}>
        {/* The ladder: the one axis the lesson says people already read. */}
        <line data-figure-part="rail" x1={TRADE_PAD.left} y1={railY} x2={TRADE_W - TRADE_PAD.right} y2={railY} stroke={colors.rail} strokeWidth="1" />
        {points.map((p, i) => (
          <line key={`stem-${p.key}`} x1={px(i)} y1={railY} x2={px(i)} y2={py(p.upfront)} stroke={colors.rail} strokeWidth="1" strokeDasharray="2 2" />
        ))}
        {points.map((p, i) => (
          <circle key={`dot-${p.key}`} data-figure-part="dot" data-figure-index={i} cx={px(i)} cy={py(p.upfront)} r="5" fill={colors.dot} />
        ))}
        {/*
          The index sits BESIDE each dot, never inside it. `graph.blue` is a
          3:1 graphics token and theme.js says of the whole group "Never text",
          so a numeral printed on a dot would be the one place in this file
          where label contrast is decided by a token that was never measured
          for it. Beside the dot it is `ink.muted`, which §28 holds at 4.5:1.
        */}
        {points.map((p, i) => (
          <text key={`n-${p.key}`} x={px(i)} y={py(p.upfront) - 9} textAnchor="middle" fill={ink.muted} fontSize="10" fontWeight="700">
            {i + 1}
          </text>
        ))}
      </svg>
      {/*
        The two ends of the horizontal axis are the lessons' own words for it
        ("it is the only one of the four that reliably becomes zero when you
        stop" / "Ben's dividend doesn't notice"), and they live in HTML rather
        than in the SVG because they are the longest strings in the figure:
        at `fontSize="9"` the Spanish pair overruns 300 units and would be
        clipped, while here they wrap and scale with the text-size control.
      */}
      <div style={{ display: "flex", gap: space["3"], marginTop: space["1"] }}>
        <Text as="span" variant="caption" color={ink.muted} style={{ flex: 1 }}>{endLabels[0]}</Text>
        <Text as="span" variant="caption" color={ink.muted} style={{ flex: 1, textAlign: "right" }}>{endLabels[1]}</Text>
      </div>
      <Text variant="caption" color={ink.muted} style={{ marginTop: space["2"], textAlign: "center" }}>{upfrontLabel}</Text>
      {/*
        An <ol>, not the <ul> the other legends use: the order IS the
        horizontal axis, so it is content rather than presentation. `role="list"`
        is not redundant here — WebKit drops list semantics from any list styled
        `listStyle: none`, which is backlog item 34 and is checked by §24. The
        index is `aria-hidden` because it is a visual key to dots that live
        inside a `role="img"`, so nothing announces it on the plot side; the
        list's own position announcement carries the order instead.
      */}
      <ol role="list" style={{ margin: `${space["3"]}px 0 0`, padding: 0, listStyle: "none", display: "grid", gap: space["1"] }}>
        {points.map((p, i) => (
          <li key={p.key} style={{ display: "flex", alignItems: "baseline", gap: space["2"] }}>
            <Text as="span" aria-hidden="true" variant="caption" color={ink.muted} style={{ fontWeight: 700, minWidth: "1.2em" }}>{i + 1}</Text>
            <Text as="span" variant="caption" color={ink.strong} style={{ fontWeight: 700 }}>{p.label}</Text>
          </li>
        ))}
      </ol>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── SunkFork ──────────────────────────────────────────────────────────────
// Lesson 19 ("Throwing Good Money After Bad"), backlog item 27.
//
// A FOURTH kind of figure for this file, and naming the kind is what decides
// what may be drawn. `GrowthCurve`/`GapColumns`/`AsymmetryChart` plot
// arithmetic their lesson states; `TradeoffPlot` plots ranks read off two
// sentences; `OutcomeGrid` plots a partition. This one plots TOPOLOGY — where
// a cost sits relative to a decision — and carries exactly one number.
//
// WHY IT EARNS A PICTURE, and the argument is positional rather than
// numerical. Lesson 19's claim is not that $120 is large or small; it is that
// the $120 left the account BEFORE tonight's choice existed ("It left her
// account the moment she bought the ticket, weeks before she ever got sick"),
// so it is common to both branches and cancels. Prose has to assert that
// twice — once per branch — and the reader has to hold both assertions at
// once to see them cancel. Drawn, nothing has to be asserted at all: the
// amount is on the trunk, the trunk is upstream of the fork, and there is
// visibly nowhere else for it to be. That is a shape, and it is the one shape
// this file does not already draw.
//
// ⚠️ WHY IT IS NOT TWO COLUMNS, which is the obvious drawing and the wrong
// one. Two columns each carrying an identical $120 band at the base is
// `GapColumns` — lesson 17's figure, whose caption already turns on "It is
// exactly the same height in both". It would also misplace the money: columns
// put the cost INSIDE each option, which is precisely the reasoning the lesson
// is arguing against ("I'd be wasting the money if I stayed home"). The cost
// belongs upstream of the fork, drawn once, because it was spent once.
//
// ⛔ THE TWO BRANCHES ARE DRAWN IDENTICALLY, and that is load-bearing rather
// than lazy. Lesson 19 explicitly refuses to rank them: "Sunk costs aren't a
// reason to always quit, either — sometimes the honest fresh look still says
// continue. The point isn't which answer is right." So both branches take the
// same stroke, the same dot radius and the same token, and neither carries a
// mark the other lacks. Coloring one `graph.green` would render a
// recommendation the lesson declines to make — §10.1 drawn rather than
// written — and `check-data.mjs` §77 (d) is what holds it.
const FORK_W = 300;
const FORK_H = 150;
// The fork sits left of center on purpose: the trunk carries one short label
// and the branches carry the comparison, so the space belongs downstream.
const FORK_X = 118;
const FORK_MID_Y = 78;
const FORK_SPREAD = 36;
const FORK_START_X = 20;
const FORK_END_X = 268;
const FORK_DOT_R = 5;

export function SunkFork({ title, amountLabel, trunkLabel, branches, colors, description, caption }) {
  const endY = [FORK_MID_Y - FORK_SPREAD, FORK_MID_Y + FORK_SPREAD];

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${FORK_W} ${FORK_H}`} style={{ width: "100%", height: 150 }} role="img" data-figure="sunkFork" aria-label={description}>
        {/*
          The trunk. `graph.neutral` rather than `graph.blue`: it is the part
          of the picture the lesson says to stop weighing, and the two live
          options are the blue ones. It is drawn once because the money was
          spent once.
        */}
        <line data-figure-part="trunk" x1={FORK_START_X} y1={FORK_MID_Y} x2={FORK_X} y2={FORK_MID_Y} stroke={colors.trunk} strokeWidth="2" />
        {/*
          The amount, printed on the trunk and nowhere else — the single number
          in this figure, and the only place it may appear. `ink.muted` is a
          4.5:1 text token; `graph.*` is "never text" (theme.js), so the label
          does not borrow the trunk's stroke color.
        */}
        <text x={FORK_START_X} y={FORK_MID_Y - 10} fill={ink.muted} fontSize="12" fontWeight="700">{amountLabel}</text>
        {/* The fork: one node, both branches leaving it at the same point. */}
        <circle data-figure-part="fork" cx={FORK_X} cy={FORK_MID_Y} r="3.5" fill={colors.trunk} />
        {endY.map((y, i) => (
          <line
            key={`branch-${i}`}
            data-figure-part="branch"
            data-figure-index={i}
            x1={FORK_X}
            y1={FORK_MID_Y}
            x2={FORK_END_X}
            y2={y}
            stroke={colors.branch}
            strokeWidth="2"
          />
        ))}
        {endY.map((y, i) => (
          <circle key={`end-${i}`} data-figure-part="end" data-figure-index={i} cx={FORK_END_X} cy={y} r={FORK_DOT_R} fill={colors.branch} />
        ))}
        {/*
          The key numerals sit BESIDE each end dot, never inside it, for the
          reason TradeoffPlot states: `graph.blue` is a 3:1 graphics token that
          theme.js marks "Never text", so a numeral printed on a dot would be
          the one label in this file whose contrast rests on a token never
          measured for it.
        */}
        {endY.map((y, i) => (
          <text key={`n-${i}`} x={FORK_END_X - 11} y={y - 8} textAnchor="middle" fill={ink.muted} fontSize="10" fontWeight="700">
            {i + 1}
          </text>
        ))}
      </svg>
      {/*
        Every long string lives in HTML rather than in the SVG, which is
        TradeoffPlot's measured convention: at SVG font sizes the Spanish and
        Korean strings here overrun 300 units and clip, while in HTML they wrap
        and scale with the app's text-size control.
      */}
      <Text variant="caption" color={ink.muted} style={{ marginTop: space["1"] }}>{trunkLabel}</Text>
      {/*
        An <ol> whose order is the two branch dots top-to-bottom. `role="list"`
        is not redundant — WebKit drops list semantics from a list styled
        `listStyle: none` (backlog item 34, checked by §24). The numeral is
        `aria-hidden` because it keys dots inside a `role="img"`, so nothing
        announces it on the figure side.
      */}
      <ol role="list" style={{ margin: `${space["3"]}px 0 0`, padding: 0, listStyle: "none", display: "grid", gap: space["1"] }}>
        {branches.map((b, i) => (
          <li key={b.key} style={{ display: "flex", alignItems: "baseline", gap: space["2"] }}>
            <Text as="span" aria-hidden="true" variant="caption" color={ink.muted} style={{ fontWeight: 700, minWidth: "1.2em" }}>{i + 1}</Text>
            <Text as="span" variant="caption" color={ink.strong} style={{ fontWeight: 700 }}>{b.label}</Text>
          </li>
        ))}
      </ol>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── OutcomeGrid ───────────────────────────────────────────────────────────
// Lesson 28 ("Does One Lucky Win Prove You Have a System?"), backlog item 27.
//
// The third KIND of figure in this file, and the difference is worth naming
// because it decides what may be drawn. `GrowthCurve`/`GapColumns`/
// `AsymmetryChart` plot arithmetic their lesson states. `TradeoffPlot` plots
// ranks read off two sentences. This one plots a PARTITION — two binary axes
// crossed — and carries no magnitude at all.
//
// WHY A PICTURE. Lesson 28's sentence is "outcome and process are two
// different things — a good decision can still lose ... and a bad or lucky
// decision can still win". Two different things means two axes, and the claim
// the lesson actually needs is that ONE COLUMN CONTAINS BOTH ROWS: a win tells
// you which column you are in and nothing about which cell. Prose can assert
// that twice; it cannot show a column with two cells in it, because a column
// with two cells in it is a shape. The bracket is what turns the grid from a
// table into that argument — it spans the won column and stops there.
//
// ⚠️ EQUAL CELLS ARE LOAD-BEARING, not a layout default. The lesson says all
// four cases occur and says NOTHING about their frequencies ("very weak
// evidence", never "usually luck"). So the cells are the same size, carry the
// same mark, and no area, count or probability appears anywhere. Weighting
// them would answer a question lesson 28 leaves open and would edge into
// telling a reader how much to trust a result — §10.1 drawn rather than
// written. `check-data.mjs` §57 (e) holds the four cells equal.
//
// COLOR. `graph.neutral` for the cell rules and the bracket, not
// `line.hairline`: these are datum geometry rather than decoration — the
// partition IS the content — so WCAG 1.4.11 applies at 3:1 and no `line-*`
// token clears that on any surface in either palette (§28b/§51). This is
// backlog item 124's case exactly, and it is the reason that item is worth
// keeping: the bracket is drawn with CSS borders, which §51's source scan
// cannot see, so the token choice here is a decision rather than something a
// check would have caught. `graph.blue` marks Maria's cell and `graph.neutral`
// the other three — never `green`/`red`, which would rank cells in a lesson
// whose whole point is that the outcome does not rank the decision.
const GRID_DOT = 7;
// The cell box is a FIXED height, not a minimum, and that is only safe because
// a cell holds one `GRID_DOT` and no text (see the cell's own comment and
// `check-data.mjs` §57 (e2)). CSS grid stretches a row to its tallest item, so
// with `minHeight` the row whose LABEL wraps to more lines drew taller cells
// than the other — measured live at 65px against 52px, from "A bad or lucky
// decision" wrapping where "A good decision" did not. The label still wraps
// freely; the cell no longer follows it.
const GRID_CELL_H = 52;

export function OutcomeGrid({ title, columnLabels, rowLabels, cells, spanLabel, hereLabel, description, caption, colors }) {
  const cellAt = (row, col) => cells.find((c) => c.row === row && c.col === col);

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/*
        HTML rather than SVG, deliberately, and the reason is the same one
        `TradeoffPlot`'s end labels are in HTML: these strings are long and
        five-language. "Una decisión mala o afortunada" cannot be laid out in a
        150-unit SVG cell at any readable size, and SVG does not wrap — it
        would clip silently in exactly the languages nobody re-reads. Here the
        cells wrap and grow with the app's own font-scale control. `Bar` is the
        precedent for a `role="img"` that is a div rather than an svg.
      */}
      <div role="img" data-figure="outcomeGrid" aria-label={description} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr)", gap: space["1"], alignItems: "stretch" }}>
        {/*
          Row 0 — the bracket. It spans the won column only; that IS the
          figure's claim, so it sits above the column labels where it reads as
          covering them. `borderBottom` on a full-width box under the label
          gives the bracket's crossbar, and the two side ticks are the short
          verticals that make it a bracket rather than an underline.
        */}
        <div />
        <div />
        <div style={{ textAlign: "center" }}>
          <Text as="span" variant="caption" color={ink.muted}>{spanLabel}</Text>
          <div style={{ height: 6, marginTop: 2, borderLeft: `1px solid ${colors.rule}`, borderRight: `1px solid ${colors.rule}`, borderBottom: `1px solid ${colors.rule}` }} />
        </div>

        {/* Row 1 — the column headings (the outcome, the visible half). */}
        <div />
        {columnLabels.map((label) => (
          <div key={label} style={{ textAlign: "center", paddingBottom: space["1"] }}>
            <Text as="span" variant="caption" color={ink.strong} style={{ fontWeight: 700 }}>{label}</Text>
          </div>
        ))}

        {/* Rows 2-3 — the row heading (the decision, the invisible half) and its two cells. */}
        {rowLabels.map((rowLabel, row) => [
          <div key={`h-${rowLabel}`} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", textAlign: "right", paddingRight: space["2"] }}>
            <Text as="span" variant="caption" color={ink.body}>{rowLabel}</Text>
          </div>,
          ...columnLabels.map((_, col) => {
            const cell = cellAt(row, col);
            return (
              <div
                key={`c-${row}-${col}`}
                data-figure-part="cell"
                style={{
                  border: `1px solid ${colors.rule}`,
                  borderRadius: radius.sm,
                  height: GRID_CELL_H,
                  alignSelf: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: space["1"],
                  padding: space["1"],
                }}
              >
                {/*
                  ⚠️ A CELL CONTAINS A DOT AND NOTHING ELSE, and that is a
                  layout invariant rather than a style choice. CSS grid sizes a
                  row to its tallest item, so ANY text in one cell grows the
                  whole row — and the first version of this figure put Maria's
                  label inside her cell and rendered the bottom row at 82px
                  against the top row's 52px. Measured in a live browser; the
                  static check passed throughout, because `minHeight` and the
                  column fractions were all still correct and the inequality
                  arrived through content. That is the weighting this figure
                  must not draw (see the header), reached by accident. The
                  label is a key below the grid instead, where it can wrap and
                  translate freely without touching a single cell.
                */}
                <span
                  style={{
                    width: GRID_DOT,
                    height: GRID_DOT,
                    borderRadius: "50%",
                    background: cell?.here ? colors.here : colors.dot,
                    flex: "none",
                  }}
                />
              </div>
            );
          }),
        ])}
      </div>
      {/*
        The key for the one marked cell. `aria-hidden` on the swatch because it
        is a visual pointer into a `role="img"` whose own description already
        names the cell; the text beside it is `ink.muted` (4.5:1 under §28)
        rather than a `graph` token, which theme.js marks "Never text".
      */}
      {hereLabel && (
        <div style={{ display: "flex", alignItems: "center", gap: space["2"], marginTop: space["2"] }}>
          <span aria-hidden="true" style={{ width: GRID_DOT, height: GRID_DOT, borderRadius: "50%", background: colors.here, flex: "none" }} />
          <Text as="span" variant="caption" color={ink.muted}>{hereLabel}</Text>
        </div>
      )}
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── MatchGrid ─────────────────────────────────────────────────────────────
// Lesson 25 ("Does This Money Need to Be There Tomorrow, or Can It Wait Ten
// Years?") — backlog item 27, added 2026-09-04.
//
// WHY A PICTURE, and the argument is about EQUAL AREA rather than about shape.
// Lesson 25's two axes are its own two questions — how soon might this money
// be needed, and where is it actually sitting — and crossing them gives two
// pairings that agree and two that do not. The lesson names both mismatches
// and explicitly says they are the same defect seen from two sides: "The same
// mismatch runs the other way, too."
//
// What prose cannot do here is give them the same weight, and the lesson says
// so in the act of failing to. The loud mismatch gets a full paragraph with
// next month's rent, an emergency fund, a planned trip and a 15% drop. The
// quiet one gets one clause after a colon — and the lesson itself flags why:
// "it's quieter because nothing ever visibly breaks". Sequential text is
// weighted by word count; a reader meets the loud failure for four sentences
// and the quiet one for part of one. Two cells of identical size, drawn at
// once, is a claim about symmetry that a paragraph cannot make and stay
// readable. That claim IS the lesson's takeaway ("Neither 'always keep it
// safe' nor 'always chase growth'").
//
// ⚠️ NO CELL IS MARKED CORRECT, and no cell carries an amount. This is the
// closest figure in the file to reading as advice (§10.1), because a grid over
// savings-vs-investment invites a verdict, and the lesson explicitly declines
// to give one: "that's a read of your own situation, not a formula with one
// right numeric answer." So the two marks say AGREES and MISMATCHED, which is
// the lesson's own vocabulary, and neither is drawn in green or red — the same
// rule `OutcomeGrid` states for the same reason one lesson further on. A
// future run must not add a tick, a preferred cell, a shaded diagonal, a
// return figure or a horizon in years: every one of those answers a question
// lesson 25 leaves to the reader. §66 (d) and (e) hold the cells equal and the
// marks neutral.
//
// The four axis labels are lifted VERBATIM from lesson 25 in each language —
// the rows from its "A savings account and an investment account aren't really
// trying to do the same job" sentence, the columns from its own closing
// question ("'possibly any day' or 'not for years'"). §66 (a)/(b) assert that,
// following §64 (a)'s precedent: a figure inches from the paragraph it draws
// must not paraphrase it, least of all in four languages nobody here reads.
//
// Cell geometry is `OutcomeGrid`'s and for `OutcomeGrid`'s measured reason: a
// fixed `GRID_CELL_H` with the mark alone inside it, because CSS grid stretches
// a row to its tallest item and any text in a cell makes the row whose label
// wraps taller than the other — which is the weighting this figure must not
// draw, arrived at by accident.
const MATCH_MARK = 11;

export function MatchGrid({ title, columnLabels, rowLabels, cells, keyLabels, description, caption, colors }) {
  const cellAt = (row, col) => cells.find((c) => c.row === row && c.col === col);

  // Filled disc for a pairing that agrees, open ring of the SAME outer size for
  // one that does not. Shape carries it, not color alone — the two marks stay
  // distinguishable in a monochrome rendering and to anyone who does not
  // separate the two `graph` hues.
  // ⚠️ `display: block` and `flex: none` are both load-bearing, and the KEY is
  // where that was measured rather than reasoned. A first version wrapped this
  // in <span aria-hidden> to hide it from the key's row; the wrapper became the
  // flex item, the mark inside it was an inline span with no line box, and the
  // key rendered live as ONE stretched purple ellipse and one swatch that was
  // not there at all. The grid cells looked perfect throughout, because they
  // center a single child. So the hidden flag goes on the mark itself and the
  // mark carries its own box — no wrapper.
  const mark = (fit, hidden = false) => (
    <span
      aria-hidden={hidden ? "true" : undefined}
      data-figure-part={fit ? "fit" : "mismatch"}
      style={{
        display: "block",
        width: MATCH_MARK,
        height: MATCH_MARK,
        borderRadius: "50%",
        background: fit ? colors.fit : "transparent",
        border: fit ? "none" : `2px solid ${colors.mismatch}`,
        boxSizing: "border-box",
        flex: "none",
      }}
    />
  );

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <div role="img" data-figure="matchGrid" aria-label={description} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, 1fr)", gap: space["1"], alignItems: "stretch" }}>
        {/* Row 0 — the column headings: when this money might be needed. */}
        <div />
        {columnLabels.map((label) => (
          <div key={label} style={{ textAlign: "center", paddingBottom: space["1"] }}>
            <Text as="span" variant="caption" color={ink.strong} style={{ fontWeight: 700 }}>{label}</Text>
          </div>
        ))}

        {/* Rows 1-2 — the row heading (where it is sitting) and its two cells. */}
        {rowLabels.map((rowLabel, row) => [
          <div key={`h-${rowLabel}`} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", textAlign: "right", paddingRight: space["2"] }}>
            <Text as="span" variant="caption" color={ink.body}>{rowLabel}</Text>
          </div>,
          ...columnLabels.map((_, col) => (
            <div
              key={`c-${row}-${col}`}
              data-figure-part="cell"
              style={{
                border: `1px solid ${colors.rule}`,
                borderRadius: radius.sm,
                height: GRID_CELL_H,
                alignSelf: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: space["1"],
              }}
            >
              {mark(Boolean(cellAt(row, col)?.fit))}
            </div>
          )),
        ])}
      </div>
      {/*
        The key. `aria-hidden` goes on the swatches themselves — they are
        visual pointers into a `role="img"` whose own description already names
        them — and NOT on a wrapper around them; see `mark`'s comment for the
        live defect a wrapper caused. The text is `ink.muted` (4.5:1 under §28)
        rather than a `graph` token, which theme.js marks "Never text".
      */}
      {keyLabels && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${space["1"]} ${space["4"]}`, marginTop: space["3"] }}>
          {keyLabels.map((label, i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
              {mark(i === 0, true)}
              <Text as="span" variant="caption" color={ink.muted}>{label}</Text>
            </div>
          ))}
        </div>
      )}
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── SpendingLoop ──────────────────────────────────────────────────────────
// Lesson 30 ("Credit: The Most Important Part"), section 3 "The Spending
// Chain" — backlog item 27, added 2026-08-31.
//
// WHY A PICTURE, in the lesson's own words rather than in an argument built
// for it. The lesson writes its own claim as a line of arrows:
//
//     "More spending → more income → more creditworthy borrowers → more
//      borrowing → more spending, and so on."
//
// Read what prose had to do there. It writes "more spending" TWICE and then
// appends "and so on", because **a line of text cannot close**. The loop is
// the whole point — the lesson's takeaway is "a self-reinforcing loop" — and
// the one thing the sentence cannot do is join its last term to its first.
// That join is this figure's entire contribution: four steps, four arrows,
// and the fourth arrow goes back to the first step instead of stopping.
//
// EVERY STRING IN THIS FIGURE IS VERBATIM FROM LESSON 30, in all five
// languages — the four steps, the title (the section's own heading) and the
// caption are substrings of that lesson's own text, not new prose. Only
// `spendingLoopDescription` (the text alternative, which has to describe the
// *shape* and so cannot be lifted) is written for the figure. That is a
// deliberate property and `check-data.mjs` §64 (a) holds it: a figure a few
// hundred pixels from the paragraph it draws must not paraphrase it, and in
// four languages nobody on this project reads, "must not paraphrase" is only
// a check away from being a wish.
//
// ⚠️ THE FOUR BOXES CARRY NO MAGNITUDE, and a future run must not give them
// one. The lesson states no amount anywhere in this section — the worked
// example beside it (a kitchen renovation, a work truck) deliberately gives
// no figures — so there is nothing to size a box by. Sizing, shading or
// ranking them would draw a claim the lesson declines to make, which is
// `OutcomeGrid`'s rule arriving at a different figure. Boxes stretch to their
// row's tallest label and to nothing else. §64 (d) holds it.
//
// ⚠️ AND THE ARROWS ALL RUN THE SAME WAY ROUND, which is not the obvious
// reading of "this self-reinforcing loop runs in both directions". Both
// directions means the loop spirals UP in a boom and DOWN in a bust — the
// takeaway says exactly that ("all the way up in a boom and all the way down
// in a bust"). It does NOT mean the causality reverses. A second ring drawn
// counter-clockwise would be an economics error, and it is the error a
// well-meaning reading of the caption leads to. §64 (c) pins the order.
const LOOP_BOX = {
  border: `1px solid ${graph.neutral}`,
  borderRadius: radius.sm,
  padding: space["2"],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

export function SpendingLoop({ title, steps, caption, description }) {
  // The glyphs are laid out clockwise from the top-left box: across the top,
  // down the right, back along the bottom, and up the left — where the last
  // one closes the loop.
  const arrow = (glyph, key) => (
    <div key={key} data-figure-part="arrow" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Text as="span" variant="body" color={ink.body} style={{ lineHeight: 1 }}>{glyph}</Text>
    </div>
  );
  const box = (i) => (
    <div key={`step-${i}`} data-figure-part="step" style={LOOP_BOX}>
      <Text as="span" variant="caption" color={ink.body}>{steps[i]}</Text>
    </div>
  );

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/*
        HTML rather than SVG, for `OutcomeGrid`'s reason: these labels are
        five-language and long ("신용도가 더 높아진 차입자", "信用力の高い借り手が増える"),
        SVG does not wrap, and a clipped label fails silently in exactly the
        languages nobody on this project re-reads. In HTML they wrap, and they
        grow with the app's own font-scale control.

        The middle cell is empty on purpose. A label in the ring's center would
        be a fifth thing to read and would push the two side arrows apart at
        320px; the ring already says what it has to say.
      */}
      <div
        role="img"
        data-figure="spendingLoop"
        aria-label={description}
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
          // `1fr` on both box rows, not `auto`. Measured live at 390px before
          // this line existed: the top row drew 35px and the bottom row 52px,
          // because "more creditworthy borrowers" wraps to two lines and CSS
          // grid sizes a row to its tallest item. Nothing in the figure means
          // "bigger", so a box that grows because its label is longer is a
          // magnitude arriving through content — `OutcomeGrid`'s 82-against-52
          // bug in a different figure. In an auto-height grid the two `1fr`
          // tracks equalize to the taller one.
          gridTemplateRows: "1fr auto 1fr",
          gap: space["2"],
          alignItems: "stretch",
        }}
      >
        {box(0)}
        {arrow("→", "top")}
        {box(1)}

        {arrow("↑", "left")}
        <div />
        {arrow("↓", "right")}

        {box(3)}
        {arrow("←", "bottom")}
        {box(2)}
      </div>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── BalanceBand ───────────────────────────────────────────────────────────
// Lesson 34 ("Deleveraging: The 4 Tools"), section 2 "Beautiful vs Ugly
// Deleveraging" — backlog item 27, added 2026-09-03.
//
// WHY A PICTURE, in the lesson's own words rather than in an argument built
// for it. The lesson's takeaway is a TWO-SIDED BOUND written as one sentence:
//
//     "Print enough money to offset deflation, but not so much you cause
//      hyperinflation."
//
// Read what prose has to do there. It states a lower bound and an upper bound
// in two clauses joined by "but", and the reader has to hold both at once and
// work out that they bound the SAME dial. A sentence is sequential: it can
// name a floor, then name a ceiling, and it cannot show them as two ends of
// one axis with the good outcome between them. That betweenness is this
// figure's entire contribution — and it is the thing section 1 actively works
// against, because section 1 introduces tool 4 (printing money) as the
// answer to the first three, so a reader arriving here with "more printing is
// better" has read the lesson correctly up to that point and is about to be
// corrected by a single word ("but").
//
// The shape is therefore three ordered zones on one dial, and the two OUTER
// zones carry the SAME label. That repetition is the claim: the failure is
// not monotonic in the dial, so moving further either way is the same kind of
// wrong. The lesson says exactly this — Germany in the 1920s (almost entirely
// printing) and the US in 1930-32 (almost entirely the deflationary tools) are both
// given as instances of an "ugly deleveraging".
//
// EVERY STRING THIS FIGURE RENDERS EXCEPT ITS TEXT ALTERNATIVE IS VERBATIM
// FROM LESSON 34, in all five languages — `SpendingLoop`'s property, for
// `SpendingLoop`'s reason (AGENT_LOG.md, owner item O-3: a figure an inch
// from the paragraph it draws must not add four languages of unreviewed
// machine translation, and "must not paraphrase" is only a check away from
// being a wish). `check-data.mjs` §69 (a) holds it.
//
// ⚠️ THE THREE ZONES ARE EQUAL AND CARRY NO MAGNITUDE, and a future run must
// not give them one. Lesson 34 states no width for the band, no distance to
// either failure, and no quantity of any kind in this section — it says
// "balance", "too much" and "not enough". A wider middle zone would claim the
// band is forgiving; a narrower one would claim it is a knife edge. Both are
// answers the lesson declines to give, which is `OutcomeGrid`'s rule arriving
// at a different figure. The three zones are `1fr` siblings in ONE grid row
// with `alignItems: "stretch"`, so they are equal in width by the template
// and equal in height by the row, whatever their labels do. §69 (d) holds it.
//
// ⚠️ AND THE MARKERS ARE ORDINAL, NOT PLACED. Each historical anchor sits
// INSIDE its zone and at no particular point in it, because the lesson gives
// only an ordering ("almost entirely", "reasonably well"). A future run must
// not position these along the axis by year, by debt ratio, or by anything
// else — the lesson states nothing to position them by, and `TradeoffPlot`'s
// ordinal-axis warning (item 27) is the same rule.
//
// COLOR. `graph.*` for the zone borders and the dial, never `line.*`: the
// partition IS the content here, so WCAG 1.4.11 applies at 3:1 and no `line-*`
// token clears that on any surface in either palette (§28b/§51, and
// `OutcomeGrid`'s header has the fuller note). The middle zone is `graph.green`
// / `ink.ok` and the two outer zones are identical to each other
// (`graph.neutral` / `ink.muted`) — two states, matching the lesson's two
// outcomes. ⚠️ The good/ugly distinction is NOT carried by color: the zones say
// "beautiful deleveraging" and "ugly deleveraging" in words, and the color only
// reinforces what the text already says. That is deliberate (WCAG 1.4.1) and
// §69 (e) holds the labels, so a future restyle cannot quietly make hue the
// only signal.
const BAND_ZONE = {
  border: `1px solid ${graph.neutral}`,
  borderRadius: radius.sm,
  padding: space["2"],
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: space["1"],
  textAlign: "center",
  // A zone's track is `minmax(0, 1fr)` and never grows, so a word longer than
  // the track has to break inside it or it spills over the border. Measured
  // live at 320px / 130% / es before this line existed: "desapalancamiento"
  // (17 characters) drew from x = -1.5 to x = 321.5 across a 79px zone and put
  // the whole page into horizontal scroll. `es` is the only language of the
  // five whose zone labels contain a word that long, which is exactly the
  // failure mode nobody on this project would have seen by looking at the
  // English (backlog item 155's point, in a figure rather than on a hub).
  overflowWrap: "anywhere",
};

export function BalanceBand({ title, zones, endLabels, description, caption }) {
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      {/*
        HTML rather than SVG, for `OutcomeGrid`'s and `SpendingLoop`'s reason:
        these labels are five-language and long ("desapalancamiento hermoso",
        "2008년부터 대략 2015년까지"), SVG does not wrap, and a clipped label fails
        silently in exactly the languages nobody on this project re-reads.
      */}
      <div role="img" data-figure="balanceBand" aria-label={description}>
        <div
          style={{
            display: "grid",
            // Three EQUAL tracks. `minmax(0, 1fr)` rather than `1fr` so a long
            // unbreakable label cannot push its own track wider than its
            // siblings — which is how a magnitude arrives through content
            // (OutcomeGrid's 82-against-52, SpendingLoop's 35-against-52).
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: space["2"],
            alignItems: "stretch",
          }}
        >
          {zones.map((zone, i) => (
            <div
              key={`zone-${i}`}
              data-figure-part="zone"
              style={{ ...BAND_ZONE, borderColor: zone.good ? graph.green : graph.neutral }}
            >
              <Text as="span" variant="caption" color={zone.good ? ink.ok : ink.muted} style={{ fontWeight: 700 }}>
                {zone.label}
              </Text>
              <Text as="span" variant="caption" color={ink.body}>{zone.anchor}</Text>
            </div>
          ))}
        </div>
        {/*
          The dial the three zones sit on. It is one line with an arrowhead at
          each end, and it is what makes the row of three boxes an AXIS rather
          than a list of three cases — the figure's whole claim is that they
          are positions on one continuum. The glyphs are inside the
          `role="img"`, so they are not announced separately; `description`
          carries the direction in words.
        */}
        <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: space["1"], marginTop: space["2"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ lineHeight: 1 }}>←</Text>
          <span style={{ flex: 1, borderTop: `1px solid ${graph.neutral}` }} />
          <Text as="span" variant="caption" color={ink.muted} style={{ lineHeight: 1 }}>→</Text>
        </div>
        {/*
          What the dial IS, at each end — the lesson's own two tool groups, in
          the lesson's own order (tools 1-3 deflationary, tool 4 inflationary).
          Without these the axis is unlabeled and the reader has to guess what
          moving right means.
        */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: space["3"], marginTop: space["1"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ flex: 1, textAlign: "left" }}>{endLabels[0]}</Text>
          <Text as="span" variant="caption" color={ink.muted} style={{ flex: 1, textAlign: "right" }}>{endLabels[1]}</Text>
        </div>
      </div>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── CycleChart ────────────────────────────────────────────────────────────
const PHASE_DOT = [graph.green, graph.amber, graph.red, graph.blue];
const PHASE_INK = [ink.ok, ink.warn, ink.bad, ink.accent];

// THE LONG-RUN TREND RISES. Until 2026-08-31 this figure drew it perfectly
// flat — `<line y1="50" y2="50">` — while `trendLabel` named it "Long-run
// productivity trend" and the cycle path returned to y=50 at both ends, so the
// economy finished a full cycle exactly where it began. The lesson two screens
// earlier on the same track ("Productivity Growth: The Long-Run Driver") tells
// the reader in its own words that productivity "grows in a fairly straight,
// gentle line" and is "the slow, steady climb in living standards". A flat line
// under that caption teaches the opposite of the lesson it illustrates, and
// this is the app's most-shown diagram: lessons 32, 33 and 38 plus Reference →
// Market signals.
//
// Why no check caught it: `check-data.mjs` §50's `figureClaims` deliberately
// excludes this component, on the correct reasoning that a hardcoded SVG path
// has no data→render mapping to break. That reasoning is about the wrong
// failure. The defect here was the literal itself, and a probe that asserts a
// literal against itself cannot see a literal that disagrees with the prose.
//
// The correction is a pure SHEAR, not a redraw. Every y below is its previous
// value plus `trendOffset(x)`, so the oscillation's shape, its amplitude, the
// phase dots' positions relative to the curve, and every label-to-line gap
// measured at the same x are all unchanged — only the axis it oscillates about
// tilts. A shear is affine, which is also why the two `T` (smooth-quadratic)
// segments below can stay `T`: the reflected control point a `T` implies is
// preserved under an affine map, so shearing the stated points shears the
// implied ones identically.
//
// SVG y grows downward, so TREND_Y0 > TREND_Y1 is a rise. The two ends are
// symmetric about 50, which keeps the figure in the same box and leaves the
// `trendLabel` text at x=150 exactly as far below the line as it always was.
const TREND_Y0 = 68;
const TREND_Y1 = 32;
const trendOffset = (x) => TREND_Y0 + ((TREND_Y1 - TREND_Y0) * x) / 300 - 50;
const sh = (x, y) => `${x},${+(y + trendOffset(x)).toFixed(2)}`;

const PHASE_POINTS = [{ x: 37, y: 32 }, { x: 75, y: 15 }, { x: 187, y: 68 }, { x: 225, y: 82 }]
  .map((p) => ({ ...p, y: p.y + trendOffset(p.x) }));

// The faint ghost curve (the idealized cycle) and the drawn cycle path.
const GHOST_PATH = `M${sh(0, 50)} Q${sh(37, 50)} ${sh(75, 15)} Q${sh(112, 50)} ${sh(150, 50)} Q${sh(187, 50)} ${sh(225, 85)} Q${sh(262, 50)} ${sh(300, 50)}`;
const CYCLE_PATH = `M${sh(0, 50)} Q${sh(37, 45)} ${sh(75, 20)} T${sh(150, 50)} Q${sh(187, 55)} ${sh(225, 80)} T${sh(300, 50)}`;

export function CycleChart({ phaseNames, trendLabel, description }) {
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: `0 0 ${space["4"]}px` }}>
      <svg viewBox="0 0 300 100" style={{ width: "100%", height: 88 }} role="img" aria-label={description}>
        {/*
          The long-run trend the cycle oscillates around. `graph.neutral`, not
          `line.strong`: `trendLabel` is drawn directly beneath it and names
          it, so a caption refers to this line and the reader has to be able to
          find the thing the caption is about. 1.4.11 applies — `line.strong`
          was 1.71:1 light / 1.62:1 dark on `surface.card`, `graph.neutral` is
          5.24:1 / 4.47:1. Kept lighter than the cycle path itself (`graph.blue`)
          so the oscillation still reads as the subject and the trend as datum.
        */}
        <line x1="0" y1={TREND_Y0} x2="300" y2={TREND_Y1} stroke={graph.neutral} strokeDasharray="4" />
        <text x="150" y="98" textAnchor="middle" fill={ink.muted} fontSize="8">{trendLabel}</text>
        <path d={GHOST_PATH} fill="none" stroke={graph.blue} strokeWidth="2" opacity="0.25" />
        <path d={CYCLE_PATH} fill="none" stroke={graph.blue} strokeWidth="2.5" strokeLinecap="round" />
        {PHASE_POINTS.map((p, i) => (
          <g key={phaseNames[i]}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={PHASE_DOT[i]} />
            <text x={p.x} y={p.y - 9} textAnchor="middle" fill={PHASE_INK[i]} fontSize="8" fontWeight="700">{phaseNames[i]}</text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

// ── NestedCycles ──────────────────────────────────────────────────────────
// Lesson 33 ("The Long-Term Debt Cycle") — backlog item 27, added 2026-09-04.
// The first figure in this file whose subject is a RATIO OF TWO TIMESCALES.
//
// WHY A PICTURE, in the lesson's own words. Lesson 33's third section states
// both spans and then leaves the arithmetic to the reader:
//
//     "each one arrives every 5-8 years"
//     "The long-term cycle spans 75-100 years"
//     "almost nobody alive personally remembers the last time it peaked"
//
// The claim is that the second contains many of the first — which is why the
// last sentence follows. Prose can only put the two numbers in adjacent
// sentences; the reader has to divide 75-100 by 5-8 and then imagine the
// result. A picture is the division, already done.
//
// ⛔ WHY THIS REPLACED `CycleChart` ON LESSON 33 RATHER THAN JOINING IT.
// Lessons 32, 33 and 38 rendered a byte-identical figure (measured on the built
// app: 1,667 characters, one fingerprint, with lessons 30 and 36 as the
// controls that differ). `CycleChart` labels four phase dots and the phases are
// lesson 38's content. Lesson 33's own prose contains ONE of those four labels
// in all five languages; lesson 38 contains four in all five. The figure was
// right about a cycle and wrong about WHICH cycle: it draws two and a half
// oscillations of the 5-8 year kind on the lesson whose entire point is that
// the thing it teaches is 10-20 times longer and, in its own takeaway,
// "fundamentally different from a regular recession".
//
// ⚠️ THE VERTICAL AXIS CARRIES NO SCALE, DELIBERATELY, and this is the same
// rule `SplitBand` and `TradeoffPlot` are held to. Lesson 33 defines the axis
// ("the debt burden (the ratio of what's owed to what's earned)") and states no
// value for it anywhere — not a level, not a growth rate, not a starting point.
// So no tick, no percentage and no number is drawn on it. A reader can see that
// it rises and that it wobbles on the way, which is exactly what the prose
// claims and no more.
//
// ⚠️ AND THERE IS NO TIME ORIGIN AND NO "YOU ARE HERE". The horizontal axis is
// a SPAN — the bracket says "75-100 years", not a set of dates — and nothing
// marks a present moment. Lesson 33's closing question asks the reader whether
// today looks like the late stage of a long-term cycle; §10.1 is why this
// figure must leave that question open rather than answer it with a marker.
// A future run must not add a date, a "today" line, or a shaded "we are here"
// region: that converts a pattern into a call.
//
// THE CYCLE COUNT IS BOUNDED BY THE LESSON, not chosen. 75/8 ≈ 9.4 and
// 100/5 = 20, so any count in [10, 20] is inside what the prose states;
// `NEST_CYCLES` is 12 and `check-data.mjs` §71 (c) holds it inside that
// interval rather than trusting this paragraph.
//
// LABELS ARE HTML, NOT SVG <text> — `SplitBand`'s and `BalanceBand`'s measured
// reason. These are five-language strings ("cada 5 a 8 años" is 15 characters
// against a 300-unit viewBox), SVG does not wrap, and a clipped label fails
// silently in exactly the languages nobody on this project re-reads. Each key
// is a MINIATURE of its mark, and the two bracket miniatures differ in width
// the way the brackets themselves do, so the key restates the figure's one
// claim rather than merely color-coding it.
const NEST_W = 300;
const NEST_H = 108;
const NEST_PAD = { left: 8, right: 8, top: 14, bottom: 30 };
// 12 short cycles across the span. See "THE CYCLE COUNT IS BOUNDED" above.
const NEST_CYCLES = 12;
// The ripple's amplitude as a fraction of the long rise. Small enough that the
// long rise is plainly the subject and the short cycles are riding on it —
// which is the lesson's ordering, not a styling preference.
const NEST_RIPPLE = 0.12;
// 10 samples per short cycle. Fewer and the ripple renders as a zigzag, which
// would read as a count of straight segments rather than as a wave.
const NEST_SAMPLES = NEST_CYCLES * 10;

// The curve, as one function so the brackets and the wave cannot drift apart:
// the short bracket below is drawn at exactly `1 / NEST_CYCLES` of the plot
// width, which is one period of the ripple by construction.
function nestCurve() {
  const plotW = NEST_W - NEST_PAD.left - NEST_PAD.right;
  const plotH = NEST_H - NEST_PAD.top - NEST_PAD.bottom;
  const raw = (t) => Math.sin((t * Math.PI) / 2) + NEST_RIPPLE * Math.sin(2 * Math.PI * NEST_CYCLES * t);
  // Normalized against the ripple's own reach so the wave never leaves the plot
  // and the long rise still uses the full height.
  const lo = -NEST_RIPPLE;
  const hi = 1 + NEST_RIPPLE;
  const pts = [];
  for (let i = 0; i <= NEST_SAMPLES; i += 1) {
    const t = i / NEST_SAMPLES;
    const v = (raw(t) - lo) / (hi - lo);
    pts.push(`${+(NEST_PAD.left + t * plotW).toFixed(2)},${+(NEST_PAD.top + plotH - v * plotH).toFixed(2)}`);
  }
  return pts.join(" ");
}

// A span bracket: a rule with a tick rising from each end toward the thing it
// measures. Drawn in a `graph` token (a mark, not text — 3:1 applies).
function nestBracket(x1, x2, y, stroke) {
  return (
    <path
      d={`M${x1},${y - 4} L${x1},${y} L${x2},${y} L${x2},${y - 4}`}
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export function NestedCycles({ title, seriesLabel, shortLabel, spanLabel, colors, labelInks, description, caption }) {
  const plotW = NEST_W - NEST_PAD.left - NEST_PAD.right;
  const floorY = NEST_PAD.top + (NEST_H - NEST_PAD.top - NEST_PAD.bottom);
  const right = NEST_W - NEST_PAD.right;
  const oneCycleX = NEST_PAD.left + plotW / NEST_CYCLES;

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${NEST_W} ${NEST_H}`} style={{ width: "100%", height: 132 }} role="img" data-figure="nestedCycles" aria-label={description}>
        {/* ⛔ NO BASELINE RULE, and it was removed rather than registered.
            The first draft drew one at `floorY` in `line.hairline`, and
            `check-data.mjs` §51b failed it: no line token clears 1.4.11's 3:1,
            so such a rule is legal only as decoration. It is not decoration
            here. The curve comes within ~5px of the floor at its first trough,
            and a rule that close under a curve reads as the axis's ZERO — a
            value lesson 33 states nowhere, on the one axis this figure's header
            insists carries no scale. The full-span bracket below already frames
            the plot, in a `graph` token §28b holds to 3:1, and the key names it.
            A future run must not add the rule back. */}
        <polyline
          data-figure-part="series"
          points={nestCurve()}
          fill="none"
          stroke={colors[0]}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {nestBracket(NEST_PAD.left, oneCycleX, floorY + 10, colors[1])}
        {nestBracket(NEST_PAD.left, right, floorY + 24, colors[2])}
      </svg>
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "grid", gap: space["1"] }}>
        <li style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
          <span aria-hidden="true" style={{ width: 20, height: 3, borderRadius: 2, background: colors[0], flexShrink: 0 }} />
          <Text as="span" variant="caption" color={labelInks[0]} style={{ fontWeight: 700 }}>{seriesLabel}</Text>
        </li>
        {[[1, shortLabel, 8], [2, spanLabel, 20]].map(([i, label, w]) => (
          <li key={label} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            {/* The miniature is the bracket itself at key size — a rule with a
                tick at each end — and its WIDTH is the claim: 8px against 20px
                is the figure's own ratio, so the key cannot read as two
                interchangeable colors. */}
            <span
              aria-hidden="true"
              style={{ width: w, height: 6, flexShrink: 0, borderBottom: `2px solid ${colors[i]}`, borderLeft: `2px solid ${colors[i]}`, borderRight: `2px solid ${colors[i]}` }}
            />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{label}</Text>
          </li>
        ))}
      </ul>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── SplitBand ─────────────────────────────────────────────────────────────
// Lesson 12 ("Renting vs. Buying: The Real Trade-offs of a Home"), section 2
// "What a Mortgage Payment Is Actually Made Of" — backlog item 27, added
// 2026-09-03. The first `essentials` figure since 2026-08-16, and the first
// anywhere in the app whose subject is a COMPOSITION THAT INVERTS while the
// thing being composed does not move.
//
// WHY A PICTURE, in the lesson's own words rather than in an argument built
// for it. The lesson writes the pattern as two snapshots and then locates the
// changeover in a separate sentence:
//
//     "early payments are mostly interest, and later payments are mostly
//      principal"
//     "A 30-year loan often doesn't cross the halfway point between interest
//      and principal until roughly two-thirds of the way through its term."
//
// Three things are being asserted there and prose can only assert them one at
// a time: that the two parts are shares of ONE payment (so one grows exactly
// as fast as the other shrinks), that the larger of the two swaps, and that
// the swap does NOT happen at the middle of the term. The last is the whole
// surprise — the lesson says so itself, "in a pattern many buyers don't
// expect" — and it is a POSITION. A sentence can name a position; it cannot
// put it next to the midpoint it is being contrasted with, which is the only
// way "two-thirds, not half" is legible at a glance.
//
// This is `PreferenceFlip`'s kind (a crossing) arriving at a different shape,
// and the difference is worth stating because a future run will be tempted to
// reuse that component here. There the two curves are INDEPENDENT quantities
// that happen to swap rank, and the panel behind them carries the decision.
// Here they are COMPLEMENTARY: the band's total height is constant by
// construction, so the two regions are one boundary seen from both sides, and
// the crossing is the single point where the boundary is halfway down. Drawn
// as two free lines that property would be a coincidence of the data; drawn as
// one boundary it cannot fail to hold.
//
// ⚠️ THE BAND IS THE LOAN PART OF THE PAYMENT, NOT THE PAYMENT. Lesson 12 says
// a monthly payment bundles four things and that "only the first two make up
// the loan itself" — principal and interest. Property taxes and homeowner's
// insurance have no stated share anywhere in the lesson, so a four-part band
// would have to invent two of its four numbers. The two segment labels are the
// lesson's own parenthetical definitions of the two it does state, which is
// also what stops the figure reading as the whole bill.
//
// ⚠️ AND THE VERTICAL AXIS CARRIES NO SCALE, DELIBERATELY. No tick, no
// percentage and no dollar figure is drawn: the lesson states no payment
// amount and no interest rate, and "mostly" is the only word it gives for how
// lopsided the early payments are. A reader can see which region is larger and
// where they trade places, which is exactly what the prose claims and no more.
//
// EVERY STRING THIS FIGURE RENDERS EXCEPT ITS TEXT ALTERNATIVE IS VERBATIM
// FROM LESSON 12, in all five languages — `SpendingLoop`'s and `BalanceBand`'s
// property, for their reason (AGENT_LOG.md, owner item O-3: a figure an inch
// from the paragraph it draws must not add four languages of unreviewed
// machine translation). `check-data.mjs` §70 (a) holds it.
//
// COLOR, and this paragraph is a correction of the one that stood here for
// about an hour on 2026-09-03, because the first version of it was wrong in
// the way this whole file keeps warning about — it reasoned about a rendered
// property instead of measuring it.
//
// The two regions are `graph` tokens and the split between them has to be
// carried by something else. §28b guarantees each graph token clears 1.4.11's
// 3:1 against the SURFACES; it guarantees nothing about two graph tokens
// against EACH OTHER, and this figure's entire content is where one region
// ends and the other begins. Measured live on the built app: `graph.blue`
// against `graph.green` is 1.30:1 in light and 1.17:1 in dark — the two fills
// differ in hue and essentially not at all in luminance, which is exactly the
// trap `PreferenceFlip`'s header records at 1.01:1 between two washes.
//
// ⛔ SO THE SEPARATOR IS NOT `ink.muted`, WHICH IS WHAT THIS FIGURE SHIPPED
// FIRST AND WHAT ITS COMMENT CLAIMED WAS "a stroke with luminance of its own".
// Measured against the two fills it is drawn ON: 1.10:1 and 1.18:1 in light,
// 1.36:1 and 1.58:1 in dark. It is a dark gray chosen to be read as TEXT ON A
// CARD (7.01:1 there), and on a saturated fill it is very nearly invisible —
// the boundary, the crossing marker and the crossing dot would all have
// disappeared and left one flat two-tone block. Found by reading
// `getComputedStyle` off the rendered figure in both schemes; a source read
// cannot see it, which is item 27's own standing warning about geometry
// arriving in a second costume.
//
// `surface.card` is the separator instead, and it is the semantically right
// answer as well as the measured one: the line between the two regions is
// drawn in the color of the card behind the figure, so it reads as a hairline
// GAP rather than as a third series. Measured against the two fills:
// 7.72:1 / 5.93:1 in light, 8.93:1 / 10.41:1 in dark — the worst cell is
// 5.93:1 against a 3:1 bar. The same color draws the dashed crossing marker
// and the dot, so the three together read as one crosshair. §70 (d) asserts
// the ratio against both palettes rather than trusting this paragraph.
const SPLIT_W = 300;
const SPLIT_H = 140;
const SPLIT_PAD = { left: 6, right: 6, top: 10, bottom: 22 };
// The boundary, the crossing marker and the crossing dot are one color, named
// once so they cannot drift apart. See the COLOR note above for why it is a
// surface token in a file whose convention is `graph` for marks.
const SPLIT_SEPARATOR = surface.card;

export function SplitBand({ title, samples, share, crossing, segmentLabels, markerLabel, endLabels, colors, labelInks, description, caption }) {
  const plotW = SPLIT_W - SPLIT_PAD.left - SPLIT_PAD.right;
  const plotH = SPLIT_H - SPLIT_PAD.top - SPLIT_PAD.bottom;
  const floorY = SPLIT_PAD.top + plotH;
  const px = (f) => SPLIT_PAD.left + f * plotW;
  // `share` returns the TOP region's fraction of the band, so y grows downward
  // as the top region grows. The function belongs to the content module for
  // `PreferenceFlip`'s reason: the curve is a claim about the loan, and this
  // file holds no data.
  const py = (s) => SPLIT_PAD.top + s * plotH;
  const boundary = samples.map((f) => `${+px(f).toFixed(2)},${+py(share(f)).toFixed(2)}`);
  const crossX = px(crossing);
  const crossY = py(0.5);

  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <svg viewBox={`0 0 ${SPLIT_W} ${SPLIT_H}`} style={{ width: "100%", height: 150 }} role="img" data-figure="splitBand" aria-label={description}>
        {/*
          The two regions are one boundary read from both sides — the top
          polygon closes along the band's flat top edge, the bottom one along
          its flat floor. Neither has a height of its own, so no edit here can
          make them disagree about the total.
        */}
        <polygon
          data-figure-part="segment"
          data-figure-index="0"
          points={`${SPLIT_PAD.left},${SPLIT_PAD.top} ${SPLIT_W - SPLIT_PAD.right},${SPLIT_PAD.top} ${[...boundary].reverse().join(" ")}`}
          fill={colors[0]}
        />
        <polygon
          data-figure-part="segment"
          data-figure-index="1"
          points={`${boundary.join(" ")} ${SPLIT_W - SPLIT_PAD.right},${floorY} ${SPLIT_PAD.left},${floorY}`}
          fill={colors[1]}
        />
        <polyline data-figure-part="boundary" points={boundary.join(" ")} fill="none" stroke={SPLIT_SEPARATOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/*
          The crossing. The dashed line runs the full height rather than
          stopping at the boundary, because what it locates is a point on the
          HORIZONTAL axis — "two-thirds of the way through the term" — and a
          stub ending at the curve would read as a value instead.
        */}
        <line data-figure-part="marker" x1={crossX} y1={SPLIT_PAD.top} x2={crossX} y2={floorY} stroke={SPLIT_SEPARATOR} strokeWidth="1" strokeDasharray="3 2" />
        <circle data-figure-part="crossing" cx={crossX} cy={crossY} r="3.5" fill={SPLIT_SEPARATOR} />
        <text x={SPLIT_PAD.left} y={SPLIT_H - 6} fill={ink.muted} fontSize="9">{endLabels[0]}</text>
        <text x={SPLIT_W - SPLIT_PAD.right} y={SPLIT_H - 6} textAnchor="end" fill={ink.muted} fontSize="9">{endLabels[1]}</text>
      </svg>
      {/*
        The keys are HTML and not SVG text, for `BalanceBand`'s measured
        reason: these are five-language strings, two of them full parenthetical
        definitions, SVG does not wrap, and a clipped label fails silently in
        exactly the languages nobody on this project re-reads. The marker's key
        is the third row rather than a label at the top of the dashed line for
        the same reason — "aproximadamente dos tercios de su plazo" is 39
        characters against a 300-unit viewBox.
      */}
      <ul role="list" style={{ listStyle: "none", margin: `${space["2"]}px 0 0`, padding: 0, display: "grid", gap: space["1"] }}>
        {segmentLabels.map((label, i) => (
          <li key={label} style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
            <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: radius.sm, background: colors[i], flexShrink: 0 }} />
            <Text as="span" variant="caption" color={labelInks[i]} style={{ fontWeight: 700 }}>{label}</Text>
          </li>
        ))}
        <li style={{ display: "flex", alignItems: "center", gap: space["2"] }}>
          {/*
            The marker's key is a MINIATURE of the marker in place, not a bare
            dashed rule: the marker is `surface.card`, so a rule of that color
            drawn straight onto the card would be a 1:1 swatch — invisible, and
            invisible in a way that reads as a missing key rather than as a
            styling slip. Drawing it across a chip of the upper region's own
            fill is the same 7.72:1 / 8.93:1 it has inside the figure.
          */}
          <span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: radius.sm, background: colors[0], flexShrink: 0, display: "flex", justifyContent: "center" }}>
            <span style={{ width: 0, height: "100%", borderLeft: `2px dashed ${SPLIT_SEPARATOR}` }} />
          </span>
          <Text as="span" variant="caption" color={ink.muted}>{markerLabel}</Text>
        </li>
      </ul>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}
