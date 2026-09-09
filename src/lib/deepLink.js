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
// else. The pure half (everything above the "browser half" marker below) has
// no DOM access at all, so `npm test` checks the routing rules without a
// browser (§18 of scripts/check-data.mjs). That marker moved down on
// 2026-09-06 when `useDismissOnBack` was added; it used to read "everything
// above `useDeepLink`", which the new hook would have made false.
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
 * route we recognize. Syntax only — whether that lesson exists or is unlocked
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
 * Resolve a hash against the real catalog and unlock state, into the
 * `{ tab, reading, missed }` triple `App.jsx` holds. Always returns a usable
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
 *
 * `missed` IS NOT THAT QUESTION, and it is why this returns three things now.
 * Landing on the path was the decision; landing there with nothing said was
 * not decided anywhere — it fell out of `fallback` being the same object for
 * "you asked for nothing" and "you asked for something I refused". Measured
 * 2026-09-08 on the built app, returning learner, `#/lesson/35`: the reader
 * never opens, the path renders, `useDeepLink` rewrites the address bar to
 * `#/learn`, and no `role="status"`/`role="alert"` node exists anywhere on the
 * screen — the last trace of what the learner clicked is gone. The control
 * (`#/lesson/29`, unlocked) opened the reader and kept its hash, so the two
 * are distinguishable and only one of them says so.
 *
 * ⚠️ THE MEASUREMENT ABOVE IS DATED AND STAYS VERBATIM; ITS INSTRUMENT DOES
 * NOT REPRODUCE. Since 2026-09-09 `App` renders a persistent, always-mounted
 * `Announcer` (`role="status"`, `SrOnly`, empty until it has something to
 * say), so "does a `role="status"` node exist on this screen" now answers YES
 * on every screen and has stopped being the discriminator it was. Worse for a
 * casual re-run: on the path it is usually NON-EMPTY, carrying the practice
 * coach mark's 64 characters, which have nothing to do with any deep link.
 * To re-measure THIS behavior, read the announcer's CONTENT and ask whether
 * anything names the lesson that was refused — presence proves nothing.
 *
 * So `missed` is `null`, or `{ lessonId, reason }` with reason:
 *   "locked"  — the lesson exists and `isUnlocked` refused it
 *   "unknown" — no lesson in the catalog carries that id (a rotted or
 *               hand-edited link)
 * Ids only, no title: this module is deliberately free of content, and the
 * caller already has the catalog to look one up in.
 */
