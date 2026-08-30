# Weekly review — 2026-08-30

**Reviewer:** scheduled task `economics-app-sunday-review`.
**Window:** 2026-08-23 (previous review, `2d4e798`) → `94b4914` (2026-08-30 06:25).
**Grade: A− on craft, C+ on direction.** The best engineering week this project has had, spent
almost entirely on work that its own author labels "downstream of O-1".

---

## 1. What shipped

**96 commits.** Cross-checked against `AGENT_LOG.md`: **every run-log entry has a matching commit,
and every commit without an entry is an automated market-data refresh, an owner-tree fingerprint,
or the weekly review's own.** No mismatch, no phantom work. (An early per-date tally appeared to
show a gap on 08-23; that was a timezone artifact in my own `git log --date=short` call — 08-23 has
19 commits against 16 entries, and all 16 map.)

| Theme | Commits | What landed |
|---|---|---|
| **Translation (item 93)** | ~14 | `zh` and `ja` economy 29-40. **The economy track — the main path since the 08-18 product reversal — is now complete in all five languages.** W-5.1 closed on 08-24 at its budgeted seven runs. |
| **Accessibility** | ~25 | Landmarks, skip link, heading hierarchy, `<html lang>` sync, focus-visible ring (invisible build-wide, §28c), touch targets (11 controls under 44px), a checked-in a11y state matrix that grew a language axis, a font-scale axis and a width axis, and a 320px reflow fix. |
| **Figures (item 27)** | ~6 | Lesson 23's preference reversal, lesson 44's second axis, lesson 3's caption axis, the equal-cells grid that rendered one row 1.5x tall. Several were figures whose claim was true in the data and invisible in the pixels. |
| **Content** | ~4 | **Money track lessons 41-44** (the income-hierarchy arc), M0/M1/M2 defined, monetary base named. Catalog is now **44 lessons / 160 minutes**. |
| **Resilience / UX** | ~8 | Chunk-load error handling, a lesson that fails to load can no longer be marked complete, "Practice all questions" scoped to lessons actually reached, link-preview metadata. |
| **Log & backlog housekeeping** | ~10 | Two archiving passes, two backlog compressions, `check-log-size.mjs` with its cut plan. |
| **Instruments** | ~30 (overlapping) | `check-data.mjs` grew to **62 sections / 8,711 lines**; `us-english.mjs` shipped. |

**Regressions: none found.** No commit this week broke the build or the suite.

## 2. Health

| Check | Result |
|---|---|
| `npm run build` | ✅ **exit 0**, 913 ms |
| `npm test` (working tree) | ✅ **exit 0** — 7 PASS, 3 warnings, all recorded debt |
| `npm test` (**fresh clone**) | ❌ **exit 1** — see §4.1 |

The three warnings are known and filed: translation human-review share (0%), 48 abridged
lesson/language pairs (item 93/94), and the over-budget log floor (item 115). None is new.

*Environment note: Node **v26.7.0** is in `PATH` at `/usr/local/bin/node`. The task file's "no Node
in PATH" instruction is stale and no portable runtime was needed.*

## 3. Quality assessment

**The craft is genuinely exceptional and I want to be specific about it, because §4 is critical and
the two are not in tension.** This week the agent repeatedly re-measured its own premises and found
them false — item 133 (two of three premises wrong, so the Korean prose stayed and a guard shipped
instead), item 145 (two safety guards blind to the start of every paragraph, and the item that said
they were fine), item 135 (a capability two items called "already there" that did not exist). It
wrote probes, proved them dead, and replaced them (item 151's proposed control was unreachable
because every spec is symmetric). It caught its own instruments reading the wrong thing — a
figure-vs-prose check that was "clean" in three languages only because it could not read them; a
caption check satisfied by a *different* caption. **That is a higher standard of self-verification
than most funded teams reach.**

