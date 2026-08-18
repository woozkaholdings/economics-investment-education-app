// ═══════════════════════════════════════════════════════════════════════════
// ICONS
//
// Line icons for interface chrome. The prototypes used emoji as UI controls,
// which renders differently on every platform, cannot inherit colour, and
// reads to a screen reader as whatever the vendor named that glyph.
//
// These inherit `currentColor` and size from the surrounding text, so an icon
// beside a label always matches it — including under the text-size control.
// Emoji still appear where they are *content* (a lesson's own symbol), not
// where they are interface.
// ═══════════════════════════════════════════════════════════════════════════

const PATHS = {
  path: "M6 4v10a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4M6 4a2 2 0 1 0 0-.001M18 22a2 2 0 1 0 0 .001",
  book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H19v14H6.5A2.5 2.5 0 0 0 4 19.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H19v-5",
  target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3",
  library: "M4 20h16M6 20V9m4 11V9m4 11V9m4 11V9M3.5 9 12 4l8.5 5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  x: "M6 6l12 12M18 6 6 18",
  lock: "M7 10.5V8a5 5 0 0 1 10 0v2.5M5.5 10.5h13v9a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5z",
  arrowLeft: "M19 12H5m0 0 6-6m-6 6 6 6",
  arrowRight: "M5 12h14m0 0-6-6m6 6-6 6",
  chevronRight: "m9 5 7 7-7 7",
  flame: "M12 22c3.9 0 6.5-2.5 6.5-6 0-3.9-3-5.5-3.5-9.5-2 1.5-2.5 3-2.5 4.5C11 9 10.5 7 8.5 5.5 7 8 5.5 10 5.5 13.5c0 3.5 2.6 8.5 6.5 8.5",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-4-4",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5M12 7.75v.5",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M2.5 20a6.5 6.5 0 0 1 13 0M17 11.5a3 3 0 1 0 0-6M18 20h3.5a5.5 5.5 0 0 0-3.2-5",
  chart: "M4 20h16M7 20v-6m5 6V7m5 13v-9",
  bookmark: "M6 3H18V21L12 17L6 21Z",
};

export default function Icon({ name, size = "1.25em", strokeWidth = 1.75, style, ...rest }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0, display: "block", ...style }}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
