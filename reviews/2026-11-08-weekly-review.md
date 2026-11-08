# Weekly review — 2026-11-08

Reviewer: scheduled `economics-app-sunday-review`. Period: 2026-11-01 (after `273e3f9`) → 2026-11-08.
HEAD at the start of the review and before each commit: `2a00324` (the 11-08 00:11 dev-agent run).
The only uncommitted items are three untracked paths (`Migration/`, `UIUX/`,
`scripts/fix-agent-skill.mjs`). They belong to the owner and were left alone.

**Grade: A.** All seven runs fixed something a learner would hit, and each followed last week's
direction (W-14.2: compare copy with code, and walk the app live). The best one found that a
non-English reader's first act in the app was accepting a disclaimer they couldn't read. All six of
last week's tests pass. The one new problem is process, not product: the monthly claims audit fell
due on 11-07 and nothing ran it. The launch is still blocked only on O-2, which the owner holds
(eighth week).

---

## 1. What shipped

**11 commits since the last review:**
- 7 dev-agent commits from 7 runs
- 4 market-data refreshes (asOf 11-02, 11-04, 11-05, 11-06; none for 11-03)

**Cross-check.** Commits match run-log entries **7/7**, one per day from 11-02 to 11-08. There was
no mismatch in either direction, and no commit was empty.

**Cadence changed, and nothing records why.** Last week had 26 runs, four a day. This week had 7, one
a day at about 00:00. That may be the owner's answer to O-7 ("slow to one a day until O-2 lands"),
or the second Mac may have been asleep for the other slots. Nothing in the repo says which, so §5
asks.

### Dev agent: 7 runs

| commit | what changed for the learner |
|---|---|
| `b145602` | W-14.1's archiving pass: run-log days 10-18 → 10-31 moved verbatim. Run log 243,037 b → 33,902 b. |
| `c0492e8` | **The first-run disclaimer now has its own language picker.** Before, everything behind the dialog was `inert`, header included, so an es/ko/zh/ja reader had to accept an English disclaimer before they could switch language. Found by W-14.2(a)'s live first-session walk in es and ko. The same run did W-14.2(b): every en string that states a number about app behavior, checked against its constant. It found no mismatch and logged the clean result. |
| `357a2a2` | zh Glossary search now finds 通胀 and 通缩, the words the lessons use (43 and 4 times). Before, those searches returned nothing. The fix is an optional `a` (alias) field, and `check-data` checks its shape. |
| `5daefaf` | ja now uses one word for "savings account", 貯金口座, where the lessons had used four. Essentials lesson 1 no longer calls *checking* 普通預金 one lesson before the glossary used 普通預金口座 for *savings*. The chip now names a word that appears on screen in 7 of 7 tagged lessons, up from 1. |
| `859b6c5` | At 320px with large text, the header cut off the app's name (en/es from 115%, ja at 130%). The name now wraps, and the language picker moves to its own row when it has to. |
| `b3b69d7` | The cycle chart's phase names (lessons 32 and 38, and the Market dashboard) go from 6.8px to 9.3px at 320px and no longer sit under the curve. The trend line's name moved to a key that wraps. |
| `2a00324` | Yield-curve tenor labels on the Market dashboard go from 5.7px to 9.8px and follow the text-size setting. Lesson 36 keeps 13.1px through a per-call-site `tickSize`. |

`src/` churn was small and targeted. There were no new screens or features, and no English lesson
prose changed.

---

## 2. Build and test status

Runtime from `scripts/bootstrap-node.sh`: **system Node v26.7.0**. No download was needed.

| check | result |
|---|---|
| `npm run build` at `2a00324` | ✅ exit 0 (built in about 1 s) |
| `npm test` at `2a00324` | ✅ exit 0, **0 FAIL, 18 WARN** |
| `npm test` after this review's backlog edit | ✅ exit 0, 0 FAIL, 18 WARN (same set) |
| `npm run check-deployed -- --identify` | ⚠️ live = `c94f5a0`, 4 build-input commits behind (§4.2) |

The WARNs:
- **1** is O-3's translation-coverage disclosure (0% human review in es/ko/zh/ja), which the owner
  accepted on 10-10.
- **17 are new**: `CLAIMS.md` rows A1–A8, B1–B4, C1–C2 and D1–D3, all past their 2026-11-07 check
  date (§4.1).

**Nothing was broken, so no build fix was needed.**

### Last week's tests (W-14.6), measured by this review

| test | target | measured | |
|---|---|---|---|
| §65 longest-option rate (en/es/ko/ja/zh) | ≤ 28.3 / 26.1 / 28.3 / 26.1 / 23.9 | **28.3 / 26.1 / 28.3 / 26.1 / 23.9** | ✅ (at ceiling) |
| mean run-entry size, 11-02 → 11-08 | ≤ 5,000 b | **4,318 b** (n=7) | ✅ (up from 3,347) |
| largest heading | ≤ 400 chars | **369** | ✅ |
| run log under the warn budget after the pass | < 250,000 b | **33,902 b** | ✅ |
| English lesson text | ≤ +0.3% from 168,230 | **168,230 (+0.00%)** | ✅ |
| no empty commit | 0 | **0** | ✅ |
| no new past-episode tally (W-14.3) | 0 | **0**; no English content file changed | ✅ |

---

## 3. Quality, accuracy and neutrality

**I found no factual errors, no regressions and nothing that reads as advice.** No English lesson,
glossary definition or locale string changed this week, so nothing new could add advice. I read
the source diffs:
- **`c0492e8`.** A single `LanguageSelect` component now renders in both places, so the two option
  lists can't drift. The Tab trap alternates between the dialog's two controls, and focus still
  starts on the accept button.