**Content accuracy and neutrality: clean.** I read the four new money lessons. They are the
"judgment, not mechanics" framing the owner asked for, and lesson 44 ("The Part the Word 'Passive'
Leaves Out") actively *debunks* passive-income hype rather than selling it. No personalized advice,
no buy/sell recommendations, no return projections. `check-data.mjs` §10.1 sweeps 25 advice patterns
across 38 files in five languages and passes, and §59 this week fixed a real hole in it — the
matcher could not see a banned phrase at the start of a paragraph in the corpus's `\n`-escaped
storage shape. The disclaimer renders on all 8 surfaces.

**One content-integrity risk worth naming (§4.4):** four languages of that corpus are 100% machine
translation with 0% human review, and the safety sweeps run over the *English* patterns.

## 4. Concerns

### 4.1 `npm test` fails on a fresh clone — and was filed as "low"

I reproduced this rather than taking it on report. `git archive HEAD` into a clean directory,
symlink `node_modules`, copy the two gitignored `economic-cycles-v*.jsx`, `npm test` → **exit 1**:

```
FAIL: §26: DECISIONS.md:669: names `drafts/income-hierarchy.en.md`, which does not exist.
```

**The suite is green only because the owner has an untracked `drafts/` folder.** Anyone who clones
this repo, and any CI ever added, gets a red suite on checkout. The run that found this filed it as
item 154 at *"honest priority: low"* and deferred it entirely to the owner. The deferral is right
about the **decision** and wrong about the **urgency** — and it shipped in the same commit that
discovered it. Raised to **PRIORITY** as **W-6.1**, with both routes written out and route (b) (the
`path-ok` exemption `check-data.mjs` §26 itself prescribes) authorized as a reversible stopgap.

### 4.2 The backlog is now generating itself — W-2's failure in its third costume

Measured off `94b4914`:

- **29 open items** carry *"filed … by the run that"* — residuals a run filed from its own work.
- **15** open items say **"Downstream of O-1"**. **8** say **"Zero live instances"**. **27** say
  **"Honest priority: low"**.
- **The last six runs form an unbroken chain**: 146→147→148→149, 150→151→152, 153+154. Every link
  was filed by the run that closed the previous link.

W-2 (08-16) caught direction coming from the previous run's "next run should pick" line. W-5.2
(08-23) caught it coming from "continue the tranche" and reserved one run in four. **W-5.2 was
scoped to item 93, item 93 closed on 08-24, and nothing replaced the constraint** — so the habit
returned in a new costume within days. A rule scoped to one item stops binding when that item does.

**This is not laziness — it is a backlog out of runway.** Of 24 open items, the genuinely
product-facing ones are owner-blocked (18, 12, 19, O-1/O-2), exhausted by their own text (17, 24,
21), or need re-scoping (26, 27). W-2's standing remedy — *a run that finds nothing to pick should
re-read `LAUNCH_PLAN.md` §4.3/§5/§9 and write new items* — is the correct move and has not been
taken since 08-17.

### 4.3 The instruments are 2.3x the application

| | Lines |
|---|---|
| `scripts/` | **15,480** |
| `src/` app code (excl. `content/`, `locales/`) | **6,589** |
| This week: `scripts/` | **+8,987** insertions |
| This week: `src/` | **+3,058** insertions |

**I am deliberately not setting a threshold.** Several of this week's instruments were plainly worth
building: §28c caught an invisible focus ring across the entire build, the a11y matrix caught bars
drawn 9px tall at 320px, §59 caught two safety guards blind to the start of every paragraph. All
three were real and learner-visible. The ratio is recorded (**W-6.3**) so the next run proposing a
check has to look at it, and **W-6.2 rule 3** now requires every new check to name the
learner-visible failure it would have caught — a test §50 (i)/(j) pass cleanly and item 152's
proposed JSX-prop regex does not obviously pass.

### 4.4 The log floor is over budget, and §4.2 is why

`npm test` warns every run: the non-archivable floor is **313,522 b against a 250,000 b budget**,
growing **+3,834 b/commit**. The backlog alone is **285,978 b** — the backlog *is* the floor now.
Archiving cannot touch it (W-5.3) and two compression passes have already run this week.

**The link nobody had drawn: each residual filed under §4.2's habit is a 2-4 KB richly-argued
backlog item whose own author labels it low priority.** That is the growth curve. Compression treats
the symptom. **In fairness, this review's own W-6 block added ~9.3 KB to that floor** — justified,
I think, for a priority block, but worth stating plainly rather than exempting myself.

### 4.5 Owner actions — unchanged, now 13 days

**O-1 (a URL) and O-2 (an analytics provider) remain the entire critical path, and nothing in the
repo can move either.** `dist/` builds, is path-agnostic, and Netlify Drop is a drag of the folder.
The refuting number, re-measured today because the version in the log had gone stale: **44 lessons,
5 languages, 8 check scripts, 62 check sections, 160 minutes of content — and zero people have ever
opened this app.** §4.3's Phase-0 completion gate stays **❌ Unmeasurable** until O-2.

### 4.6 Two notes, no action taken

- **The market-data job appears to have stopped.** `market.json` is `asOf 2026-08-28`; it committed
  daily 08-24 → 08-28 and not on 08-29 or 08-30. `STALE_AFTER_DAYS` is 4, so the Sector-performance
  screen starts rendering "Market data isn't available right now" around **2026-09-02**. Owner's
  scheduled job — flagged, not touched.
- **O-3 restated at a new scale.** The economy track is complete in five languages and four money
  lessons shipped, all at **0% human review**. The "(Beta)" decision was made on 08-11 about a
  smaller, static surface. Re-affirm or cap — owner's call.

## 5. Plan for the coming week

Set in `AGENT_LOG.md` as **PRIORITY BLOCK W-6**. W-5's standing rules (the pick-list staleness
warning, W-5.3's archiving rule, W-5.5's re-read-the-count rule) are unchanged and marked as such;
W-5.2 is marked **EXPIRED** in place so no run acts on a ratio scoped to a closed item.

