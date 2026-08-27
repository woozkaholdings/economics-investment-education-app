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

import { graph, ink, line, radius, space, surface } from "../theme.js";
import { Text } from "./ui.jsx";

// ── Bar ───────────────────────────────────────────────────────────────────
// `description` is the figure's text alternative, and it is not optional in
// practice: the bar heights carry the whole comparison, and the per-bar numbers
// inside the `role="img"` container stop being announced individually once the
// container is one image. §22 of check-data.mjs asserts every call site passes
// one, which is what keeps the unconditional `aria-label` below from silently
// resolving to `undefined`.
export function Bar({ data, title, colors, height = 140, description, caption }) {
  const max = Math.max(...data.map((d) => Math.abs(d.value)));
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["4"], margin: 0 }}>
      {title && (
        <figcaption style={{ marginBottom: space["3"] }}>
          <Text as="span" variant="caption" color={ink.muted} style={{ textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
            {title}
          </Text>
        </figcaption>
      )}
      <div role="img" aria-label={description} style={{ display: "flex", alignItems: "flex-end", gap: space["1"], height }}>
        {data.map((d, i) => (
          <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: space["1"], color: ink.body }}>{d.value}</span>
            {/*
              The bar's percentage height must resolve against the space left
              for bars, not against the whole column — the column also holds the
              value and the (often two-line) label. Measured before this track
              existed: at height={90} the 4.5, 3.8, 9.0 and 6.7 bars all rendered
              at exactly 35.5px, so the Fed balance sheet's ten-fold expansion
              was drawn as four bars of equal height with the true numbers
              printed above them. `minHeight: 0` is what lets the track actually
              shrink to its flex size instead of its content's.
            */}
            <div style={{ flex: 1, minHeight: 0, width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
              <div style={{ width: "72%", height: `${(Math.abs(d.value) / max) * 100}%`, background: colors[i], borderRadius: 4, minHeight: 2, transition: "height 0.5s" }} />
            </div>
            <span style={{ fontSize: "0.6875rem", color: ink.muted, marginTop: space["2"], textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.25 }}>{d.label}</span>
          </div>
        ))}
      </div>
      {caption && <Text variant="caption" color={ink.muted} style={{ marginTop: space["3"], lineHeight: 1.5 }}>{caption}</Text>}
    </figure>
  );
}

// ── YieldCurve ────────────────────────────────────────────────────────────
const CURVE_PATHS = {
  normal: "M10,60 Q40,50 70,35 T130,15",
  flat: "M10,38 Q40,37 70,36 T130,34",
  inverted: "M10,15 Q40,25 70,35 T130,55",
  steep: "M10,70 Q40,55 70,30 T130,5",
};
const CURVE_STROKE = { normal: graph.green, flat: graph.amber, inverted: graph.red, steep: graph.blue };
const CURVE_INK = { normal: ink.ok, flat: ink.warn, inverted: ink.bad, steep: ink.accent };

