# Weekly review — 2026-09-20

Window: **2026-09-13 00:00 → 2026-09-20 09:xx**, HEAD `d83bf5b`, branch `main`.
Reviewer: scheduled weekly-review task. Nothing was pushed; no remote was touched.

⚠️ **There was no weekly review on 2026-09-13.** `reviews/` runs 2026-09-06 → this file. The
commit review below covers one week; the direction-setting covers two.

---

## 1. What shipped

**66 commits.** Of those, **5** are the separate `economics-app-market-data` job (`2fb1f46`,
`a828a3e`, `3585207`, `d45417a`, `91de7a6`) and **61** are dev-agent runs.

**Cross-check against `AGENT_LOG.md` — the log and the commits reconcile; no entry claims work
that has no commit behind it.** Dated run entries per day (live log + archive):

| day | run entries | dev-agent commits | note |
|---|---|---|---|
| 09-13 | 6 | 7 | `2dcc1db`, a one-line US-English fix to that day's own entry, folded into it |
| 09-14 | 3 | 3 | |
| 09-15 | 1 | 1 | |
| 09-16 | **0** | **0** | see §4.2 |
| 09-17 | 8 | 8 | four of them owner-directed |
| 09-18 | 15 | 15 | |
| 09-19 | 21 | 21 | |
| 09-20 | 5 | 6 | `aee0ac8`, a market-data refresh, folded into the day's entry |
| **total** | **59** | **61** | |

**Substance: 61 of 61 dev-agent commits were a single-sentence content-accuracy correction or an
archiving pass.** Representative of the week:

- **Lesson 38's four cycle phases** (`4e383d4`, `7cd0173`, `b45aa0a`, `db059a4`) — Trough, Peak
  ×2 and Contraction each taught a claim the US record contradicts (sentiment bottoming *at* the
  trough; the mood lagging the turn; the Fed still raising at the peak; the first cut falling
  *inside* the recession). All four measured against FRED/OECD/NBER series and corrected in five
  languages.
- **Lesson 35's rate-transmission paragraph** (`9ee5346`, `025a017`, `8723d7a`, `7cfe87b`) — the
  12–24 month policy lag, home sales cooling in 6–12 months, the dollar strengthening on hikes,
  growth stocks falling harder than utilities. Three of the four did not survive measurement.
- **Glossary sweep** (`b900df3`, `7a059b9`, `4b245af`, `c30e684`, `87a538d`, `637778f`, `4cad5d9`)
  — bubble, productivity growth, deleveraging, credit spread, PMI, deflation, yield curve.
- **`4cad5d9`** is the week's best single run: the yield-curve fix was not an unswept entry but a
  fix an earlier run **recorded as applied on 2026-08-02** that reached three of four surfaces and
  missed `glossary.js` for 48 days. It also caught a dead instrument of its own — monthly
  `GS10-TB3MS` washed out a six-day 1989 inversion that daily `DGS10-DTB3` finds — and **stopped an
  edit** rather than shipping a wrong correction.
- **`f6b24f9`** — Lesson 5 was shipping the literal characters `*and*` to every English learner.
- **`56f8bb3`, `ec6211c`** — W-5.3's 17th and 18th archiving passes; **cleared the log-size WARN**
  (`npm test` 4 → 3 warnings).

**Code volume** (`ca9ebd7..HEAD`, excluding the log files): `src/` **+472 / −346**, `scripts/`
**+452 / −145**. Largest single file: `scripts/check-data.mjs` **+308 / −1**.

---

## 2. Build and test status

Run on Node **v26.7.0** (`scripts/bootstrap-node.sh` selected the system Node; nothing downloaded).

| | result |
|---|---|
| `npm run build` | ✅ **exit 0**, built in 1.07 s, entry bundle 272.47 kB / 98.02 kB gzip |
| `npm test` | ✅ **exit 0**, 0 failures, **3 warnings** |

All three warnings are pre-existing recorded debt, not regressions:

1. **Translation review** — es/ko/zh/ja 100% reviewed, **0% human** in all four (O-3).
2. **Translation completeness** — **47 of 176 lesson/language pairs abridged**, 12 lessons, all on
   the `essentials` track (item 94).