1. **W-6.1 — fix the fresh-clone failure first.** Route (b) authorized as a stopgap if the owner has
   not answered. Control: the fresh-clone recipe must exit 0. Also fix the Environment note's `HEAD`
   control recipe, which has the same defect.
2. **W-6.2 — the residual-chain rule.** (a) No run may take its own previous run's residual as its
   headline pick more than **twice in a row**; the third refills the backlog from `LAUNCH_PLAN.md`.
   (b) A residual at *"zero live instances"* **and** *"honest priority: low"* is a **note under its
   parent**, not a numbered item. (c) Every new check must name the learner-visible failure it would
   have caught. Items **120, 126, 140, 143, 144, 149, 152, 153** are **PARKED** in place.
   ⚠️ The residual-*filing* discipline is one of the best habits in this log and must continue. The
   defect is picking it up next, not writing it down.
3. **A backlog refill is the single highest-value run available** and is explicitly a legitimate
   whole run. The launch plan has not been re-read end-to-end since 08-17.
4. **W-6.3 / W-6.4** — consult the instrument ratio before proposing a check; understand that the
   floor is fed by rule 2, not by insufficient compression.

**Nothing was reverted and no dev-agent work was modified.** The only code-adjacent change this
review made is the `AGENT_LOG.md` curation.

---

### Reviewer's note on concurrency

A dev-agent run was **live during this review** — `src/components/ui.jsx` was modified in the
working tree at 09:15:46, mid-review, with an in-progress fix for item 153 (browser text zoom at
320px; the Reference hub laid out to 408px against a 320px viewport). **I did not touch it.** My
curation commit `a3cf6ae` was built with `git write-tree` over an index in which only `AGENT_LOG.md`
was staged, and I verified afterwards that the committed `ui.jsx` blob is byte-identical to
`94b4914`'s. The owner's untracked `UIUX/` and `drafts/` were likewise left alone.

**One race this review cannot prevent:** if that run read `AGENT_LOG.md` before commit `a3cf6ae`, it
will write its entry against the pre-curation version and may not see W-6 until the run after. The
block is at the top of the backlog and W-6.2 is self-describing, so the cost is one run's delay.
