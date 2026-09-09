// ═══════════════════════════════════════════════════════════════════════════
// QUESTION
//
// One multiple-choice question with immediate feedback. Shared by the
// end-of-lesson check and the spaced-review queue so a question looks and
// behaves identically wherever it appears — and so both routes record their
// result into the same schedule.
//
// The explanation is the point: a wrong answer teaches rather than scoring.
//
// `question` arrives with its text already resolved to one language — plain
// strings, not { en, es, … } maps. Since the 2026-08-17 quiz split (item 48)
// the words live in a per-language module the screens load, so the language
// is chosen before this component sees the question rather than by indexing
// a map here. `lang` is still taken because the caller passes it, but nothing
// below needs it.
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState } from "react";
import Icon from "./Icon.jsx";
import { Note, SrOnly, Text } from "./ui.jsx";
import { fill, ink, line, MIN_TAP, radius, space, surface } from "../theme.js";

// `headingLevel` exists because the correct level is a property of where the
// question SITS, not of the question. In the lesson reader it hangs under the
// block label's <h2> ("Before you read" / "Check what you learned"), which is
// itself under the lesson's <h1> — so <h3> is right, and it is the default so
// that call site keeps working untouched. In the review runner the question is
// the whole screen: no lesson title, no block label, nothing above it, so an
// <h3> there left the page with a single heading three levels deep and no <h1>
// at all (item 109, measured live 2026-08-25). See Practice.jsx's runner.
export default function Question({ question, t, onAnswered, autoFocusHeading = false, reveal = true, headingLevel = "h3" }) {
  const [choice, setChoice] = useState(null);
  const answered = choice !== null;
  // Answering and being told the answer are two different things. The
  // pre-lesson hook (`reveal={false}`) takes a guess and deliberately withholds
  // the verdict: disclosing it there would answer the question the lesson is
  // about to answer, and would leave the end-of-lesson check re-asking
  // something the reader was just told. See LessonReader's HOOK block.
  const disclosed = answered && reveal;
  const correct = choice === question.answer;

  const choose = (i) => {
    if (answered) return;                 // one answer per question
    setChoice(i);
    onAnswered?.(i === question.answer, i);
  };

  // ── THE RADIOGROUP KEYBOARD CONTRACT ──────────────────────────────────────
  //
  // The markup below has claimed `role="radiogroup"`/`role="radio"` since the
  // 2026-08-02 a11y pass, and until now it implemented none of the keyboard
  // half of that role: every option was its own Tab stop and the arrow keys
  // did nothing. `Settings.jsx`'s `ChoiceRow` has shipped the correct pattern
  // since 2026-08-16 and the shared component the whole quiz runs through was
  // never given it — the same shape as `Segmented`'s `role="tab"` (§82), one
  // role later.
  //
  // ⚠️ ONE DELIBERATE DIVERGENCE FROM `ChoiceRow`, and it is the whole design
  // of this block: **the arrow keys move focus and do NOT select.** APG's
  // radio pattern selects on arrow, and `ChoiceRow` does exactly that because
  // changing the theme is instant and reversible. Here, selecting IS
  // answering: `choose` fires `onAnswered`, which grades the question, writes
  // it into the Leitner schedule and locks the option set for good. An arrow
  // key that answered on the learner's behalf while they were reading the
  // options would be worse than the defect this fixes. This is APG's own
  // guidance for the case ("do not make selection follow focus when the user
  // could inadvertently change a setting with significant consequences");
  // Space and Enter still activate the focused option, which is how a radio
  // is chosen deliberately.
  //
  // Focus stays live AFTER answering on purpose: the two `SrOnly` markers
  // below are the only non-visual signal of which option was right, and
  // `aria-disabled` (not `disabled`) keeps every option reachable to read.
  // `choose`'s own `if (answered) return` is what makes that safe.
  const optionRefs = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  // Exactly ONE option is in the Tab sequence. Once answered that is the
  // learner's own pick, so tabbing back into the question lands on the answer
  // they gave rather than at the top of a list they can no longer change.
  const tabbable = choice !== null ? choice : focusIndex;

  const moveFocusTo = (i) => {
    const next = (i + question.opts.length) % question.opts.length;
    setFocusIndex(next);
    optionRefs.current[next]?.focus();
  };

  const handleKeyDown = (e, i) => {
    const keys = {
      ArrowRight: i + 1, ArrowDown: i + 1,
      ArrowLeft: i - 1, ArrowUp: i - 1,
      Home: 0, End: question.opts.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    moveFocusTo(keys[e.key]);
  };

  return (
    <div>
      <Text
        as={headingLevel}
        variant="heading"
        color={ink.strong}
        tabIndex={autoFocusHeading ? -1 : undefined}
        style={{ marginBottom: space["3"], outline: "none" }}
      >
        {question.q}
      </Text>

      <div role="radiogroup" aria-label={question.q}>
        {question.opts.map((option, i) => {
          const isRight = i === question.answer;
          const picked = i === choice;

          // Three states, not two. Unanswered: neutral. Answered-and-disclosed:
          // mark the right answer and the learner's wrong pick, leaving the
          // others neutral so attention goes to the two that matter.
          // Answered-but-withheld (the hook): mark only what they picked, in
          // accent rather than ok/bad — the color must not leak a verdict.
          const border = !answered
            ? line.strong
            : !disclosed
              ? (picked ? fill.accent : line.hairline)
              : isRight ? fill.ok : picked ? fill.bad : line.hairline;
          const bg = !answered
            ? surface.card
            : !disclosed
              ? (picked ? surface.accentWash : surface.card)
              : isRight ? surface.okWash : picked ? surface.badWash : surface.card;

          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={picked}
              ref={(el) => { optionRefs.current[i] = el; }}
              tabIndex={i === tabbable ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, i)}
              // `aria-disabled`, NOT `disabled` — and the difference is a
              // learner's place on the page. A native `disabled` button is
              // removed from the tab order, so the browser blurs it the moment
              // it is set: answering a question with the keyboard dropped
              // `document.activeElement` to `<body>`, and the learner had to
              // tab from the top of the document to reach the explanation and
              // the Continue button. Measured live 2026-09-08 on
              // `index-DkIEnxqk.js` at 375x812, on BOTH surfaces this component
              // renders — the lesson reader's check and a Practice session
              // (focusables 16 -> 12 and 8 -> 5, tabbable options 4 -> 0,
              // `activeElement` BODY in both).
              //
              // `aria-disabled` announces the same state and keeps the node
              // focusable, so focus simply stays on the option that was just
              // activated. That also makes the two `SrOnly` markers below
              // reachable by Tab rather than only in a screen reader's browse
              // mode — they are the ONLY non-visual signal of which option was
              // right, so a keyboard-driven screen-reader user could not get to
              // them at all.
              //
              // The re-entry guard is `choose`'s own `if (answered) return`,
              // which was already there and is what makes this safe: an
              // `aria-disabled` button still fires click on Enter and Space.
              // Nothing visual changes — no `:disabled` rule exists in
              // `index.css` and every property here is inline, so the UA's
              // disabled styling was never reaching these buttons.
              aria-disabled={answered || undefined}
              onClick={() => choose(i)}
              style={{
                display: "flex", alignItems: "center", gap: space["3"],
                width: "100%", textAlign: "left",
                padding: `${space["3"]}px ${space["4"]}px`,
                // Already cleared 44 on this padding alone. Stated rather than
                // left to coincidence: a later padding change should not be
                // able to drop the answer options under the floor in silence.
                minHeight: MIN_TAP,
                marginBottom: space["2"],
                borderRadius: radius.md,
                border: `1.5px solid ${border}`,
                background: bg,
                color: ink.body,
                fontSize: "1rem",
                fontWeight: disclosed && isRight ? 600 : 400,
                cursor: answered ? "default" : "pointer",
              }}
            >
              <span style={{ flex: 1 }}>{option}</span>
              {/* Withheld mode marks the pick without judging it, so the row
                  still reads as "this is what you chose" to a screen reader. */}
              {answered && !disclosed && picked && (
                <span style={{ color: ink.accent, fontSize: "0.8125rem", fontWeight: 600 }}>
                  {t.hookYourGuess}
                </span>
              )}
              {/* Both markers carry an `SrOnly` label, and that text is the
                  ONLY non-visual signal of which option was right. `Icon` is
                  `aria-hidden`, and the green/red border and wash are color —
                  so without these two strings the disclosed state reads to a
                  screen reader exactly like the neutral one, while
                  `aria-checked` announces the learner's WRONG pick as the
                  selected radio and the correct option as unselected. Measured
                  live 2026-08-30 before the labels existed. The explanation
                  below is not a substitute: it is prose written to teach the
                  concept, and 15 of the 46 explanations do not name the
                  correct option's own words at all.
                  Appended as content rather than set as `aria-label` so the
                  visible option text stays the start of the accessible name
                  (WCAG 2.5.3, and voice control keeps working). */}
              {disclosed && isRight && (
                <span style={{ color: ink.ok, display: "flex" }}>
                  <SrOnly>{t.quizMarkCorrect}</SrOnly>
                  <Icon name="check" size="1.1em" strokeWidth={2.5} />
                </span>
              )}
              {/* The learner's own wrong pick gets an equally explicit marker,
                  not just a color shift — so "what I picked" and "what was
                  right" are both legible at a glance, not one marked and one
                  merely tinted. */}
              {disclosed && !isRight && picked && (
                <span style={{ color: ink.bad, display: "flex" }}>
                  <SrOnly>{t.quizMarkWrong}</SrOnly>
                  <Icon name="x" size="1.1em" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* The live region is rendered ALWAYS, empty, and the verdict is switched
          in and out INSIDE it — `{answered && …}` used to wrap the region
          itself, and that is the difference between an announcement and
          silence. A live region has to be in the accessibility tree before its
          content changes: assistive technology registers the region and then
          watches it for mutations, so a node that arrives with its text
          already inside is one insertion rather than a change to anything
          being monitored, and is not reliably announced. Measured on the built
          app 2026-09-08 at lesson 35 with the policy simulator as the control:
          answering the check inserted an `aria-live="polite"` node that had
          not existed a moment earlier, carrying all 191 characters of
          "Correct!" plus the explanation; the simulator's always-rendered
          region, stamped before the interaction, kept its stamp and went 0 ->
          521 characters, which is the shape that DOES announce.
          The cost of getting it wrong is the whole point of this component:
          `question.explain` is the teaching, and since answering now leaves
          focus on the option that was pressed (see `aria-disabled` above),
          nothing carries the reader to the verdict either — the two `SrOnly`
          markers on the options are the only other non-visual trace, and they
          name the right answer without explaining it.
          `role="alert"` would announce on insertion — that is the documented
          exception — but it is assertive and interrupts, which is wrong for a
          verdict the reader asked for. `PolicySim` already uses exactly this
          always-rendered idiom, including the conditional `style`, so this is
          the app's own convention rather than a new one. */}
      <div aria-live="polite" style={answered ? { marginTop: space["3"] } : undefined}>
        {answered && (disclosed ? (
          <Note
            tone={correct ? "ok" : "bad"}
            label={correct ? t.quizCorrect : t.quizWrong}
            icon={correct ? "check" : "info"}
          >
            {question.explain}
          </Note>
        ) : (
          // The curiosity gap, held open on purpose. No verdict, and
          // explicitly no `question.explain` — that string names the answer.
          <Note tone="accent" label={t.hookHeldLabel} icon="info">
            {t.hookHeldBody}
          </Note>
        ))}
      </div>
    </div>
  );
}
