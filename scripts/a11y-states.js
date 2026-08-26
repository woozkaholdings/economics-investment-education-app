/*
 * scripts/a11y-states.js — the STATE matrix for a11y-sweep.js.
 *
 * WHY THIS FILE EXISTS. a11y-sweep.js answers "is THIS document clean?". It has no idea how the
 * document got there, and every sweep in AGENT_LOG.md before 2026-08-25 read whatever state a URL
 * load happens to arrive in. Three defects came out of the states those sweeps could not reach:
 *
 *   item 106  the lesson reader's skipped heading level — invisible in the COMPLETED state,
 *             visible only while the lesson is unfinished.
 *   item 109  the review runner had no <h1> at all — one button behind a landing screen that
 *             every sweep in the log had read, and called clean, for weeks.
 *   item 110  the first-run dialog promised isolation (aria-modal) that nothing in the DOM kept —
 *             on the one screen with 100% reach, reachable only from cleared storage.
 *
 * The unit of work is a STATE, not a route. This file makes that unit first-class: each state is a
 * recipe (seed, hash, steps) plus — and this is the load-bearing half — an ARRIVAL ASSERTION,
 * plus, since 2026-08-26, an optional STORAGE PRECONDITION (`requires`).
 *
 * ── WHY A PRECONDITION, AND NOT JUST AN ASSERTION (item 118) ──────────────────────────────────
 * A recipe plus an arrival assertion identifies a ROUTE. Several screens here are functions of
 * localStorage as well, and drive() never touches storage — `clear`/`seed` are honored only by
 * begin(), the reload path — so for the no-reload states storage was simply whatever the page
 * loaded with, and nothing in the report said which. Measured: `practice-landing` renders three
 * different cards ("Nothing to review yet" / "You're all caught up" / "1 ready to review"), all
 * three satisfy `#how-review-title exists`, and all three reported `ok, findings: 0`.
 *
 * That is a lying zero of a new kind. Not "the sweep missed the screen" — the sweep found a
 * screen, swept it correctly, and the report named a different one. It is also the exact
 * mechanism that hid item 117a for four weeks: the one prior live check of that card seeded a
 * review entry first and truthfully reported the string it saw, so the false never-started copy
 * was never on screen to be read.
 *
 * A state therefore DECLARES the storage its screen is a function of, and drive() ASSERTS it
 * before running a single step — reporting `PRECONDITION` (findings `null`) rather than a clean
 * zero. It never SETS storage: the app reads localStorage at mount only, so a mid-session write
 * changes the store and not the screen. The corollary is that the no-reload set must be
 * side-effect-free, which is why `practice-all-questions` — the one recipe that answered a
 * question and so wrote `ecycles_review` — is reload-gated as of the same date.
 *
 * ── WHY THE ASSERTION IS THE POINT ────────────────────────────────────────────────────────────
 * A recipe whose click silently misses does not error. It sweeps whatever screen it is actually
 * on, finds it clean, and reports a zero — the exact lying-zero shape a11y-sweep.js's header
 * catalogues, wearing a new costume. So no state here is allowed to report a sweep result unless
 * it can first prove, from the DOM, that it is where it claims to be. A state that cannot reports
 * status "MISSED" and its findings are `null`, never `[]`. `runAll()` counts MISSED separately
 * from clean, because "0 findings" and "never got there" must not look the same in a run log.
 *
 * ── THE YIELD, AND A CORRECTION TO a11y-sweep.js's HEADER ─────────────────────────────────────
 * That header's precondition 3 says: "React commits asynchronously, so a same-call read returns
 * the PREVIOUS render. Always click in one javascript_tool call and read in the next." Both
 * observations are true, and the conclusion drawn from them is too strong. What is throttled in
 * this hidden preview pane is TIMERS — item 109 measured a setTimeout-driven click loop stretching
 * a 2-second sequence past 30s. A MessageChannel round-trip is not a timer and is not subject to
 * visibility throttling, and React 18's scheduler flushes on one. Measured 2026-08-25: a full
 * 14-question review session driven end-to-end inside a SINGLE javascript_tool call.
 * That is what makes a state matrix affordable at all — without it, every state in the table below
 * costs one round-trip per click, and nobody re-runs a matrix that expensive.
 *
 * ── HOW TO RUN IT ─────────────────────────────────────────────────────────────────────────────
 * Build and serve per AGENT_LOG.md's Environment note, copy BOTH files into dist/, then:
 *
 *   fetch('/a11y-sweep.js').then(r=>r.text()).then(s=>eval(s))     // required — this file uses it
 *   fetch('/a11y-states.js').then(r=>r.text()).then(s=>eval(s))
 *   A11ySweep.selftest()        // FIRST. Its zeros are meaningless until this passes.
 *   A11yStates.selftest()       // proves MISSED is detected, and that `requires` refuses two-sidedly
 *   await A11yStates.runAll()   // every state that needs no reload, one call
 *
 * runAll() and sweepLangs() expect CLEARED STORAGE at page load — several states declare it (see
 * `requires`/COLD below) and will report PRECONDITION rather than a zero if the page was loaded
 * warm. `localStorage.clear()` then reload, then re-eval both files.
 *
 * ── AUDITING THE DECLARATIONS THEMSELVES (item 119) ───────────────────────────────────────────
 * `requires` is OPT-IN, so a state that SHOULD declare storage and does not simply keeps
 * reporting `ok`. The audit turns "this screen does not vary" from a reading into a measurement:
 *
 *   ...from a COLD page, both files eval'd...
 *   await A11yStates.auditBegin()    // snapshots every no-reload state COLD, twice, then reloads warm
 *   ...re-eval both files after the reload...
 *   await A11yStates.auditFinish()   // snapshots them WARM and diffs; names GAP / OVER-DECLARED states
 *
 * Both controls are built in and both must fire: cold-vs-cold must be byte-identical (or a diff
 * is noise, not a finding), and every already-declared state must vary (or the fixture is not
 * reaching the app). Run it after adding a state, or after any change that makes a screen read a
 * new localStorage key. RESULT 2026-08-26: 12 states, 4 vary, 8 provably independent, 1 gap
 * (`reference-glossary`, now declaring NO_BOOKMARKS), 0 over-declared.
 *
 * States marked `reload: true` seed localStorage, which the app only reads at mount. Writing
 * ecycles_review while the app is running does nothing — useAppState holds review state in React
 * and saves over it (item 109 lost a reading to exactly this). Those states are therefore a
 * two-call sequence, and the split is explicit rather than hidden:
 *
 *   A11yStates.begin('practice-batch-pause')   // seeds, then reloads the page
 *   ...re-eval both files after the reload...
 *   await A11yStates.finish()                  // drives the steps and sweeps
 *
 * ZERO dependencies, same as a11y-sweep.js. Not in `npm test`: this is a browser instrument, and
 * making it a Node test means adding a headless browser — item 12's port-cost rule territory.
 */
