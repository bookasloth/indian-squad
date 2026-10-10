import type { SportSlug } from "@/lib/site";
import type { Fmt } from "@/lib/player-stats";

export interface Comparison {
  sport: SportSlug;
  slug: string;
  a: string;
  b: string;
  /** The format the debate is about; the page opens on it. */
  format: Fmt;
  /** Which figures the generated FAQ answers lead with. */
  kind: "batting" | "bowling";
  title: string;
  description: string;
  /** Our words. Qualitative on purpose: the numbers live in the table and refresh weekly. */
  intro: string[];
  verdict: string;
}

// ponytail: hand-written, one entry per debate fans actually have. Verdicts were
// written against the Cricsheet figures in October 2026; reread them when a
// player's numbers move a lot (a big series, a retirement).
export const COMPARISONS: Comparison[] = [
  {
    sport: "cricket",
    slug: "virat-kohli-vs-rohit-sharma",
    a: "virat-kohli",
    b: "rohit-sharma",
    format: "odi",
    kind: "batting",
    title: "Virat Kohli vs Rohit Sharma in ODIs",
    description:
      "Kohli vs Rohit in one-day cricket: averages, strike rates by phase, record against the top sides and each man's best three-year spell — plus the fan vote.",
    intro: [
      "India's two great one-day batters of their generation did different jobs. Kohli, mostly at three, built innings and finished chases; Rohit, opening, set the tempo and turned good starts into very big scores.",
      "That shows in the numbers: Kohli's figures are about consistency, Rohit's about damage done when he gets going.",
    ],
    verdict:
      "Kohli is the more reliable run-maker — a clearly higher average, a better record against the strongest sides and a peak spell few batters have matched. Rohit scores slightly faster in every phase and owns the highest individual score in ODI history. For a match you must not lose, Kohli; for the fastest start, Rohit.",
  },
  {
    sport: "cricket",
    slug: "jasprit-bumrah-vs-mohammed-shami",
    a: "jasprit-bumrah",
    b: "mohammed-shami",
    format: "odi",
    kind: "bowling",
    title: "Jasprit Bumrah vs Mohammed Shami in ODIs",
    description:
      "Bumrah vs Shami in one-day cricket: wickets, economy in the powerplay and at the death, record against the top sides, and best spells — plus the fan vote.",
    intro: [
      "Two of India's finest one-day fast bowlers, with different gifts. Shami hits the seam and takes wickets in clusters; Bumrah's unusual action and yorkers make him almost impossible to score off.",
    ],
    verdict:
      "Shami takes wickets more often and has the better record against the top sides. Bumrah concedes far fewer runs, above all at the death, where the gap is wide. Their averages are almost identical, so the choice depends on the job: Shami to break a partnership, Bumrah to close out an innings.",
  },
  {
    sport: "cricket",
    slug: "ravichandran-ashwin-vs-ravindra-jadeja",
    a: "ravichandran-ashwin",
    b: "ravindra-jadeja",
    format: "test",
    kind: "bowling",
    title: "Ravichandran Ashwin vs Ravindra Jadeja in Tests",
    description:
      "Ashwin vs Jadeja in Test cricket: wickets, bowling average and strike rate, batting, and record against the top sides — India's great spin pair compared.",
    intro: [
      "For a decade, Ashwin and Jadeja were the reason India were so hard to beat at home. Ashwin the off-spinning thinker, Jadeja the relentless left-armer who also became a genuine Test batter.",
    ],
    verdict:
      "As a bowler, Ashwin is ahead: more wickets, a better average and a quicker strike rate, including against the strongest sides. Jadeja is the tighter bowler and by far the better batter, with a much higher average. Ashwin was the better bowler; Jadeja the more complete cricketer.",
  },
  {
    sport: "cricket",
    slug: "rishabh-pant-vs-sanju-samson",
    a: "rishabh-pant",
    b: "sanju-samson",
    format: "t20i",
    kind: "batting",
    title: "Rishabh Pant vs Sanju Samson in T20Is",
    description:
      "Pant vs Samson in T20 internationals: strike rate in the powerplay and middle overs, average, hundreds and record against the top sides — the keeper-batter debate.",
    intro: [
      "Both are attacking wicketkeeper-batters who have competed for the same T20I place. Pant made his name in Test cricket; Samson's international career took off in T20Is.",
    ],
    verdict:
      "In T20 internationals the numbers favour Samson clearly: a higher average and a much higher strike rate in every phase, better figures against the top sides, and three hundreds. Pant's greatest work has come in other formats.",
  },
  {
    sport: "cricket",
    slug: "shubman-gill-vs-yashasvi-jaiswal",
    a: "shubman-gill",
    b: "yashasvi-jaiswal",
    format: "test",
    kind: "batting",
    title: "Shubman Gill vs Yashasvi Jaiswal in Tests",
    description:
      "Gill vs Jaiswal in Test cricket: average, strike rate, hundreds, record against the top sides and recent form — the next generation of India's top order compared.",
    intro: [
      "Two young batters who will shape India's Test top order for years. Jaiswal arrived as a fearless left-handed opener; Gill, already a run-machine in white-ball cricket, has grown into a heavy Test scorer.",
    ],
    verdict:
      "Very close. Jaiswal has the higher career average and scores faster, and does slightly better against the strongest sides. Gill has more hundreds and the stronger recent peak. On the evidence so far, Jaiswal for consistency, Gill for current form — and India want both.",
  },
  {
    sport: "cricket",
    slug: "suryakumar-yadav-vs-rohit-sharma",
    a: "suryakumar-yadav",
    b: "rohit-sharma",
    format: "t20i",
    kind: "batting",
    title: "Suryakumar Yadav vs Rohit Sharma in T20Is",
    description:
      "Suryakumar vs Rohit in T20 internationals: strike rate in every phase, average, record against the top sides and best spells — India's T20 batting greats compared.",
    intro: [
      "Rohit, an opener for most of his long T20I career, retired from the format after the 2024 World Cup win. Suryakumar's 360-degree hitting from the middle order made him the world's top-ranked T20I batter.",
    ],
    verdict:
      "By the rates, Suryakumar: a higher average and a much higher strike rate, quicker in every phase of the innings, and better against the top sides. Rohit scored more runs over a longer career and opened the batting, a harder job early on — but at his best, Suryakumar was the more dangerous T20 batter.",
  },
  {
    sport: "cricket",
    slug: "kuldeep-yadav-vs-axar-patel",
    a: "kuldeep-yadav",
    b: "axar-patel",
    format: "t20i",
    kind: "bowling",
    title: "Kuldeep Yadav vs Axar Patel in T20Is",
    description:
      "Kuldeep vs Axar in T20 internationals: wickets, average, economy and strike rate, record against the top sides — wrist-spin against left-arm all-rounder.",
    intro: [
      "Two left-arm spinners who give India very different things. Kuldeep spins it both ways and hunts wickets; Axar bowls flat and quick, can bowl in the powerplay, and bats in the lower middle order.",
    ],
    verdict:
      "As a bowler, Kuldeep is clearly ahead: he takes wickets far more often, at a better average and a better economy, including against the top sides. Axar's case rests on everything else he brings — powerplay overs and useful runs.",
  },
  {
    sport: "cricket",
    slug: "arshdeep-singh-vs-jasprit-bumrah",
    a: "arshdeep-singh",
    b: "jasprit-bumrah",
    format: "t20i",
    kind: "bowling",
    title: "Arshdeep Singh vs Jasprit Bumrah in T20Is",
    description:
      "Arshdeep vs Bumrah in T20 internationals: wickets, economy in the powerplay and at the death, average and best spells — India's T20 new-ball pair compared.",
    intro: [
      "India's leading T20I wicket-taker against the bowler many consider the best in the world. Arshdeep swings the new ball and bowls at the death; Bumrah does both while conceding remarkably little.",
    ],
    verdict:
      "Arshdeep takes his wickets slightly more often and has more of them, but Bumrah is the better T20I bowler on every rate that measures control — economy in the powerplay and at the death, and average, including against the top sides.",
  },
  {
    sport: "cricket",
    slug: "smriti-mandhana-vs-shafali-verma",
    a: "smriti-mandhana",
    b: "shafali-verma",
    format: "t20i",
    kind: "batting",
    title: "Smriti Mandhana vs Shafali Verma in T20Is",
    description:
      "Mandhana vs Shafali in women's T20 internationals: average, strike rate in the powerplay, record against the top sides and best spells — India's opening pair compared.",
    intro: [
      "India women's long-standing T20I opening pair: Mandhana's elegant left-handed timing alongside Shafali's all-out attack from the first ball.",
    ],
    verdict:
      "They complement each other. Mandhana is the more consistent — a higher average and a much better record against the strongest sides. Shafali is the faster starter, scoring far quicker in the powerplay, and adds handy off-spin. Mandhana for the long innings, Shafali to win the first six overs.",
  },
  {
    sport: "cricket",
    slug: "harmanpreet-kaur-vs-jemimah-rodrigues",
    a: "harmanpreet-kaur",
    b: "jemimah-rodrigues",
    format: "odi",
    kind: "batting",
    title: "Harmanpreet Kaur vs Jemimah Rodrigues in ODIs",
    description:
      "Harmanpreet vs Jemimah in women's ODIs: average, strike rate by phase, record against the top sides and best spells — India's middle order compared.",
    intro: [
      "The two cornerstones of India women's one-day middle order. Harmanpreet, the senior power-hitter famous for her big-match innings; Jemimah, quick on her feet and increasingly the anchor.",
    ],
    verdict:
      "Harmanpreet has the higher career average and a much stronger record against the top sides. Jemimah scores faster through the middle and death overs and her best recent spell is slightly better. Harmanpreet for the big occasion; Jemimah as the player India's middle order is being built around.",
  },
  {
    sport: "cricket",
    slug: "deepti-sharma-vs-sneh-rana",
    a: "deepti-sharma",
    b: "sneh-rana",
    format: "odi",
    kind: "bowling",
    title: "Deepti Sharma vs Sneh Rana in ODIs",
    description:
      "Deepti vs Sneh Rana in women's ODIs: wickets, economy by phase, batting average and record against the top sides — India's spin all-rounders compared.",
    intro: [
      "Two off-spinning all-rounders competing for overlapping roles in India women's ODI side.",
    ],
    verdict:
      "Deepti is ahead on almost every measure: more wickets at a better average and economy, especially against the top sides, and a far higher batting average. Sneh scores a little faster with the bat, but Deepti is the more complete one-day cricketer.",
  },
  {
    sport: "cricket",
    slug: "mohammed-siraj-vs-mohammed-shami",
    a: "mohammed-siraj",
    b: "mohammed-shami",
    format: "test",
    kind: "bowling",
    title: "Mohammed Siraj vs Mohammed Shami in Tests",
    description:
      "Siraj vs Shami in Test cricket: wickets, bowling average, economy, record against the top sides and best spells — India's seam attack compared.",
    intro: [
      "Shami spent a decade as one of India's leading Test seamers; Siraj grew into a central figure of the attack after a breakthrough tour of Australia in 2020–21.",
    ],
    verdict:
      "Shami is ahead on the numbers that matter most in Tests: a better average, a slightly better economy, a better record against the top sides and a stronger peak spell. Siraj owns the more spectacular single spell, but on a whole-career view Shami is the better Test bowler.",
  },
];

export const comparisonsFor = (sport: string) => COMPARISONS.filter((c) => c.sport === sport);
export const getComparison = (sport: string, slug: string) => COMPARISONS.find((c) => c.sport === sport && c.slug === slug);