3. **Quiz option-length cue** — always tapping the longest option scores **en 24/46 = 52.2%**
   against a 25.0% chance baseline (item 160).

Readiness line: **44 lessons / 164,172 en chars / 174 min.** Claims register: 17 claims, 3 refuted,
0 past due. `check-blindspot` green.

**No build break occurred this week, so no fix was needed and none was made.**

---

## 3. Quality assessment

**The content work is the best-evidenced this project has produced.** Every correction names its
series, most carry a **negative control** (a bad FRED id must return 404) and several carry a
**positive control** (an inverted curve through the same machinery must reproduce a known figure).
Limits are stated rather than buried — `d83bf5b` says outright that its 87.5% is computed only over
expansions that *ended*, and that the three no-downturn episodes are exactly what that measure
cannot see. `4cad5d9` refused to ship an edit its own control had undermined. Corrections land in
all five languages in the same commit.

**Neutrality holds.** `check-blindspot` is green inside `npm test`, and this review read the most
advice-adjacent surface changed this week directly rather than trusting the check. `markets.js`'s
teaching scenario is hypothetical, undated and carries no recommendation; its closing sentence now
states a 2.8x lift **and** the three episodes with no downturn behind it. **No buy/sell language,
no personalized advice, no regression found anywhere in the week.**

**Readability: `f00b1fd`'s worry is closed by measurement.** That run found four correct corrections
had piled into one lesson-35 paragraph, leaving it at 1,949 characters. Re-measured today across all
**334** English paragraphs in all three tracks: **longest 1,201; one paragraph over 1,200; five over
900.** The split worked. Reading time went 171 → 174 min — worth watching, not acting on.

---

## 4. Concerns

### 4.1 ⛔ Nothing shipped this week reached a learner. (Owner action — O-5.)

`origin/main` is **`b900df3`**. Local `main` is **28 commits ahead**. The last push was
**2026-09-18 21:18**. The entire 09-19/09-20 body of work — 26 content fixes — is not on the site.

With a date attached:
- live `market.json` is `asOf 2026-09-18`; HEAD's is `asOf 2026-09-20`
- `STALE_AFTER_DAYS` is 4, tested as `ageDays > 4` (`src/lib/useMarketData.js:20,52`)
- ⛔ **Reference → Sectors goes to its unavailable state for every visitor on 2026-09-23** unless a
  push carrying a fresher `market.json` lands first

The rest of the app is unaffected — 44 lessons, glossary, Review and the parent guide keep working
on a stale deployment. **This is O-5 exactly as filed; both routes are still the owner's to choose
(have the market job push, or document that Sectors may go dark between pushes).** A run is
forbidden to push and I have not.

### 4.2 ~8 scheduled runs did not fire, and the log structurally cannot know it

Run entries per day were **6, 3, 1, 0, 8, 15, 21, 5** against a 6-hour schedule (4/day). The gap
from `0bc1a95` (09-15 00:04) to `f631020` (09-17 16:13) is **~40 hours with no dev-agent commit**.
The market job kept committing at 19:46 throughout, so the machine was up; the dev schedule was not.
No run entry mentions it, because a run that does not fire cannot write one.

### 4.3 W-7.2's accretion did not stop — it moved from the backlog into `src/`

Over `ca9ebd7..HEAD`, the six teaching-content modules gained **124 lines, 123 of them comments**:

| file | +lines | of which comment | of which code |
|---|---|---|---|
| `content/markets.js` | +50 | **+50** | **0** |
| `content/kidsContent.js` | +32 | +31 | +1 |
| `content/moneyVisuals.js` | +23 | +23 | 0 |
| `content/sectors.js` | +14 | +14 | 0 |
| `content/policyScenarios.js` | +5 | +5 | 0 |
| **total** | **+124** | **+123** | **+1** |

`markets.js` is now **37.7% comment by line**, up from 32.9%; the block above its `scenario` export
runs ~40 lines for one sentence. **This is not a request to delete provenance** — those blocks are
why the corrections can be trusted. It is W-7.2 rule 1 applied where it now bites: keep the finding,
the limit and the re-measure warning; drop the narration of the search, which is already in the run
log.

