/*
 * scripts/a11y-sweep.js — the live accessibility sweep, as a checked-in instrument.
 *
 * WHY THIS FILE IS NOT IN `npm test`. Every one of check-data.mjs's forty-plus sections reads
 * SOURCE TEXT. Item 102 (the app's missing landmarks) and item 103 (the skip link) were
 * *composition* defects: every attribute was individually correct and the browser's computed
 * tree was still wrong. No amount of grepping src/ can see that — only a rendered document can.
 * This file is therefore a browser script, pasted into the preview tool's javascript_tool by a
 * run, not a Node script. Adding a headless browser to make it a test is item 12's port-cost
 * rule territory: scope that before reaching for it. This file has ZERO dependencies.
 *
 * HOW TO RUN IT — see AGENT_LOG.md's Environment note for the build+serve half. In short:
 *   npm run build && (cd dist && python3 -m http.server 8811 --bind 127.0.0.1 &)
 *   ...open the preview at that URL, take a SCREENSHOT (forces layout — note 1),
 *   send ONE `computer{action:"key", text:"Tab"}` (seeds the focused area — note 2),
 *   then paste this whole file into javascript_tool.
 * It returns a JSON string. Paste `A11ySweep.selftest()` FIRST — see below.
 * Skip the Tab and everything still runs, minus focusVisibleOnTab, which says so in its verdict.
 *
 * ── THE POINT OF THE PRECONDITIONS ────────────────────────────────────────────────────────────
 * A live DOM instrument fails SILENTLY, and a silent failure is indistinguishable from a clean
 * result. Three ways this harness has actually produced a lying zero, all measured, not guessed:
 *
 *   1. LAYOUT NOT YET LIVE. On a fresh preview_start, `window.innerWidth` and every
 *      getBoundingClientRect() read 0. Geometry probes (hit targets, overflow) then return zero
 *      findings because nothing has a size, not because everything is fine. Taking a screenshot
 *      forces layout; this script HARD-GATES on it and refuses to report at all without it.
 *   2. THE FOCUS STATE MACHINE IS ASLEEP, NOT DEAD — AND ONE Tab WAKES IT. Rewritten
 *      2026-08-28 (item 116). Everything the 2026-08-26 version measured is reproducible and
 *      still true; what was wrong was the word "unavailable", and it cost this file a stubbed
 *      probe for two days on the belief that no harness here can ever focus a document.
 *
 *      AT PAGE LOAD, before any input reaches the pane, all of this reproduces exactly:
 *        (a) `document.activeElement` is CORRECT after .focus()            → TRUSTWORTHY
 *        (b) a real `focus` listener on a real button gets ZERO events     → asleep
 *        (c) the focused element does NOT match `:focus`/`:focus-visible`  → asleep
 *      with `hasFocus()` false and `visibilityState` "hidden" EVEN WHEN FRONTED. The isolation
 *      controls rule out the boring explanations: `click` events deliver fine, a SYNTHETIC
 *      FocusEvent reaches the same listener fine, and the selector engine handles pseudo-classes
 *      fine. One mechanism explains (a), (b) and (c) at once: the document has no focused AREA,
 *      so per spec no focus event fires and nothing matches :focus, while activeElement still
 *      names the element that WOULD be focused.
 *
 *      THE PART THAT WAS MISSING: a focused area is something you can just go and create.
 *      Send ONE real input event to the pane — `computer{action:"key", text:"Tab"}` — and on the
 *      very next call `hasFocus()` is true, focus events fire, `:focus` matches, `:focus-visible`
 *      matches, and a subsequent programmatic `.focus()` INHERITS focus-visible, which is what
 *      lets a probe iterate over a whole screen without pressing Tab once per element. Measured
 *      2026-08-28 over 100+ controls across eight screens. `visibilityState` stays "hidden"
 *      throughout, so it was never the signal to read.
 *
 *      ⚠️ A CLICK IS NOT ENOUGH, AND THE DIFFERENCE IS THE PROBE'S WHOLE SUBJECT. A seeding
 *      `left_click` gives `:focus` but NOT `:focus-visible` — correctly, per the spec's
 *      pointer-vs-keyboard heuristic. Since the app's only focus styling is index.css's
 *      `:focus-visible` rule, a click-seeded sweep would find every control ringless and report
 *      the entire app broken. Seed with Tab. capabilities() measures the two pseudo-classes
 *      separately for exactly this reason.
 *
 *      ⚠️ `hasFocus()` LIES ABOUT KEYBOARD DELIVERY TOO — the item-108 proxy failure, one level
 *      over. Measured 2026-08-28 while the first-run dialog was open: `hasFocus()` read true
 *      across sixteen key presses of which a capturing `document` keydown listener received
 *      EXACTLY ZERO, while a synthetic dispatch to the same listener fired — so the listener was
 *      alive and the keys were going elsewhere. Eight of those presses had been read as "the
 *      focus trap holds". They proved nothing. **If a measurement depends on a key press being
 *      delivered, plant a keydown listener and count trusted events; never infer delivery from
 *      hasFocus().** (Redone that way, the trap does hold — 16 trusted keydowns, focus entered
 *      the dialog and never left.)
 *      NOTE: (b) and (c) are not asserted from this comment — capabilities() plants a button and
 *      measures all three signals every run, so a session where they differ reports itself.
 *   3. READING IN THE SAME CALL THAT CLICKED. React commits asynchronously, so a same-call read
 *      returns the PREVIOUS render. Always click in one javascript_tool call and read in the next.
 *
 * PREMISE CORRECTION vs. backlog item 105, which specified this file. Item 105 said the script
 * "must refuse to report a zero unless `document.hasFocus() && document.visibilityState ===
 * 'visible'`". Measured against this harness, that gate is WRONG: both are permanently false in
 * this preview pane even when the tab is fronted and the page is demonstrably rendering (buttons
 * measured 139x44, document 2944px tall, screenshot correct). That gate would disable the entire
 * instrument forever and report nothing — the same silent-zero failure in a new costume. The gate
 * implemented here is per-capability instead: hard-gate on the thing the probes actually need
 * (live layout, which IS achievable), and mark only the focus-dependent probes unavailable.
 *
 * SECOND CORRECTION, 2026-08-26 (item 108), and it is the same mistake one level up. Rejecting
 * `hasFocus()` as a REFUSAL gate was right; keeping it as the CAPABILITY signal was not. It is a
 * proxy, and on 2026-08-25 it disagreed with the thing it stands for — reading true while a
 * native listener saw no events, which flipped focusVisibleOnTab from UNAVAILABLE to VACUOUS and
 * would mark a blind probe available. A capability that CAN be measured directly must never be
 * inferred: capabilities() now plants a button and a listener and reads the answer. The general
 * rule, worth more than this instance: a proxy signal fails green, a planted control fails loud.
 */
