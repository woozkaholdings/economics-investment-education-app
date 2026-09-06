// The 1200x630 link-preview card, as drawing code rather than as a binary.
//
// WHY THIS FILE EXISTS. `public/og-card.png` is the only raster asset in the
// repo, and a committed PNG with no source is an unexplained file: nobody can
// change the wording, fix a color that moved in `src/index.css`, or prove the
// image says what the <head> says. This module IS the source. The PNG is its
// rasterization, and the recipe below regenerates it byte-for-byte-equivalent
// from a browser with no toolchain, no dependency and no network.
//
// HOW TO REGENERATE (about a minute, any Chromium):
//   1. Put this file and a one-line HTML page in the same directory:
//        <canvas id=c width=1200 height=630></canvas>
//        <script type="module">
//          import { drawOgCard } from "./og-card.js";
//          drawOgCard(document.getElementById("c"));
//          console.log(document.getElementById("c").toDataURL("image/png"));
//        </script>
//   2. Serve that directory over http:// (a module import will not load from
//      file://) and open it.
//   3. Copy the logged data URL and decode its base64 payload into
//      public/og-card.png.
//   4. `npm test` — check-data.mjs §38 re-reads the PNG's IHDR and fails if it
//      is not a real 1200x630 PNG, and asserts og:image points at it.
//
// DELIBERATELY NOT A BUILD STEP. Rasterizing text needs a font engine; every
// route to one from Node is a new dependency, and this card changes about
// never. The port-cost rule (backlog item 12) says scope the toolchain before
// adding it, and one card does not pay for it.
//
// COLORS are copies of the light palette in `src/index.css` — an <img> in a
// feed never sees the stylesheet. If those tokens move, move these with them:
// --surface-canvas, --fill-accent, --ink-strong, --ink-body, --ink-muted,
// --surface-accent-wash, --ink-on-fill.
const C = {
  canvas: "#f8f5f0",
  accent: "#2f43c4",
  accentWash: "#ecedf9",
  inkStrong: "#1c1a17",
  inkBody: "#45403a",
  inkMuted: "#5f584f",
  onFill: "#ffffff",
};

// Kept equal to en's `appTitle` / `appSub` and to index.html's <meta
// name="description">. §38 pins the <head> copy to the locale; these two lines
// are the same name on a third surface, so they are asserted there too.
const TITLE = "Economic Cycles";
const SUB = "Master the Economy";
const BLURB = [
  "Booms and busts, interest rates, and the judgment",
  "behind everyday money decisions.",
];
const DISCLAIMER =
  "Educational content only — not personalized investment, legal, or tax advice.";

// The mark from public/icon.svg: one cycle — expansion, peak, contraction,
// trough — authored on a 64-unit box. Drawn here through a transform so the
// two files carry the same curve rather than two hand-fitted copies.
// `sx`/`sy` are separate because the hero copy is stretched wide and the tile
// copy is not; the stroke is applied AFTER restore(), so the line width stays
// uniform in device pixels instead of being squashed with the path.
function cycleStroke(ctx, { x, y, sx, sy = sx, width, color }) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(sx, sy);
  ctx.beginPath();
  ctx.moveTo(10, 44);
  ctx.bezierCurveTo(18, 44, 20, 20, 28, 20);
  ctx.bezierCurveTo(36, 20, 38, 44, 46, 44);
  ctx.bezierCurveTo(54, 44, 52, 28, 54, 24);
  ctx.restore();
  ctx.lineWidth = width;
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawOgCard(canvas) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, W, H);

  // The band the mark sits on, so the curve reads as a figure and not as a
  // scratch across the copy.
  ctx.fillStyle = C.accentWash;
  ctx.fillRect(0, 486, W, H - 486);

  // Icon tile, 96px, the same rounded square and the same curve as the favicon.
  ctx.fillStyle = C.accent;
  roundRect(ctx, 80, 72, 96, 96, 21);
  ctx.fill();
  cycleStroke(ctx, { x: 80, y: 72, sx: 96 / 64, width: 9, color: C.onFill });

  const serif = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
  const sans =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = C.inkStrong;
  ctx.font = `700 84px ${serif}`;
  ctx.fillText(TITLE, 80, 290);

  ctx.fillStyle = C.accent;
  ctx.font = `600 46px ${sans}`;
  ctx.fillText(SUB, 80, 352);

  ctx.fillStyle = C.inkBody;
  ctx.font = `400 34px ${sans}`;
  BLURB.forEach((line, i) => ctx.fillText(line, 80, 416 + i * 46));

  // The same curve again as the hero graphic, in the space to the right of the
  // copy: the card's only ornament is the product's own mark.
  //
  // ⚠️ The box is x 830-1145, y 120-390, and the left edge is the number that
  // matters. The path's drawn extent runs from unit 10 to unit 54, NOT 0 to
  // 64, so a box placed by eye lands ~90px left of where it looks like it
  // will. The first version put it at x 720 and the curve's descending tail
  // ran straight through the word "judgment" on the blurb's first line —
  // invisible in the layout arithmetic and obvious in the rendered PNG.
  // Longest line of copy measured on the render: the blurb's first line ends
  // near x 805.
  cycleStroke(ctx, {
    x: 830 - 10 * (315 / 44),
    y: 120 - 20 * (270 / 24),
    sx: 315 / 44,
    sy: 270 / 24,
    width: 9,
    color: C.accent,
  });

  // The band carries the disclaimer alone. §10.1's rule is about the app, but a
  // preview card is the first thing a stranger reads, so it says it too.
  ctx.fillStyle = C.inkMuted;
  ctx.font = `400 26px ${sans}`;
  ctx.fillText(DISCLAIMER, 80, 570);

  return canvas;
}
