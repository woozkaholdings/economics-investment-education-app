import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Strip macOS Finder metadata out of the build.
//
// This repo is developed on a Mac, and `public/` is a folder the owner opens in
// Finder — which writes a `.DS_Store` into it (measured 2026-09-07:
// `public/.DS_Store`, 8,196 b, created 2026-08-22). Vite copies `publicDir`
// into `dist/` verbatim, so that file lands in every build, and
// `scripts/deploy.mjs` zips `dist/` recursively — so the moment the Netlify
// token exists, the deploy publishes `https://<site>/.DS_Store`, which lists
// the names of every file in that folder to anyone who asks for it.
//
// It is gitignored and untracked, which is exactly why nothing else here sees
// it: every instrument in this repo reads the tree, and this file is not in the
// tree. The only thing that ever noticed was `npm run check-deployed`, which
// reported it as a standing `✗` against the live site.
//
// Deleting the source copies would not hold — Finder rewrites them on the next
// window open — so the strip happens on the build output, where it is durable
// and needs nothing from the owner.
const stripFinderMetadata = () => ({
  name: "strip-finder-metadata",
  closeBundle() {
    // Resolved against THIS config file, not the working directory, so it is
    // also correct in the throwaway trees `check-deployed.mjs --identify`
    // builds — each carries its own copy of this file beside its own dist/.
    const out = fileURLToPath(new URL("dist", import.meta.url));
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name === ".DS_Store") rmSync(p, { force: true });
      }
    };
    if (existsSync(out)) walk(out);
  },
});

export default defineConfig({
  plugins: [react(), stripFinderMetadata()],

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
