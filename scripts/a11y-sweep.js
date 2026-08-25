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
 *   ...open the preview at that URL, then paste this whole file into javascript_tool.
 * It returns a JSON string. Paste `A11ySweep.selftest()` FIRST — see below.
 *
 * ── THE POINT OF THE PRECONDITIONS ────────────────────────────────────────────────────────────
 * A live DOM instrument fails SILENTLY, and a silent failure is indistinguishable from a clean
 * result. Three ways this harness has actually produced a lying zero, all measured, not guessed:
 *
 *   1. LAYOUT NOT YET LIVE. On a fresh preview_start, `window.innerWidth` and every
 *      getBoundingClientRect() read 0. Geometry probes (hit targets, overflow) then return zero
 *      findings because nothing has a size, not because everything is fine. Taking a screenshot
 *      forces layout; this script HARD-GATES on it and refuses to report at all without it.
 *   2. FOCUS EVENTS NEVER FIRE. Measured 2026-08-25 with a native listener as the control:
 *      `document.hasFocus()` is false and `visibilityState` is "hidden" in this pane EVEN WHEN
 *      FRONTED, and a real `focus` listener on a real button recorded ZERO events across separate
 *      calls — while `document.activeElement` was correct the whole time. So: activeElement
 *      assertions are TRUSTWORTHY here; anything built on focus/blur EVENTS is not, and must
 *      report UNAVAILABLE rather than 0.
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
 * (live layout, which IS achievable), and mark only the focus-EVENT-dependent probes unavailable.
 */
(function () {
  "use strict";

  var SKIP_ATTR = "data-a11y-selftest";

  /* ── capability detection ──────────────────────────────────────────────────────────────────
   * Not decoration. Each probe declares what it needs; a probe whose capability is missing
   * reports status "UNAVAILABLE" and is never counted as a pass. */
  function capabilities() {
    var sized = 0, sample = document.querySelectorAll("button, a, h1, h2, p");
    for (var i = 0; i < sample.length && i < 40; i++) {
      var r = sample[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0) sized++;
    }
    return {
      layout: window.innerWidth > 0 && window.innerHeight > 0 && sized > 0,
      layoutEvidence: "innerWidth=" + window.innerWidth + " sizedSample=" + sized + "/" +
        Math.min(sample.length, 40),
      focusEvents: document.hasFocus(),
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

    imagesWithoutAlt: { needs: "layout", run: function () {
      var out = [], imgs = document.querySelectorAll("img, svg[role='img']"), scanned = 0;
      [].forEach.call(imgs, function (el) {
        if (!visible(el) || !exposed(el)) return;
        scanned++;
        if (el.tagName === "IMG" && el.getAttribute("alt") === null) {
          out.push("<img> with no alt attribute at all: " + where(el));
        }
        if (el.tagName === "svg" && !accName(el) && !el.querySelector("title")) {
          out.push("svg[role=img] with no accessible name: " + where(el));
        }
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

    /* Declared, gated OFF, and never silently green: focus EVENTS do not fire in this pane.
     * activeElement-based assertions are fine and belong in a run's own ad-hoc checks. */
    focusVisibleOnTab: { needs: "focusEvents", run: function () {
      return { findings: [], scanned: 0,
               note: "focus/blur events do not fire in this harness; see the header." };
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
      '<section id="a11y-selftest-region"><p>planted unnamed region</p></section>';
    document.body.appendChild(box);
    // Overflow is planted separately: it must actually widen the document to be a real control.
    var wide = document.createElement("div");
    wide.setAttribute(SKIP_ATTR, "1");
    wide.style.cssText = "position:absolute;left:0;top:0;height:1px;width:" +
      (document.documentElement.clientWidth + 500) + "px;";
    document.body.appendChild(wide);

    var expect = {
      duplicateIds: /a11y-selftest-dup/,
      namelessControls: /no accessible name/,
      danglingRefs: /a11y-selftest-missing/,
      headingOrder: /skips a level/,
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
      unnamedRegions: /a11y-selftest-region/
    };
    var caps = capabilities(), results = {}, failed = [];
    Object.keys(expect).forEach(function (name) {
      if (!caps[PROBES[name].needs]) { results[name] = "UNAVAILABLE"; failed.push(name); return; }
      var joined = PROBES[name].run().findings.join(" | ");
      var hit = expect[name].test(joined);
      results[name] = hit ? "control fired" : "CONTROL DID NOT FIRE";
      if (!hit) failed.push(name);
    });

    box.remove();
    wide.remove();

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
        : "FAIL — do not trust a zero from: " + failed.join(", ") + ". Fix the instrument first."
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