export function YieldCurve({ type, label, description }) {
  return (
    <figure style={{ background: surface.card, border: `1px solid ${line.hairline}`, borderRadius: radius.lg, padding: space["3"], textAlign: "center", margin: 0 }}>
      <svg viewBox="0 0 140 75" style={{ width: "100%", maxHeight: 64 }} role="img" aria-label={description || label}>
        <line x1="10" y1="70" x2="130" y2="70" stroke={line.hairline} strokeWidth="1" />
        <line x1="10" y1="5" x2="10" y2="70" stroke={line.hairline} strokeWidth="1" />
        <text x="15" y="68" fill={ink.muted} fontSize="7">2Y</text>
        <text x="60" y="68" fill={ink.muted} fontSize="7">10Y</text>
        <text x="112" y="68" fill={ink.muted} fontSize="7">30Y</text>
        <path d={CURVE_PATHS[type]} fill="none" stroke={CURVE_STROKE[type]} strokeWidth="2.5" strokeLinecap="round" />
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
      <svg viewBox={`0 0 ${CURVE_W} ${CURVE_H}`} style={{ width: "100%", height: 132 }} role="img" aria-label={description}>
        <line x1={CURVE_PAD.left} y1={py(0)} x2={CURVE_W - CURVE_PAD.right} y2={py(0)} stroke={line.hairline} strokeWidth="1" />
        {xValues.filter((x) => x > 0 && x < lastX).map((x) => (
          <line key={x} x1={px(x)} y1={CURVE_PAD.top} x2={px(x)} y2={py(0)} stroke={line.hairline} strokeWidth="0.5" strokeDasharray="3" />
        ))}
        {series.map((s, i) => (
          <polyline
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
      <div role="img" aria-label={description} style={{ position: "relative", display: "flex", gap: space["4"], height: 150 }}>
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: "50%", borderTop: `1px solid ${graph.neutral}` }} />
        {bars.map((b, i) => {
          const up = b.felt > 0;
          const frac = (Math.abs(b.felt) / max) * 50;
          return (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                {up && <div style={{ width: "60%", height: `${frac * 2}%`, background: colors[i], borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, transition: "height 0.5s" }} />}
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                {!up && <div style={{ width: "60%", height: `${frac * 2}%`, background: colors[i], borderRadius: `0 0 ${radius.sm}px ${radius.sm}px`, transition: "height 0.5s" }} />}
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
// The reversal is carried by two things, and only one of them is the lines.
// For most of the span the curves are nearly coincident — that is the honest
// shape of hyperbolic discounting, not a drafting failure, and it is itself the
// point: seen from far enough away the two options are close and the bigger
// number simply wins. So the *decision* is carried by the tinted panel behind
// them, which stays readable at any line separation, and the lines carry the
// mechanism (the nearer reward climbing faster as it approaches).
//
// `crossing` arrives already solved by the caller; deriving it from the sampled
// points here would put the marker wherever the sampling happened to be dense.
const FLIP_W = 300;
const FLIP_H = 140;
const FLIP_PAD = { left: 6, right: 6, top: 18, bottom: 22 };

export function PreferenceFlip({ title, xValues, series, crossing, colors, labelInks, zones, zoneColors, zoneEdges, markerLabel, axisLabels, description, caption }) {
  const max = Math.max(...series.flatMap((s) => s.values));
  const lastX = xValues[xValues.length - 1];
  const plotW = FLIP_W - FLIP_PAD.left - FLIP_PAD.right;
  const plotH = FLIP_H - FLIP_PAD.top - FLIP_PAD.bottom;
  const px = (x) => FLIP_PAD.left + (x / lastX) * plotW;
  const py = (v) => FLIP_PAD.top + plotH - (v / max) * plotH;
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
      <svg viewBox={`0 0 ${FLIP_W} ${FLIP_H}`} style={{ width: "100%", height: 150 }} role="img" aria-label={description}>
        {/* The two decision regions, drawn first so everything else sits on top. */}
        <rect x={FLIP_PAD.left} y={FLIP_PAD.top} width={flipX - FLIP_PAD.left} height={plotH} fill={zoneColors[0]} />
        <rect x={flipX} y={FLIP_PAD.top} width={FLIP_W - FLIP_PAD.right - flipX} height={plotH} fill={zoneColors[1]} />
        <line x1={FLIP_PAD.left} y1={py(0)} x2={FLIP_W - FLIP_PAD.right} y2={py(0)} stroke={line.hairline} strokeWidth="1" />
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
        <line x1={flipX} y1={FLIP_PAD.top} x2={flipX} y2={py(0)} stroke={ink.muted} strokeWidth="1" strokeDasharray="3 2" />
        <text x={flipX - 4} y={FLIP_PAD.top - 6} textAnchor="end" fill={ink.muted} fontSize="9">{markerLabel}</text>
        {series.map((s, i) => (
          <polyline
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
      <div role="img" aria-label={description} style={{ display: "flex", alignItems: "flex-end", gap: space["5"], paddingTop: space["5"] }}>
        {columns.map((col) => {
          const raise = col.bands.reduce((sum, b) => sum + (b.isRaise ? b.amount : 0), 0);
          return (
            <div key={col.label} style={{ flex: 1, minWidth: 0 }}>
              <div style={{ position: "relative", height: (col.total / max) * STACK_H }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column-reverse", borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, overflow: "hidden" }}>
                  {col.bands.map((b, i) => (
                    <div key={i} style={{ height: `${(b.amount / col.total) * 100}%`, background: tierColors[b.tier], minHeight: 2, transition: "height 0.5s" }} />
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
      <div role="img" aria-label={description} style={{ position: "relative", display: "flex", gap: space["5"], height: 170, alignItems: "flex-end" }}>
        {columns.map((c) => (
          <div key={c.label} style={{ flex: 1, height: `${(c.total / max) * 100}%`, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ flex: 1, background: colors[0], borderRadius: `${radius.sm}px ${radius.sm}px 0 0`, transition: "height 0.5s" }} />
            <div style={{ height: `${(c.gap / c.total) * 100}%`, background: colors[1], minHeight: 4 }} />
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

// ── CycleChart ────────────────────────────────────────────────────────────
const PHASE_DOT = [graph.green, graph.amber, graph.red, graph.blue];
const PHASE_INK = [ink.ok, ink.warn, ink.bad, ink.accent];
const PHASE_POINTS = [{ x: 37, y: 32 }, { x: 75, y: 15 }, { x: 187, y: 68 }, { x: 225, y: 82 }];

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
        <line x1="0" y1="50" x2="300" y2="50" stroke={graph.neutral} strokeDasharray="4" />
        <text x="150" y="98" textAnchor="middle" fill={ink.muted} fontSize="8">{trendLabel}</text>
        <path d="M0,50 Q37,50 75,15 Q112,50 150,50 Q187,50 225,85 Q262,50 300,50" fill="none" stroke={graph.blue} strokeWidth="2" opacity="0.25" />
        <path d="M0,50 Q37,45 75,20 T150,50 Q187,55 225,80 T300,50" fill="none" stroke={graph.blue} strokeWidth="2.5" strokeLinecap="round" />
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
