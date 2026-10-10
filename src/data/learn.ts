import type { SportSlug } from "@/lib/site";
import type { Qa } from "@/lib/seo";

export interface Explainer {
  sport: SportSlug;
  slug: string;
  title: string;
  /** Meta description. */
  description: string;
  /** First paragraph: answers the title question on its own. */
  answer: string;
  sections: { h: string; body: string[] }[];
  /** Optional term list (the glossary). */
  terms?: { term: string; def: string }[];
  faq: Qa[];
  /** ISO date the article was last reviewed. */
  reviewed: string;
  /** Slugs of other explainers, internal links, or tools to link at the end. */
  related: { label: string; href: string }[];
}

// Original writing for this site, checked against the MCC Laws of Cricket and ICC
// playing conditions. No figures here go stale except where a date says so.
export const EXPLAINERS: Explainer[] = [
  {
    sport: "cricket",
    slug: "how-to-read-a-scorecard",
    title: "How to read a cricket scorecard",
    description:
      "What every column and abbreviation on a cricket scorecard means — R, B, 4s, 6s, SR, O, M, W, extras, fall of wickets, and how dismissals are written.",
    answer:
      "A cricket scorecard has two halves for each innings. The batting card shows each batter's runs, the balls they faced and how they got out; the bowling card shows each bowler's overs, maidens, runs conceded and wickets. Underneath, the team total is written as runs for wickets — 287/6 means 287 runs for the loss of six wickets.",
    sections: [
      {
        h: "The batting card",
        body: [
          "Each row is one batter, in batting order. R is runs scored and B is balls faced. 4s and 6s count boundaries. SR is strike rate: runs per 100 balls, so 45 runs off 30 balls is a strike rate of 150.",
          "The second column says how the batter got out. \"not out\" means they were still batting when the innings ended. A dagger (†) marks the wicketkeeper and (c) marks the captain.",
        ],
      },
      {
        h: "How dismissals are written",
        body: [
          "The bowler always comes after \"b\". \"b Bumrah\" means bowled by Bumrah. \"c Rahul b Siraj\" means caught by Rahul off Siraj's bowling. \"c & b Kuldeep\" means Kuldeep caught it off his own bowling. \"lbw b Jadeja\" is leg before wicket to Jadeja. \"st †Pant b Axar\" means stumped by the keeper off Axar.",
          "Run outs credit the fielders, not a bowler: \"run out (Jadeja)\". Retired hurt is not a dismissal; the batter can come back later in the innings.",
        ],
      },
      {
        h: "Extras",
        body: [
          "Runs that don't come off the bat are extras. b is byes (the ball missed everything and the batters ran), lb is leg byes (it came off the body), w is wides, nb is no-balls and p is penalty runs. Wides and no-balls are charged to the bowler; byes and leg byes are not.",
        ],
      },
      {
        h: "Total, overs and fall of wickets",
        body: [
          "Overs are written overs.balls, not as a decimal: 49.3 means 49 overs and three balls. In arithmetic, 49.3 overs is 49.5 overs, because three balls are half an over.",
          "Fall of wickets lists the score when each wicket fell — \"3-112 (Kohli, 24.2 ov)\" means the third wicket fell at 112, when Kohli was out in the 25th over. It shows where partnerships were built and where a collapse began.",
          "In India and most of the world the total is written runs first (287/6). Australians traditionally write wickets first (6/287) — same score, different order.",
        ],
      },
      {
        h: "The bowling card",
        body: [
          "O is overs bowled, M is maidens (overs in which no runs were charged to the bowler), R is runs conceded and W is wickets. Econ is economy rate: runs conceded per over. Wides and no-balls are often shown in their own columns.",
        ],
      },
    ],
    faq: [
      {
        q: "What does 49.3 overs mean in cricket?",
        a: "Forty-nine overs and three balls. Overs are written overs.balls, and an over has six balls, so the number after the point only ever runs from 0 to 5.",
      },
      {
        q: "What does the † symbol mean on a scorecard?",
        a: "It marks the wicketkeeper. The captain is shown with (c).",
      },
      {
        q: "What does c & b mean?",
        a: "Caught and bowled: the bowler took the catch off their own delivery.",
      },
      {
        q: "What is the difference between byes and leg byes?",
        a: "Byes are runs taken when the ball passes the batter and keeper without touching either batter or bat. Leg byes are runs taken after the ball hits the batter's body (not the bat or gloves) while they were playing a shot or trying to avoid it.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Cricket glossary", href: "/cricket/learn/cricket-glossary" },
      { label: "Cricket calculator", href: "/cricket/calculator" },
    ],
  },
  {
    sport: "cricket",
    slug: "duckworth-lewis-stern",
    title: "Duckworth-Lewis-Stern (DLS) explained",
    description:
      "How the DLS method sets a revised target when rain shortens a one-day or T20 match, what a par score is, and why the target is not just run rate.",
    answer:
      "Duckworth-Lewis-Stern (DLS) is the method used to set a fair target when weather or bad light shortens a one-day or T20 match. Instead of comparing run rates, it measures the batting resources each side had — the overs left and the wickets in hand — and scales the target to match.",
    sections: [
      {
        h: "Why run rate isn't enough",
        body: [
          "Suppose a side chasing 280 in 50 overs is 140 for 7 after 25 overs when rain ends the game. On run rate they are level. In reality they are in trouble: three wickets left to make 140 more. A method that ignored wickets would hand them the match.",
          "That is what DLS fixes. Runs are scored with two resources together — overs and wickets — and losing either reduces what a team can still score.",
        ],
      },
      {
        h: "The resource idea",
        body: [
          "Every innings starts with 100% of its resources. As overs are used and wickets fall, that percentage drops. Losing overs to rain also removes resources. The method uses a table, built from the scoring patterns of real matches, that gives the percentage left for any combination of overs remaining and wickets lost.",
          "If the side batting second has fewer resources than the side batting first had, its target is scaled down in proportion. If the first innings was cut short and the second side gets more resources, the target is scaled up.",
        ],
      },
      {
        h: "Par score",
        body: [
          "At any point in a chase, the par score is what the batting side needs to have made, for the wickets they have lost, to be exactly level. If play stops for good after the minimum overs, a side above par wins and a side below par loses. Broadcasters show par after every over in rain-threatened games.",
        ],
      },
      {
        h: "Minimum overs for a result",
        body: [
          "A result needs a minimum amount of play in the second innings: 20 overs in a one-day international and five overs in a T20 international. Less than that and the match is a no result, unless it can be completed on a reserve day.",
        ],
      },
      {
        h: "Where it came from",
        body: [
          "English statisticians Frank Duckworth and Tony Lewis devised the method in the 1990s, and it became the standard in international cricket. Australian statistician Steven Stern later updated it to reflect higher modern scoring, and it was renamed Duckworth-Lewis-Stern in 2014. International matches use a professional edition run on software; the underlying tables are not published in full.",
        ],
      },
    ],
    faq: [
      {
        q: "How does the DLS method work?",
        a: "It works out what share of its batting resources — overs and wickets combined — each side had, and scales the second side's target in proportion, instead of simply comparing run rates.",
      },
      {
        q: "What is the par score in cricket?",
        a: "The score a chasing side needs at that moment, for the wickets it has lost, to be exactly level under DLS. If the match ends there, being above par wins it.",
      },
      {
        q: "How many overs are needed for a DLS result?",
        a: "At least 20 overs in the second innings of a one-day international and at least five in a T20 international.",
      },
      {
        q: "Why can the DLS target be higher than the first-innings score?",
        a: "When the first innings is cut short, the side batting second may get more resources than the first side had — for example, a full 20 overs with all ten wickets against a team whose innings was stopped early. The target rises to reflect the extra scoring potential.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Net run rate explained", href: "/cricket/learn/net-run-rate" },
      { label: "Cricket formats explained", href: "/cricket/learn/test-odi-t20-formats" },
    ],
  },
  {
    sport: "cricket",
    slug: "net-run-rate",
    title: "Net run rate (NRR) explained",
    description:
      "How net run rate is calculated in cricket tournaments, why it uses totals not averages, the bowled-out rule, and a worked example.",
    answer:
      "Net run rate is the tie-breaker for teams level on points. It is a team's run rate over the whole tournament — total runs scored divided by total overs faced — minus the run rate scored against it. A positive NRR means a side has scored faster than its opponents.",
    sections: [
      {
        h: "The formula",
        body: [
          "NRR = (total runs scored ÷ total overs faced) − (total runs conceded ÷ total overs bowled).",
          "Both halves use tournament totals. You add up every run and every over first and divide once — you do not average the NRR from each match. That is why a heavy defeat can hurt more than a narrow win helps.",
        ],
      },
      {
        h: "Overs become balls first",
        body: [
          "Because overs are written overs.balls, 37.3 overs is 37 and a half overs in maths (225 balls), not 37.3. Every calculation converts to balls, then divides by six.",
        ],
      },
      {
        h: "The bowled-out rule",
        body: [
          "If a team is bowled out before its overs are up, the calculation counts its full quota of overs — 50 in a one-day match, 20 in a T20 — not the overs it actually faced. Being bowled out for 150 in 30 overs counts as 150 from 50.",
          "In rain-affected matches the revised overs and revised target are used. Matches abandoned without a result don't count.",
        ],
      },
      {
        h: "A worked example",
        body: [
          "A team plays two T20s. It makes 150 in 20 overs and loses; then makes 200 in 20 and wins. Its opponents made 151 in 18.4 overs and 120 in 20.",
          "Runs for: 350 off 40 overs = 8.750 an over. Runs against: 271 off 38.4 overs (38.667 in maths) = 7.009 an over. NRR = 8.750 − 7.009 = +1.741.",
        ],
      },
    ],
    faq: [
      {
        q: "How is net run rate calculated?",
        a: "Total runs scored divided by total overs faced, minus total runs conceded divided by total overs bowled, across the whole tournament.",
      },
      {
        q: "What happens to NRR when a team is bowled out?",
        a: "The full quota of overs is used in the calculation, not the overs actually faced — 50 in an ODI and 20 in a T20.",
      },
      {
        q: "Is NRR an average of each match?",
        a: "No. Runs and overs are added up across all matches first, then divided once.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Work out NRR with the calculator", href: "/cricket/calculator" },
      { label: "IPL playoffs and winners", href: "/cricket/ipl" },
    ],
  },
  {
    sport: "cricket",
    slug: "lbw-rule",
    title: "The LBW rule explained",
    description:
      "When a batter is out leg before wicket: where the ball must pitch, where it must hit, the no-shot exception, and how DRS and umpire's call work.",
    answer:
      "A batter is out leg before wicket (LBW) when the ball would have gone on to hit the stumps but hit the batter's body — usually the pad — first. It only counts if the ball did not pitch outside leg stump, the impact was in line with the stumps (with one exception), the ball did not hit the bat first, and the fielding side appeals.",
    sections: [
      {
        h: "The conditions, in order",
        body: [
          "1. The delivery is not a no-ball.",
          "2. The ball did not pitch outside the line of leg stump. Pitching outside leg is never out, however straight it then goes.",
          "3. The ball hit the batter (not the bat or the glove holding the bat) before anything else.",
          "4. The impact was in line between wicket and wicket — or outside off stump if the batter made no genuine attempt to play the ball with the bat.",
          "5. The ball would have gone on to hit the stumps.",
          "6. The fielding side appealed. Without an appeal, the umpire cannot give anyone out.",
        ],
      },
      {
        h: "The no-shot exception",
        body: [
          "A batter hit outside the line of off stump is normally not out. But if they were not genuinely trying to hit the ball — padding it away — they can be given out even when the impact is outside off. This stops batters kicking away anything that might turn back in.",
        ],
      },
      {
        h: "DRS and umpire's call",
        body: [
          "With the Decision Review System, ball-tracking shows where the ball pitched, where it hit and where it was going. If the tracking shows the ball only marginally hitting the stumps, or the impact only marginally in line, the on-field decision stands. That is umpire's call: the original decision is not overturned, and the reviewing side keeps its review.",
        ],
      },
    ],
    faq: [
      {
        q: "Can you be out LBW if the ball pitches outside leg stump?",
        a: "No. A ball that pitches outside the line of leg stump can never give an LBW, even if it would have hit the stumps.",
      },
      {
        q: "Can you be out LBW if the ball pitches outside off stump?",
        a: "Yes. Where the ball pitches on the off side doesn't matter, as long as the impact is in line — or outside off with no genuine shot offered — and the ball would have hit the stumps.",
      },
      {
        q: "What is umpire's call in LBW reviews?",
        a: "When ball-tracking shows the ball only marginally hitting the stumps or the impact only marginally in line, the on-field decision stands and the reviewing team does not lose its review.",
      },
      {
        q: "Is it LBW if the ball hits the bat first?",
        a: "No. If the ball touches the bat, or the glove holding the bat, before hitting the pad, the batter cannot be out LBW.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "How to read a scorecard", href: "/cricket/learn/how-to-read-a-scorecard" },
      { label: "Cricket glossary", href: "/cricket/learn/cricket-glossary" },
    ],
  },
  {
    sport: "cricket",
    slug: "test-odi-t20-formats",
    title: "Test, ODI and T20: cricket's three formats explained",
    description:
      "The difference between Test, one-day and T20 cricket: length, overs, bowling limits, fielding restrictions, how each can end, and India's titles in each.",
    answer:
      "International cricket has three formats. Tests last up to five days with two innings a side and no limit on overs. One-day internationals (ODIs) give each side one innings of 50 overs. T20 internationals give each side 20 overs and finish in about three and a half hours.",
    sections: [
      {
        h: "Test cricket",
        body: [
          "The oldest format: the first Test was played in 1877. Each side bats twice, play is scheduled for 90 overs a day over five days, and there is no limit on how long an innings lasts or how much one bowler can bowl.",
          "A Test can be won, lost, tied or drawn. A draw happens when time runs out before both sides have finished. A side leading by at least 200 runs after the first innings of a five-day Test can enforce the follow-on, making the other side bat again straight away. Tests are played with a red ball, or a pink one under lights.",
          "Since 2019 Tests between the top nations have counted towards the World Test Championship.",
        ],
      },
      {
        h: "One-day internationals",
        body: [
          "Fifty overs a side, played in a day with a white ball. Each bowler can bowl at most ten overs. Fielding restrictions are split into three powerplays: overs 1–10 allow two fielders outside the 30-yard circle, overs 11–40 allow four, and the last ten overs allow five.",
          "The format's biggest prize is the Cricket World Cup, held every four years since 1975. India won it in 1983 and 2011.",
        ],
      },
      {
        h: "T20 internationals",
        body: [
          "Twenty overs a side, with each bowler limited to four. Only two fielders are allowed outside the circle in the six-over powerplay at the start, and five after that. A tie is usually settled by a Super Over — one over each.",
          "T20 is also the format of franchise leagues such as the IPL. India won the T20 World Cup in 2007, 2024 and 2026.",
        ],
      },
    ],
    faq: [
      {
        q: "How many overs can one bowler bowl?",
        a: "Ten in an ODI and four in a T20. In Test cricket there is no limit.",
      },
      {
        q: "Can a Test match end in a draw?",
        a: "Yes. If time runs out before both sides finish their innings, the Test is drawn. ODIs and T20s cannot be drawn, though they can be tied or have no result.",
      },
      {
        q: "Which is the oldest cricket format?",
        a: "Test cricket. The first Test match was played between Australia and England in 1877.",
      },
      {
        q: "How long does a T20 match take?",
        a: "Around three and a half hours, compared with about eight hours for an ODI and up to five days for a Test.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "ODI World Cup winners", href: "/cricket/odi-world-cup" },
      { label: "T20 World Cup winners", href: "/cricket/t20-world-cup" },
      { label: "The IPL", href: "/cricket/ipl" },
    ],
  },
  {
    sport: "cricket",
    slug: "cricket-glossary",
    title: "Cricket glossary: terms every fan should know",
    description:
      "Plain-English definitions of cricket terms — from duck, maiden and hat-trick to googly, free hit, nightwatchman, powerplay and umpire's call.",
    answer:
      "Cricket has its own vocabulary. This glossary explains the terms you'll hear most on commentary and read on scorecards, in plain English, from A to Z.",
    sections: [],
    terms: [
      { term: "All-rounder", def: "A player picked for both batting and bowling." },
      { term: "Average (batting)", def: "Runs scored per dismissal. Not-out innings add runs but not dismissals." },
      { term: "Average (bowling)", def: "Runs conceded per wicket taken. Lower is better." },
      { term: "Bouncer", def: "A short, fast delivery that rises towards the batter's head or shoulders." },
      { term: "Bye", def: "A run taken when the ball passes the batter and wicketkeeper without touching the batter." },
      { term: "Century", def: "A score of 100 or more by one batter in an innings." },
      { term: "Death overs", def: "The final overs of a limited-overs innings, usually the last four or five in a T20 and last ten in an ODI." },
      { term: "Declaration", def: "In a Test, the batting captain ending their innings early to give their bowlers time to win." },
      { term: "Doosra", def: "An off-spinner's delivery that turns the opposite way to their stock ball." },
      { term: "DRS", def: "Decision Review System: each side can ask the third umpire to check an on-field decision using replays and ball-tracking." },
      { term: "Duck", def: "Getting out without scoring. A golden duck is out first ball." },
      { term: "Economy rate", def: "Runs a bowler concedes per over." },
      { term: "Extras", def: "Runs not scored off the bat: byes, leg byes, wides, no-balls and penalty runs." },
      { term: "Fifty", def: "A score of 50 to 99 by one batter in an innings." },
      { term: "Five-wicket haul", def: "Five or more wickets for one bowler in an innings, also called a five-for." },
      { term: "Follow-on", def: "In a Test, the side batting second having to bat again straight away because it fell far enough behind (200 runs in a five-day Test)." },
      { term: "Free hit", def: "The ball after a no-ball in limited-overs cricket, from which the batter can't be out except by run out and a few rare dismissals." },
      { term: "Googly", def: "A leg-spinner's delivery that turns the opposite way to their stock ball." },
      { term: "Hat-trick", def: "A bowler taking wickets with three consecutive deliveries." },
      { term: "Leg bye", def: "A run taken after the ball hits the batter's body rather than the bat." },
      { term: "LBW", def: "Leg before wicket: out because the body stopped a ball that would have hit the stumps." },
      { term: "Maiden", def: "An over in which no runs are charged to the bowler. A wicket maiden also includes a wicket." },
      { term: "Net run rate", def: "A tournament tie-breaker: run rate scored minus run rate conceded." },
      { term: "Nightwatchman", def: "A lower-order batter sent in late in a day's play to protect a better batter from getting out cheaply." },
      { term: "No-ball", def: "An illegal delivery, most often for overstepping the crease. It adds a run and must be bowled again." },
      { term: "Powerplay", def: "A block of overs in limited-overs cricket when only a few fielders are allowed outside the 30-yard circle." },
      { term: "Reverse swing", def: "Swing in the opposite direction to normal, achieved with an older ball." },
      { term: "Run out", def: "Out because a fielder broke the stumps while the batter was short of the crease while running." },
      { term: "Stumped", def: "Out because the wicketkeeper broke the stumps while the batter was out of the crease and not attempting a run." },
      { term: "Strike rate (batting)", def: "Runs scored per 100 balls faced." },
      { term: "Super Over", def: "A one-over-each eliminator used to settle tied limited-overs matches." },
      { term: "Umpire's call", def: "In a DRS review, the on-field decision standing because the ball-tracking evidence is too marginal to overturn it." },
      { term: "Wide", def: "A delivery too far from the batter to hit with a normal shot. It adds a run and must be bowled again." },
      { term: "Yorker", def: "A full delivery aimed at the batter's feet or the base of the stumps." },
    ],
    faq: [
      {
        q: "What is a duck in cricket?",
        a: "Getting out without scoring a run. Out first ball is a golden duck.",
      },
      {
        q: "What is a maiden over?",
        a: "An over in which no runs are charged to the bowler.",
      },
      {
        q: "What is a free hit?",
        a: "In limited-overs cricket, the delivery after a no-ball. The batter can't be out from it except in a handful of ways, mainly run out.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "How to read a scorecard", href: "/cricket/learn/how-to-read-a-scorecard" },
      { label: "The LBW rule", href: "/cricket/learn/lbw-rule" },
      { label: "Take the cricket quiz", href: "/cricket/quiz" },
    ],
  },
];

export const explainersFor = (sport: string) => EXPLAINERS.filter((e) => e.sport === sport);

export const getExplainer = (sport: string, slug: string) =>
  EXPLAINERS.find((e) => e.sport === sport && e.slug === slug);
