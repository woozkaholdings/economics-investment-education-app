// ═══════════════════════════════════════════════════════════════════════════
// DEEP LINKS — LAUNCH_PLAN §5, "each lesson a shareable URL" (backlog item 31)
//
// Before this, the app had no routing of any kind: tab and lesson selection
// were component state, every screen lived at the same URL, and §5's whole
// distribution motion ("web is top-of-funnel... every lesson yields two or
// three clips") had no link to put in a clip description or a Show HN post.
//
// WHY HASH ROUTING, AND WHY NO ROUTER. Backlog item 12 (§2.1, Expo vs. web)
// is HELD, and its standing rule is that the dev agent must not deepen the
// web-only investment in a way that raises the eventual port cost. A router
// dependency and history-API paths would do that — they would also need
// server-side rewrites to survive a refresh on a static host. Hash routing
// needs neither, and the entire web-specific surface is this one file:
// `App.jsx` calls `initialRoute()` once and `useDeepLink()` once, and a
// native shell deletes both calls and this module without touching anything
// else. The pure half (everything above `useDeepLink`) has no DOM access at
// all, so `npm test` checks the routing rules without a browser (§18 of
// scripts/check-data.mjs).
//
// GRAMMAR — four routes, no query string, no nesting:
//   #/learn          the lesson path
//   #/practice       the spaced-review queue
//   #/reference      the reference tab (its sub-nav is deliberately not
//                    routed — §5 asks for lesson links, and every sub-screen
//                    added here is surface a native port has to reproduce)
//   #/lesson/<id>    one lesson, addressed by its stable lesson `id`
//
// Lesson `id`, not path index: index is a position in `lessonsByTrack()` and
// moves whenever a track is reordered, so an indexed link would silently rot
// into a link to a different lesson. Ids are stable — note the 2026-08-14
// renumbering predates any URL ever existing, so no shared link can be
// carrying an old id and this module deliberately does NOT apply
// `lessonIdMigration`'s table to URLs.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useRef } from "react";

export const ROUTED_TABS = ["learn", "practice", "reference"];

/**
 * Parse a location hash into `{ tab, lessonId }`, or null when it names no
 * route we recognise. Syntax only — whether that lesson exists or is unlocked
 * is `resolveRoute`'s job.
 */
export function parseRoute(hash) {
  if (typeof hash !== "string") return null;
  const path = hash.replace(/^#/, "").replace(/^\/+/, "").replace(/\/+$/, "").toLowerCase();
  if (!path) return null;
  const parts = path.split("/");

  if (parts.length === 2 && parts[0] === "lesson") {
    // `Number` alone would accept "1e2", "0x5" and " 12 ".
    if (!/^\d+$/.test(parts[1])) return null;
    return { tab: "learn", lessonId: Number(parts[1]) };
  }
  if (parts.length === 1 && ROUTED_TABS.includes(parts[0])) {
    return { tab: parts[0], lessonId: null };
  }
  return null;
}

/**
 * The hash for the app's current navigation state — the inverse of
 * `parseRoute`, over `App.jsx`'s `{ tab, reading }` rather than over a route,
 * so the caller never has to convert an index back into an id itself.
 */
export function routeHash({ tab, reading, lessons }) {
  if (tab === "learn" && reading !== null && reading !== undefined) {
    const lesson = lessons?.[reading];
    if (lesson) return `#/lesson/${lesson.id}`;
  }
  return `#/${ROUTED_TABS.includes(tab) ? tab : "learn"}`;
}

/**
 * Resolve a hash against the real catalogue and unlock state, into the
 * `{ tab, reading }` pair `App.jsx` holds. Always returns a usable
 * destination — an unparseable hash, a nonexistent lesson id, or a locked
 * lesson all land on the lesson path rather than on an error.
 *
 * A locked lesson deliberately does NOT open. Sequential unlocking is a
 * recorded product bet (CLAIMS.md A1), and a URL that walks past it would
 * void that bet silently, from outside the app, with no decision anywhere.
 * The cost is real and is written down in DECISIONS.md: a clip of lesson 20
 * links to a lesson most new visitors cannot yet open, so they land on the
 * path instead. That is a product question for the owner, not one a routing
 * module should answer by being permissive.
 */
export function resolveRoute(hash, lessons, isUnlocked) {
  const route = parseRoute(hash);
  const fallback = { tab: "learn", reading: null };
  if (!route) return fallback;
  if (route.lessonId === null) return { tab: route.tab, reading: null };

  const index = lessons.findIndex((l) => l.id === route.lessonId);
  if (index === -1) return fallback;
  if (typeof isUnlocked === "function" && !isUnlocked(index)) return fallback;
  return { tab: "learn", reading: index };
}

/**
 * The `{ tab, reading }` to start at. Identical to `resolveRoute` except that
 * it preserves §3.2's first-open routing — a brand-new install opens straight
 * into the first lesson rather than onto a menu.
 *
 * That fallback applies to a *failed lesson link* too, not only to an absent
 * hash, and the reason is the §5 case this whole module exists for: someone
 * arriving from a clip of lesson 20 has no progress, so the link resolves to
 * nothing. Landing them on a cold path is the "menu instead of a lesson"
 * outcome §3.2 calls the app's most important thing to avoid — and they
 * demonstrably wanted a lesson, they clicked one. A working `#/practice` or
 * `#/reference` link still wins; this only catches the link that couldn't be
 * honoured.
 */
export function initialRoute(hash, lessons, isUnlocked, isFirstVisit) {
  const route = parseRoute(hash);
  if (!route) return { tab: "learn", reading: isFirstVisit ? 0 : null };

  const resolved = resolveRoute(hash, lessons, isUnlocked);
  const lessonLinkFailed = route.lessonId !== null && resolved.reading === null;
  if (lessonLinkFailed && isFirstVisit) return { tab: "learn", reading: 0 };
  return resolved;
}

// ── the browser half ──────────────────────────────────────────────────────
// Everything above is pure. This is the only part that touches `window`.

/**
 * Keeps the address bar and the app's navigation state in step, in both
 * directions: state changes rewrite the hash, and Back/Forward (or a hand-
 * edited hash) call `onRoute` with a resolved `{ tab, reading }`.
 *
 * The first sync uses `replaceState`, later ones `pushState`, so landing on
 * the app does not cost a history entry — a visitor's first Back leaves the
 * site as they expect — while in-app navigation does build history and the
 * Back button works. Feedback loops end on their own: a state change whose
 * hash already matches the address bar writes nothing, and a hash change
 * resolves to state that formats back to the same hash.
 */
export function useDeepLink({ tab, reading, lessons, isUnlocked, onRoute }) {
  const hash = routeHash({ tab, reading, lessons });
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === hash) { initialized.current = true; return; }
    try {
      if (initialized.current) window.history.pushState(null, "", hash);
      else window.history.replaceState(null, "", hash);
    } catch {
      // Some embedded/file:// contexts reject the History API. Losing the
      // address bar is not worth losing the app over.
    }
    initialized.current = true;
  }, [hash]);

  // Read through a ref so a new `onRoute` identity each render doesn't
  // detach and reattach the listeners.
  const onRouteRef = useRef(onRoute);
  onRouteRef.current = onRoute;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => {
      onRouteRef.current(resolveRoute(window.location.hash, lessons, isUnlocked));
    };
    // `popstate` covers Back/Forward after a `pushState`; `hashchange` covers
    // a hash typed or pasted into the address bar, which fires no popstate.
    window.addEventListener("popstate", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, [lessons, isUnlocked]);
}