(function () {
  "use strict";

  var SKIP_ATTR = "data-a11y-selftest";

  /* Sequentially-focusable elements. `[tabindex]:not([tabindex="-1"])` is deliberate — tabindex
   * -1 is programmatically focusable but not reachable by Tab, and a probe named ...OnTab must
   * not report a ring missing on something no Tab press can ever reach. Disabled controls match
   * this selector too and are filtered later, by measurement rather than by attribute: `disabled`
   * is not the only way an element refuses focus (an `inert` ancestor is another, and the app
   * uses one on the first-run dialog). */
  var FOCUSABLE = 'button, a[href], select, input, textarea, [tabindex]:not([tabindex="-1"])';

  /* ── focus capability, MEASURED rather than inferred ───────────────────────────────────────
   * Backlog item 108, 2026-08-26. Until this run the focus capability was `document.hasFocus()`
   * — a PROXY for "do focus events fire", and the two have provably disagreed. On 2026-08-25
   * five sweeps reported `focusVisibleOnTab` VACUOUS rather than UNAVAILABLE, which happens only
   * when hasFocus() is true, while this file's header records a native listener seeing ZERO
   * events on the same day. A proxy that can read "available" on a session where the probe is
   * blind is precisely how a probe gets marked green while measuring nothing — the lying zero
   * this whole file exists to prevent, one level up in the instrument.
   *
   * So plant a real button and a real listener and look. Two capabilities come back, because
   * they fail SEPARATELY and the header only ever named the first:
   *   focusEvents    — a real .focus() actually DELIVERED a focus event to a real listener
   *   focusSelectors — the focused element actually MATCHES :focus
   * Measured in this pane 2026-08-26: `document.activeElement` is correct, and BOTH of these are
   * false. A probe named `focusVisibleOnTab` needs the SECOND one, which nothing had checked.
   *
   * THE DETECTOR CARRIES ITS OWN CONTROL. A detector that answers `false` because it is broken
   * is indistinguishable from one answering `false` about a blind harness — and it fails safe
   * in the direction that silently disables probes forever. So a synthetic FocusEvent is
   * dispatched at a SECOND plant: if that does not arrive, listeners are broken here and the
   * native `false` means nothing. It is reported alongside the answer, never folded into it.
   * Two plants and not one on purpose: measuring both on the same element lets the synthetic
   * dispatch inflate the native counter, which is exactly what it did on the first attempt at
   * this measurement — a control firing for its own reasons, caught only by expecting 0. */
  function measureFocus() {
    var host = document.createElement("div");
    host.setAttribute(SKIP_ATTR, "focus-capability");
    host.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;";
    var native = document.createElement("button");   // plant 1: the real question
    var synth = document.createElement("button");    // plant 2: the detector's own control
    host.appendChild(native);
    host.appendChild(synth);
    document.body.appendChild(host);

    var nativeSeen = 0, synthSeen = 0;
    native.addEventListener("focus", function () { nativeSeen++; });
    synth.addEventListener("focus", function () { synthSeen++; });

    var prev = document.activeElement;
    var matched = false, active = false, matchedVisible = false;
    try {
      native.focus();
      active = document.activeElement === native;   // trustworthy here even when events are not
      matched = native.matches(":focus");
      // The THIRD signal, added 2026-08-28 (item 116). `:focus` and `:focus-visible` are not the
      // same question and this app styles only the second (`index.css`'s `:focus-visible` rule is
      // the ONLY focus styling in the repo), so a probe gated on `:focus` would scan a document
      // where nothing it is looking for can appear. Measured: after a seeding CLICK this is
      // false while `matched` is true; after a seeding TAB both are true. See header note 2.
      matchedVisible = native.matches(":focus-visible");
    } catch (e) { /* fall through as unavailable */ }
    var nativeDelivered = nativeSeen;               // FREEZE before the synthetic dispatch

    try { synth.dispatchEvent(new FocusEvent("focus")); } catch (e) { /* detector broken */ }
    var detectorOk = synthSeen > 0;

    host.remove();
    // Put focus back where it was; on a harness where focus events DO fire, silently stealing
    // focus from the app is the instrument changing what it measures.
    if (prev && prev !== document.body && typeof prev.focus === "function") {
      try { prev.focus(); } catch (e) { /* ignore */ }
    }

    return {
      focusEvents: nativeDelivered > 0,
      focusSelectors: matched,
      focusVisibleSelectors: matchedVisible,
      detectorOk: detectorOk,
      evidence: "nativeFocusEvents=" + nativeDelivered + " matches(:focus)=" + matched +
        " matches(:focus-visible)=" + matchedVisible +
        " activeElementCorrect=" + active + " syntheticControl=" +
        (detectorOk ? "fired" : "DID NOT FIRE — this detector is broken, its false means nothing") +
        " hasFocus()=" + document.hasFocus() + " visibilityState=" + document.visibilityState +
        (matchedVisible ? "" : "  ⟵ NOT a permanent harness limit: send one `computer key Tab` " +
          "to the pane and re-run. See header note 2.")
    };
  }

  /* ── capability detection ──────────────────────────────────────────────────────────────────
   * Not decoration. Each probe declares what it needs; a probe whose capability is missing
   * reports status "UNAVAILABLE" and is never counted as a pass. */
  function capabilities() {
    var sized = 0, sample = document.querySelectorAll("button, a, h1, h2, p");
    for (var i = 0; i < sample.length && i < 40; i++) {
      var r = sample[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) sized++;
    }
    var f = measureFocus();
    return {
      layout: window.innerWidth > 0 && window.innerHeight > 0 && sized > 0,
      layoutEvidence: "innerWidth=" + window.innerWidth + " sizedSample=" + sized + "/" +
        Math.min(sample.length, 40),
      focusEvents: f.focusEvents,
      focusSelectors: f.focusSelectors,
      focusVisibleSelectors: f.focusVisibleSelectors,
      focusEvidence: f.evidence,
      // Kept as RECORDED EVIDENCE, not as a gate. It is the signal the capability used to be
      // inferred from, so a future session where it disagrees with focusEvidence above is the
      // item-108 divergence reproducing, and the sweep's own output will show it.
      hasFocus: document.hasFocus(),
      visibilityState: document.visibilityState
    };
  }

  function visible(el) {
    if (el.closest("[" + SKIP_ATTR + "]")) return true; // planted probes are deliberately offscreen
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return false;
    var s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none";
  }

  function exposed(el) { return !el.closest('[aria-hidden="true"]'); }

  /* Approximate accessible-name computation: enough to catch a control with NO name at all,
   * which is the defect class worth catching. Not a full AccName implementation. */
  function accName(el) {
    var lb = el.getAttribute("aria-labelledby");
    if (lb) {
      var t = lb.split(/\s+/).map(function (id) {
        var n = document.getElementById(id);
        return n ? n.textContent.trim() : "";
      }).join(" ").trim();
      if (t) return t;
    }
    var al = (el.getAttribute("aria-label") || "").trim();
    if (al) return al;
    if (el.id) {
      var lab = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
      if (lab && lab.textContent.trim()) return lab.textContent.trim();
    }
    var wrap = el.closest("label");
    if (wrap && wrap.textContent.trim()) return wrap.textContent.trim();
    var txt = (el.textContent || "").trim();
    if (txt) return txt;
    var img = el.querySelector("img[alt]");
    if (img && img.getAttribute("alt").trim()) return img.getAttribute("alt").trim();
    var ti = (el.getAttribute("title") || "").trim();
    if (ti) return ti;
    if (el.tagName === "INPUT") {
      var v = (el.getAttribute("value") || el.getAttribute("placeholder") || "").trim();
      if (v) return v;
    }
    return "";
  }

  /* A LANDMARK's name is NOT accName(). This is a separate function on purpose, and the reason is
   * the whole difficulty of the unnamedRegions probe: accName() falls back to textContent, and a
   * <section> always has contents, so reusing it would have made that probe permanently green —
   * a lying zero that no control based on a planted BARE section could ever catch, because the
   * plant would be "named" by its own paragraph. Per HTML-AAM a region's name comes only from
   * aria-labelledby, aria-label or title; content never names a landmark. Measured 2026-08-25:
   * accName() returns the full body text for all three of the lesson reader's sections. */
  function landmarkName(el) {
    var lb = el.getAttribute("aria-labelledby");
    if (lb) {
      var t = lb.split(/\s+/).map(function (id) {
        var n = document.getElementById(id);
        return n ? n.textContent.trim() : "";
      }).join(" ").trim();
      if (t) return t; // an aria-labelledby that resolves to nothing leaves the region UNNAMED
    }
    var al = (el.getAttribute("aria-label") || "").trim();
    if (al) return al;
    return (el.getAttribute("title") || "").trim();
  }

  /* Colors have to be compared across two notations: a CSS custom property holds `#e4ddd2` while
   * getComputedStyle always hands back `rgb(228, 221, 210)`. Comparing the strings would make the
   * item-124 border check permanently silent — a lying zero of exactly the kind this file is
   * about — so both sides are normalized to "r,g,b" first. Returns "" for anything it cannot
   * parse (`transparent`, `currentColor`, a gradient), and "" never matches a token, so an
   * unparseable color is reported as no finding rather than as a false one. */
  function norm(c) {
    if (!c) return "";
    var m = String(c).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (m) {
      var h = m[1];
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      return parseInt(h.slice(0, 2), 16) + "," + parseInt(h.slice(2, 4), 16) + "," + parseInt(h.slice(4, 6), 16);
    }
    m = String(c).match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (m) return Math.round(+m[1]) + "," + Math.round(+m[2]) + "," + Math.round(+m[3]);
    return "";
  }

  function where(el) {
    var d = el.tagName.toLowerCase();
    if (el.id) d += "#" + el.id;
    var cls = (el.getAttribute("class") || "").trim().split(/\s+/)[0];
    if (cls) d += "." + cls;
    var t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 32);
    return d + (t ? ' "' + t + '"' : "");
  }

  /* ── the probes ────────────────────────────────────────────────────────────────────────────
   * Each returns {needs, findings:[...], scanned:N}. `scanned` is load-bearing: a probe that
   * found nothing because it scanned nothing is a lying zero, and the reporter checks for it. */
  var PROBES = {
    /* Item 102's exact shape: a reference that resolves to nothing. */
    danglingRefs: { needs: "layout", run: function () {
      var attrs = ["aria-controls", "aria-labelledby", "aria-describedby",
                   "aria-owns", "aria-activedescendant", "for"];
      var out = [], scanned = 0;
      attrs.forEach(function (a) {
        [].forEach.call(document.querySelectorAll("[" + a + "]"), function (el) {
          if (a === "for" && el.tagName !== "LABEL") return;
          scanned++;
          (el.getAttribute(a) || "").split(/\s+/).filter(Boolean).forEach(function (id) {
            if (!document.getElementById(id)) {
              out.push(a + '="' + id + '" resolves to nothing, on ' + where(el));
            }
          });
        });
      });
      return { findings: out, scanned: scanned };
    } },

    duplicateIds: { needs: "layout", run: function () {
      var seen = {}, out = [], all = document.querySelectorAll("[id]");
      [].forEach.call(all, function (el) {
        var id = el.id;
        if (seen[id]) { if (seen[id] === 1) out.push('duplicate id="' + id + '"'); seen[id]++; }
        else seen[id] = 1;
      });
      return { findings: out, scanned: all.length };
    } },

    namelessControls: { needs: "layout", run: function () {
      var sel = 'button, a[href], input:not([type="hidden"]), select, textarea, ' +
                '[role="button"], [role="link"], [role="tab"], [role="checkbox"]';
      var out = [], scanned = 0;
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        if (!visible(el) || !exposed(el)) return;
        scanned++;
        if (!accName(el)) out.push("no accessible name: " + where(el));
      });
      return { findings: out, scanned: scanned };
    } },

    headingOrder: { needs: "layout", run: function () {
      var hs = [].filter.call(
        document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role='heading']"),
        function (el) { return visible(el) && exposed(el); });
      var out = [], prev = 0;
      hs.forEach(function (el) {
        var lvl = el.getAttribute("aria-level")
          ? parseInt(el.getAttribute("aria-level"), 10)
          : parseInt(el.tagName.slice(1), 10);
        // The ENTRY point, not just the steps between headings. `prev` starts at
        // 0, so the original loop compared every heading with its predecessor and
        // therefore never examined the FIRST one at all — a page whose outline
        // began at <h3> returned 0 findings and status "ok". That is not a
        // hypothetical: Practice mid-quiz read sequence "3" (one <h3>, no <h1>
        // anywhere) and every sweep in the log called it clean, because each
        // sweep had only ever looked at Practice's landing state, which reads
        // "12". Item 109, 2026-08-25. A skip from nothing is still a skip.
        if (!prev && lvl > 1) {
          out.push("document's first heading is h" + lvl + ", not h1 — the outline " +
                   "starts " + (lvl - 1) + " level(s) deep with nothing above it, at " + where(el));
        }
        if (prev && lvl > prev + 1) {
          out.push("h" + prev + " -> h" + lvl + " skips a level, at " + where(el));
        }
        prev = lvl;
      });
      return { findings: out, scanned: hs.length, sequence: hs.map(function (el) {
        return el.getAttribute("aria-level") || el.tagName.slice(1); }).join("") };
    } },

    smallTargets: { needs: "layout", run: function () {
      var sel = 'button, a[href], input:not([type="hidden"]), select, [role="button"], [role="tab"]';
      var out = [], scanned = 0;
      [].forEach.call(document.querySelectorAll(sel), function (el) {
        if (!visible(el) || !exposed(el)) return;
        scanned++;
        var r = el.getBoundingClientRect();
        if (r.width < 44 || r.height < 44) {
          out.push(Math.round(r.width) + "x" + Math.round(r.height) + " < 44x44: " + where(el));
        }
      });
      return { findings: out, scanned: scanned };
    } },

    horizontalOverflow: { needs: "layout", run: function () {
      var de = document.documentElement, out = [];
      if (de.scrollWidth > de.clientWidth + 1) {
        out.push("document scrolls horizontally: scrollWidth=" + de.scrollWidth +
                 " clientWidth=" + de.clientWidth);
        var lim = de.clientWidth + 1;
        [].forEach.call(document.querySelectorAll("body *"), function (el) {
          if (!visible(el)) return;
          var r = el.getBoundingClientRect();
          if (r.right > lim && out.length < 8) {
            out.push("  extends to " + Math.round(r.right) + "px: " + where(el));
          }
        });
      }
      return { findings: out, scanned: 1 };
    } },

    /* ⚠️ THE SELECTOR WAS `img, svg[role='img']` UNTIL 2026-08-28 AND THAT WAS A HOLE, measured
     * rather than reasoned: `role="img"` is an ARIA role and any element may carry it, and
     * **6 of this file's 11 chart primitives render `<div role="img">`** — `Bar`,
     * `ProportionBar`, `AsymmetryChart`, `BracketStack`, `GapColumns` and `OutcomeGrid` — because
     * their labels are long, five-language and must wrap, which SVG cannot do. So the probe was
     * blind to the MAJORITY of the app's figures, not to an exception.
     *
     * Measured, not reasoned, and the count was corrected once on the way: on lesson 28 the page
     * holds 1 `[role="img"]` and this probe matched 0, with the control firing on lesson 44's
     * `<svg role="img">` so the selector was proven working rather than broken generally. The
     * first version of this note said "two of eight" from reading the two figures I happened to
     * have open; parsing every `role="img"` against its owning component says six of eleven.
     * **The hand count was wrong in the same direction as item 134's: it counted where it was
     * looking.** Any of the six could have lost its accessible name and this probe would have
     * stayed green. §22 of check-data.mjs catches it at the call site, so nothing shipped
     * unnamed — but the probe's own claim was broader than what it did, which is the lying zero
     * this file exists to prevent, in the file itself. */
    imagesWithoutAlt: { needs: "layout", run: function () {
      var out = [], imgs = document.querySelectorAll("img, [role='img']"), scanned = 0;
      [].forEach.call(imgs, function (el) {
        if (!visible(el) || !exposed(el)) return;
        scanned++;
        if (el.tagName === "IMG" && el.getAttribute("alt") === null) {
          out.push("<img> with no alt attribute at all: " + where(el));
        }
        /* An <img> is named by alt and handled above; every other role="img" — svg or div — is
         * named by `aria-label` or `aria-labelledby`, or by a <title> child in the SVG case. */
        if (el.tagName !== "IMG" && !accName(el) && !el.querySelector("title")) {
          out.push("[role=img] with no accessible name: " + where(el));
        }
      });
      return { findings: out, scanned: scanned };
    } },

    /* ── figureClaims ─────────────────────────────────────────────────────────────────────────
     * Backlog items 135 and 124, built together because they are one probe read from two sides.
     *
     * WHY IT EXISTS. Every figure check in check-data.mjs (§21, §50, §53, §54, §57) reads SOURCE:
     * it asserts the numbers a figure is built from, or the style literals it is laid out with.
     * The claims the figures actually make are about the RENDER — "both gaps are the same",
     * "losing weighs heavier", "only labor sits on the rail", "all four cells are equal" — and a
     * source check cannot see one. That is not hypothetical. On 2026-08-28 `OutcomeGrid` shipped
     * twice with unequal rows (82px vs 52px, then 65 vs 52) while §57 passed and every style
     * literal in the file was correct: the inequality arrived through CONTENT, because CSS grid
     * sizes a row to its tallest item. It was found by measuring the live DOM, which is this.
     *
     * DESIGN, and the part that keeps it falsifiable: there is no generic "does this figure look
     * right" test. Each figure DECLARES the relation its own caption states, keyed by a
     * `data-figure` attribute that is language-independent, and the probe checks that relation
     * and nothing else. Same discipline as §50/§53/§54, moved from the data to the render.
     *
     * THE BORDER HALF IS ITEM 124. A datum line drawn as a CSS `border` is invisible to §51's
     * source scan — it is lexically identical to the ~50 decorative card and separator borders —
     * and that is how the worse of item 123's two defects was drawn. In the live DOM the question
     * answers itself: anything inside a `role="img"` subtree is part of the picture, so a border
     * there that resolves to a `--line-*` value is under-contrast datum geometry (§28b/§51: no
     * line token clears 3:1 on any surface in either palette). Position and containment, which
     * defeat a source scanner, are free here. */
    figureClaims: { needs: "layout", run: function () {
      var out = [], scanned = 0;
      var cs = getComputedStyle(document.documentElement);
      var lineTokens = {};
      ["--line-hairline", "--line-strong"].forEach(function (t) {
        var v = cs.getPropertyValue(t).trim();
        if (v) lineTokens[norm(v)] = t;
      });

      function boxes(fig, part) {
        return [].slice.call(fig.querySelectorAll('[data-figure-part="' + part + '"]'))
          .map(function (el) { return el.getBoundingClientRect(); });
      }
      /* Sub-pixel layout is real: 95.5625 vs 95.5469 is one box, not two. Everything below
       * compares at 1px, which is coarser than any defect this has caught (the smallest was 13px)
       * and immune to fractional-fr rounding. */
      function same(a, b) { return Math.abs(a - b) <= 1; }

      var CLAIMS = {
        /* Lesson 28. The caption says the grid "says nothing about how often each cell happens",
         * so any inequality between cells is the figure asserting a frequency the lesson refuses
         * to state. check-data.mjs §57 (e)/(e2) pin the two ways it got there; this measures it. */
        outcomeGrid: function (fig) {
          var r = boxes(fig, "cell"), i;
          if (r.length !== 4) return ["expected 4 cells, measured " + r.length];
          var bad = [];
          for (i = 1; i < 4; i++) {
            if (!same(r[i].width, r[0].width)) bad.push("cell " + i + " is " + Math.round(r[i].width) + "px wide against cell 0's " + Math.round(r[0].width));
            if (!same(r[i].height, r[0].height)) bad.push("cell " + i + " is " + Math.round(r[i].height) + "px tall against cell 0's " + Math.round(r[0].height));
          }
          return bad.length ? ["the four cells are not equal, so the grid draws one case as likelier than another: " + bad.join("; ")] : [];
        },
        /* Lesson 17. The lesson's own flagged counterintuitive result is that the two gaps are the
         * SAME $5,000 at very different incomes. §53 asserts the six numbers; this asserts that
         * the two segments actually render at one height. */
        earningsGap: function (fig) {
          var r = boxes(fig, "gap");
          if (r.length !== 2) return ["expected 2 gap segments, measured " + r.length];
          return same(r[0].height, r[1].height) ? []
            : ["the two gap segments render at " + Math.round(r[0].height) + "px and " + Math.round(r[1].height) + "px. The lesson's whole point is that both gaps are the same $5,000, and the caption says so — a reader sees two different gaps."];
        },
        /* Lesson 27. Loss aversion IS the asymmetry; a figure where the two bars match, or where
         * the gain bar is the taller one, draws the opposite of the lesson. */
        lossAsymmetry: function (fig) {
          var els = [].slice.call(fig.querySelectorAll('[data-figure-part="bar"]'));
          if (els.length !== 2) return ["expected 2 bars, measured " + els.length];
          els.sort(function (a, b) { return (+a.getAttribute("data-figure-index")) - (+b.getAttribute("data-figure-index")); });
          var gain = els[0].getBoundingClientRect().height, loss = els[1].getBoundingClientRect().height;
          return loss > gain + 1 ? []
            : ["the loss bar renders " + Math.round(loss) + "px against the gain bar's " + Math.round(gain) + "px. Lesson 27 is that losing weighs heavier, so a figure that does not draw the loss bar taller states the opposite of its own caption."];
        },
        /* Lesson 44. The figure's left-hand claim is that labor income sits ON the rail and the
         * other three are lifted clear of it. §54 (d) computes the clearance from source constants
         * — the exact "rendered claim checked in source arithmetic" item 135 names. Here it is
         * measured off the boxes the browser actually laid out. */
        incomeTradeoff: function (fig) {
          var rail = fig.querySelector('[data-figure-part="rail"]');
          var els = [].slice.call(fig.querySelectorAll('[data-figure-part="dot"]'));
          if (!rail || els.length !== 4) return ["expected a rail and 4 dots, measured " + (rail ? 1 : 0) + " and " + els.length];
          els.sort(function (a, b) { return (+a.getAttribute("data-figure-index")) - (+b.getAttribute("data-figure-index")); });
          var railY = rail.getBoundingClientRect().top;
          var r0 = els[0].getBoundingClientRect(), dia = r0.height, bad = [];
          if (Math.abs(r0.top + r0.height / 2 - railY) > dia / 2) {
            bad.push("labor's dot centre is " + Math.round(r0.top + r0.height / 2 - railY) + "px off the rail, but the caption says it is the one that sits on the line");
          }
          els.slice(1).forEach(function (el, i) {
            var r = el.getBoundingClientRect(), lift = railY - (r.top + r.height / 2);
            if (lift <= dia) bad.push("dot " + (i + 1) + " clears the rail by " + Math.round(lift) + "px, no more than one " + Math.round(dia) + "px dot diameter, so it reads as sitting on the line too");
          });
          return bad;
        },
        /* Lesson 23, backlog item 136. Three sentences in this figure's own text alternative are
         * claims about the RENDER, and §50 asserts all three in source arithmetic: the two curves
         * cross exactly once, the dashed marker sits at that crossing, and "for most of the span
         * the $65 curve sits slightly above the $50 curve".
         *
         * The third is the one worth measuring here, and it is why this claim was written. §50 (g)
         * proves the ORDERING at the samples bracketing the crossing — which is true and is not
         * the same question as whether a reader can SEE it. Two 2.5-unit strokes whose center
         * lines are 1.6 units apart are one thick line on screen. So the separation is compared
         * against the stroke width the browser actually computed, at the two ENDS specifically:
         * those are the lesson's own two scenarios, named on the axis ("Both a year away" / "The
         * $50 is available today"), and they are where the caption's claim is strongest and
         * furthest from the crossing. Nothing is asserted near the crossing, where the curves MUST
         * converge — a blanket "always separated" rule would contradict the figure's whole point.
         *
         * Everything is read in CLIENT pixels through getScreenCTM() and the live SVGPointList,
         * not off the `points` string: the viewBox->CSS mapping, a transform, a CSS stroke-width
         * override and `vector-effect: non-scaling-stroke` all change what is drawn without
         * changing any source number, and reading the attribute would be a source check wearing a
         * probe's costume. */
        preferenceFlip: function (fig) {
          var els = [].slice.call(fig.querySelectorAll('[data-figure-part="series"]'));
          var marker = fig.querySelector('[data-figure-part="marker"]');
          if (els.length !== 2 || !marker) return ["expected 2 series and a crossing marker, measured " + els.length + " and " + (marker ? 1 : 0)];
          els.sort(function (a, b) { return (+a.getAttribute("data-figure-index")) - (+b.getAttribute("data-figure-index")); });
          var ctm = fig.getScreenCTM();
          if (!ctm) return ["the figure has no screen CTM, so nothing about its geometry can be measured"];
          var cx = function (x) { return ctm.a * x + ctm.e; };
          var cy = function (y) { return ctm.d * y + ctm.f; };
          var stroke = parseFloat(getComputedStyle(els[0]).strokeWidth) * ctm.d;
          var a = els[0].points, b = els[1].points, n = a.numberOfItems, bad = [], j;
          if (n < 2 || b.numberOfItems !== n) return ["the two series carry " + n + " and " + b.numberOfItems + " points; they are drawn from one x-axis and must be sampled together"];
          var xs = [], gap = [];
          for (j = 0; j < n; j++) {
            var pa = a.getItem(j), pb = b.getItem(j);
            if (Math.abs(cx(pa.x) - cx(pb.x)) > 1) return ["the two series are sampled at different x positions, so no vertical comparison between them means anything"];
            xs.push(cx(pa.x));
            /* Screen y grows downward, so a POSITIVE gap means series 1 is drawn higher up —
             * i.e. the $65 is the one that feels worth more. */
            gap.push(cy(pa.y) - cy(pb.y));
          }
          var sign = null, flips = [];
          for (j = 0; j < n; j++) {
            var cur = Math.sign(gap[j]);
            if (cur === 0) continue;
            if (sign !== null && cur !== sign) flips.push(j);
            sign = cur;
          }
          if (flips.length !== 1) {
            bad.push("the two curves change order " + flips.length + " time(s) as drawn, not once. The figure draws one dashed marker and two tinted zones, which can only describe a single reversal.");
          } else {
            var lo = xs[flips[0] - 1], hi = xs[flips[0]];
            var mb = marker.getBoundingClientRect(), mx = mb.left + mb.width / 2;
            if (mx < lo - 1 || mx > hi + 1) {
              bad.push("the drawn curves swap order between x=" + Math.round(lo) + "px and x=" + Math.round(hi) + "px, but the dashed marker stands at x=" + Math.round(mx) + "px. The marker names the moment the answer flips, so it has to stand where the lines actually cross.");
            }
          }
          [[0, "left"], [n - 1, "right"]].forEach(function (end) {
            var d = Math.abs(gap[end[0]]);
            if (d <= stroke) {
              bad.push("at the " + end[1] + " edge the two curves are " + d.toFixed(2) + "px apart while each stroke is " + stroke.toFixed(2) + "px wide, so the two strokes overlap and no reader can see which option is on top. That edge is one of lesson 23's two scenarios and the caption states which way it goes.");
            }
          });
          return bad;
        },
        /* Lesson 3, backlog item 136. This figure's text alternative names the shape of each
         * line: "simple interest climbs in a STRAIGHT LINE ... while compound interest CURVES
         * UPWARD", both "rising from the SAME STARTING POINT", and the caption adds that "the gap
         * WIDENS every year". Four relations, all about the drawn path.
         *
         * WHY THIS ONE IS WORTH A CLAIM WHEN `ProportionBar`'s WAS NOT. Both are true of the
         * source arithmetic by construction — but this one is true only while the y-axis stays
         * LINEAR, and that is a live, named, contemplated edit rather than a hypothetical: on
         * 2026-08-28 item 137 gave lesson 23's figure a logarithmic y-axis, and explicitly
         * declined to do the same here on the judgment that this figure prints its endpoint
         * values as text. That decision had no instrument. Measured against this figure's own
         * numbers in the real plot box, a log axis SWAPS the two descriptions: the "straight"
         * line bends away from its chord by 6.69 units against a 2.5-unit stroke, and the
         * "curving" one flattens to 0.01. The caption would then describe the opposite picture.
         *
         * Which series is which is read off the RENDER, not off an index: the one finishing
         * higher is the compound one. That keeps the claim independent of the order
         * `compoundSeries` happens to list them in.
         *
         * ⚠️ REUSE CAVEAT, and it applies to `lossAsymmetry` and `outcomeGrid` identically —
         * `data-figure` sits on the PRIMITIVE, and `GrowthCurve` is generic. Only lesson 3 uses
         * it today (`LESSON_VISUALS`), so the claim and the description match. A second lesson
         * drawing two curving lines through this primitive would inherit a claim its own caption
         * does not make and fail on correct copy. If that ever happens, move `data-figure` up to
         * the call site rather than loosening the claim. */
        growthCurve: function (fig) {
          var els = [].slice.call(fig.querySelectorAll('[data-figure-part="series"]'));
          if (els.length !== 2) return ["expected 2 series, measured " + els.length];
          var ctm = fig.getScreenCTM();
          if (!ctm) return ["the figure has no screen CTM, so nothing about its geometry can be measured"];
          var cx = function (x) { return ctm.a * x + ctm.e; };
          var cy = function (y) { return ctm.d * y + ctm.f; };
          var stroke = parseFloat(getComputedStyle(els[0]).strokeWidth) * ctm.d;
          var pts = els.map(function (el) {
            var list = el.points, out = [], k;
            for (k = 0; k < list.numberOfItems; k++) out.push([cx(list.getItem(k).x), cy(list.getItem(k).y)]);
            return out;
          });
          var n = pts[0].length, bad = [];
          if (n < 3 || pts[1].length !== n) {
            return ["the two series carry " + n + " and " + pts[1].length + " points; they are drawn from one x-axis and must be sampled together"];
          }
          /* Screen y grows downward, so the series finishing higher has the SMALLER final y. */
          var hi = pts[0][n - 1][1] <= pts[1][n - 1][1] ? 0 : 1, lo = 1 - hi;
          if (Math.abs(pts[0][0][1] - pts[1][0][1]) > 1 || Math.abs(pts[0][0][0] - pts[1][0][0]) > 1) {
            bad.push("the two series start " + Math.abs(pts[0][0][1] - pts[1][0][1]).toFixed(2) + "px apart, but the figure's own description says they rise from the same starting point.");
          }
          /* Worst perpendicular-in-y departure from the straight line joining a series' ends. */
          function bend(p) {
            var y0 = p[0][1], y1 = p[n - 1][1], x0 = p[0][0], x1 = p[n - 1][0], worst = 0, k;
            if (Math.abs(x1 - x0) < 1) return 0;
            for (k = 1; k < n - 1; k++) {
              var chord = y0 + (y1 - y0) * ((p[k][0] - x0) / (x1 - x0));
              worst = Math.max(worst, Math.abs(p[k][1] - chord));
            }
            return worst;
          }
          var bendLo = bend(pts[lo]), bendHi = bend(pts[hi]);
          if (bendLo > stroke / 2) {
            bad.push("the lower series departs from its own chord by " + bendLo.toFixed(2) + "px against a " + stroke.toFixed(2) + "px stroke, so it does not read as the straight line the description calls it. A non-linear y-axis does exactly this (item 137 gave lesson 23 one); this figure prints its endpoint values as text, so its axis has to stay readable.");
          }
          if (bendHi <= stroke) {
            bad.push("the upper series departs from its own chord by only " + bendHi.toFixed(2) + "px against a " + stroke.toFixed(2) + "px stroke, so it draws as a straight line too. The description says it curves upward, and the whole lesson is that compounding is not linear.");
          }
          /* "the gap widens every year" — monotone in the drawn separation, 1px slack for
           * sub-pixel layout, same tolerance the rest of this probe uses. */
          var prev = null, k2;
          for (k2 = 0; k2 < n; k2++) {
            var d = pts[lo][k2][1] - pts[hi][k2][1];
            if (prev !== null && d < prev - 1) {
              bad.push("the gap between the two series narrows between sample " + (k2 - 1) + " and " + k2 + " (" + prev.toFixed(2) + "px to " + d.toFixed(2) + "px). The caption says it widens every year.");
              break;
            }
            prev = d;
          }
          return bad;
        },
        /* Lesson 7, backlog item 136. The caption's first sentence is the lesson: "Below the old
         * income line the two stacks are IDENTICAL — a raise cannot reach back and re-tax what
         * was already there." That is an equality between rendered boxes in two different
         * columns, which is the same shape as `outcomeGrid`'s claim and the same shape as the
         * defect that shipped twice there.
         *
         * It holds by construction today — a band's pixel height is amount/max x STACK_H, so
         * equal amounts give equal pixels regardless of column — and it is guarded anyway because
         * the construction is one edit deep. The column container is sized
         * `(col.total / max) * STACK_H` precisely so the two share a scale; normalizing each
         * column to a fixed height instead (a plausible "make the columns match" change) keeps
         * every source number correct and silently makes the lower layers disagree. The file's
         * own comment already flags this as load-bearing: "the alignment is the argument here,
         * not decoration". `minHeight: 2` is the other distortion path and does not bind — the
         * smallest band renders 13.03px. */
        bracketStack: function (fig) {
          var els = [].slice.call(fig.querySelectorAll('[data-figure-part="band"]'));
          if (!els.length) return ["expected stacked bands, measured none"];
          var cols = {};
          els.forEach(function (el) {
            var c = el.getAttribute("data-figure-column");
            (cols[c] = cols[c] || []).push(el);
          });
          var keys = Object.keys(cols).sort();
          if (keys.length !== 2) return ["expected 2 columns, measured " + keys.length];
          keys.forEach(function (c) {
            cols[c].sort(function (a, b) { return (+a.getAttribute("data-figure-index")) - (+b.getAttribute("data-figure-index")); });
          });
          var a = cols[keys[0]], b = cols[keys[1]], bad = [];
          if (b.length <= a.length) {
            bad.push("the second column draws " + b.length + " bands against the first column's " + a.length + ". The description says the second column adds layers on top of the shared ones, so it has to carry more.");
          }
          var shared = Math.min(a.length, b.length), i;
          for (i = 0; i < shared; i++) {
            var ha = a[i].getBoundingClientRect().height, hb = b[i].getBoundingClientRect().height;
            if (Math.abs(ha - hb) > 1) {
              bad.push("shared layer " + i + " renders " + ha.toFixed(2) + "px in the first column and " + hb.toFixed(2) + "px in the second. The caption's first sentence is that below the old income line the two stacks are identical — a reader who sees them differ is being told a raise re-taxes income that was already there.");
            }
          }
          return bad;
        }
      };

      [].forEach.call(document.querySelectorAll('[role="img"]'), function (fig) {
        if (fig.getAttribute(SKIP_ATTR) || !visible(fig)) return;
        scanned++;
        var key = fig.getAttribute("data-figure");
        if (key && CLAIMS[key]) {
          CLAIMS[key](fig).forEach(function (m) { out.push(key + ": " + m); });
        }
        /* Item 124's half, over EVERY figure — it needs no per-figure declaration, because
         * "inside the picture" is the whole predicate. */
        [].forEach.call(fig.querySelectorAll("*"), function (el) {
          var st = getComputedStyle(el);
          ["Top", "Right", "Bottom", "Left"].forEach(function (side) {
            if (parseFloat(st["border" + side + "Width"]) > 0) {
              var tok = lineTokens[norm(st["border" + side + "Color"])];
              if (tok) out.push((key || "[role=img]") + ": a border inside the figure paints " + tok + " (" + st["border" + side + "Color"] + "), which never clears 3:1 on any surface in either palette. Geometry inside a picture is datum, not decoration — use a graph token.");
            }
          });
        });
      });
      return { findings: out, scanned: scanned };
    } },

    /* Items 102/103 shipped these; this probe is the regression net. */
    landmarks: { needs: "layout", run: function () {
      var mains = document.querySelectorAll("main, [role='main']");
      var navs = document.querySelectorAll("nav, [role='navigation']");
      var out = [];
      if (mains.length === 0) out.push("no <main> landmark in the rendered tree");
      if (mains.length > 1) out.push(mains.length + " <main> landmarks; exactly one is expected");
      if (navs.length === 0) out.push("no <nav> landmark in the rendered tree");
      return { findings: out, scanned: mains.length + navs.length,
               counts: { main: mains.length, nav: navs.length } };
    } },

    /* Backlog item 107. The `landmarks` probe above counts <main> and <nav> and has no notion of a
     * region, so on 2026-08-25 it reported the lesson reader `clean` while that screen carried three
     * bare <section> elements — the defect that same run then went on to fix, found by reading the
     * tree by hand. Measured before this probe was written, with a control: a bare <section> planted
     * into `main` moved totalFindings not at all, while a planted second <main> fired the landmarks
     * probe immediately, so the instrument was live and simply blind to this class.
     *
     * This does NOT duplicate check-data.mjs §44. That section reads <section> tags written in src/;
     * it cannot see a region composed at runtime, one a library introduces, or a role set from a
     * variable. Source text and the computed tree are different things — which is why this file
     * exists at all. The two checks overlap deliberately and neither subsumes the other.
     *
     * VACUOUS is the correct report on a screen with no regions (the Glossary uses <dl>/<dt>/<dd>,
     * and several Reference sub-screens carry no <section> at all). A zero there proves nothing
     * about region naming because nothing was named or unnamed — which is exactly what the vacuous
     * accounting is for. Do not pad `scanned` to make those screens read green. */
    unnamedRegions: { needs: "layout", run: function () {
      var out = [], scanned = 0;
      [].forEach.call(document.querySelectorAll('section, [role="region"]'), function (el) {
        if (!visible(el) || !exposed(el)) return;
        scanned++;
        if (landmarkName(el)) return;
        // Worded apart because the two failures differ: an unnamed <section> is not a landmark at
        // all (it vanishes from the rotor), while an unnamed role="region" IS one, anonymously.
        out.push(el.hasAttribute("role")
          ? 'role="region" with no accessible name — an anonymous landmark: ' + where(el)
          : "<section> with no accessible name is not a landmark (HTML-AAM): " + where(el));
      });
      return { findings: out, scanned: scanned };
    } },

    /* IMPLEMENTED 2026-08-28 (item 116). It was a stub for two days on the belief that this
     * harness can never focus a document; that belief was wrong — see header note 2 — and the
     * stub is what the belief cost.
     *
     * `needs` is `focusVisibleSelectors`, the THIRD capability, not `focusSelectors`. The app's
     * only focus styling is `index.css`'s `:focus-visible` rule, so on a session seeded by a
     * CLICK (`:focus` matches, `:focus-visible` does not) this probe would find every control
     * ringless and report the whole app as broken. Gating one pseudo-class on its neighbor is
     * the item-108 proxy mistake a third time; each pseudo-class is now measured on its own.
     *
     * METHOD, and why it is a comparison rather than a rule lookup: park focus on a planted
     * offscreen button, snapshot the element's computed style, focus it, snapshot again. An
     * element whose computed outline / box-shadow / border / background are byte-identical in
     * both states has no visible focus indicator, whatever CSS claims. This reads the RESULT,
     * which is the whole reason this file exists — items 102/103 were composition defects where
     * every rule was individually right and the computed tree was still wrong.
     *
     * `document.activeElement !== el` after .focus() means the element is not really focusable
     * (a disabled button — the Learn path renders 11 of them for locked lessons). Those are
     * skipped rather than counted, so `scanned` stays the number of elements actually measured. */
    focusVisibleOnTab: { needs: "focusVisibleSelectors", run: function () {
      var park = document.createElement("button");
      park.setAttribute(SKIP_ATTR, "focus-park");
      park.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;";
      document.body.appendChild(park);
      var prev = document.activeElement, out = [], scanned = 0;

      /* ⚠️ `outlineOffset` and `borderRadius` are DELIBERATELY ABSENT, and the selftest plant is
       * what proves it. index.css's `:focus-visible` rule sets outline, outline-offset AND
       * border-radius together, so an element that suppresses only the outline still shows an
       * offset moving 0px → 2px on focus — a difference with no visual consequence whatsoever,
       * since an offset on a `none` outline paints nothing. Including it made this probe read a
       * ringless control as ringed: the first version of this code shipped that way and the
       * plant caught it in one run. The plant still overrides only outline and box-shadow, so
       * if a later edit puts either property back into the signature the control stops firing
       * and the selftest fails — the guard is the plant, not a comment. */
      function sig(el) {
        var s = getComputedStyle(el);
        return [s.outlineStyle, s.outlineWidth, s.outlineColor,
                s.boxShadow, s.border, s.backgroundColor, s.color].join("|");
      }

      [].forEach.call(document.querySelectorAll(FOCUSABLE), function (el) {
        if (el === park) return;
        if (!visible(el) || !exposed(el)) return;
        park.focus();                       // guarantee `el` is unfocused for the first read
        var before = sig(el);
        el.focus();
        if (document.activeElement !== el) return;   // not actually focusable — not a finding
        scanned++;
        if (sig(el) !== before) return;
        out.push("no visible focus indicator — computed outline/box-shadow/border/background are " +
                 "identical focused and unfocused: " + where(el));
      });

      park.remove();
      // Same courtesy measureFocus() extends: an instrument that leaves focus somewhere else has
      // changed the page it was measuring, and the next probe reads the changed page.
      if (prev && prev !== document.body && typeof prev.focus === "function") {
        try { prev.focus(); } catch (e) { /* ignore */ }
      }
      return { findings: out, scanned: scanned };
    } }
  };

  function runProbes() {
    var caps = capabilities(), report = {}, findingCount = 0, unavailable = [], suspect = [];
    Object.keys(PROBES).forEach(function (name) {
      var p = PROBES[name];
      if (!caps[p.needs]) {
        report[name] = { status: "UNAVAILABLE", needs: p.needs, findings: null };
        unavailable.push(name);
        return;
      }
      var r = p.run();
      // A zero from a probe that scanned nothing is not a pass — it is a broken instrument.
      var status = r.findings.length ? "FINDINGS" : (r.scanned > 0 ? "ok" : "VACUOUS");
      if (status === "VACUOUS") suspect.push(name);
      findingCount += r.findings.length;
      report[name] = Object.assign({ status: status }, r);
    });
    return {
      url: location.href,
      capabilities: caps,
      totalFindings: findingCount,
      unavailable: unavailable,
      vacuous: suspect,
      probes: report,
      verdict: !caps.layout
        ? "REFUSED — layout is not live; a zero here would be a lie. Take a screenshot to force " +
          "layout, then re-run. (" + caps.layoutEvidence + ")"
        : (findingCount === 0 && suspect.length === 0
            ? "clean on " + (Object.keys(PROBES).length - unavailable.length) + " probe(s); " +
              unavailable.length + " unavailable"
            : findingCount + " finding(s); " + suspect.length + " vacuous; " +
              unavailable.length + " unavailable")
    };
  }

  /* ── selftest ──────────────────────────────────────────────────────────────────────────────
   * Step 3.5's "carry a control", encoded into the instrument instead of left to the operator.
   * Plants one known defect per probe, asserts the probe FINDS it, then removes the plant.
   * RUN THIS FIRST. A sweep whose selftest has not passed this session proves nothing. */
  function selftest() {
    var box = document.createElement("div");
    box.setAttribute(SKIP_ATTR, "1");
    box.style.cssText = "position:fixed;left:-99999px;top:0;width:600px;height:600px;";
    box.innerHTML =
      '<span id="a11y-selftest-dup"></span><span id="a11y-selftest-dup"></span>' +
      '<button style="width:60px;height:60px"></button>' +
      '<button style="width:60px;height:60px" aria-controls="a11y-selftest-missing">x</button>' +
      '<button style="width:10px;height:10px">s</button>' +
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==">' +
      '<h1>plant</h1><h5>plant</h5><main></main>' +
      // The paragraph is not filler: it is what makes this a real control. A bare <section> with
      // contents is precisely the case a content-fallback name computation would call "named",
      // so an empty plant would pass even against the wrong implementation.
      '<section id="a11y-selftest-region"><p>planted unnamed region</p></section>' +
      /* figureClaims plants BOTH of its halves at once, because they fail separately.
       *  • four `outcomeGrid` cells of which one is deliberately short — the geometry half.
       *  • a border painted with the LIVE value of --line-hairline — the item-124 half. The
       *    value is read from the document rather than hardcoded, so the plant cannot rot into
       *    a control that fires for the wrong reason after a palette edit.
       * The plant carries SKIP_ATTR on its outer box, and the probe skips figures under it — so
       * this control must be the one thing the probe still reaches: it is planted as its own
       * role="img" INSIDE the skipped box, and the probe's skip test looks at the figure's own
       * attribute, not an ancestor's. That asymmetry is deliberate and is why the plant works
       * while the app's real figures stay the only other thing scanned. */
      '<div role="img" data-figure="outcomeGrid" aria-label="planted figure">' +
        '<div data-figure-part="cell" style="width:40px;height:40px"></div>' +
        '<div data-figure-part="cell" style="width:40px;height:40px"></div>' +
        '<div data-figure-part="cell" style="width:40px;height:40px"></div>' +
        '<div data-figure-part="cell" style="width:40px;height:12px"></div>' +
        '<div style="border-top:1px solid ' +
          (getComputedStyle(document.documentElement).getPropertyValue("--line-hairline").trim() || "#e4ddd2") +
          '"></div>' +
      '</div>' +
      /* The `preferenceFlip` plant is a SECOND role="img", not more parts inside the first: this
       * claim's two checks are per-figure and could not both be expressed in one node.
       * viewBox and width/height are equal on purpose, so getScreenCTM() is the identity and the
       * numbers below are the numbers the probe reports.
       *  • gaps 3 / 3 / -40 against a 7px stroke -> the ENDS check fires on the left edge.
       *  • exactly one order change, between x=150 and x=290, with the marker parked at x=30 ->
       *    the MARKER check fires.
       * Both expectations below are keyed to something the real app cannot produce (a 7px stroke;
       * a negative client x, which only an off-screen plant has), rather than to the shape of the
       * message. Lesson 23's real figure fails the left-edge check TODAY — backlog item 137 — so
       * a shape match would report this control as fired while measuring the app's live defect. */
      '<svg role="img" data-figure="preferenceFlip" aria-label="planted flip" ' +
           'viewBox="0 0 300 140" width="300" height="140">' +
        '<polyline data-figure-part="series" data-figure-index="0" fill="none" stroke="#000" ' +
          'stroke-width="7" points="10,100 150,90 290,20"></polyline>' +
        '<polyline data-figure-part="series" data-figure-index="1" fill="none" stroke="#000" ' +
          'stroke-width="7" points="10,97 150,87 290,60"></polyline>' +
        '<line data-figure-part="marker" x1="30" y1="10" x2="30" y2="130" stroke="#000"></line>' +
      '</svg>' +
      /* `growthCurve`'s plant (item 136). Identity CTM again, so the numbers below are the
       * numbers reported. Series A finishes at y=30 and series B at y=120, so B is the "lower"
       * one the description calls straight — and B is bent 20px off its own chord against a 9px
       * stroke, which is the one message this plant must produce. Deliberately tuned so the
       * OTHER three checks stay silent: both series start at 10,100 (same start), A is bent well
       * clear of its stroke (so the "curves upward" half does not fire), and the gap 0 -> 70 ->
       * 90 never narrows. A control that fires four ways cannot tell you which half rotted.
       * Keyed to a 9.00px stroke, which the real figure (2.5px) cannot produce. */
      '<svg role="img" data-figure="growthCurve" aria-label="planted growth" ' +
           'viewBox="0 0 300 140" width="300" height="140">' +
        '<polyline data-figure-part="series" data-figure-index="0" fill="none" stroke="#000" ' +
          'stroke-width="9" points="10,100 150,20 290,30"></polyline>' +
        '<polyline data-figure-part="series" data-figure-index="1" fill="none" stroke="#000" ' +
          'stroke-width="9" points="10,100 150,90 290,120"></polyline>' +
      '</svg>' +
      /* `bracketStack`'s plant (item 136). Two columns whose FIRST shared layer matches (40px)
       * and whose second does not (30px vs 17px), so the equality half fires exactly once and
       * names both numbers. The second column carries three bands against the first's two, so
       * the "adds layers on top" half stays silent — again, one plant, one message. Heights are
       * inline and explicit because the claim reads getBoundingClientRect(). */
      '<div role="img" data-figure="bracketStack" aria-label="planted stack">' +
        '<div data-figure-part="band" data-figure-column="0" data-figure-index="0" style="height:40px"></div>' +
        '<div data-figure-part="band" data-figure-column="0" data-figure-index="1" style="height:30px"></div>' +
        '<div data-figure-part="band" data-figure-column="1" data-figure-index="0" style="height:40px"></div>' +
        '<div data-figure-part="band" data-figure-column="1" data-figure-index="1" style="height:17px"></div>' +
        '<div data-figure-part="band" data-figure-column="1" data-figure-index="2" style="height:10px"></div>' +
      '</div>' +
      /* focusVisibleOnTab's control. The `!important` is load-bearing rather than lazy: it has
       * to beat index.css's global `:focus-visible` rule, which is precisely the rule whose
       * absence this probe hunts for, so a plant that did NOT beat it would inherit a ring and
       * quietly never fire. Styled inline via a <style> the box owns, because the probe reads
       * COMPUTED style — an inline `style="outline:none"` on the element would suppress the ring
       * in both states and the before/after comparison would see no difference for the wrong
       * reason, which is a control firing on its own account (the trap step 3.5 names). */
      '<style>#a11y-selftest-noring:focus, #a11y-selftest-noring:focus-visible ' +
        '{ outline: none !important; box-shadow: none !important; }</style>' +
      '<button id="a11y-selftest-noring" style="width:60px;height:60px">ring</button>';
    document.body.appendChild(box);
    // Overflow is planted separately: it must actually widen the document to be a real control.
    var wide = document.createElement("div");
    wide.setAttribute(SKIP_ATTR, "1");
    wide.style.cssText = "position:absolute;left:0;top:0;height:1px;width:" +
      (document.documentElement.clientWidth + 500) + "px;";
    document.body.appendChild(wide);
    // The first-heading control has to be planted at the TOP of the document,
    // not in `box` above: what it tests is document ORDER, and a plant appended
    // after the app's own <h1> would sit second and prove nothing. Hence a
    // separate node and insertBefore. <h4> rather than <h3> so the message it
    // produces cannot be confused with the app's real item-109 defect shape.
    var first = document.createElement("div");
    first.setAttribute(SKIP_ATTR, "1");
    first.style.cssText = "position:fixed;left:-99999px;top:0;width:300px;height:40px;";
    first.innerHTML = "<h4>planted first heading</h4>";
    document.body.insertBefore(first, document.body.firstChild);

    var expect = {
      duplicateIds: /a11y-selftest-dup/,
      namelessControls: /no accessible name/,
      danglingRefs: /a11y-selftest-missing/,
      // TWO regexes, both required: this probe has two independent failure modes
      // and for its whole first day it silently had only one of them. A single
      // /skips a level/ control passed just as happily while the first-heading
      // check did not exist at all — which is exactly how the item-109 defect
      // survived every sweep in the log. An array means BOTH must fire.
      headingOrder: [/skips a level/, /first heading is h4, not h1/],
      // NOT /10x10/: the planted button renders 16x10, because a UA stylesheet's padding and
      // min-content width win over the declared width. A control whose expectation depends on
      // exact rendered geometry fails for its OWN reasons — which is the trap step 3.5 warns
      // about, and this line cost one debug cycle on 2026-08-25 to learn. Match the SHAPE.
      smallTargets: /< 44x44/,
      imagesWithoutAlt: /no alt attribute/,
      horizontalOverflow: /scrolls horizontally/,
      landmarks: /<main> landmarks/,
      // Matches the plant's own id, not the shape: the app's own sections are all named as of
      // item 82 + the 2026-08-25 lesson-reader fix, so a shape match would pass off a REAL
      // regression as a fired control the moment one of them lost its label.
      unnamedRegions: /a11y-selftest-region/,
      /* TWO regexes, both required, for the same reason headingOrder needs two: this probe has
       * two independent halves and a single control would let either rot silently green. The
       * geometry half must report the short cell; the item-124 half must report the planted
       * line-token border. */
      /* SIX regexes now, one per independently-rottable half of this probe: two from the
       * outcomeGrid plant, two from the preferenceFlip plant, and one each from the growthCurve
       * and bracketStack plants added when item 136 was closed. Each is keyed to a number the
       * real app cannot produce (a 9px or 7px stroke, a negative client x, a 30/17px band pair)
       * rather than to the shape of the message, so a control cannot report itself fired while
       * actually matching a live defect in the app. */
      figureClaims: [/the four cells are not equal/, /--line-hairline/,
                     /swap order between x=-\d/, /each stroke is 7\.\d\dpx wide/,
                     /chord by 20\.00px against a 9\.00px stroke/,
                     /renders 30\.00px in the first column and 17\.00px in the second/],
      /* Matches the plant's own id rather than the shape, for unnamedRegions' reason: every
       * control in the app carries the global `:focus-visible` ring today, so a shape match
       * would pass off a REAL regression as a fired control the moment one of them lost it. */
      focusVisibleOnTab: /a11y-selftest-noring/
    };
    var caps = capabilities(), results = {}, failed = [];
    Object.keys(expect).forEach(function (name) {
      if (!caps[PROBES[name].needs]) { results[name] = "UNAVAILABLE"; failed.push(name); return; }
      var joined = PROBES[name].run().findings.join(" | ");
      var want = expect[name];
      var hit = Array.isArray(want)
        ? want.every(function (re) { return re.test(joined); })
        : want.test(joined);
      results[name] = hit ? "control fired" : "CONTROL DID NOT FIRE";
      if (!hit) failed.push(name);
    });

    box.remove();
    wide.remove();
    first.remove();

    // The control must also come back DOWN once the plants are gone, or it is not measuring them.
    // Distinguish the two things a post-cleanup finding can be, because conflating them is how a
    // control quietly stops being one: a leftover PLANT means the instrument is contaminating the
    // page, while a real APP finding is the sweep doing its job and must not read as residue.
    var after = runProbes();
    var plantsGone = !document.querySelector("[" + SKIP_ATTR + "]") &&
      JSON.stringify(after.probes).indexOf("a11y-selftest") === -1;
    if (!plantsGone) failed.push("CLEANUP");
    return JSON.stringify({
      selftest: results,
      failedProbes: failed,
      plantsRemoved: plantsGone,
      appFindingsAfterCleanup: after.totalFindings,
      verdict: failed.length === 0
        ? "PASS — every probe found its planted defect and the plants are gone. Zeros from " +
          "runProbes() are meaningful this session. (appFindingsAfterCleanup counts REAL findings " +
          "in the page, not residue — see plantsRemoved for the residue answer.)"
        : "FAIL — do not trust a zero from: " + failed.join(", ") + ". Fix the instrument first." +
          // The one failure with a one-gesture fix, so it says so instead of reading like the
          // others. Before item 116 this probe was a stub and never appeared here at all.
          (results.focusVisibleOnTab === "UNAVAILABLE"
            ? "  ⟵ focusVisibleOnTab is UNAVAILABLE because this document has no focused area " +
              "yet, which is an OPERATOR step and not a harness limit: send one `computer key " +
              "Tab` to the pane, then re-run selftest(). A seeding CLICK is not enough — it " +
              "gives :focus without :focus-visible. See header note 2."
            : "")
    }, null, 2);
  }

  window.A11ySweep = {
    run: function () { return JSON.stringify(runProbes(), null, 2); },
    selftest: selftest,
    probes: Object.keys(PROBES)
  };
  return "A11ySweep ready — run A11ySweep.selftest() FIRST, then A11ySweep.run(). Probes: " +
    Object.keys(PROBES).join(", ");
})()