- **`357a2a2`.** Aliases are searched but never displayed. The comment limits them to forms the
  reader actually sees on screen.
- **`2a00324` / `b3b69d7`.** These are layout-only. The yield-curve change keeps lesson 36's large
  figure at its old size through a prop, instead of growing every curve.
- **`5daefaf` (a note, not a defect).** Using 貯金口座 for savings and 当座預金口座 for checking is
  consistent across the corpus, and 当座預金口座 matches lessons 10 and 25. In Japan, though, a
  当座預金 account is mostly a business account, and most people's everyday account is 普通預金. A
  fluent Japanese reader might phrase this pair differently. That's a question for a human ja
  reviewer (O-3), not for a run, so W-15.2 tells runs to leave it alone.

**Direction.** The app is feature-complete for the Phase-0 launch plan. Every run this week went to
accessibility and translation defects on surfaces a learner reaches. That's the right use of runs
while O-2 is open. There is one early sign of narrowing: two of the last three runs fixed SVG label
sizes, and item 179 has one more part. W-15.2 lets runs finish 179 but bars turning it into a sweep
of every chart, and names three surfaces that haven't been walked yet.

---

## 4. Concerns

### 4.1 The monthly claims audit was missed (W-15.1, top priority)
On 10-04 the review moved every `CLAIMS.md` check date to 2026-11-07, the next §9.3 audit. No run did
that audit on the day, so `npm test` has printed 17 extra WARNs since then. The 11-08 run noticed
and filed the audit as **item 180** (correctly, it didn't also do it in that run). W-15.1 makes it the
next run's first job. It also asks for short notes on rows still blocked by O-2, because each
audit so far has added another "Earlier record follows" paragraph. `CLAIMS.md` is 38,444 b, up from
36,713 b on 10-04, which is still well under the point where it would need a size guard (W-10.6(b)).

### 4.2 Deploy gap: the usual weekend shape
`check-deployed --identify` found the live site byte-identical to **`c94f5a0`** (Thu 11-05 19:50).
It is four build-input commits behind: `859b6c5`, `eb8ba00`, `b3b69d7` and `2a00324`. The live
`market.json` is asOf 11-05, so **the Sectors card goes dark on Tue 2026-11-10** unless a push lands
before then.

### 4.3 The critical path is still held by the owner (eighth week)
O-2 (an analytics account and a public key) hasn't moved since 09-05. The Phase-0 gate (≥40% finish
lesson 1) is still **❌ Unmeasurable**.

### 4.4 Minor: the backlog keeps growing
The backlog is 265,505 b, 87% of the log's floor. The floor is 303,911 b, 61% of its 500 KB budget,
and it grows about 0.7 KB per run plus about 5 KB per weekly review. That's months of headroom at
the current cadence, so no action is needed yet. Superseded priority blocks W-5 → W-13 make up most
of it. They're a candidate for a verbatim archive move when the floor nears its budget, not before.

---

## 5. Questions for the owner

1. **O-2 (week eight): will you create one analytics account and paste its public key?** If you
   choose PostHog, also turn on Settings › Project › "Discard client IP data" first.
   `npm run analytics-check -- --key …` verifies the key. This is the only thing between the app
   and a measurable launch gate.
2. **O-7: was the change to one run a day intended?** If it was, O-7 is closed. If not, the second
   Mac may be asleep or the schedule may be skipping three of every four slots.
3. **Push by Monday 11-09?** Otherwise the live Sectors card goes dark on 11-10.
4. **O-5 / O-6** are unchanged: should the market job push, and should the archive move be
   automated? O-6 matters less at one run a day.

---

## 6. Plan for next week (priority block W-15, committed to `AGENT_LOG.md`)

| | item | owner? |
|---|---|---|
| **W-15.0** | W-14's tests: all six pass. | — |
| **W-15.1** | **PRIORITY, next run:** item 180, the §9.3 claims audit. Short notes for rows blocked by O-2. Next date 2026-12-05. | run |
| **W-15.2** | Finish item 179(b), then change surface: a ja/zh first session, the parent guide and Reference at 320px/130%, and a keyboard-only lesson and quiz. No SVG sweep. Leave the ja 当座預金 wording to a human reviewer. | run |
| **W-15.3** | The cadence went from 4 runs a day to 1. Runs don't guess at the reason or change it. No early archiving pass. | run |
| **W-15.4** | O-2 (8th week), O-7 (confirm), O-5, O-6. Deploy: live = `c94f5a0`; Sectors goes dark 11-10 without a push. | **owner** |
| **W-15.5** | Test for 11-15: §65 at or below the ceiling; mean entry ≤ 5,000 b and no heading > 400; 0 past-due claim WARNs; `CLAIMS.md` grows ≤ 4,000 b; English text grows ≤ 0.3% from 168,230; no empty commit; no new tally. | — |

W-14.3 (no new past-episode tallies) and W-14.4 (headings ≤ 400 chars) are now standing rules.

---

## 7. Notes

- Nothing was pushed to any remote. No history was rewritten, no commit was reverted, and no file
  belonging to the owner was touched. `Migration/`, `UIUX/`, `scripts/fix-agent-skill.mjs`, the
  launch-plan documents and `working_files/` were left alone.
- `npm run build` wrote into the git-ignored `dist/`, which `check-deployed` compares against.
- The W-15 block cost **4,876 b**, on the backlog side. After the edit, `check-log-size` reports a floor
  of **303,911 b** against the 500 KB budget. The run log is unchanged at 33,902 b.
- Entry sizes and heading lengths came from a scratchpad script that splits `## Run log` on
  `### YYYY-MM-DD` headings. The per-day counts matched `git log` exactly.
- Both commits were made with `git commit-tree` + `update-ref`, because `git commit` stalls on this
  machine. HEAD was re-checked immediately before each one.