### 4.4 The instruments started outgrowing the app again

**22,752 / 10,196 = 2.23x**, against 2.19x on 09-06 (same method as W-7.0). This week: `scripts/`
net **+307** vs `src/` net **+126** — instruments grew **2.4x faster than the app**, reversing the
near-parity W-7.0 credited. **`check-data.mjs` took +308/−1 of that and now stands at 13,175 lines**
(11,597 on 09-06, **+13.6% in a fortnight**) in one file.

### 4.5 One mode, and two unblocked learner-visible items sat out the week

61 of 61 dev commits were a sentence audit or an archiving pass. That mode is working — but it is
**unbounded**, and two items that a run **can** close, that need no owner, and that `npm test` warns
about **every single run**, were not picked once:

- **Item 94** — 47 of 176 pairs abridged, all on `essentials`, while both main-path tracks are fully
  translated. The largest learner-visible gap left that a run can close, with a measured scope and a
  per-lesson list.
- **Item 160** — a learner can pass half the checks off the option shape (52.2% vs a 25% baseline).
  That is a content-accuracy defect in the *assessment*, the same class the week spent 61 runs on in
  the prose.

### 4.6 A class was diagnosed and only its instance was fixed

`f6b24f9` reasoned the inert-Markdown class precisely — the reader renders `{section.body}` as a
plain text child, no Markdown dependency, no `dangerouslySetInnerHTML` — and then fixed one string.
Re-measured today: the corpus is **clean in all five languages**, and **no `check-data.mjs` section
guards it** (the list ends at §84). Cheapest guard on the open list.

### 4.7 Minor — noted, deliberately not "fixed"

The Yield Curve glossary entry reads "the six US recessions since **1976**" in its definition and
"every US recession since **1955**" in its example. Both are correct and `4cad5d9` explains exactly
why (1957 and 1960 predate `DGS10`). A learner sees two start years two sentences apart.

---

## 5. Grade

**B+.** Execution is excellent and the evidentiary standard is genuinely high — controls, stated
limits, five-language parity, and one run that stopped itself. Health is green. What pulls it down
is direction and delivery: the agent has narrowed to one unbounded mode while two warnings it can
clear print on every test run, and — the fact that dominates the week — **none of it has reached a
learner since 2026-09-18.**

---

## 6. Plan for the week of 2026-09-21

Set as **PRIORITY BLOCK W-8** in `AGENT_LOG.md` (supersedes W-7's active clauses; W-7.2 rules 1–3,
W-6.2 and W-6.3 remain binding). Items 94 and 160 carry a promotion pointer back to W-8.5.

**Owner:**
1. ⛔ **Push `main`** (28 commits). Sectors goes dark for visitors on **2026-09-23** otherwise.
   Then decide O-5 route 1 or 2 so this stops recurring.
2. Check why the dev schedule did not fire 09-14 → 09-17 (§4.2).
3. O-2 (analytics key) is still the top of the critical path and still the only thing that makes
   §4.3's ≥40% completion gate measurable. O-3 (unreviewed machine translation at scale) is still
   un-re-affirmed.

**Dev agent, in order:**
1. **Item 94** or **item 160** — whichever standing `npm test` WARN is still up. A run may override
   this, but must say in its entry why the sentence it chose was more valuable to a learner than
   clearing a warning the test prints every run. **The clause expires when both WARNs clear.**
2. **Guard the inert-Markdown class** as the next `check-data.mjs` section (§4.6).
3. Apply W-7.2 rule 1 to the provenance blocks in `src/content/` — target under ten lines per
   corrected sentence (§4.3).
4. Then resume the sentence-audit mode, which is working.

**Next review:** open with a fresh `check-log-size.mjs` MEASURED line. W-8's own test is whether the
backlog is **below 413,641 b** on 2026-09-27.

---

## 7. Working tree

Clean apart from two untracked directories, **`Migration/`** and **`UIUX/`**, which are the owner's
and were not touched. (`git status` at the start of this run also listed
`src/content/lessonContent.essentials.es.js` as modified; that was a stale stat-cache entry — the
file's content is identical to HEAD and the entry cleared on the first real diff.)
