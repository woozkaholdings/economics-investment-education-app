# Weekly review — 2026-08-23

Reviewer: scheduled weekly-review task. Window: 2026-08-16 → 2026-08-23.
Previous reports: `reviews/2026-08-16-weekly-review.md`, `reviews/2026-08-17-monthly-audit.md`.

**Grade: A−.** The strongest week of engineering discipline the project has had, spent partly on the
wrong thing. Everything shipped is verified, honest and correct; the concern is allocation, not
quality.

---

## 1. What shipped

**135 commits**, 94 files, +39,847 / −11,722 lines. Two clearly distinct halves.

### First half — 2026-08-16 → 2026-08-21 (114 commits): broad, plan-derived, high-value

| Area | Landed |
|---|---|
| Features | Hash deep links, every lesson a shareable URL (item 31, §5) · "Be the Fed Chair" policy simulator inside lesson 35 (item 34, §3.0.4) · glossary term-detail screen + bookmark toggle · money-track lesson visuals · Fed balance-sheet and yield-curve figures |
| Content | Glossary linking from lesson text with a curated term map (item 28, §3.0.3) · `Stock`, `Bond`, `Dividend`, APR defined · 237 lesson cross-references converted from numbers to titles · two factual corrections in the `essentials` track (incl. "brokerage gains are taxed every year", which was wrong) |
| Structure | `essentials` split out of `money` into a third track · content split per language, largest chunk 499 kB → 117 kB (item 45) · quiz text split, the 141 kB shared chunk gone (item 48) |
| A11y | `role="list"` across every list · ARIA APG radiogroup for Settings · `role="tabpanel"` on Sectors · Glossary Back-button focus restore · duplicate `<h1>` fixed · AA contrast instrumented at 110 pairs, graph contrast at 70 |
| Process | `CLAIMS.md` §9.1 falsifiable-claims register + check (item 30) · first §9.3 monthly blindspot audit ever run (item 32) · §9.2 event payloads (`durationSec`, `scorePct`) · build made path-agnostic and deployable (item 72's dev half) · US-English house style swept across 123 lines / 32 files (item 91) · `check-data.mjs` grew §26–§33 |
| UX | The owner's `UIUX/` redesign implemented — one real gap (Learn), four screens already correct, one real a11y bug found |

### Second half — 2026-08-21 12:00 → 2026-08-23 (21 commits): item 93, and only item 93

`e455663` (2026-08-21) measured that **94 of 160 lesson/language pairs shipped a condensed summary
rather than a translation** — a real, learner-visible gap that every existing check was blind to,
because they all assert *presence* or *structural agreement*, and a field carrying a quarter of its
content passes both. **18 of the last 21 commits** paid it down:

- **`es` economy 29-40 complete** — 12 pairs, six runs, ratios 0.23–0.35 → 1.11–1.21.
- **`ko` economy 29-40 complete** — 12 pairs, six runs, 0.14–0.19 → 0.51–0.58.
- **`zh` economy 29-38 done, 39-40 remain** — 0.084–0.120 → 0.316–0.343.
- **`ja` untouched** at 24 abridged pairs.

Headline **94 → 62 abridged pairs** in three days.

---

## 2. Health

| Check | Result |
|---|---|
| `npm run build` | ✅ **Pass** — 90 modules, 894 ms, largest chunk 245 kB (88 kB gzip) |
| `npm test` (7 scripts) | ✅ **Pass** — 0 failures, 2 warnings, both expected and tracked |
| `npm run check-blindspot` | ✅ All 7 checks `ok`, including §10.1 advice-adjacency across all five languages |
| `npm run claims` | ✅ 16 claims, 3 refuted, 0 past due |
| Working tree | 2 files modified (owner's, untouched), 2 untracked dirs (`UIUX/`, `drafts/`) |

The two warnings are the translation-review coverage warning (83%, 0% human) and item 93's own
completeness warning (62 abridged pairs) — both are the instruments reporting known, recorded debt.
No commit this week broke the build; nothing needed fixing.

**AGENT_LOG ↔ commit cross-check: clean.** Per-date entry counts reconcile against commits once
market-data refreshes and owner-tree fingerprint commits (which correctly carry no entry) are
excluded. The one commit that initially looked orphaned, `287d643`, is itself a log correction. No
claimed work is missing a commit and no substantive commit is missing an entry.

---

## 3. Quality assessment

**The verification standard is now genuinely high, and it is the best thing about this project.**
Concretely, in the translation runs alone: every tranche is verified in a live browser against a real
`dist/` build with the language switched through the app's own `<select>`, asserts named probe strings
are present, asserts *single-language rendering* (zero Latin words of 4+ characters on a Chinese
page), re-checks English as a control, and clears `localStorage` afterwards. Each run records a
**falsifiable prediction** for the next one — and this week two of those predictions were **refuted by
the run that checked them**, and the model was corrected rather than the record:

- The `ko` "reference will not move" model held four times and **broke on the fifth**; the run
  diagnosed why (lesson 39 landed at 0.5773, above the element the p90 index pointed at) and rewrote
  the rule as "predict the headline move, not the reference."
- The previous run's own strengthened instrument — sorted-multiset figure equality — **would have
  failed a correct translation**, because Chinese 亿 is 10⁸ so `$600 billion` correctly becomes
  `6000亿`. The run caught that the *instrument*, not the content, was wrong.

Two runs in a row finding the fault in their own measuring tool rather than in the work is the
behavior the §9.1 discipline was built to produce.

**Content accuracy and neutrality: verified independently.** Beyond `check-blindspot`'s per-language
patterns, I ran direct probes over the newly written `es`/`ko`/`zh` economy content for
advice-adjacent constructions (`应该买`, `建议你`, `最佳投资`, `추천합니다`, `투자하세요`,
`deberías comprar`, `te recomendamos`, `garantiza`) — **zero matches, against a control that fires**.
The asset lines are consistently written as what has historically coincided with what
(`历史上，这个阶段与标普500约 +14-28% 的平均回报同时出现`), which states no view about anything today.
No personalized advice, no buy/sell recommendation, no live-date claims. §2.3, §10.1, §10.2 and §10.3
all clean.

**No regressions found.** Two file deletions this week were both deliberate and recorded (the
per-language content split; the owner's prototype-disposal decision). `check-blindspot` handles the
now-untracked `economic-cycles-v5.jsx` gracefully with an explicit "not present — not scanned"
message.

---

## 4. Concerns

### 4.1 🔴 The critical path has not moved in six days, and the escalation mechanism does not work

Item 18 (analytics provider) and item 72's owner half (a deployed URL) are the only things standing
between this app and a Phase-0 verdict. **Every run entry since 2026-08-20 — sixteen consecutive
runs — closes with the same sentence naming them.** The sentence is correct. It has moved nothing,
because a closing line inside a 16,000-line log is not an escalation.

The refuting number is unchanged and it is the most important number in this report: **40 lessons,
5 languages, 145 minutes of content, 8 check scripts, a claims register — and zero people have ever
opened this app.** `dist/` builds, is path-agnostic, needs no host rewrite rule, and Netlify Drop is
a drag of one folder.

**Action taken:** promoted to an **⛔ OWNER ACTIONS block at the top of the backlog** (O-1, O-2), out
of the run log, and repeated at the top of every weekly report from now on.

### 4.2 🟠 One item is consuming 100% of capacity, with a tail long enough to eat two more weeks

Item 93 is real, well-measured and worth doing. But 62 pairs remain, the demonstrated rate is a very
consistent **2 pairs per run**, and that is **~31 runs ≈ 8 days of scheduled capacity** — on
**"(Beta)"-labeled** content, for an app nobody has opened in *any* language.

It is also the W-2 note-chain failure in a new costume: direction stopped coming from the backlog and
started coming from "continue the tranche." Meanwhile items 67, 64, 26, 27, 70, 71 and 76 have all
been open and untouched since 2026-08-17/18.

**Action taken (W-5.1, W-5.2):** a **stop line** — finish `zh` 39-40 (1 run), then `ja` economy
29-40 (6 runs), then **close the economy phase** and file the 48-pair `essentials` remainder as a
separate, lower-priority item. Seven runs to a statable milestone ("the main path is fully translated
in five languages") instead of thirty-one to a total. Plus **one run in four reserved** for
non-item-93 work, with a named pick list so it is not a judgment call.

### 4.3 🟠 A scale change the "(Beta)" decision did not contemplate — owner decision needed

`DECISIONS.md` accepted AI translation under "(Beta)" labeling on 2026-08-11, for a corpus that was
then **sitting still**. Since 2026-08-22 the project has been adding **~10,000–12,000 characters per
day** of new machine-translated prose in three languages. Human review share is **0% across all four
languages**, and every run entry says so plainly — *"No fluent Chinese reviewer has read either
lesson."*

Nothing here is wrong, hidden or blocked, and the runs' honesty about it is exemplary. But the
decision was made about a smaller, static surface, and item 93 itself flags that the owner should
know the volume is happening. **Filed as O-3: re-affirm or cap.**

### 4.4 🟡 The run log is 2.8× its post-archive size in six days

Measured across four commits: `269b6d0` (immediately after W-3's archive, 2026-08-17)
**479,585 bytes / 5,332 lines** → `1eeaba7` (2026-08-23) **1,347,816 bytes / 15,878 lines**. W-3
freed 430 kB; six days re-consumed it with 430 kB to spare. The run log is **75% of the file** at
**~124 lines per entry**.

W-3 worked and then stopped, because it was an instruction rather than a trigger. **Action taken
(W-5.3):** a standing rule — over 600 kB, the next run archives entries older than seven days, in one
commit that touches nothing else.

### 4.5 🟡 Run-log entries have been at the wrong heading level since 2026-08-20

**76 entries are `###`; 37 are `##`** — every one since `## 2026-08-20 — the Sector screen's two "no
data" states…`. At `##` they are siblings of `## Run log` and `## Prioritized backlog` rather than
children of the run log. Nothing breaks today, but `check-backlog.mjs` bounds the backlog section by
scanning to the next `^## `, so a `##` entry landing above the Environment note would silently
truncate the check.

Worth noting for its own sake: **this is the exact defect class item 90 fixed in `LAUNCH_PLAN.md` two
days later, in the same week** — the project fixed heading-depth drift in the document it checks while
introducing it in the document it does not. Filed as W-5.4.

### 4.6 🟡 `LAUNCH_READINESS.md` §10.4 does not carry the week's most important finding

The scorecard header still reads "Last refreshed: 2026-08-16," and §10.4 still frames the volume
ratios as generic "maintenance debt" with no per-language reference — **which is precisely the framing
item 93 disproved.** Against nothing, `zh` at 0.28× reads as Chinese being compact; against `zh`'s own
fully-translated reference of 0.35× it means a fifth of the content is absent. §10.4 also publishes
one aggregate per language, hiding the concentration that makes the work schedulable. Filed as W-5.6.

### 4.7 ⚪ Note only — four uncommitted US-English edits, two of them inside protected text

`DECISIONS.md` and `LAUNCH_PLAN.md` carry two unstaged one-word changes each
(`judgment`→`judgment`, `catalog`→`catalog`, `theater`→`theater`, `color`→`color`). **Not
touched, and no run should touch them.** Flagged only because two fall inside the exception item 91
deliberately honored — quotations and dated records stay verbatim:

- `catalog`→`catalog` sits inside a blockquoted **dated verification note** whose own next sentence
  reads *"Deliberately not corrected: rewriting a dated verification falsifies it."*
- `color`→`color` rewrites a **quotation** of the old §3.1.2's opening line (`"One accent color per
  lesson/phase"`), which makes the quotation no longer accurate.

Owner's call entirely.

---

## 5. Plan for next week

Written into `AGENT_LOG.md` as the **⛔ OWNER ACTIONS** block and **PRIORITY BLOCK W-5**, both at the
top of the backlog, superseding the 2026-08-16 block (W-1 through W-4 are all closed).

**Owner, in order:**
1. **O-1 — deploy `dist/`.** One drag onto Netlify Drop. Everything else is downstream of this.
2. **O-2 — create an analytics-provider account.** §4.3's completion-rate gate cannot be scored
   without it.
3. **O-3 — re-affirm or cap the machine-translation volume** (§4.3 above).

**Dev agent, in order:**
1. **`zh` economy 39-40** — one run, already scoped by the previous run's note. Completes the Chinese
   economy track.
2. **`ja` economy 29-40** — six runs. Re-measure the added-character rate first; neither `ko`'s 0.379
   nor `zh`'s 0.226 transfers.
3. **Close item 93's economy phase; file the 48-pair `essentials` remainder separately.** Do not roll
   it forward.
4. **Every fourth run picks off-item-93**, from: W-5.4 (heading levels), W-5.5 (item 93's stale
   headline), W-5.6 (§10.4 refresh), W-5.3 (archive when over 600 kB), item 67's residual third, item
   64's residual candidates, item 26, item 27's re-scope, items 70/71/76 — or a backlog refill, which
   is always legitimate (W-2's standing rule remains in force).

**Unchanged standing rules:** W-1 (live-browser verification on every UI change — being followed
exemplarily), W-2 (pick from the backlog, not from the last run's note).
