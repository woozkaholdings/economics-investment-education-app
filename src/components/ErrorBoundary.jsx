// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY
//
// The app had none (backlog item 96). `App.jsx` wraps its three `lazy()`
// screens in `<Suspense>`, and Suspense handles a *pending* promise, not a
// *rejected* one — so a screen chunk that 404s re-throws during render with
// nothing above it to catch, and React 18 unmounts the whole tree. A blank
// page, no message.
//
// That is not a hypothetical: `dist/` ships 27 content-hashed chunks, and a
// redeploy under an open tab invalidates every one of them. It becomes
// reachable the day the app gets a URL, not before.
//
// RECOVERY IS A RELOAD, AND THAT IS NOT LAZINESS — it is what the module
// spec allows. Measured 2026-08-24 in a live browser: once a dynamic import
// rejects, that specifier is recorded as errored in the document's module
// map, and re-importing it fails again *without a network request* even after
// the file is back at 200. Only a cache-busted specifier refetches, and Vite
// needs literal specifiers to split chunks at all (see CONTENT_LOADERS), so
// there is no in-place retry to offer. A retry button that re-rendered the
// children would fail every time it was pressed.
// ═══════════════════════════════════════════════════════════════════════════

import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { failed: true, error };
  }

  componentDidCatch(error) {
    // No remote sink to report to (item 18 is owner-blocked), but the console
    // is where a bug report starts, and swallowing it silently is the exact
    // failure mode this component exists to end.
    console.error("[ErrorBoundary]", error);
  }

  // `fallback` may be a node or a function of the caught error. The function
  // form exists so a boundary can choose its copy from what actually failed —
  // `AsyncScreen` shows a download message only for a tagged ChunkLoadError
  // and the render-crash message otherwise (see lib/chunkError.js). Boundaries
  // with one honest message for every failure keep passing a node.
  render() {
    if (this.state.failed) {
      const { fallback } = this.props;
      return typeof fallback === "function" ? fallback(this.state.error) : fallback;
    }
    return this.props.children;
  }
}
