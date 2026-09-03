// ═══════════════════════════════════════════════════════════════════════════
// QUIZ TEXT — English (en)
//
// One language. Split this way 2026-08-17 (backlog item 48), the same second
// axis item 45 applied to lesson content: quizData.js carried all five
// languages together (128 kB of text, of which any one reader could read
// ~25 kB), and it was statically imported by both Practice and LessonReader.
//
// Index-aligned with quizMeta.js — entry i here is entry i there. That
// alignment is how a question's words are found once its schedule entry has
// been looked up by id, so all six files reorder together or not at all;
// see quizMeta.js. (Until 2026-09-01 the alignment also carried every
// learner's persisted schedule, which is no longer true.)
//
// The language-independent `lesson` and `answer` fields are NOT here on
// purpose. They live once, in quizMeta.js.
// ═══════════════════════════════════════════════════════════════════════════

export const quizText = [
  {
    "q": "What drives the economy?",
    "opts": [
      "Only government spending",
      "Gold reserves",
      "Total spending (money + credit)",
      "Stock prices"
    ],
    "explain": "Total spending drives the economy. Spending = money + credit. Every dollar spent becomes someone else's income."
  },
  {
    "q": "What is the most important part of the economy?",
    "opts": [
      "Credit",
      "Gold",
      "Government",
      "Technology"
    ],
    "explain": "Credit is the most important and most volatile part of the economy. Total credit outstanding in the US is many times larger than the monetary base (M0)."
  },
  {
    "q": "How long is the short-term debt cycle?",
    "opts": [
      "1-2 years",
      "20-30 years",
      "75-100 years",
      "5-8 years"
    ],
    "explain": "The short-term debt cycle lasts 5-8 years. It's the business cycle controlled primarily by the central bank through interest rates."
  },
  {
    "q": "What causes inflation?",
    "opts": [
      "Too little government spending",
      "Spending growing faster than production",
      "Low interest rates alone",
      "Stock market crashes"
    ],
    "explain": "When spending and incomes grow faster than the production of goods, prices rise. That's inflation."
  },
  {
    "q": "What happens during deleveraging that's different from recession?",
    "opts": [
      "Stock market goes up",
      "Government stops spending",
      "Banks have too much money",
      "Interest rates are already at 0% — can't cut more"
    ],
    "explain": "In a deleveraging, rates are already at 0%, so the Fed's normal tool (cutting rates) doesn't work. That's why QE and the other tools are needed."
  },
  {
    "q": "An inverted yield curve predicts:",
    "opts": [
      "Immediate stock rally",
      "Low inflation",
      "Recession within 12-18 months",
      "Strong GDP growth"
    ],
    "explain": "Inverted yield curves have preceded every US recession since 1955 — a strong track record, though not every inversion has been followed by a recession, so it isn't a perfect predictor. When short rates exceed long rates, it signals economic weakness ahead."
  },
  {
    "q": "What is QE (Quantitative Easing)?",
    "opts": [
      "Central bank buys bonds to inject money when rates are at 0%",
      "Government raises taxes",
      "Banks stop lending",
      "Prices frozen by law"
    ],
    "explain": "QE is the Fed's emergency tool. When rates are at 0%, it prints money to buy bonds, injecting liquidity into the system."
  },
  {
    "q": "The first rule of thumb for managing debt is:",
    "opts": [
      "Always buy stocks",
      "Never borrow money",
      "Save 50% of income",
      "Don't have debt rise faster than income"
    ],
    "explain": "If debt rises faster than income, your debt burdens will eventually crush you. This applies to individuals AND nations."
  },
  {
    "q": "What matters most for economic growth in the long run?",
    "opts": [
      "Credit expansion",
      "Productivity growth",
      "Government stimulus",
      "Stock market gains"
    ],
    "explain": "Productivity growth is what raises living standards over the long run. Credit matters most in the short run and creates the cycles — but it can't create real, lasting growth on its own."
  },
  {
    "q": "Which of these is NOT one of the 4 tools for reducing a debt burden?",
    "opts": [
      "Austerity (cutting spending)",
      "Debt restructuring or default",
      "Raising interest rates further",
      "Printing money (QE)"
    ],
    "explain": "The 4 tools are austerity, debt restructuring/default, wealth redistribution (taxes), and printing money. Raising rates further isn't one of them — in a deleveraging, rates are usually already near 0%."
  },
  {
    "q": "What is the Fed Funds Rate?",
    "opts": [
      "The key rate that influences nearly all other interest rates",
      "A tax rate on capital gains",
      "The interest rate on 30-year Treasury bonds only",
      "A rate set directly by Congress"
    ],
    "explain": "The Fed Funds Rate is the rate banks charge each other overnight, set by the Federal Reserve. It's the master signal that ripples out to mortgages, savings accounts, and credit cards."
  },
  {
    "q": "During the 'Trough' phase of the economic cycle, historically:",
    "opts": [
      "Interest rates are typically at their highest point",
      "Pessimism is at its worst, but it has often been a strong time to find investment opportunities",
      "Inflation is usually at its peak",
      "Stocks have historically continued falling for years afterward"
    ],
    "explain": "At the trough, sentiment is at its most negative — but historically, the year following a market bottom has shown some of the strongest average returns, since expansion begins again from there. This is a historical pattern, not a guarantee for any specific future trough."
  },
  {
    "q": "Which economic indicator is often called the 'Fear Gauge'?",
    "opts": [
      "GDP",
      "CPI",
      "VIX",
      "PMI"
    ],
    "explain": "The VIX measures expected market volatility. There are no official cutoffs, but as a rough guide, below 15 suggests calm markets and above 40 extreme panic. Contrarian investors watch for spikes as potential buying opportunities."
  },
  {
    "q": "Why does the long-term debt cycle eventually have to turn?",
    "opts": [
      "Because governments legally cap borrowing",
      "Because debts eventually grow faster than the incomes needed to repay them",
      "Because interest rates are fixed by law",
      "Because productivity stops growing entirely"
    ],
    "explain": "Over decades, debt burdens can rise faster than the incomes that service them. That cannot continue indefinitely, so the cycle turns into a period of deleveraging — which is what the next lesson covers."
  },
  {
    "q": "What is a commonly cited starting guideline for splitting income across needs, wants, and savings?",
    "opts": [
      "70% needs / 20% wants / 10% savings",
      "20% needs / 50% wants / 30% savings",
      "90% needs / 5% wants / 5% savings",
      "50% needs / 30% wants / 20% savings"
    ],
    "explain": "A commonly cited starting split is about 50% needs, 30% wants, 20% savings or debt payoff — a rule of thumb to adjust, not a strict rule."
  },
  {
    "q": "What's a commonly cited guideline for the size of an emergency fund?",
    "opts": [
      "3-6 months of essential expenses",
      "One week of expenses",
      "A fixed $100, regardless of income",
      "As much as you can put into stocks"
    ],
    "explain": "A common guideline is 3-6 months of essential expenses, kept somewhere safe and quick to access — not invested for growth."
  },
  {
    "q": "Using the Rule of 72, approximately how many years does it take money to double at 9% annual growth?",
    "opts": [
      "3 years",
      "24 years",
      "8 years",
      "72 years"
    ],
    "explain": "72 ÷ 9 ≈ 8. The Rule of 72 is a quick approximation for doubling time, not an exact formula."
  },
  {
    "q": "Which two factors usually matter most for a credit score?",
    "opts": [
      "Your job title and salary alone",
      "Payment history and credit utilization",
      "How many bank branches you've visited",
      "Your age and zip code"
    ],
    "explain": "Payment history (paying on time) and credit utilization (how much of your available credit you're using) are usually the biggest factors."
  },
  {
    "q": "What is the main idea behind diversification?",
    "opts": [
      "Buying only the single best-performing stock",
      "Avoiding bonds entirely since they're 'boring'",
      "Timing the market to buy at the exact bottom",
      "Spreading money across many holdings so no single one can sink the whole portfolio"
    ],
    "explain": "Diversification spreads risk across many holdings, so one holding falling sharply doesn't sink the whole portfolio."
  },
  {
    "q": "What's the key difference between a Traditional and a Roth retirement account?",
    "opts": [
      "Traditional is taxed when you withdraw in retirement; Roth is taxed when you contribute now",
      "Traditional is taxed when you contribute; Roth is taxed when you withdraw",
      "Both are taxed the exact same way, just at different banks",
      "Neither is ever taxed"
    ],
    "explain": "Traditional accounts skip tax now and pay it on withdrawal in retirement; Roth accounts pay tax on the money before it goes in, so qualified withdrawals later are tax-free. Which is better depends on an individual's own tax situation, not a fixed rule."
  },
  {
    "q": "If a raise pushes part of your income into a higher tax bracket, what actually happens?",
    "opts": [
      "Your entire income gets taxed at the new, higher rate",
      "You take home less money overall than before the raise",
      "Only the portion of income that fell into the new bracket is taxed at the higher rate — the rest is unchanged",
      "The government takes the entire raise as tax"
    ],
    "explain": "Marginal tax brackets only tax the slice of income that falls into each bracket, not the whole income at that bracket's rate. A raise can never shrink your take-home pay — it can only mean the extra dollars are taxed a bit more."
  },
  {
    "q": "If Policy A has a higher deductible than Policy B, with the same coverage limit, what would you expect based on the trade-off this lesson described?",
    "opts": [
      "Policy A has a higher premium than Policy B",
      "Policy A has a lower premium than Policy B",
      "Policy A and Policy B have the exact same premium",
      "The deductible has no relationship to the premium"
    ],
    "explain": "A higher deductible generally means a lower premium, because the policyholder agrees to absorb more of the smaller, more common losses themselves, and the insurer only pays out once the loss exceeds that threshold."
  },
  {
    "q": "A savings account grows 3% in a year where prices across the economy rise 5%. What happened to its real purchasing power?",
    "opts": [
      "It shrank — the real return was roughly -2%, even though the balance grew",
      "It grew by 3%, the same as the nominal return",
      "It grew by 8%, combining both rates",
      "It stayed exactly the same regardless of inflation"
    ],
    "explain": "Real return ≈ nominal return − inflation rate: 3% − 5% ≈ -2%. The balance grew in dollar terms, but it now buys less than it did a year ago — a bigger number on the statement didn't mean more real wealth."
  },
  {
    "q": "A freelancer receives 1099 income instead of a W-2 paycheck. What's the key tax difference?",
    "opts": [
      "Nothing changes — taxes work exactly the same either way",
      "The freelancer pays income tax but owes no payroll/Social Security taxes at all",
      "The IRS automatically withholds taxes from 1099 payments, just like a W-2",
      "No taxes are withheld automatically, and the freelancer owes both halves of the payroll tax (self-employment tax) themselves"
    ],
    "explain": "1099 income has nothing withheld automatically, and because there's no employer to cover its half of Social Security/Medicare, the self-employed worker owes both halves — the self-employment tax — on top of ordinary income tax, usually paid via quarterly estimated payments."
  },
  {
    "q": "Two funds hold the same investments, but Fund A charges a 0.05% annual fee and Fund B charges 1.05%. Invested for 30 years at the same underlying return, what happens?",
    "opts": [
      "Almost nothing — a 1-point fee difference is too small to matter over decades",
      "Fund B's fee, compounding every year, consumes roughly a quarter of the ending balance versus Fund A",
      "Fund B automatically returns more because higher fees fund better research",
      "The fee only applies once, at the time of purchase, so long-term results are unaffected"
    ],
    "explain": "Because a fee is deducted every year — including from growth the fee already took in prior years — it compounds against the balance just like the interest in “Compound Interest” compounds for it. A 1-percentage-point difference, held for 30 years, is enough to consume roughly a quarter of the ending balance even though both funds hold identical investments."
  },
  {
    "q": "A homeowner is 3 years into a 30-year mortgage. Which best describes the split of their monthly payment between principal and interest?",
    "opts": [
      "Mostly principal, since most of the loan should already be paid off",
      "Split evenly between principal and interest",
      "Mostly interest, since interest is charged on the large remaining balance early in the loan",
      "Entirely interest, since no principal is paid until the loan is refinanced"
    ],
    "explain": "Interest is charged on the remaining balance, which is largest early in a loan, so early payments are mostly interest — the same compounding math from “Compound Interest”, working against the borrower. The principal share only overtakes the interest share around two-thirds of the way through a typical 30-year loan."
  },
  {
    "q": "A brokerage account holds $500 in uninvested cash that was just deposited. What generally happens to it if the owner does nothing else?",
    "opts": [
      "It automatically grows through the account's own compound interest, just like a savings account",
      "It's automatically invested into a diversified index fund by the brokerage",
      "The brokerage takes a portion of it as a monthly maintenance fee",
      "It sits there and generally doesn't grow — buying an actual investment is a separate, deliberate step"
    ],
    "explain": "A brokerage account is a container, not an investment itself. Uninvested cash sitting inside it generally doesn't grow on its own — buying stocks, bonds, or funds is a separate step the account owner has to take deliberately."
  },
  {
    "q": "Someone rewrites their will after a divorce to leave everything to their new spouse, but never updates the beneficiary form on a 401(k) they opened years earlier — it still lists their ex-spouse. Who actually receives that 401(k) when they die?",
    "opts": [
      "The ex-spouse, because the account's own beneficiary designation overrides what the will says",
      "The new spouse, because the will was written more recently",
      "The money is split evenly between the ex-spouse and new spouse automatically",
      "The 401(k) provider decides based on which spouse contributed more"
    ],
    "explain": "A will doesn't control accounts with their own beneficiary designation, like a 401(k) or life insurance policy from “Retirement Accounts” and “Insurance”. Whoever is named on that account's beneficiary form receives it directly, regardless of what a more recent will says — which is why beneficiary forms need to be updated separately after major life changes."
  },
  {
    "q": "A person sees a credit score of 705 in one app and 680 in a different app on the same day. Based on this lesson, what's the most likely explanation?",
    "opts": [
      "One of the apps made a calculation error and should be reported",
      "Credit scores update in real time, so the difference reflects a transaction made between checks",
      "The two apps likely pulled from different credit bureaus or used different scoring models, since a person has more than one score",
      "Only the higher score is accurate; scores can never legitimately be lower than a person's \"true\" score"
    ],
    "explain": "A credit report is kept separately by three bureaus, and multiple scoring models (like FICO and VantageScore) can each turn the same report into a different number — so a single person has several credit scores rather than one, and two apps can legitimately disagree without either being wrong."
  },
  {
    "q": "According to this lesson, what makes something an asset rather than a liability?",
    "opts": [
      "Whether it was expensive enough to be worth financing",
      "Which direction money flows after you buy it",
      "Whether you paid with cash instead of credit",
      "Whether other people would consider the purchase responsible"
    ],
    "explain": "The test is the direction of cash over time, not the price, the payment method, or how the purchase looks to others. Plenty of real purchases sit in between — a home builds equity while also costing money every month — which is exactly why the lesson treats it as a question worth asking deliberately rather than a way to sort purchases into good and bad."
  },
  {
    "q": "Two people each have a gap of $5,000 a year between what they earn and what they spend, but one earns $50,000 and the other $120,000. According to this lesson, what does that tell you?",
    "opts": [
      "The higher earner is necessarily better off, because a larger income always compounds faster",
      "The lower earner must be budgeting poorly, since the same gap on less income is unlikely",
      "Nothing useful — a gap is only meaningful once you know what each person invests it in",
      "They are the same distance from any goal the gap funds, even though one has a materially nicer life"
    ],
    "explain": "What funds an emergency fund, invested savings, or the eventual option to work less is the gap between earning and spending — not income by itself. Two identical gaps are identically far from those goals, which is why high earners can live paycheck to paycheck: lifestyle inflation is precisely the mechanism that keeps the gap flat while the top line rises."
  },
  {
    "q": "Jordan spends a $2,000 bonus on a home theater. Alex leaves the same $2,000 in an account earning 6% a year and doesn't touch it. Ten years later, what does the lesson say is the real cost of Jordan's purchase?",
    "opts": [
      "The $2,000 he paid, plus roughly $1,580 more — what that money would have grown into if he'd chosen differently",
      "Exactly $2,000, since that's the price he paid",
      "Nothing, since he already got the full use and enjoyment of it",
      "Whatever the home theater would resell for today"
    ],
    "explain": "Opportunity cost means the real cost of a choice includes the value of the next-best alternative given up, not just the sticker price. Jordan's $2,000 also stopped being $2,000 growing at 6% a year, so the honest comparison is the enjoyment he got against the roughly $3,580 that money would have become — not against the $2,000 price tag alone."
  },
  {
    "q": "Priya feels a bad cold coming on the night before a concert she already paid $120 for. According to the lesson, what should the $120 she already spent count for in deciding whether to go?",
    "opts": [
      "Nothing — it's gone either way and shouldn't affect the decision",
      "The full $120, since going honors what she paid",
      "Half of it, since she's already sick",
      "It should make her more likely to stay home, to protect the ticket's value"
    ],
    "explain": "A sunk cost — money already spent that no future choice can recover — should carry zero weight in the decision. Once the $120 is removed from the comparison, the real choice is between a miserable night out and a restful night in, not between \"wasting\" and \"not wasting\" the ticket."
  },
  {
    "q": "Marcus buys an investment mostly because three different people have mentioned it's tripled in price recently. According to the lesson, what is the crowd of buyers around him actually evidence of?",
    "opts": [
      "That the price will keep tripling",
      "That Marcus did enough research to buy confidently",
      "That the asset's fundamentals must have improved",
      "That other people are buying it — not that it's a good value"
    ],
    "explain": "A crowd's size and enthusiasm are evidence that a lot of people are doing the same thing — not evidence about the asset's actual value. A rising price can just as easily mean the same future gains now cost more, since it reflects everyone who already bought, not what's still ahead."
  },
  {
    "q": "Priya buys a jacket marked '$220, now $89' and feels she got a bargain, without comparing it to what similar jackets cost elsewhere. According to the lesson, what does the crossed-out $220 actually tell her about whether $89 is a fair price?",
    "opts": [
      "That $89 is definitely a fair price, since the jacket used to cost more",
      "That she should have negotiated an even lower price before buying",
      "Almost nothing — it's a reference point, not evidence of the jacket's actual value",
      "That jackets in general are becoming cheaper over time"
    ],
    "explain": "The size of an anchor — like a crossed-out 'was' price — doesn't tell you whether the resulting price is actually fair. It only tells you what number someone else chose to place next to it, often because it makes the second number look smaller by comparison. Judging a price against independent information (what comparable items actually cost) is different from judging it against whichever number was placed beside it."
  },
  {
    "q": "Tomás invests in a company after a friend's tip, then reads closely the article titled 'Why analysts are bullish' but skims past the one titled 'Three risks investors are ignoring,' telling himself it's probably clickbait. What does the lesson call this pattern?",
    "opts": [
      "Diversification — spreading research across many independent sources",
      "Confirmation bias — seeking out and favoring information that supports a decision already made",
      "Anchoring — judging the company's price against an arbitrary reference number",
      "Loss aversion — feeling losses more strongly than equivalent gains"
    ],
    "explain": "Confirmation bias is seeking out, favoring, and remembering information that supports a decision already made, while dismissing or skipping what contradicts it. Tomás's search returned both articles — what changed was which one he gave his attention to, and which one he dismissed as clickbait without reading."
  },
  {
    "q": "Priya says she'd rather have $50 today than $65 in a month, but when asked to choose between $50 in twelve months and $65 in thirteen months, she picks the $65. Both choices involve waiting one extra month for $15 more. What does the lesson call this pattern?",
    "opts": [
      "Anchoring — Priya is judging the $65 against the wrong reference point",
      "Present bias (hyperbolic discounting) — an immediate reward gets weighted far more heavily than the same reward slightly delayed",
      "Loss aversion — Priya feels the $15 as a loss rather than a gain",
      "Diversification — Priya is spreading her choice across two different time periods"
    ],
    "explain": "Present bias means an immediate reward is weighted out of proportion to how much time actually separates it from a delayed one. The one-month wait and $15 difference are identical in both choices, but only the first choice has 'today' as an option — and that's what flips Priya's answer, not a difference in the underlying math."
  },
  {
    "q": "Jordan's phone still works — it has one small crack in the corner, but every app opens fine. Somewhere during checkout, 'I want a new phone' quietly became 'I need a new phone.' What is that relabeling actually doing?",
    "opts": [
      "Making the new phone cheaper",
      "Proving the new phone is a bad purchase",
      "Skipping the evaluation a want is supposed to get",
      "Fixing the cracked screen without paying for a new phone"
    ],
    "explain": "Calling a want a need doesn't change the phone, the crack, or the price — it changes whether the purchase ever gets weighed at all. A real need doesn't have to justify itself, so relabeling something as a need is a shortcut past the one question a want is supposed to face: is this worth it, at this price, right now."
  },
  {
    "q": "Marcus has $3,000 he won't need for at least fifteen years — his emergency fund and this year's expenses are already covered elsewhere — and it's currently sitting in a savings account earning less than inflation. According to the lesson, what is that arrangement actually costing him?",
    "opts": [
      "Nothing — a savings account is always the safest place for any amount of money, regardless of how long it will sit there",
      "The $3,000 loses its deposit insurance once it's held for longer than a year",
      "The account's low interest rate guarantees the $3,000 will shrink in dollar terms no matter how long it sits there",
      "He's paying for stability this specific money doesn't currently need, since its long time horizon would give it room to recover from a temporary drop before he'd ever withdraw it"
    ],
    "explain": "Stability has value when money might be needed on short notice and can't afford to be down that day — that's the job a savings account does well. Marcus's $3,000 has no near-term claim on it, so its fifteen-year horizon gives it time to recover from any bad stretch long before he'd ever withdraw it. The protection a savings account offers is being paid for (in lost growth) even though this particular dollar isn't the one that currently needs that protection."
  },
  {
    "q": "Elena gets a $600 tax refund and spends it on a spontaneous weekend trip she would never have booked with $600 from her paycheck — money she budgets carefully every month. What does the lesson call this pattern of treating the refund differently from paycheck money of the same amount?",
    "opts": [
      "Mental accounting — sorting money into mental buckets and applying a looser rule to money that feels 'found' rather than earned",
      "Diversification — spreading spending across several different purchases instead of one",
      "Present bias — valuing a reward available today far more than the same reward delayed",
      "Anchoring — judging the trip's price against an arbitrary reference number"
    ],
    "explain": "Mental accounting is treating money differently based on its source or the label attached to it, even though a dollar buys the same thing no matter where it came from. Elena's $600 refund and $600 of paycheck money are financially identical; only the mental rule attached to each — 'found money' versus 'earned money' — differs, and that rule, not the money itself, is what changed her decision."
  },
  {
    "q": "Marcus bought a stock that has since dropped 20%. He refuses to sell it, even though he has a better use for the money, because 'I'll just wait until it gets back to what I paid for it.' A different stock he bought instead rose 20%, and he sold it within a week to 'lock in the win.' What pattern does the lesson say is driving Marcus to treat these two situations so differently, even though the dollar amounts involved are the same?",
    "opts": [
      "Sunk cost — he's counting the money he already spent on the falling stock as a reason to keep spending more on it",
      "Loss aversion — the pain of locking in the loss feels far heavier than the pleasure of an equivalent gain",
      "Anchoring — he's judging the stock's current price against an arbitrary reference number",
      "Diversification — spreading money across more than one holding instead of concentrating it in one"
    ],
    "explain": "Loss aversion is the tendency for a loss to feel roughly twice as painful as an equivalent gain feels good, which pushes people to avoid officially realizing a loss even when the money would be better used elsewhere. Sunk cost (option 0) is a related but distinct pattern about being influenced by money already spent; here, the deciding factor is the asymmetric pain of admitting the loss is real, not the amount already invested."
  },
  {
    "q": "After Maria picks a stock on a hunch and it rises 40% in two months, she starts making three times as many trades, each with less research than before, because she now feels like she has a knack for picking stocks. Which pattern best explains her behavior?",
    "opts": [
      "Sunk cost — she keeps investing because she's already put money in",
      "FOMO — she's copying what other successful investors around her are doing",
      "Overconfidence after a lucky outcome — she's crediting the win to her own skill rather than considering how much luck was involved, and increasing her risk-taking as a result",
      "Loss aversion — she's trying to avoid the pain of admitting a loss"
    ],
    "explain": "This is overconfidence after a lucky outcome (self-attribution bias): crediting a win to one's own skill and increasing risk-taking as a result, without weighing how much of the outcome was actually luck. FOMO (option 1, “Everyone Can't Be Wrong — Can They?”) is about copying what other people are doing, which isn't what's driving Maria here — no one else's behavior is mentioned. Sunk cost (option 0) is about being influenced by money already spent, and loss aversion (option 3, “Why Does Losing $50 Hurt More Than Finding $50 Feels Good?”) is about the asymmetric pain of a loss — neither fits a story about a single win driving more risk-taking."
  },
  {
    "q": "Why is personal finance largely absent from most school curricula?",
    "opts": [
      "There is nothing useful that could be taught about it",
      "Curricula favor examinable subjects, and money rules are local and change often",
      "It is deliberately withheld to keep people in debt",
      "Every country already teaches it thoroughly"
    ],
    "explain": "Curricula are built around examinable, standardizable subjects, and money rules differ by country and change every few years — so the topic is awkward to standardize and goes stale quickly. It fell between subjects rather than being withheld on purpose. The effect on you is the same either way, which is why it's worth naming."
  },
  {
    "q": "Priya works extra shifts; Tom collects rent on an apartment he owns. Both receive about $1,000. What is the most accurate thing to say about the two?",
    "opts": [
      "Tom's $1,000 is worth more than Priya's",
      "They are identical, since the amounts match",
      "They arrived by different mechanisms",
      "Only Priya's counts as real income"
    ],
    "explain": "The amounts are the same and neither is worth more per pound. What differs is the mechanism: Priya's is paid for hours she worked, Tom's is produced by an asset he had to buy first, and each carries its own demands and its own ways of failing — an empty apartment pays nothing, while a shift always pays."
  },
  {
    "q": "Alina owns a small cleaning company with one employee and works in it herself. If she stopped working for three months, what would most likely happen to her business income?",
    "opts": [
      "It would stay exactly the same, since she owns the business",
      "It would fall to zero immediately, like a wage",
      "It would shrink roughly in proportion to how much the business depended on her personally",
      "It would increase, because she stopped taking pay"
    ],
    "explain": "Business income sits between a wage and a passive source. The parts that run without her — her employee's work, existing customers — carry on; the parts that were really her own labor stop. In a two-person company that personal share is large, so the income shrinks substantially without disappearing."
  },
  {
    "q": "What does the phrase 'passive income' tend to leave out?",
    "opts": [
      "That it is always larger than a wage",
      "The capital, time, skill or risk required up front — and that it lacks a wage's protections",
      "That it is available to anyone immediately at no cost",
      "That it is taxed identically to wages everywhere"
    ],
    "explain": "'Passive' describes only the final stage, once something is already built or bought. Getting there takes capital, years, skill or risk, and the result gives up protections a wage has — legal minimums, notice periods, and being paid regardless of how the business did. It isn't a better rung on a ladder; it's a different trade."
  }
];