(function () {
  "use strict";

  var PENDING_KEY = "__a11ystates_pending";
  var PENDING_AXES = "__a11ystates_axes";
  var AUDIT_KEY = "__a11ystates_audit_cold";

  /* ── the yield ──────────────────────────────────────────────────────────────────────────── */
  function tick() {
    return new Promise(function (resolve) {
      var ch = new MessageChannel();
      ch.port1.onmessage = function () { resolve(); };
      ch.port2.postMessage(0);
    });
  }
  // Two round-trips, not one: the first lets React's scheduler run, the second lets the effects
  // that render schedules (focus moves, follow-up setState) commit before anything is read.
  function settle() { return tick().then(tick); }

  // Bounded polling, NOT a sleep. Two settle()s is enough for a plain setState, but a route
  // change that remounts a lazy-loaded screen (Reference's chunk, the market data a Sectors
  // panel reads) can need more, and "enough ticks" is exactly the kind of guess that makes a
  // recipe pass on a fast machine and report MISSED on a slow one. The cap is hard: when it is
  // hit the caller throws, and the state is reported MISSED rather than swept in the wrong place.
  //
  // TWO PHASES, because two different things are being waited for and only one of them is a
  // render. MessageChannel ticks are microtask-fast, so 40 of them cost no wall-clock at all and
  // catch every synchronous React commit — but they cannot wait through a dynamic import() or a
  // fetch, and this app has both (the Practice and Reference screens are lazy chunks; the sector
  // panel reads market.json). Measured: a tick-only wait reported MISSED on `practice-landing`
  // with the DOM still reading "Loading…". So after the fast phase, fall back to real-time polls.
  //
  // The slow phase deliberately does NOT use setTimeout. Timers are throttled in this hidden pane
  // (item 109 measured a 2-second loop stretching past 30s), and a first attempt at this file used
  // setTimeout(50) polls: the whole matrix then blew through the 30-second javascript_tool timeout
  // and returned nothing at all — a throttled timer turns a bounded wait into an unbounded one.
  // A same-origin fetch round-trip is not a timer, is not throttled, costs about a millisecond
  // against the local static server, and still yields long enough for a pending dynamic import()
  // to settle. That is the whole trick, and it is why this file can wait for a lazy chunk at all.
  // A yield that costs real wall-clock without being a timer. See waitUntil's note below.
  function yieldIO() {
    return fetch(location.pathname, { method: "HEAD", cache: "no-store" }).catch(function () {});
  }

  // Wait for the app to STOP CHANGING, rather than for a fixed number of settles.
  //
  // This exists because of a measured defect in this file's own first draft. A route change is
  // NOT finished when `location.hash` matches the target and React has committed once: clicking
  // into that window starts a session that a LATER remount silently discards. The symptom is
  // brutal for an instrument — the control is found, the click fires and throws nothing, and two
  // ticks later the screen is back on its landing, so the state reports MISSED with no error to
  // explain it. (`practice-all-questions` did exactly this, reproducibly, while the identical
  // click by hand worked every time. The only difference was a preceding route bounce.)
  //
  // A fixed number of settles would be a guess that passes here and fails on a slower machine.
  // Quiescence is an observation: <main>'s text unchanged across two consecutive real-time yields.
  function quiesce(cap) {
    var last = null, stable = 0, n = 0;
    function again() {
      var now = mainText();
      if (now === last) { if (++stable >= 2) return Promise.resolve(true); }
      else { stable = 0; last = now; }
      if (n++ >= (cap || 30)) return Promise.resolve(false);
      return yieldIO().then(again);
    }
    return again();
  }

  function waitUntil(pred, opts) {
    var fastCap = (opts && opts.fast) || 40;
    var slowCap = (opts && opts.slow) || 60;
    var n = 0, m = 0;
    function fast() {
      if (pred()) return Promise.resolve(true);
      if (n++ < fastCap) return tick().then(fast);
      return slow();
    }
    function slow() {
      if (pred()) return Promise.resolve(true);
      if (m++ >= slowCap) return Promise.resolve(false);
      return yieldIO().then(slow);     // a failed probe is still a yield, which is all we need
    }
    return fast();
  }

  /* ── DOM helpers. All text matching is on innerText, i.e. what a person would read. ──────── */
  function main() { return document.querySelector("main"); }
  function mainText() { var m = main(); return m ? m.innerText : ""; }
  function controls() {
    return Array.prototype.slice.call(document.querySelectorAll(
      'button, [role="button"], [role="tab"], a[href]'));
  }
  function byText(txt, exact) {
    var all = controls();
    for (var i = 0; i < all.length; i++) {
      var t = (all[i].innerText || "").trim();
      if (exact ? t === txt : t.indexOf(txt) !== -1) return all[i];
    }
    return null;
  }
  function radios() {
    return Array.prototype.slice.call(document.querySelectorAll('[role="radio"]'));
  }
  function counter() {
    var m = mainText().match(/(\d+)\s*\/\s*(\d+)/);
    return m ? { at: +m[1], of: +m[2], text: m[0] } : null;
  }
  function headingTags() {
    return Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
      .filter(function (h) { return !h.closest('[aria-hidden="true"]'); });
  }
  function hasHeading(text) {
    return headingTags().some(function (h) { return (h.innerText || "").indexOf(text) !== -1; });
  }

  /* ── LANGUAGE-INDEPENDENT SELECTION (item 112) ──────────────────────────────────────────────
   * The first version of this file matched every control and every assertion by its ENGLISH
   * text — "Glossary", "Market Dashboard", "Kids", "About", "Practice all questions". The moment
   * the language axis was switched on, 12 of 13 states reported MISSED in `es` and again in `ko`.
   *
   * That is the arrival assertion doing its job, and it is worth being precise about what it
   * prevented: without it this run would have reported "5 languages, 65 states, all clean", and
   * 48 of those sweeps would have been the Reference menu measured over and over while claiming
   * to be five different sub-screens. A text-matched recipe is a monolingual recipe.
   *
   * So selection now uses handles that do not translate: element ids, ARIA roles, structural
   * position, and numerals. Where a label must be involved, it is READ FROM THE APP rather than
   * hardcoded — `menuItem` records the row's own text and the assertion checks the sub-screen's
   * <h1> against it, which holds in every language because both render the same locale string. */

  var lastLabel = null;   // set by menuItem/termRow, asserted by h1IsLastLabel/headingIsLastLabel

  function firstLine(el) { return ((el && el.innerText) || "").split("\n")[0].trim(); }
  function mainButtons() {
    return Array.prototype.slice.call(document.querySelectorAll("main button"));
  }
  // The runner's continue control ("Next" / "See Results" / "Done") in any language: the close
  // control carries an aria-label and the four options carry role="radio", so the plain button is
  // the only one left. Measured in ko: exactly one candidate, "다음".
  function plainButtons() {
    return mainButtons().filter(function (b) {
      return !b.getAttribute("role") && !b.getAttribute("aria-label");
    });
  }
  function h1IsLastLabel() {
    var h = document.querySelector("main h1");
    return !!h && !!lastLabel && (h.innerText || "").trim() === lastLabel;
  }
  function headingIsLastLabel() {
    return !!lastLabel && headingTags().some(function (h) {
      return (h.innerText || "").trim() === lastLabel;
    });
  }

  /* ── step verbs ─────────────────────────────────────────────────────────────────────────── */
  var STEPS = {
    // Setting location.hash to the value it ALREADY has fires no hashchange, so the app never
    // re-routes — and anything pushed on top of that route (Reference's five sub-screens, a
    // glossary term detail) stays open underneath a recipe that believes it just navigated.
    // NINE states reported MISSED for exactly this on the first run of this file, which is the
    // best evidence available that the arrival assertion is not decoration. Bouncing through
    // another route forces a real transition; the app resets its sub-screen on route change
    // (measured — #/practice -> #/reference came back to the Reference menu, not the term).
    hash: function (v) {
      if (location.hash !== v) { location.hash = v; return settle().then(quiesce); }
      var away = (v === "#/learn") ? "#/reference" : "#/learn";
      location.hash = away;
      return waitUntil(function () { return location.hash === away; })
        .then(settle)
        .then(function () {
          location.hash = v;
          return waitUntil(function () { return location.hash === v; }).then(settle).then(quiesce);
        });
    },
    click: function (v) {
      return waitUntil(function () { return !!byText(v, false); }).then(function (found) {
        if (!found) throw new Error('no control containing "' + v + '" appeared within the wait cap');
        byText(v, false).click(); return settle();
      });
    },
    // Reference's five sub-screens have no ids, so they are selected by POSITION and confirmed by
    // LABEL: the row's own text is recorded here and the state's assertion checks the resulting
    // <h1> against it. If the menu is ever reordered, the assertion fails loudly (MISSED) instead
    // of silently sweeping the wrong sub-screen — which is the property that matters.
    menuItem: function (n) {
      return waitUntil(function () { return mainButtons().length > n; }).then(function (found) {
        if (!found) throw new Error("no <main> button at index " + n + " (found " + mainButtons().length + ")");
        var b = mainButtons()[n];
        lastLabel = firstLine(b);
        b.click(); return settle().then(quiesce);
      });
    },
    // A glossary row's accessible name IS the term, in whatever language is loaded.
    termRow: function (n) {
      var rows = function () {
        return Array.prototype.slice.call(document.querySelectorAll('main [role="button"][aria-label]'));
      };
      return waitUntil(function () { return rows().length > n; }).then(function (found) {
        if (!found) throw new Error("no glossary row at index " + n + " (found " + rows().length + ")");
        var r = rows()[n];
        lastLabel = (r.getAttribute("aria-label") || "").trim();
        r.click(); return settle().then(quiesce);
      });
    },
    clickId: function (id) {
      return waitUntil(function () { return !!document.getElementById(id); }).then(function (found) {
        if (!found) throw new Error("no element with id " + id + " appeared within the wait cap");
        document.getElementById(id).click(); return settle().then(quiesce);
      });
    },
    // "Practice all questions" is the LAST button on the Review landing, after the conditional
    // "Start Quiz"; "Start Quiz" is the first, and exists only when something is due. Position,
    // not text. It is NOT unconditional — this comment said it was until 2026-08-26, when the
    // button was scoped to the questions the learner has actually reached and now does not render
    // at all from cleared storage. A recipe that clicks the last button therefore has to EARN one
    // first; see the practice-all-questions state.
    lastButton: function () {
      return waitUntil(function () { return mainButtons().length > 0; }).then(function (found) {
        if (!found) throw new Error("no buttons in <main>");
        var b = mainButtons(); b[b.length - 1].click(); return settle().then(quiesce);
      });
    },
    firstButton: function () {
      return waitUntil(function () { return mainButtons().length > 0; }).then(function (found) {
        if (!found) throw new Error("no buttons in <main>");
        mainButtons()[0].click(); return settle().then(quiesce);
      });
    },
    // The first-run dialog has exactly one control, so it needs no label to dismiss.
    dismissDialog: function () {
      var d = document.querySelector('[role="dialog"]');
      if (!d) return Promise.resolve();
      var b = d.querySelector("button");
      if (!b) return Promise.resolve();
      b.click(); return settle().then(quiesce);
    },
    // Tolerant by design: the first-run dialog is up only when storage was cleared, and a
    // recipe that hard-fails on its ABSENCE would report MISSED for a state it actually reached.
    // Tolerance is safe here only because `arrived` still has to prove the destination.
    clickIfPresent: function (v) {
      var el = byText(v, false);
      if (!el) return Promise.resolve();
      el.click(); return settle();
    },
    clickExact: function (v) {
      return waitUntil(function () { return !!byText(v, true); }).then(function (found) {
        if (!found) throw new Error('no control whose text is exactly "' + v + '" appeared within the wait cap');
        byText(v, true).click(); return settle();
      });
    },
    radio: function (n) {
      return waitUntil(function () { return radios().length > n; }).then(function (found) {
        if (!found) throw new Error("no [role=radio] at index " + n + " (found " + radios().length + ")");
        radios()[n].click(); return settle();
      });
    },
    collapseTracks: function () {
      var open = Array.prototype.slice.call(document.querySelectorAll('[aria-expanded="true"]'));
      var chain = Promise.resolve();
      open.forEach(function (el) { chain = chain.then(function () { el.click(); return settle(); }); });
      return chain;
    },
    // Answer-and-advance through the review runner. Bounded by a hard step cap rather than by
    // trust: a runner that stops advancing must end the loop, not spin.
    //
    // The continue control is found STRUCTURALLY, not by its words. It is labelled "Next" for
    // every question except the last, where it becomes "See Results" — and both of those are
    // English. In the runner the close control carries an aria-label and the four options carry
    // role="radio", so the sole plain button is the one to press, in any language (measured in
    // ko: exactly one candidate, "다음").
    answer: function (n) {
      var done = 0, guard = 0;
      function step() {
        if (done >= n || guard++ > n * 4) return Promise.resolve();
        if (!counter()) return Promise.resolve();          // left the runner (pause/complete)
        var cont = plainButtons();
        if (cont.length === 1) { cont[0].click(); done++; return settle().then(step); }
        var r = radios();
        if (!r.length) return Promise.resolve();
        r[0].click(); return settle().then(step);
      }
      return step();
    }
  };

  function runSteps(steps) {
    var chain = Promise.resolve();
    (steps || []).forEach(function (s) {
      chain = chain.then(function () {
        var verb = Object.keys(s)[0];
        if (!STEPS[verb]) throw new Error("unknown step verb: " + verb);
        return STEPS[verb](s[verb]);
      });
    });
    return chain;
  }


  /* ── THE TWO AXES: language and font scale ──────────────────────────────────────────────────
   * Every state in the matrix above was measured in `en` at 100% until 2026-08-25 (item 112).
   * That is not a small gap: the four "(Beta)" languages re-render every string in the app, and
   * text length is what drives the two probes most likely to fire on a mobile viewport —
   * `horizontalOverflow` and `smallTargets`.
   *
   * ⚠️ THE AXIS ITSELF IS A LYING-ZERO RISK, and it is the worst one in this file. If a language
   * switch silently fails, every subsequent state reports CLEAN — and it is a clean result in
   * English, dressed as a clean result in Japanese. Nothing errors. So both setters ASSERT, and
   * every result carries the OBSERVED environment (`env`) rather than the requested one: a reader
   * checking whether `ja` was really swept looks at what the DOM said, not at what was asked for.
   */

  // Drives the app's OWN language control, not localStorage. A user switches language with this
  // <select>, and the app re-renders in place — no reload, which is what makes the axis affordable.
  // A native <select> needs the value SETTER plus a dispatched change event; `el.value = x` alone
  // does not notify React (a standing note in AGENT_LOG.md's Environment section).
  // The app does not put the picker's value straight into <html lang>: it maps through
  // useAppState.js's HTML_LANG, where `zh` becomes the correct BCP-47 subtag `zh-Hans`. Mirrored
  // here rather than relaxed to "any value", because "whatever the DOM says" is not an assertion.
  // Found by this check firing on zh and being WRONG — the app was right; see the run log.
  var HTML_LANG = { en: "en", es: "es", ko: "ko", ja: "ja", zh: "zh-Hans" };

  function setLang(code) {
    var sel = document.querySelector("header select");
    if (!sel) return Promise.reject(new Error("no language <select> in the header — the picker moved"));
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(sel, code);
    sel.dispatchEvent(new Event("change", { bubbles: true }));
    return settle().then(quiesce).then(function () {
      // Two independent confirmations. <html lang> is the one that matters to a screen reader and
      // is set by a different code path (item 97) than the <select>'s own value, so agreeing is
      // meaningfully stronger than either alone.
      var wantHtml = HTML_LANG[code] || code;
      if (sel.value !== code || document.documentElement.lang !== wantHtml) {
        throw new Error('language did not switch to "' + code + '": select=' + sel.value +
          ', <html lang>=' + document.documentElement.lang + ' (expected ' + wantHtml + ')');
      }
      return code;
    });
  }

  // Drives the app's own font-scale control on Reference > About, rather than writing
  // documentElement.style.fontSize by hand. Setting the style directly replicates what
  // useAppState's effect does, but it leaves React's fontScale state at 1 — so the next time that
  // effect runs it silently reverts, and the sweep after that measures 100% while reporting 130%.
  // Clicking the real radio moves the state, so the scale survives everything the matrix does.
  function setFontScale(pct) {
    var before = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // menuItem(4), not click("About") — About is the fifth Reference row, and its LABEL is
    // translated. The first version of this helper matched the English word and threw the moment
    // the language axis it exists to support was actually switched on. Same bug, same fix.
    return STEPS.hash("#/reference")
      .then(function () { return STEPS.menuItem(4); })
      .then(function () {
        var radio = document.querySelector('main [role="radio"][aria-label="' + pct + '%"]');
        if (!radio) throw new Error("no font-scale control labelled " + pct + "% on Reference > About");
        radio.click();
        return settle().then(quiesce);
      })
      .then(function () {
        var radio = document.querySelector('main [role="radio"][aria-label="' + pct + '%"]');
        var after = parseFloat(getComputedStyle(document.documentElement).fontSize);
        var want = 16 * (pct / 100);
        // Assert BOTH the control's state and the rendered result. The control could report
        // checked while the effect that resizes the root has not run; the root could be resized
        // by something else entirely. Neither alone proves the app is at this scale.
        if (!radio || radio.getAttribute("aria-checked") !== "true") {
          throw new Error("font-scale " + pct + "% did not become the checked option");
        }
        if (Math.abs(after - want) > 0.5) {
          throw new Error("root font-size is " + after + "px, expected ~" + want + "px for " + pct + "%");
        }
        return { pct: pct, rootFontSizeBefore: before, rootFontSizePx: after };
      });
  }

  // The OBSERVED axis values. Stamped onto every result so a clean sweep can never be read as
  // covering a language or a scale it was not actually in.
  function env() {
    return {
      htmlLang: document.documentElement.lang || null,
      selectLang: (document.querySelector("header select") || {}).value || null,
      rootFontSizePx: parseFloat(getComputedStyle(document.documentElement).fontSize),
      viewportWidth: window.innerWidth
    };
  }

  // Per-probe tally across a set of results. item 112's third axis: a probe that is VACUOUS on
  // every screen is not passing, it is not running — and until this existed, nobody was looking.
  function probeTally(results) {
    var tally = {};
    results.forEach(function (r) {
      Object.keys(r.probeStatus || {}).forEach(function (k) {
        tally[k] = tally[k] || { ok: 0, FINDINGS: 0, VACUOUS: 0, UNAVAILABLE: 0 };
        if (tally[k][r.probeStatus[k]] !== undefined) tally[k][r.probeStatus[k]]++;
      });
    });
    return tally;
  }

  /* ── the state matrix ───────────────────────────────────────────────────────────────────────
   * `arrived.is` must read the DOM for something only this state shows. "A heading exists" is
   * usually not enough — several states share an <h1>. Prefer the thing that CHANGED. */
  // A fixed constant, not a computed "five days ago". check-data.mjs §23 rejects
  // `new Date(...).toISOString().slice(0,10)` because it is tomorrow's date every evening east
  // of UTC — and §23 allows exactly ONE exemption in the repo, which this does not deserve to
  // spend. The seeded entries only need a `due` that is unambiguously in the past for
  // dueQuestions()'s `dayDiff(due, today) >= 0`; a date no timezone can drag into the future is
  // strictly better than a correct-but-computed one. This is scaffolding, never rendered.
  var LONG_PAST_DUE = "2000-01-01";
  function seededReview(n) {
    var o = {}, due = LONG_PAST_DUE;
    for (var i = 0; i < n; i++) o[String(i)] = { box: 1, due: due, seen: 2, wrong: 0 };
    return JSON.stringify(o);
  }

  // The cold precondition: nothing completed, nothing ever reviewed. It is the state EVERY first
  // user is in, and — until this run — the one state the no-reload matrix could not promise it
  // was in. Named once so the states below read as a declaration rather than a repeated snippet.
  var COLD = {
    says: "cleared storage — no completed lessons and no review history",
    is: function () {
      var s = storageNow();
      return emptyKey(s.completed) && emptyKey(s.review);
    }
  };

  // A SECOND precondition, and the reason it is not just COLD is the whole point of declaring
  // storage precisely. COLD is about lesson/review PROGRESS; the Glossary is not a function of
  // progress at all. It is a function of `ecycles_glossary_bookmarks`, which COLD does not read —
  // so `requires: COLD` here would pass on a page that has bookmarks and no completed lessons,
  // which is exactly the screen it needs to refuse.
  //
  // MEASURED 2026-08-26 by storageAudit (item 119), not reasoned: with one bookmark seeded, the
  // bookmarked row's aria-label becomes `"Inflation, Saved"` instead of `"Inflation"` and gains a
  // bookmark icon (Glossary.jsx:115,130). The state's arrival assertion — "more than 10 labelled
  // term rows" — is satisfied by BOTH variants, and the sweep reported `ok` over the bookmarked
  // one while naming the plain list. Same lying zero as item 118, one screen along.
  //
  // Over-declaring is its own error: a state that names storage it does not depend on reports
  // PRECONDITION for a screen it would have swept correctly. So this names one key, not nine.
  var NO_BOOKMARKS = {
    says: "no glossary bookmarks — every term row carries its bare term as its aria-label",
    is: function () { return emptyKey(storageNow().bookmarks); }
  };

  var STATES = [
    { name: "first-run-modal", reload: true, clear: true, hash: "#/learn",
      note: "item 110 — the only screen with 100% reach; the dialog must isolate the app behind it",
      arrived: { says: 'a [role=dialog] is present and owns the only heading',
        is: function () { return !!document.querySelector('[role="dialog"][aria-modal="true"]') && headingTags().length === 1; } } },

    // The three track headings carry ids (`track-<key>-title`), so this holds in any language.
    //
    // `requires` cold, because this screen is FOUR strings deep in storage: the <h1> is
    // welcomeTitle vs returningTitle, the sub is welcomeSub vs returningSub, the resume eyebrow
    // is startHereLabel vs resumeLabel, the action is startLesson vs continueLesson — and the
    // streak chip exists at all only when `streak > 0`. Measured cold vs warm this run: every one
    // of the five flipped. A sweep that does not say which side it read is reporting on a screen
    // it has not named.
    { name: "learn", requires: COLD, steps: [{ dismissDialog: true }, { hash: "#/learn" }],
      arrived: { says: 'Learn shows all three track sections (by id, not by label)',
        is: function () { return !!document.getElementById("track-economy-title") &&
                                 !!document.getElementById("track-money-title") &&
                                 !!document.getElementById("track-essentials-title"); } } },

    { name: "learn-collapsed", requires: COLD, steps: [{ hash: "#/learn" }, { collapseTracks: true }],
      arrived: { says: 'no track section reports aria-expanded="true"',
        is: function () { return document.querySelectorAll('[aria-expanded="true"]').length === 0 &&
                                 document.querySelectorAll('[aria-expanded="false"]').length > 0; } } },

    { name: "reference", steps: [{ hash: "#/reference" }],
      arrived: { says: 'the Reference menu is showing its five sub-screen rows',
        is: function () { return mainButtons().length === 5 && !document.querySelector("main h1[id]"); } } },

    // Sub-screens: selected by POSITION, confirmed by the row's own LABEL against the <h1>.
    // Both render the same locale string, so the check is language-independent by construction.
    { name: "reference-glossary", requires: NO_BOOKMARKS,
      steps: [{ hash: "#/reference" }, { menuItem: 0 }],
      note: "item 119 — the only Reference state measured to vary with storage; a bookmarked row relabels",
      arrived: { says: "the sub-screen <h1> matches the menu row that opened it, and term rows are rendered",
        is: function () { return h1IsLastLabel() &&
          document.querySelectorAll('main [role="button"][aria-label]').length > 10; } } },

    { name: "reference-glossary-term",
      steps: [{ hash: "#/reference" }, { menuItem: 0 }, { termRow: 0 }],
      arrived: { says: "a heading now carries the term name taken from the row's own aria-label",
        is: function () { return headingIsLastLabel(); } } },

    { name: "reference-markets", steps: [{ hash: "#/reference" }, { menuItem: 1 }],
      arrived: { says: "the sub-screen <h1> matches the menu row that opened it",
        is: function () { return h1IsLastLabel(); } } },

    { name: "reference-sectors", steps: [{ hash: "#/reference" }, { menuItem: 2 }],
      note: "the assertion is the SCREEN (#sector-list), never its data — §2.3 suppresses stale figures",
      arrived: { says: "the <h1> matches its menu row AND #sector-list is present",
        is: function () { return h1IsLastLabel() && !!document.getElementById("sector-list"); } } },

    { name: "reference-kids", steps: [{ hash: "#/reference" }, { menuItem: 3 }],
      arrived: { says: 'the age-band panel is present and labelled by the 5-8 band',
        is: function () { var p = document.getElementById("age-band-panel");
          return !!p && p.getAttribute("aria-labelledby") === "age-band-5-8"; } } },

    // Band tabs carry ids, so no label text is involved at all.
    { name: "reference-kids-9-12",
      steps: [{ hash: "#/reference" }, { menuItem: 3 }, { clickId: "age-band-9-12" }],
      note: "item 111 — the age selector swaps panels with no route change",
      arrived: { says: 'the 9-12 band is selected AND the panel label followed it',
        is: function () { var t = document.getElementById("age-band-9-12"),
                              p = document.getElementById("age-band-panel");
          return !!t && t.getAttribute("aria-selected") === "true" &&
                 !!p && p.getAttribute("aria-labelledby") === "age-band-9-12"; } } },

    { name: "reference-kids-13-17",
      steps: [{ hash: "#/reference" }, { menuItem: 3 }, { clickId: "age-band-13-17" }],
      arrived: { says: 'the 13-17 band is selected AND the panel label followed it',
        is: function () { var t = document.getElementById("age-band-13-17"),
                              p = document.getElementById("age-band-panel");
          return !!t && t.getAttribute("aria-selected") === "true" &&
                 !!p && p.getAttribute("aria-labelledby") === "age-band-13-17"; } } },

    // The font-scale controls are labelled with NUMERALS ("90%", "130%"), which do not translate.
    { name: "reference-about", steps: [{ hash: "#/reference" }, { menuItem: 4 }],
      arrived: { says: "the <h1> matches its menu row AND the font-scale radios are present",
        is: function () { return h1IsLastLabel() &&
          !!document.querySelector('main [role="radio"][aria-label="130%"]'); } } },

    // reload+clear, not a bare hash: "unfinished" is a property of STORAGE, not of the URL. The
    // unfinished reader renders EIGHT radios (four for the hook, four for the check); a completed
    // one renders four. That count is the language-independent signature of the hook's presence.
    { name: "lesson-unfinished", reload: true, clear: true, hash: "#/lesson/1",
      steps: [{ dismissDialog: true }],
      note: "item 106 — the hook block only exists before the lesson is completed",
      arrived: { says: 'the reader shows 8 radios (hook + check), i.e. the lesson is unfinished',
        is: function () { return radios().length === 8 && !!document.getElementById("lesson-section-0-title"); } } },

    { name: "lesson-midquiz", reload: true, clear: true, hash: "#/lesson/1",
      steps: [{ dismissDialog: true }, { radio: 4 }],
      note: "item 111 — the end-of-lesson check answered, explanation revealed",
      arrived: { says: 'an answer is chosen and the completion control has appeared',
        is: function () { return radios().some(function (r) { return r.getAttribute("aria-checked") === "true"; }) &&
                                 plainButtons().length >= 1; } } },

    // `requires` COLD and the assertion now names the CARD, not just the rail. The rail is
    // present in all three variants, so `#how-review-title` alone proved only that Review had
    // rendered — see drive()'s precondition note for the three cards it could not tell apart.
    // `#review-empty-title` is the never-started/caught-up card's own heading; pairing it with
    // COLD pins this state to the never-started one.
    { name: "practice-landing", requires: COLD, steps: [{ hash: "#/practice" }],
      note: "item 118 — the never-started Review card, the variant item 117a's false copy lived in",
      arrived: { says: 'the Review landing shows the nothing-due card AND its #how-review-title panel',
        is: function () { return !!document.getElementById("how-review-title") &&
                                 !!document.getElementById("review-empty-title") &&
                                 !document.querySelector('[role="progressbar"]'); } } },

    // The first two steps are what EARNS the entrance rather than assuming it. `#/lesson/1` is the
    // first lesson of its track and so is always unlocked; `radio: 4` is the check question's
    // first option (indices 0-3 belong to the hook), and answering it is what puts one question
    // into the review state. Before 2026-08-26 this state was `[{ hash }, { lastButton }]` and
    // relied on "Practice all questions" rendering unconditionally — which it no longer does, and
    // in runAll() (one page session, no reload, nothing else answers anything) that recipe would
    // now report MISSED. Earning the question also makes the state DETERMINISTIC, which it never
    // was: it carries no `clear`/`seed`, so it used to sweep whatever storage the page happened
    // to load with.
    //
    // RELOAD-GATED 2026-08-26 (item 118), and the reason is the sweep AFTER it, not this one.
    // `{ radio: 4 }` answers a check question, which calls recordReview and writes
    // `ecycles_review` — the only recipe in this file that mutates persistent learner state
    // mid-sweep. In runAll() it runs last, so nothing follows it; in sweepLangs(), which runs the
    // whole no-reload set once PER LANGUAGE in one page session, it warms storage for every
    // language after the first. MEASURED this run: from cleared storage `practice-landing` shows
    // "Nothing to review yet"; immediately after this state runs, the same recipe shows "You're
    // all caught up" — and both reported `ok`. So the 2026-08-26 sweepLangs line "all 5 languages,
    // every state reached, 0 findings" was comparing en's never-started card against four
    // languages' caught-up card. Moving this behind begin()/finish() makes the no-reload set
    // side-effect-free, which is what lets `requires: COLD` above hold for a whole sweepLangs run.
    { name: "practice-all-questions", reload: true, clear: true, hash: "#/lesson/1",
      steps: [{ dismissDialog: true }, { radio: 4 }, { hash: "#/practice" }, { lastButton: true }],
      note: "item 109's open question — this entrance renders the same runner branch as Start Quiz",
      arrived: { says: 'a quiz is running: counter, progress bar and four options',
        is: function () { return !!counter() && document.querySelectorAll('[role="progressbar"]').length === 1 &&
                                 radios().length === 4; } } },

    { name: "practice-runner", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice", steps: [{ dismissDialog: true }, { firstButton: true }],
      arrived: { says: 'a seeded session is running at question 1 of 14',
        is: function () { var c = counter(); return !!c && c.at === 1 && c.of === 14 && radios().length === 4; } } },

    // Batch pause and session complete are told apart STRUCTURALLY, not by their words: the pause
    // offers two plain buttons (keep going / stop here), the complete screen offers one (done).
    { name: "practice-batch-pause", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice", steps: [{ dismissDialog: true }, { firstButton: true }, { answer: 10 }],
      note: "BATCH_SIZE is 10, so a 14-question queue is the smallest that reaches a pause",
      arrived: { says: 'no counter and exactly two plain buttons (keep going / stop here)',
        is: function () { return !counter() && plainButtons().length === 2; } } },

    { name: "practice-complete", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice",
      // firstButton at the pause is "keep going"; the outline "stop here" is second (Practice.jsx).
      steps: [{ dismissDialog: true }, { firstButton: true }, { answer: 10 }, { firstButton: true }, { answer: 4 }],
      arrived: { says: 'no counter, one plain button (done), and a results recap is rendered',
        is: function () { return !counter() && plainButtons().length === 1 &&
                                 headingTags().length >= 2; } } }
  ];

  function find(name) {
    for (var i = 0; i < STATES.length; i++) if (STATES[i].name === name) return STATES[i];
    return null;
  }

  /* ── running one state ──────────────────────────────────────────────────────────────────── */
  function sweepHere(state) {
    if (typeof A11ySweep === "undefined") {
      return { state: state.name, status: "UNAVAILABLE",
        note: "a11y-sweep.js is not loaded — eval it first; this file only drives, it does not probe.",
        findings: null };
    }
    var rep = JSON.parse(A11ySweep.run());
    var probes = rep.probes || {};
    return {
      state: state.name,
      status: rep.totalFindings === 0 ? "ok" : "FINDINGS",
      findings: rep.totalFindings,
      sequence: probes.headingOrder ? probes.headingOrder.sequence : null,
      scanned: probes.headingOrder ? probes.headingOrder.scanned : null,
      detail: Object.keys(probes).filter(function (k) { return probes[k].status === "FINDINGS"; })
        .map(function (k) { return { probe: k, findings: probes[k].findings }; }),
      // The FULL probe status set, not just the ones that fired. Until item 112 every sweep in
      // AGENT_LOG.md was read for headingOrder alone, so a probe that had quietly been VACUOUS
      // on every screen for weeks would have looked exactly like a probe that kept passing.
      probeStatus: Object.keys(probes).reduce(function (acc, k) { acc[k] = probes[k].status; return acc; }, {}),
      vacuous: rep.vacuous, unavailable: rep.unavailable, verdict: rep.verdict,
      env: env()
    };
  }

  // The storage a state's screen is a function of, read straight from localStorage. Reported
  // verbatim on a precondition failure so the operator sees WHAT was ambient, not just that
  // something was.
  function storageNow() {
    return {
      completed: localStorage.getItem("ecycles_completed_lessons"),
      review: localStorage.getItem("ecycles_review"),
      streak: localStorage.getItem("ecycles_streak"),
      // Added 2026-08-26 (item 119). A PRECONDITION report quotes this object, so a key that a
      // state declares and this omits produces a failure report that does not contain the reason
      // for the failure — the operator reads three empty-looking values and no cause.
      bookmarks: localStorage.getItem("ecycles_glossary_bookmarks")
    };
  }

  // A key is "empty" when absent, or present as an empty array/object. useAppState writes `[]`
  // for completedLessons on first mount (measured), so `null` alone is not the cold signature.
  function emptyKey(raw) {
    if (raw === null || raw === "") return true;
    try { var v = JSON.parse(raw); return !v || (Array.isArray(v) ? v.length === 0 : Object.keys(v).length === 0); }
    catch (e) { return false; }
  }

  function drive(state) {
    // ── PRECONDITION, checked before a single step runs (2026-08-26, item 118) ────────────────
    // A recipe plus an arrival assertion identifies a ROUTE. It does not identify a SCREEN,
    // because several screens here are functions of localStorage, and `drive()` never touches
    // storage — `clear`/`seed` are honored only by begin(), the reload path. So for the 13
    // no-reload states, storage was whatever the page happened to load with, and nothing said so.
    //
    // MEASURED, not reasoned: `practice-landing` renders three different cards — "Nothing to
    // review yet" (review absent), "You're all caught up" (seen, none due), "1 ready to review"
    // + Start Quiz (due) — and its arrival assertion (`#how-review-title` exists) is satisfied by
    // ALL THREE. Each reported `status: "ok", findings: 0`. That is the same lying zero this
    // file's header catalogues: not "the sweep missed the screen" but "the sweep found a screen
    // and the report named a different one".
    //
    // This is also the mechanism that hid item 117a for four weeks. The one prior live check of
    // that card (AGENT_LOG.archive.md:1921) seeded a review entry first and truthfully reported
    // the string it saw; the false never-started copy was never on screen. The fixture and the
    // bug were the same shape.
    //
    // So storage is declared, and asserted — never set. Setting it would be a lie of a different
    // kind: the app reads localStorage at mount only, and useAppState holds review state in React
    // afterwards, so a mid-session write changes the store and not the screen.
    if (state.requires && !state.requires.is()) {
      return Promise.resolve({
        state: state.name, status: "PRECONDITION", findings: null,
        needed: state.requires.says, storage: storageNow(),
        fix: "reload the page from cleared storage, then re-eval both files and re-run"
      });
    }
    return runSteps(state.steps)
      .then(function () {
        // One last bounded wait before declaring a miss: the steps are done, but the render they
        // triggered may not have committed. Waiting HERE rather than sprinkling settles into the
        // recipes keeps the assertion the single place that decides whether we arrived.
        return waitUntil(function () { return state.arrived.is(); }).then(function () { return state; });
      })
      .then(function (state) {
        if (!state.arrived.is()) {
          // The whole reason this file exists. Never fall through to a sweep here.
          return { state: state.name, status: "MISSED", findings: null,
            expected: state.arrived.says,
            sawInstead: { headings: headingTags().map(function (h) { return h.tagName + ":" + (h.innerText || "").replace(/\n/g, " ").slice(0, 40); }),
                          hash: location.hash, mainStart: mainText().replace(/\n/g, " | ").slice(0, 120) } };
        }
        var r = sweepHere(state);
        r.arrived = state.arrived.says;
        if (state.note) r.note = state.note;
        return r;
      })
      .catch(function (e) {
        return { state: state.name, status: "MISSED", findings: null,
          expected: state.arrived.says, threw: String(e && e.message || e),
          sawInstead: { hash: location.hash, mainStart: mainText().replace(/\n/g, " | ").slice(0, 120) } };
      });
  }

  function applySeed(state) {
    if (state.clear) localStorage.clear();
    Object.keys(state.seed || {}).forEach(function (k) { localStorage.setItem(k, state.seed[k]); });
  }

  /* ── the storage-dependence audit (item 119) ───────────────────────────────────────────────
   * `requires` is OPT-IN, so a state that SHOULD declare COLD and does not just keeps reporting
   * `ok`. Three states declare it; the other nine were judged storage-independent by READING
   * them. This converts those nine judgments into nine measurements: drive every no-reload state
   * cold, snapshot <main>, then do it again from a warm store and diff. A state whose DOM is
   * byte-identical across the two is provably not a function of learner storage; the rest need
   * `requires`.
   *
   * WHY THE FIXTURE IS NINE KEYS AND NOT TWELVE — a correction to the item as filed. Item 119
   * says "with every declared key populated". Taken literally that includes `ecycles_lang`,
   * `ecycles_theme_mode` and `ecycles_font_scale`, which restyle or re-translate EVERY screen —
   * so every state would differ and the audit would return an all-positive result that
   * distinguishes nothing. Those three are presentation preferences, already swept as explicit
   * axes (sweepLangs' language axis and setFontScale, item 112). The nine below are the
   * LEARNER-STATE keys, which is the class `requires` exists to pin down.
   *
   * EVERY VALUE HERE HAS TO BE A SHAPE THE APP ACTUALLY READS, not merely a non-empty string.
   * `storage.js`'s readers all take a fallback and swallow a parse failure, so a malformed
   * fixture value does not throw — it silently degrades to the COLD default, and the state it
   * was supposed to warm then reports "provably storage-independent". A junk fixture and a
   * genuinely independent screen produce the same row. Shapes checked against their readers:
   * `loadStreak` destructures `{ count, lastDate }` (storage.js:25), `continuePref` is
   * `{ optedIn, lastPromptDate }` (useAppState.js:222), `completedLessons` is an id array and
   * ids 1-3 exist (the `essentials` track), glossary bookmarks are glossary KEYS.
   *
   * `lastDate` is TODAY, computed the way src/utils/date.js computes it — local getFullYear/
   * getMonth/getDate, never `toISOString().slice(0,10)`, which is check-data.mjs §23's banned
   * idiom. It has to be today because `loadStreak` reports 0 for a gap of more than one day, so
   * seeding LONG_PAST_DUE here would warm the key and still render no chip. */
  function todayLocal() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  var WARM_FIXTURE = {
    ecycles_seen_disclaimer: "true",
    ecycles_completed_lessons: JSON.stringify([1, 2, 3]),
    ecycles_streak: JSON.stringify({ count: 4, lastDate: todayLocal() }),
    ecycles_continue_pref: JSON.stringify({ optedIn: true, lastPromptDate: todayLocal() }),
    // LONG_PAST_DUE, so these are DUE — the "N ready to review" card rather than "all caught up".
    ecycles_review: seededReview(3),
    ecycles_analytics_log: JSON.stringify([{ event: "audit_fixture", ts: LONG_PAST_DUE }]),
    ecycles_legacy_lesson_id_migrated: "true",
    ecycles_seen_practice_coachmark: "true",
    // The live candidate item 119 names: a bookmarked row renders a second aria-label form
    // (`${term}, ${t.bookmarkedLabel}`) plus a bookmark icon. Must be a term the list renders.
    ecycles_glossary_bookmarks: JSON.stringify(["Inflation"])
  };
  // Deliberately NOT in the fixture, and named so the exclusion is reviewable rather than an
  // oversight. If one of these ever stops being a pure presentation preference, it belongs above.
  var FIXTURE_EXCLUDES = ["ecycles_lang", "ecycles_theme_mode", "ecycles_font_scale"];

  // Did the fixture survive the reload? Byte-equality for eight of the nine — but NOT for
  // `ecycles_analytics_log`, and the exception is a measurement rather than a concession.
  // MEASURED 2026-08-26: the first auditFinish() reported FIXTURE-NOT-APPLIED naming exactly that
  // key, because `analytics.js` appends an `app_opened` event on every mount. So the log is
  // append-only and its post-reload value is NEVER the value written before the reload; asserting
  // equality there would fail this audit forever, for a reason that has nothing to do with the
  // audit. The honest assertion for an append-only key is that the seeded entry is still IN it.
  function fixtureHolds(key) {
    var got = localStorage.getItem(key);
    if (got === null) return false;
    if (key === "ecycles_analytics_log") return got.indexOf("audit_fixture") >= 0;
    return got === WARM_FIXTURE[key];
  }

  // The snapshot. <main> is the screen; the header (language <select>) and the tab bar sit
  // outside it and are not what a state names. Normalized only for whitespace — anything more
  // aggressive would be the instrument deciding in advance which differences do not count.
  function snapshotMain() {
    var m = document.querySelector("main") || document.getElementById("root");
    return m ? m.outerHTML.replace(/\s+/g, " ").trim() : "";
  }

  // Drive every no-reload state, ignoring `requires` — the audit is measuring the very side of
  // the precondition that drive() is built to refuse, so it has to step around it. The bypass is
  // a shallow copy with `requires` dropped, never a mutation of the state itself.
  function auditPass() {
    var out = [], chain = Promise.resolve();
    STATES.filter(function (s) { return !s.reload; }).forEach(function (s) {
      var bare = {};
      Object.keys(s).forEach(function (k) { if (k !== "requires") bare[k] = s[k]; });
      chain = chain.then(function () { return drive(bare); }).then(function (r) {
        out.push({ state: s.name, declares: s.requires ? s.requires.says : null,
                   reached: r.status !== "MISSED", status: r.status, dom: snapshotMain() });
      });
    });
    return chain.then(function () { return out; });
  }

  function byName(pass) {
    var m = {}; pass.forEach(function (r) { m[r.state] = r; }); return m;
  }

  // Where two snapshots first diverge, with a little context each side. A boolean "differs" is
  // not enough to act on: the point of the audit is to write a `requires` declaration, and that
  // needs to name WHAT varies.
  function firstDelta(a, b) {
    if (a === b) return null;
    var i = 0, min = Math.min(a.length, b.length);
    while (i < min && a[i] === b[i]) i++;
    return { atChar: i, lenCold: a.length, lenWarm: b.length,
             cold: a.slice(Math.max(0, i - 40), i + 90), warm: b.slice(Math.max(0, i - 40), i + 90) };
  }

  /* ── public surface ─────────────────────────────────────────────────────────────────────── */
  window.A11yStates = {
    list: function () {
      return JSON.stringify(STATES.map(function (s) {
        return { name: s.name, reload: !!s.reload, proves: s.arrived.says, note: s.note || null };
      }), null, 2);
    },

    // One state that needs no reload.
    run: function (name) {
      var s = find(name);
      if (!s) return Promise.resolve(JSON.stringify({ error: "unknown state: " + name }));
      if (s.reload) return Promise.resolve(JSON.stringify({ error: name + " needs a reload — use begin('" + name + "') then finish()." }));
      return drive(s).then(function (r) { return JSON.stringify(r, null, 2); });
    },

    // Every state that needs no reload, in one call. MISSED is counted separately from clean on
    // purpose: a run log must never be able to read "all zero" over a state it never reached.
    runAll: function () {
      var out = [], chain = Promise.resolve();
      STATES.filter(function (s) { return !s.reload; }).forEach(function (s) {
        chain = chain.then(function () { return drive(s); }).then(function (r) { out.push(r); });
      });
      return chain.then(function () {
        var missed = out.filter(function (r) { return r.status === "MISSED"; });
        var findings = out.filter(function (r) { return r.status === "FINDINGS"; });
        // Counted apart from both clean and missed. A precondition failure is not "we could not
        // get there" — the screen rendered fine. It is "the screen that rendered is not the one
        // this state names", which a reader skimming for zeros cannot tell from a pass.
        var precon = out.filter(function (r) { return r.status === "PRECONDITION"; });
        return JSON.stringify({
          env: env(),
          probeTally: probeTally(out),
          swept: out.length,
          clean: out.filter(function (r) { return r.status === "ok"; }).length,
          withFindings: findings.length,
          missed: missed.length,
          preconditionFailed: precon.length,
          verdict: precon.length
            ? precon.length + " state(s) had the WRONG STORAGE — reload from cleared storage and re-run; these zeros describe a different screen"
            : missed.length
            ? missed.length + " state(s) NOT REACHED — their zeros do not exist, fix the recipes first"
            : findings.length + " state(s) with findings, " + out.length + " reached and swept",
          skippedNeedingReload: STATES.filter(function (s) { return s.reload; }).map(function (s) { return s.name; }),
          states: out
        }, null, 2);
      });
    },

    // Seeded states: localStorage is only read at mount, so this reloads the page.
    // opts: { lang, fontScale } — the axes, for states that must be reached through a reload.
    // sweepLangs() cannot cover these (it switches language in place, and these states are gone
    // the moment the page reloads), so without this the six reload-gated states would be stuck in
    // `en` at 100% forever — which is exactly the coverage gap item 112 exists to close.
    // Seeded through the same localStorage keys the app reads at mount, then ASSERTED by finish()
    // via the env stamp on the result, so a seed that did not take is visible rather than assumed.
    begin: function (name, opts) {
      var s = find(name);
      if (!s) return JSON.stringify({ error: "unknown state: " + name });
      if (!s.reload) return JSON.stringify({ error: name + " needs no reload — call run('" + name + "')." });
      applySeed(s);
      if (opts && opts.lang) localStorage.setItem("ecycles_lang", opts.lang);
      // fontScale is given as a PERCENT here (130), to match setFontScale(130) and the control's
      // own "130%" aria-label — but the app stores a FRACTION: theme.js's FONT_SCALE_STEPS are
      // 0.9 / 1 / 1.15 / 1.3, and loadFontScale() silently falls back to 1 for anything not in
      // that list. Seeding "130" therefore produced a 100% page that a naive runner would have
      // reported as a 130% sweep. Caught by finish()'s axis assertion, not by reading the code.
      if (opts && opts.fontScale) localStorage.setItem("ecycles_font_scale", String(opts.fontScale / 100));
      if (opts && (opts.lang || opts.fontScale)) sessionStorage.setItem(PENDING_AXES, JSON.stringify(opts));
      sessionStorage.setItem(PENDING_KEY, name);
      location.replace(location.pathname + "?a11ystates=" + encodeURIComponent(name) + (s.hash || ""));
      return JSON.stringify({ seeded: name, axes: (opts || null), reloading: true, then: "re-eval both files, then await A11yStates.finish()" });
    },

    finish: function () {
      var name = sessionStorage.getItem(PENDING_KEY);
      if (!name) return Promise.resolve(JSON.stringify({ error: "no pending state — call begin(<name>) first." }));
      var s = find(name);
      var axes = null;
      try { axes = JSON.parse(sessionStorage.getItem(PENDING_AXES) || "null"); } catch (e) { axes = null; }
      sessionStorage.removeItem(PENDING_KEY);
      sessionStorage.removeItem(PENDING_AXES);
      if (!s) return Promise.resolve(JSON.stringify({ error: "pending state no longer defined: " + name }));
      return drive(s).then(function (r) {
        // Assert the requested axes actually took. A seed that silently failed would otherwise
        // hand back a clean `en` result wearing a `ja` label — the axis lying zero, one reload
        // further along than the one setLang() guards.
        if (axes) {
          r.axesRequested = axes;
          var wantLang = axes.lang ? (HTML_LANG[axes.lang] || axes.lang) : null;
          var wantPx = axes.fontScale ? 16 * (axes.fontScale / 100) : null;
          var bad = [];
          if (wantLang && r.env && r.env.htmlLang !== wantLang) bad.push("lang is " + (r.env && r.env.htmlLang) + ", expected " + wantLang);
          if (wantPx && r.env && Math.abs(r.env.rootFontSizePx - wantPx) > 0.5) bad.push("root font-size is " + (r.env && r.env.rootFontSizePx) + "px, expected ~" + wantPx);
          if (bad.length) { r.status = "AXES-NOT-APPLIED"; r.findings = null; r.axesProblem = bad; }
        }
        return JSON.stringify(r, null, 2);
      });
    },

    // ── the storage-dependence audit (item 119) ─────────────────────────────────────────────
    // Two calls, because localStorage is read at mount: auditBegin() from a COLD page, then
    // re-eval both files after the reload and call auditFinish().
    //
    // auditBegin() takes the cold snapshot TWICE and requires the two to be byte-identical
    // before it will go on. That is the negative control, and it is the one this audit cannot
    // do without: the measurement is a byte diff, so any incidental instability in the DOM
    // (a timestamp, a random id, an unsettled render) would report every state as
    // storage-dependent and look exactly like a thorough result.
    auditBegin: function () {
      if (!COLD.is()) {
        return Promise.resolve(JSON.stringify({
          error: "auditBegin needs a COLD page — the cold half is the baseline",
          storage: storageNow(), fix: "localStorage.clear(), reload, re-eval both files, retry"
        }, null, 2));
      }
      return auditPass().then(function (a) {
        return auditPass().then(function (b) {
          var mb = byName(b);
          var unstable = a.filter(function (r) { return mb[r.state] && mb[r.state].dom !== r.dom; })
                          .map(function (r) { return r.state; });
          var missed = a.filter(function (r) { return !r.reached; }).map(function (r) { return r.state; });
          if (unstable.length || missed.length) {
            return JSON.stringify({
              status: "INSTRUMENT-NOT-USABLE",
              stabilityControl: "FAIL",
              unstableStates: unstable, missedStates: missed,
              verdict: "cold-vs-cold was not byte-identical (or a state was not reached), so a cold-vs-warm diff would be noise. Fix before reading any result.",
              sample: unstable.length ? firstDelta(byName(a)[unstable[0]].dom, mb[unstable[0]].dom) : null
            }, null, 2);
          }
          var stored = true;
          try {
            sessionStorage.setItem(AUDIT_KEY, JSON.stringify(a.map(function (r) {
              return { state: r.state, declares: r.declares, dom: r.dom };
            })));
          } catch (e) {
            stored = false;
            sessionStorage.setItem(AUDIT_KEY, JSON.stringify(a.map(function (r) {
              return { state: r.state, declares: r.declares, domLen: r.dom.length, dom: null };
            })));
          }
          Object.keys(WARM_FIXTURE).forEach(function (k) { localStorage.setItem(k, WARM_FIXTURE[k]); });
          location.replace(location.pathname);
          return JSON.stringify({
            status: "COLD-CAPTURED",
            stabilityControl: "PASS — " + a.length + " state(s), cold vs cold byte-identical",
            captured: a.length, fullSnapshotsStored: stored,
            warmFixtureKeys: Object.keys(WARM_FIXTURE), excludedKeys: FIXTURE_EXCLUDES,
            reloading: true, then: "re-eval both files, then await A11yStates.auditFinish()"
          }, null, 2);
        });
      });
    },

    auditFinish: function () {
      var raw = sessionStorage.getItem(AUDIT_KEY);
      if (!raw) return Promise.resolve(JSON.stringify({ error: "no cold baseline — call auditBegin() from a cold page first." }));
      var cold;
      try { cold = JSON.parse(raw); } catch (e) { return Promise.resolve(JSON.stringify({ error: "cold baseline unreadable: " + e.message })); }
      // The warm half has to prove it is warm, for the same reason the cold half does. A fixture
      // that silently failed to apply would make every state look storage-independent — the
      // exact lying zero this audit exists to close, one level up.
      var applied = Object.keys(WARM_FIXTURE).filter(fixtureHolds);
      if (applied.length !== Object.keys(WARM_FIXTURE).length) {
        return Promise.resolve(JSON.stringify({
          status: "FIXTURE-NOT-APPLIED", applied: applied,
          missing: Object.keys(WARM_FIXTURE).filter(function (k) { return applied.indexOf(k) < 0; }),
          verdict: "the warm store is not the fixture, so every 'identical' below would be meaningless"
        }, null, 2));
      }
      sessionStorage.removeItem(AUDIT_KEY);
      return auditPass().then(function (warm) {
        var mw = byName(warm);
        var rows = cold.map(function (c) {
          var w = mw[c.state];
          var same = w && (c.dom === null ? null : c.dom === w.dom);
          return {
            state: c.state,
            declaresRequires: !!c.declares,
            reachedWarm: !!(w && w.reached),
            dependsOnStorage: same === null ? "UNKNOWN (baseline truncated)" : !same,
            // The two cases that matter, named rather than left to the reader:
            // an undeclared state that varies is a GAP; a declared one that does not is DEAD.
            verdict: same === null ? "unknown"
              : (!same && !c.declares) ? "GAP — varies with learner storage and declares nothing"
              : (same && c.declares) ? "OVER-DECLARED — declares COLD but does not vary"
              : (!same && c.declares) ? "correctly declared"
              : "provably storage-independent",
            delta: (same === false && c.dom !== null) ? firstDelta(c.dom, w.dom) : null
          };
        });
        var gaps = rows.filter(function (r) { return r.verdict.indexOf("GAP") === 0; });
        var over = rows.filter(function (r) { return r.verdict.indexOf("OVER") === 0; });
        var varies = rows.filter(function (r) { return r.dependsOnStorage === true; });
        return JSON.stringify({
          status: "AUDITED",
          fixtureApplied: applied.length + "/" + Object.keys(WARM_FIXTURE).length,
          excludedKeys: FIXTURE_EXCLUDES,
          audited: rows.length,
          varyWithStorage: varies.length,
          provablyIndependent: rows.length - varies.length,
          // The POSITIVE control. The three states that already declare COLD were measured to
          // branch (item 118). If none of them varies here, the fixture is not reaching the app
          // and every "provably independent" row is a lying zero.
          positiveControl: rows.filter(function (r) { return r.declaresRequires; }).every(function (r) { return r.dependsOnStorage === true; })
            ? "PASS — every already-declared state varies under the fixture"
            : "FAIL — a state known to branch on storage did not vary; the fixture is not reaching the app",
          gaps: gaps.map(function (r) { return { state: r.state, delta: r.delta }; }),
          overDeclared: over.map(function (r) { return r.state; }),
          verdict: gaps.length
            ? gaps.length + " state(s) vary with learner storage and declare nothing — they need `requires`"
            : "every undeclared state is provably storage-independent under the fixture",
          rows: rows
        }, null, 2);
      });
    },

    // Proves the MISSED path works. A driver that cannot detect its own miss turns every recipe
    // into a lying zero, so this is the same contract A11ySweep.selftest() has: the control must
    // fire before any zero from this file means anything.
    selftest: function () {
      var bogus = {
        name: "__selftest_unreachable",
        steps: [{ hash: "#/reference" }],
        arrived: { says: "a heading that does not exist anywhere in this app",
          is: function () { return hasHeading("ZZ_NO_SUCH_HEADING_ZZ"); } }
      };
      var badVerb = {
        name: "__selftest_badstep",
        steps: [{ click: "ZZ_NO_SUCH_CONTROL_ZZ" }],
        arrived: { says: "unreachable", is: function () { return true; } }
      };
      // The AXIS control (item 112). A language switch that fails silently is the worst lying
      // zero available here — every state afterwards reports clean, in the previous language,
      // labelled as the requested one. This proves setLang() refuses rather than returns.
      //
      // It works by detaching the <select> and restoring it, NOT by asking for a bogus language.
      // Asking for one was tried first and is a bad control: a native <select> rejects an unknown
      // value by going to "", the app stores that empty string, and the whole screen drops into
      // its error boundary. (Recoverable — loadLang() validates on the next load and falls back
      // to `en` — but a control must not put the subject in a state the UI cannot reach.)
      function axisControl() {
        var sel = document.querySelector("header select");
        if (!sel) return Promise.resolve({ ran: false, why: "no <select> to detach" });
        var parent = sel.parentNode, next = sel.nextSibling;
        sel.remove();
        return setLang("ja")
          .then(function () { return { ran: true, rejected: false }; })
          .catch(function (e) { return { ran: true, rejected: true, threw: String(e && e.message || e) }; })
          .then(function (r) { parent.insertBefore(sel, next); return r; });
      }

      // The PRECONDITION control (item 118), and it is deliberately TWO-SIDED. A gate that always
      // fires and a gate that never fires are both lying results, and only one of the two is
      // caught by asking "did it fire?". So: one state whose storage requirement cannot hold, one
      // whose requirement cannot fail, and the pair has to come back different.
      //
      // The failing one carries a step that THROWS. If it still reports PRECONDITION rather than
      // MISSED, that proves the gate ran BEFORE the recipe — which is the whole point of it:
      // a state in the wrong storage must not touch the page at all, because its steps are what
      // would mutate storage for the states after it.
      var preconFails = {
        name: "__selftest_precondition_fails",
        requires: { says: "a condition that cannot hold", is: function () { return false; } },
        steps: [{ click: "ZZ_NO_SUCH_CONTROL_ZZ" }],
        arrived: { says: "unreachable", is: function () { return true; } }
      };
      var preconHolds = {
        name: "__selftest_precondition_holds",
        requires: { says: "a condition that cannot fail", is: function () { return true; } },
        steps: [{ hash: "#/reference" }],
        arrived: { says: "the Reference menu rendered",
          is: function () { return mainButtons().length === 5; } }
      };

      return drive(bogus).then(function (a) {
        return drive(badVerb).then(function (b) {
          return drive(preconFails).then(function (d) {
            return drive(preconHolds).then(function (e) {
              return axisControl().then(function (c) {
                var preconOk = d.status === "PRECONDITION" && d.findings === null && !d.threw &&
                               e.status !== "PRECONDITION";
                var ok = a.status === "MISSED" && b.status === "MISSED" && !!b.threw &&
                         a.findings === null && b.findings === null && preconOk &&
                         (c.ran ? c.rejected === true : true);
                return JSON.stringify({
                  unreachableAssertion: { status: a.status, findingsIsNull: a.findings === null },
                  failingStep: { status: b.status, threw: b.threw, findingsIsNull: b.findings === null },
                  preconditionRefuses: { status: d.status, needed: d.needed, findingsIsNull: d.findings === null,
                    ranStepsAnyway: !!d.threw, storage: d.storage },
                  preconditionAllows: { status: e.status },
                  bothSidesDiffer: preconOk,
                  axisAssertion: c,
                  verdict: ok
                    ? "PASS — a state that is not reached reports MISSED with null findings (assertion failure AND step throw), a state in the wrong storage reports PRECONDITION without running its steps while a satisfiable one does not, and setLang refuses when it cannot confirm the switch. Zeros from run()/runAll()/sweepLangs() are meaningful this session."
                    : "FAIL — a control did not fire; every recipe and every language row in this file is an unverified zero until this passes."
                }, null, 2);
              });
            });
          });
        });
      });
    },

    // ── the axes ──────────────────────────────────────────────────────────────────────────
    setLang: function (code) { return setLang(code).then(function (c) { return JSON.stringify({ lang: c, env: env() }); }); },
    setFontScale: function (pct) { return setFontScale(pct).then(function (r) { return JSON.stringify({ fontScale: r, env: env() }); }); },
    env: function () { return JSON.stringify(env(), null, 2); },

    // Run every no-reload state in each language, in ONE call. The language is switched through
    // the app's own <select> and re-asserted per language, so a switch that fails aborts that
    // language loudly instead of quietly re-measuring the previous one.
    //
    // Font scale is NOT looped here: it is a separate call (setFontScale) because it navigates.
    // Set it first, then call this; every row carries the observed root font size, so the pairing
    // is visible in the output rather than remembered by the operator.
    sweepLangs: function (opts) {
      var langs = (opts && opts.langs) || ["en", "es", "ko", "zh", "ja"];
      var byLang = [], chain = Promise.resolve();
      langs.forEach(function (L) {
        chain = chain.then(function () {
          return setLang(L).then(function () {
            var out = [], inner = Promise.resolve();
            STATES.filter(function (s) { return !s.reload; }).forEach(function (s) {
              inner = inner.then(function () { return drive(s); }).then(function (r) { out.push(r); });
            });
            return inner.then(function () {
              byLang.push({
                lang: L, env: env(),
                swept: out.length,
                clean: out.filter(function (r) { return r.status === "ok"; }).length,
                missed: out.filter(function (r) { return r.status === "MISSED"; }).length,
                preconditionFailed: out.filter(function (r) { return r.status === "PRECONDITION"; }).length,
                withFindings: out.filter(function (r) { return r.status === "FINDINGS"; }).length,
                probeTally: probeTally(out),
                findings: out.filter(function (r) { return r.status === "FINDINGS"; })
                  .map(function (r) { return { state: r.state, detail: r.detail }; }),
                missedStates: out.filter(function (r) { return r.status === "MISSED"; })
                  .map(function (r) { return { state: r.state, expected: r.expected, threw: r.threw }; })
              });
            });
          });
        }).catch(function (e) {
          // A failed language is recorded as a failed language, never skipped: an absent row and
          // a clean row are the same thing to a reader skimming for zeros.
          byLang.push({ lang: L, status: "LANG-SWITCH-FAILED", threw: String(e && e.message || e), env: env() });
        });
      });
      return chain.then(function () {
        var bad = byLang.filter(function (r) { return r.status === "LANG-SWITCH-FAILED" || r.missed || r.preconditionFailed || r.withFindings; });
        return JSON.stringify({
          langsRequested: langs,
          langsMeasured: byLang.filter(function (r) { return r.status !== "LANG-SWITCH-FAILED"; }).map(function (r) { return r.env.htmlLang; }),
          verdict: bad.length === 0
            ? "all " + langs.length + " language(s) swept, every state reached in the storage it declares, 0 findings"
            : bad.length + " language(s) with a finding, a missed state, wrong storage, or a failed switch — see rows",
          byLang: byLang
        }, null, 2);
      });
    },

    states: STATES.map(function (s) { return s.name; })
  };
})();
