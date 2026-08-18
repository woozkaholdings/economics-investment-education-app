import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Relative asset URLs, so one `dist/` works wherever it is served from.
  //
  // Vite's default (`base: "/"`) emits `<script src="/assets/index-<hash>.js">`
  // into `dist/index.html`. That resolves only at a domain root. Served one
  // directory down — a GitHub Pages *project* site (`user.github.io/<repo>/`),
  // an S3 key prefix, a staging path — the HTML still returns 200 and the
  // script 404s, so the app is a silently blank page. Measured 2026-08-17
  // (backlog item 72) against a real static server: `GET /app/` 200,
  // `GET /assets/index-<hash>.js` 404, `#root` empty, and no console error,
  // because a 404 on a `type="module"` script does not throw into the page.
  //
  // `"./"` costs nothing at a root deploy and removes the whole class of
  // failure, so the owner never has to know their host's path shape before
  // building. It works because nothing in the app builds a URL from a
  // hardcoded leading "/": the one runtime fetch resolves against
  // `document.baseURI` (`lib/useMarketData.js`), and routing is hash-based
  // (`lib/deepLink.js`), which also means a static host needs no SPA rewrite
  // rule. Keep all three of those properties if you change this.
  base: "./",
});