export function resolveRoute(hash, lessons, isUnlocked) {
  const route = parseRoute(hash);
  const fallback = { tab: "learn", reading: null, missed: null };
  if (!route) return fallback;
  if (route.lessonId === null) return { tab: route.tab, reading: null, missed: null };

  const index = lessons.findIndex((l) => l.id === route.lessonId);
  if (index === -1) return { ...fallback, missed: { lessonId: route.lessonId, reason: "unknown" } };
  if (typeof isUnlocked === "function" && !isUnlocked(index)) {
    return { ...fallback, missed: { lessonId: route.lessonId, reason: "locked" } };
  }
  return { tab: "learn", reading: index, missed: null };
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
 * honored.
 *
 * That branch deliberately reports NO `missed`, and the asymmetry is the
 * point: a first-time visitor is not stranded on a menu, they are reading a
 * lesson, and the cost DECISIONS.md accepted for them ("they land in lesson 1
 * having been promised lesson 20") is a fact about the reader, not about the
 * path. A path notice on a screen that is not the path would be a second
 * surface for a case the record already settled. The returning visitor is who
 * this reaches, because landing on the path with nothing said is the half
 * nobody ever decided.
 */
export function initialRoute(hash, lessons, isUnlocked, isFirstVisit) {
  const route = parseRoute(hash);
  if (!route) return { tab: "learn", reading: isFirstVisit ? 0 : null, missed: null };

  const resolved = resolveRoute(hash, lessons, isUnlocked);
  const lessonLinkFailed = route.lessonId !== null && resolved.reading === null;
  if (lessonLinkFailed && isFirstVisit) return { tab: "learn", reading: 0, missed: null };
  return resolved;
}

// ── the browser half ──────────────────────────────────────────────────────
// Everything above is pure. This is the only part that touches `window`.

// ── pushed views that are not routes ──────────────────────────────────────
// WHY THIS EXISTS, and why it is not four more routes. The grammar above is
// four routes on purpose (see the header: §5 asks for lesson links, and every
// hash added here is surface a native port has to reproduce). But the app
// pushes views that grammar does not name — a Reference section, a glossary
// term on top of it, a practice session — and the learner cannot see the
// difference between those and a lesson. They pushed a screen; Back should
// take it back.
//
// Measured 2026-09-06 on the built app at 375x812, with a routed lesson as the
// control: from Reference › Glossary › a term, ONE Back press left all three
// levels and landed on the Learn tab, because none of them had touched the
// hash and the entry underneath was whatever tab the learner was on before.
// Mid-practice-session Back did the same and lost the session. The control —
// Back from `#/lesson/29` — correctly returned to the path, which is what says
// the failure is the app's and not the measurement's.
//
// THE FIX KEEPS THE GRAMMAR. Nothing is pushed onto history when a view opens
// and no hash is invented; instead the ONE popstate listener this module
// already owns asks, before it resolves a hash, whether the navigation was a
// Back AND a pushed view is open. If so it closes the top one and re-pushes
// the hash the app is actually at — so the address bar is unchanged,
// `resolveRoute` is never consulted, and a native shell still deletes this
// file whole. Two open views take two Back presses, then the third leaves the
// tab, which is the order a learner means.
//
// "AND the navigation was a Back" is load-bearing, and it is there because the
// first draft left it out: a `location.hash` assignment also fires `popstate`,
// so a pasted hash was being eaten as a dismissal. See `entryIndex` below.
//
// LIFO by registration TIME, not by component tree: a term detail registers
// when the learner taps a term, which is always after the section it sits in.
const dismissStack = [];

/**
 * Register `dismiss` as the thing Back should do while `active` is true.
 * Pure book-keeping — it touches no DOM, so `check-data.mjs` can import this
 * module in node exactly as before.
 */
export function useDismissOnBack(active, dismiss) {
  const dismissRef = useRef(dismiss);
  dismissRef.current = dismiss;

  useEffect(() => {
    if (!active) return undefined;
    const entry = () => dismissRef.current();
    dismissStack.push(entry);
    return () => {
      const i = dismissStack.lastIndexOf(entry);
      if (i !== -1) dismissStack.splice(i, 1);
    };
  }, [active]);
}

/**
 * Close every pushed view that is currently open, top down, and report whether
 * there was anything to close.
 *
 * WHAT THIS IS FOR. `App.jsx`'s `goToTab` resets everything the SHELL owns —
 * `reading`, the lesson reader — so re-tapping the highlighted Learn tab has
 * always returned the learner to the path. It could not reach the pushed views
 * a SCREEN owns: Reference's `section` and Practice's `session` are that
 * component's own `useState`. Measured live on the built app 2026-09-08, with
 * the Learn tab as the control: from Reference › Glossary, tapping the already
 * selected Reference tab twice changed nothing at all, and mid-review-session
 * the Review tab did the same — while the identical gesture on Learn returned
 * to the path. Switching to another tab and back DID clear them, but only
 * because `ScreenBoundary` is keyed by `tab` and the screen unmounted; nothing
 * had decided that, so the one route into the tab that does not unmount it
 * behaved differently from every other.
 *
 * It drains rather than popping one, because a tab re-tap means "the root of
 * this tab", not "one step back" — Reference › Glossary › a term is two pushed
 * views and one tap clears both. Only the active tab's screen is mounted
 * (`ScreenBoundary` is keyed by `tab`), so everything registered here belongs
 * to it.
 *
 * Top-down over a snapshot, and each entry is called exactly once: a dismisser
 * sets its own state to null, and the `useEffect` cleanups that unregister
 * these entries do not run until React has re-rendered, so the stack does not
 * shrink underneath this loop.
 *
 * Same book-keeping as `useDismissOnBack`, and no DOM — `check-data.mjs`
 * imports this module in node.
 */
export function dismissAllPushed() {
  return dismissAll(dismissStack);
}

/**
 * The pure half of the above, over an explicit stack, so the DRAIN can be
 * exercised without React registering anything — `check-data.mjs` §81 calls it
 * with three recording entries and asserts all three ran, top down, once each.
 *
 * It is separate because the structural check that replaced it could not see
 * the difference: swapping the loop for `stack[stack.length - 1]()` leaves a
 * function that still exists, still returns true and still closes SOMETHING,
 * so a source-shape assertion went green while one tap on the Reference tab
 * would have left the learner in the glossary instead of at the tab's root.
 * Measured by injection 2026-09-08 — the section passed on the broken drain.
 */
export function dismissAll(stack) {
  if (!stack || stack.length === 0) return false;
  for (const dismiss of [...stack].reverse()) dismiss();
  return true;
}

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

  // A counter stamped into every history entry this module writes, so the
  // popstate handler can tell WHICH KIND of navigation it is looking at. It
  // has to, because `popstate` alone does not mean Back — measured in Chrome
  // 2026-09-06, assigning `location.hash` fires `popstate` (with a null state)
  // AND `hashchange`, which is one more event than this module's original
  // comment assumed. The stamp separates the three cases cleanly: a smaller
  // index is Back, a larger one is Forward, and a null state is an entry this
  // module never wrote — a typed or pasted hash.
  const entryIndex = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === hash) {
      // Nothing to navigate, but the entry still gets stamped: a visitor who
      // lands on `#/learn` takes this branch, and an UNSTAMPED entry reads to
      // `onPop` below as "not ours", so the first Back out of a pushed view
      // would fall through and leave the tab. Same URL, state only.
      try { window.history.replaceState({ i: entryIndex.current }, "", hash); } catch { /* see below */ }
      initialized.current = true;
      return;
    }
    try {
      if (initialized.current) {
        entryIndex.current += 1;
        window.history.pushState({ i: entryIndex.current }, "", hash);
      } else {
        window.history.replaceState({ i: entryIndex.current }, "", hash);
      }
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

  // The hash the app's own state formats to, read live inside the listener so
  // Back can put it back without re-running the effect on every render.
  const hashRef = useRef(hash);
  hashRef.current = hash;

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const sync = () => {
      onRouteRef.current(resolveRoute(window.location.hash, lessons, isUnlocked));
    };
    // Only BACK can mean "close the pushed view I am looking at" (see
    // `useDismissOnBack` above). Forward is a destination the learner already
    // left, and a typed or pasted hash is an explicit destination — turning
    // either into a dismissal would strand them on the screen they are on.
    // The first draft of this intercepted every `popstate` and did exactly
    // that to a pasted hash; the stamp on `entryIndex` is what tells them apart.
    const onPop = (event) => {
      const to = event.state && typeof event.state.i === "number" ? event.state.i : null;
      const isBack = to !== null && to < entryIndex.current;
      // A null state is an entry this module did not write, which means a
      // fragment navigation just ADDED one on top — so the counter goes up,
      // not sideways. Leaving it alone made the new entry inherit the index of
      // the one below it, and two entries sharing an index makes the Back
      // between them unreadable as a Back.
      entryIndex.current = to !== null ? to : entryIndex.current + 1;

      if (isBack && dismissStack.length > 0) {
        dismissStack[dismissStack.length - 1]();
        try {
          // Put the entry back, so the address bar and the app agree and the
          // NEXT Back has something of its own to consume.
          entryIndex.current += 1;
          window.history.pushState({ i: entryIndex.current }, "", hashRef.current);
        } catch {
          // Same reason as above: an embedded context that rejects the History
          // API still gets the view closed, it just also changes tab.
        }
        return;
      }
      sync();
    };
    // `popstate` covers Back/Forward after a `pushState`; `hashchange` covers
    // a hash typed or pasted into the address bar. Those two overlap more than
    // the original comment here said — a fragment navigation fires BOTH, and
    // so does a Back across differing hashes — but `sync` is idempotent, so a
    // doubled call resolves to the state the app is already in and writes
    // nothing.
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", sync);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", sync);
    };
  }, [lessons, isUnlocked]);
}

