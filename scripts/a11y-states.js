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
 * recipe (seed, hash, steps) plus — and this is the load-bearing half — an ARRIVAL ASSERTION.
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
 *   A11yStates.selftest()       // proves a MISSED state is actually detected as MISSED
 *   await A11yStates.runAll()   // every state that needs no reload, one call
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
    // trust: a runner that stops advancing must end the loop, not spin. The continue control is
    // "Next" for every question except the last, where it is "See Results" — found the hard way.
    answer: function (n) {
      var done = 0, guard = 0;
      function step() {
        if (done >= n || guard++ > n * 4) return Promise.resolve();
        if (!counter()) return Promise.resolve();          // left the runner (pause/complete)
        var next = byText("Next", true) || byText("See Results", true);
        if (next) { next.click(); done++; return settle().then(step); }
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

  var STATES = [
    { name: "first-run-modal", reload: true, clear: true, hash: "#/learn",
      note: "item 110 — the only screen with 100% reach; the dialog must isolate the app behind it",
      arrived: { says: 'a [role=dialog] is present and owns the only heading',
        is: function () { return !!document.querySelector('[role="dialog"][aria-modal="true"]') && headingTags().length === 1; } } },

    { name: "learn", steps: [{ clickIfPresent: "Got it" }, { hash: "#/learn" }],
      arrived: { says: 'Learn shows its three track headings',
        is: function () { return hasHeading("How the Economy Works") && hasHeading("Thinking About Money"); } } },

    { name: "learn-collapsed", steps: [{ hash: "#/learn" }, { collapseTracks: true }],
      arrived: { says: 'no track section reports aria-expanded="true"',
        is: function () { return document.querySelectorAll('[aria-expanded="true"]').length === 0 &&
                                 document.querySelectorAll('[aria-expanded="false"]').length > 0; } } },

    { name: "reference", steps: [{ hash: "#/reference" }],
      arrived: { says: 'the Reference menu lists its five sub-screens',
        is: function () { return !!byText("Market Dashboard") && !!byText("Sector performance"); } } },

    { name: "reference-glossary", steps: [{ hash: "#/reference" }, { click: "Glossary" }],
      arrived: { says: 'the glossary term list is rendered',
        is: function () { return document.querySelectorAll('[role="button"][aria-label]').length > 10; } } },

    { name: "reference-glossary-term",
      steps: [{ hash: "#/reference" }, { click: "Glossary" }, { click: "Gross Domestic Product" }],
      arrived: { says: 'a term detail is open (Back crumb + the term as a heading)',
        is: function () { return hasHeading("Gross Domestic Product") && !!byText("Reference", true); } } },

    { name: "reference-markets", steps: [{ hash: "#/reference" }, { click: "Market Dashboard" }],
      arrived: { says: 'the yield-curve teaching section is present',
        is: function () { return hasHeading("Yield Curve Shapes"); } } },

    // The assertion is the SCREEN, not its data. An earlier version required the "The economy
    // right now" panel and reported MISSED on a screen it had plainly reached — that panel is
    // data-dependent, and §2.3's standing rule is that figures older than 4 days are SUPPRESSED
    // rather than shown. Asserting on suppressible data makes a correct screen look unreachable.
    { name: "reference-sectors", steps: [{ hash: "#/reference" }, { click: "Sector performance" }],
      arrived: { says: 'the Sector performance sub-screen is open (its own <h1>, not the menu row)',
        is: function () { var h = headingTags()[0];
          return !!h && h.tagName === "H1" && (h.innerText || "").indexOf("Sector performance") !== -1; } } },

    { name: "reference-kids", steps: [{ hash: "#/reference" }, { click: "Kids" }],
      arrived: { says: 'the 5-8 band is the selected tab',
        is: function () { var t = byText("Ages 5-8"); return !!t && t.getAttribute("aria-selected") === "true"; } } },

    { name: "reference-kids-9-12",
      steps: [{ hash: "#/reference" }, { click: "Kids" }, { clickExact: "Ages 9-12" }],
      note: "item 111 — the age selector swaps panels with no route change",
      arrived: { says: 'the 9-12 band is selected AND the panel label followed it',
        is: function () {
          var t = byText("Ages 9-12"), p = document.getElementById("age-band-panel");
          return !!t && t.getAttribute("aria-selected") === "true" &&
                 !!p && p.getAttribute("aria-labelledby") === "age-band-9-12";
        } } },

    { name: "reference-kids-13-17",
      steps: [{ hash: "#/reference" }, { click: "Kids" }, { clickExact: "Ages 13-17" }],
      arrived: { says: 'the 13-17 band is selected AND the panel label followed it',
        is: function () {
          var t = byText("Ages 13-17"), p = document.getElementById("age-band-panel");
          return !!t && t.getAttribute("aria-selected") === "true" &&
                 !!p && p.getAttribute("aria-labelledby") === "age-band-13-17";
        } } },

    { name: "reference-about", steps: [{ hash: "#/reference" }, { click: "About" }],
      arrived: { says: 'the About screen is open',
        is: function () { return hasHeading("About") && mainText().indexOf("Reference") !== -1; } } },

    // The lesson reader. item 106's defect lived in the UNFINISHED state only, so "the hook is
    // present" is the assertion that matters — a completed lesson does not render it.
    // reload+clear, not a bare hash: "unfinished" is a property of STORAGE, not of the URL. The
    // first run of this file drove here on a session where lesson 1 had already been completed,
    // and the recipe reported MISSED rather than sweeping a completed lesson and calling the
    // unfinished state clean. Clearing is the only guarantee that the hook is rendered at all.
    { name: "lesson-unfinished", reload: true, clear: true, hash: "#/lesson/1",
      steps: [{ clickIfPresent: "Got it" }],
      note: "item 106 — the hook block only exists before the lesson is completed",
      arrived: { says: 'the BEFORE YOU READ hook is rendered (i.e. lesson not yet complete)',
        is: function () { return headingTags().some(function (h) {
          return (h.innerText || "").toUpperCase().indexOf("BEFORE YOU READ") !== -1; }); } } },

    // radio index 4 is the check question's first option: the unfinished reader renders EIGHT
    // radios (four for the BEFORE YOU READ hook, four for the check). On a completed lesson the
    // hook is gone, there are only four, and the step throws rather than answering the hook by
    // mistake — which is why this state carries the same clear as lesson-unfinished.
    { name: "lesson-midquiz", reload: true, clear: true, hash: "#/lesson/1",
      steps: [{ clickIfPresent: "Got it" }, { radio: 4 }],
      note: "item 111 — the end-of-lesson check answered, explanation revealed",
      arrived: { says: 'the check question has a chosen answer and Mark Complete has appeared',
        is: function () { return radios().some(function (r) { return r.getAttribute("aria-checked") === "true"; }) &&
                                 !!byText("Mark Complete"); } } },

    { name: "practice-landing", steps: [{ hash: "#/practice" }],
      arrived: { says: 'the Review landing shows its "how review works" panel',
        is: function () { return hasHeading("How review works"); } } },

    { name: "practice-all-questions",
      steps: [{ hash: "#/practice" }, { click: "Practice all questions" }],
      note: "item 109's open question — this entrance renders the same runner branch as Start Quiz",
      arrived: { says: 'a quiz is running: counter, progress bar and four options',
        is: function () { return !!counter() && document.querySelectorAll('[role="progressbar"]').length === 1 &&
                                 radios().length === 4; } } },

    { name: "practice-runner", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice", steps: [{ clickIfPresent: "Got it" }, { click: "Start Quiz" }],
      arrived: { says: 'a seeded session is running at question 1 of 14',
        is: function () { var c = counter(); return !!c && c.at === 1 && c.of === 14 && radios().length === 4; } } },

    { name: "practice-batch-pause", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice", steps: [{ clickIfPresent: "Got it" }, { click: "Start Quiz" }, { answer: 10 }],
      note: "BATCH_SIZE is 10, so a 14-question queue is the smallest that reaches a pause",
      arrived: { says: 'the batch pause offers "Keep going" and the counter is gone',
        is: function () { return !counter() && !!byText("Keep going") && !!byText("Stop here"); } } },

    { name: "practice-complete", reload: true, clear: true, seed: { ecycles_review: seededReview(14) },
      hash: "#/practice",
      steps: [{ clickIfPresent: "Got it" }, { click: "Start Quiz" }, { answer: 10 }, { click: "Keep going" }, { answer: 4 }],
      arrived: { says: 'the session-complete card is shown with a score line',
        is: function () { return !counter() && !!byText("Done") &&
                                 /\d+\s+of\s+\d+/.test(mainText()); } } }
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
      vacuous: rep.vacuous, unavailable: rep.unavailable, verdict: rep.verdict
    };
  }

  function drive(state) {
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
        return JSON.stringify({
          swept: out.length,
          clean: out.filter(function (r) { return r.status === "ok"; }).length,
          withFindings: findings.length,
          missed: missed.length,
          verdict: missed.length
            ? missed.length + " state(s) NOT REACHED — their zeros do not exist, fix the recipes first"
            : findings.length + " state(s) with findings, " + out.length + " reached and swept",
          skippedNeedingReload: STATES.filter(function (s) { return s.reload; }).map(function (s) { return s.name; }),
          states: out
        }, null, 2);
      });
    },

    // Seeded states: localStorage is only read at mount, so this reloads the page.
    begin: function (name) {
      var s = find(name);
      if (!s) return JSON.stringify({ error: "unknown state: " + name });
      if (!s.reload) return JSON.stringify({ error: name + " needs no reload — call run('" + name + "')." });
      applySeed(s);
      sessionStorage.setItem(PENDING_KEY, name);
      location.replace(location.pathname + "?a11ystates=" + encodeURIComponent(name) + (s.hash || ""));
      return JSON.stringify({ seeded: name, reloading: true, then: "re-eval both files, then await A11yStates.finish()" });
    },

    finish: function () {
      var name = sessionStorage.getItem(PENDING_KEY);
      if (!name) return Promise.resolve(JSON.stringify({ error: "no pending state — call begin(<name>) first." }));
      var s = find(name);
      sessionStorage.removeItem(PENDING_KEY);
      if (!s) return Promise.resolve(JSON.stringify({ error: "pending state no longer defined: " + name }));
      return drive(s).then(function (r) { return JSON.stringify(r, null, 2); });
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
      return drive(bogus).then(function (a) {
        return drive(badVerb).then(function (b) {
          var ok = a.status === "MISSED" && b.status === "MISSED" && !!b.threw &&
                   a.findings === null && b.findings === null;
          return JSON.stringify({
            unreachableAssertion: { status: a.status, findingsIsNull: a.findings === null },
            failingStep: { status: b.status, threw: b.threw, findingsIsNull: b.findings === null },
            verdict: ok
              ? "PASS — a state that is not reached reports MISSED with null findings, both when the assertion fails and when a step throws. Zeros from run()/runAll() are meaningful this session."
              : "FAIL — the MISSED path did not fire; every recipe in this file is an unverified zero until this passes."
          }, null, 2);
        });
      });
    },

    states: STATES.map(function (s) { return s.name; })
  };
})();
