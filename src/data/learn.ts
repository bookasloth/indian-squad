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

  // ── Hockey (checked against the FIH Rules of Hockey) ──
  {
    sport: "hockey",
    slug: "hockey-rules",
    title: "Hockey rules explained: a beginner's guide",
    description:
      "How field hockey works: 11 a side, four 15-minute quarters, goals only from inside the circle, the flat side of the stick, cards and shoot-outs.",
    answer:
      "Field hockey is played eleven a side, including a goalkeeper, over four quarters of 15 minutes. Players may only use the flat side of their stick, nobody but the goalkeeper may use their body to play the ball, and a goal only counts if the attacker touched the ball inside the shooting circle.",
    sections: [
      {
        h: "The basics",
        body: [
          "Each team has eleven players on the pitch, one of them a goalkeeper. Substitutions are rolling: players can come off and go back on as often as the coach likes, without stopping play except for penalty corners.",
          "An international match lasts 60 minutes, split into four quarters of 15 minutes, with short breaks between quarters and a longer one at half-time. The clock stops for goals and penalty corners.",
        ],
      },
      {
        h: "Playing the ball",
        body: [
          "The ball may only be played with the flat face of the stick (and its edges), never the rounded back. Outfield players can't stop or move the ball with their feet or body — doing so is a foul.",
          "Players can't play the ball dangerously, raise it into an opponent at close range, or obstruct an opponent by putting their body or stick between the player and the ball.",
        ],
      },
      {
        h: "Scoring",
        body: [
          "A goal counts only if an attacker played the ball inside the shooting circle — the D-shaped area in front of goal — and it then crossed the goal line. A shot from outside the circle that goes straight in doesn't count.",
        ],
      },
      {
        h: "Free hits, corners and strokes",
        body: [
          "Most fouls give the other side a free hit where the foul happened, and the taker can play it to themselves. Fouls by defenders inside their circle, or deliberate ones near it, give a penalty corner. A foul that stops a probable goal gives a penalty stroke: a one-on-one shot at the goalkeeper from a spot 6.4 metres out.",
        ],
      },
      {
        h: "Cards",
        body: [
          "Umpires can show three cards. A green card suspends a player for two minutes, a yellow card for at least five minutes, and a red card sends them off for the rest of the match. A suspended player's team plays a player short.",
        ],
      },
      {
        h: "Shoot-outs",
        body: [
          "Knockout matches level at full time go to a shoot-out. A player starts 23 metres out and has eight seconds to beat the goalkeeper one-on-one; each side takes five, then sudden death.",
        ],
      },
    ],
    faq: [
      {
        q: "How long is a hockey match?",
        a: "Sixty minutes of playing time in international hockey, as four quarters of 15 minutes, plus breaks.",
      },
      {
        q: "Can you score from outside the circle in hockey?",
        a: "No. An attacker must touch the ball inside the shooting circle for a goal to count.",
      },
      {
        q: "What does a green card mean in hockey?",
        a: "A two-minute suspension. The player's team plays with one fewer player until it ends.",
      },
      {
        q: "How many players are in a hockey team?",
        a: "Eleven on the pitch, including the goalkeeper, with unlimited rolling substitutions from the bench.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Penalty corners explained", href: "/hockey/learn/penalty-corner" },
      { label: "Hockey positions", href: "/hockey/learn/hockey-positions" },
      { label: "Take the hockey quiz", href: "/hockey/quiz" },
    ],
  },
  {
    sport: "hockey",
    slug: "penalty-corner",
    title: "The penalty corner explained",
    description:
      "How a hockey penalty corner works: when it's given, where everyone stands, the injection, the 460 mm rule for hit shots, and why drag-flickers matter.",
    answer:
      "A penalty corner is hockey's set piece. The attacking side pushes the ball from the backline to teammates waiting at the edge of the circle, and the defenders — four plus the goalkeeper — rush out from behind their goal line to stop the shot. It is awarded mainly for fouls by defenders inside their own circle.",
    sections: [
      {
        h: "When it's given",
        body: [
          "The most common reasons are an unintentional foul by a defender inside the circle, a deliberate foul by a defender in the 23-metre area, or a defender deliberately playing the ball over their own backline.",
        ],
      },
      {
        h: "Where everyone stands",
        body: [
          "One attacker injects the ball from a mark on the backline at least 10 metres from the goalpost. The other attackers wait outside the circle. Up to five defenders, including the goalkeeper, stand behind the backline; the rest of the defending team must be beyond the halfway line until the ball is played.",
        ],
      },
      {
        h: "Taking the shot",
        body: [
          "The ball must travel outside the circle before anyone can shoot, so it is usually stopped just outside and pulled back in. If the first shot is a hit, it must cross the goal line no higher than 460 mm — the height of the backboard. Flicks, pushes and drag-flicks can go higher, as long as they aren't dangerous.",
          "That is why teams prize drag-flickers: players who sling the ball low and fast, and high if they want, from a dragging motion. India's Harmanpreet Singh is one of the best in the world.",
        ],
      },
      {
        h: "Penalty corner vs penalty stroke",
        body: [
          "A penalty stroke is different: a single shot from 6.4 metres against only the goalkeeper. It is given for a foul that prevents a probable goal, or a deliberate foul inside the circle.",
        ],
      },
    ],
    faq: [
      {
        q: "How many defenders can defend a penalty corner?",
        a: "Five, including the goalkeeper. They start behind the backline; everyone else must be beyond the halfway line.",
      },
      {
        q: "Why does the ball go out of the circle before the shot?",
        a: "The rules require the injected ball to leave the circle before a shot can be taken. Attackers stop it just outside, then bring it back in.",
      },
      {
        q: "What is the 460 mm rule?",
        a: "If the first shot at a penalty corner is a hit, it must cross the goal line no higher than 460 mm, the height of the backboard.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Hockey rules explained", href: "/hockey/learn/hockey-rules" },
      { label: "Video referral explained", href: "/hockey/learn/video-referral" },
    ],
  },
  {
    sport: "hockey",
    slug: "video-referral",
    title: "Video referral in hockey explained",
    description:
      "How video referral works in international hockey: who can ask for it, what it can check, and when a team keeps its referral.",
    answer:
      "Video referral lets a team ask the video umpire to check an on-field decision near goal — a goal, a penalty corner or a penalty stroke. Each team has one referral; if the referral succeeds the team keeps it, and if it fails the team loses it.",
    sections: [
      {
        h: "What can be referred",
        body: [
          "Referrals are for decisions inside or near the circles: whether a goal was scored, and whether a penalty corner or penalty stroke should or shouldn't have been given. Umpires can also ask the video umpire for help themselves.",
        ],
      },
      {
        h: "How it works",
        body: [
          "The captain or a designated player asks for a referral straight after the decision. The video umpire reviews the replays and tells the on-field umpire what the pictures show; the on-field umpire makes the final call.",
          "A team keeps its referral when the decision is changed in its favour. If the original decision stands, the referral is gone for the rest of the match.",
        ],
      },
    ],
    faq: [
      {
        q: "How many video referrals does a hockey team get?",
        a: "One per match. A team that refers successfully keeps it; an unsuccessful referral uses it up.",
      },
      {
        q: "Can a team refer any decision in hockey?",
        a: "No. Referrals cover decisions about goals, penalty corners and penalty strokes, mostly in and around the circle.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Penalty corners explained", href: "/hockey/learn/penalty-corner" },
      { label: "Hockey rules explained", href: "/hockey/learn/hockey-rules" },
    ],
  },
  {
    sport: "hockey",
    slug: "hockey-positions",
    title: "Hockey positions explained",
    description:
      "The positions in field hockey — goalkeeper, defenders, midfielders and forwards — what each one does, and how teams line up.",
    answer:
      "A hockey team has a goalkeeper and ten outfield players, usually split into defenders, midfielders and forwards. Rolling substitutions mean players rotate constantly, so roles are more fluid than in football, but each line has a clear job.",
    sections: [
      {
        h: "Goalkeeper",
        body: [
          "The only player who can use their body and feet to stop the ball, and only inside their own circle. Goalkeepers wear full protective kit and lead the defence at penalty corners.",
        ],
      },
      {
        h: "Defenders",
        body: [
          "Usually three or four defenders protect the circle, mark attackers and start moves from the back. Central defenders are often the side's penalty-corner specialists, because drag-flicking takes the strength and technique that defenders tend to have.",
        ],
      },
      {
        h: "Midfielders",
        body: [
          "Midfielders link defence and attack, win the ball back and carry it forward. A defensive midfielder sits in front of the back line; attacking midfielders support the forwards in the circle.",
        ],
      },
      {
        h: "Forwards",
        body: [
          "Forwards press the opposition high up the pitch and get into the circle to score or win penalty corners. Wingers stretch the play; a centre-forward works the space in front of goal.",
        ],
      },
      {
        h: "Formations",
        body: [
          "Teams describe formations by outfield lines, such as 4-3-3 or 3-4-3. In practice shapes change through the match, and rolling substitutions let coaches keep fresh legs in the most demanding roles.",
        ],
      },
    ],
    faq: [
      {
        q: "How many defenders does a hockey team play?",
        a: "Usually three or four, though formations shift during a match.",
      },
      {
        q: "Who takes penalty corners in hockey?",
        a: "A specialist drag-flicker, often a central defender. India's leading scorer, Harmanpreet Singh, is a defender and drag-flicker.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Hockey rules explained", href: "/hockey/learn/hockey-rules" },
      { label: "India men's hockey team", href: "/hockey/teams/india-men" },
    ],
  },

  // ── Kabaddi (checked against international and Pro Kabaddi League rules) ──
  {
    sport: "kabaddi",
    slug: "kabaddi-rules",
    title: "Kabaddi rules explained: a beginner's guide",
    description:
      "How kabaddi works: seven a side, raids and tackles, how points are scored, revivals, all-outs, and how long a match lasts.",
    answer:
      "Kabaddi is played seven a side on a court split in two. Teams take turns to send one raider into the other half to touch as many defenders as possible and get back over the midline without being stopped. Each defender touched is out and earns the raiding side a point; if the defenders stop the raider, they earn the point instead.",
    sections: [
      {
        h: "The teams and the match",
        body: [
          "Each side has seven players on court and substitutes on the bench. A match is two halves of 20 minutes with a short break, and teams swap halves of the court at the interval.",
        ],
      },
      {
        h: "The raid",
        body: [
          "One player at a time — the raider — crosses into the opponents' half. Traditionally the raider chants \"kabaddi\" on a single breath; in the Pro Kabaddi League each raid instead has a 30-second limit. The raider has to cross the baulk line in the opponents' half for the raid to count, then get back to their own half.",
        ],
      },
      {
        h: "Tackles",
        body: [
          "Defenders try to stop the raider getting home, usually by holding them, blocking them or bringing them down. A successful tackle puts the raider out and earns the defending team a point.",
        ],
      },
      {
        h: "Outs and revivals",
        body: [
          "Players who are out leave the court and wait. Each point a team scores brings one of its out players back, in the order they went out. That revival rule means a side that is losing players can recover quickly.",
        ],
      },
      {
        h: "All out",
        body: [
          "If a team loses all seven players, it is \"all out\": the other side gets two bonus points and the whole team comes back on court.",
        ],
      },
    ],
    faq: [
      {
        q: "How many players are on a kabaddi team?",
        a: "Seven on court at a time, with substitutes on the bench.",
      },
      {
        q: "How long is a kabaddi match?",
        a: "Forty minutes of play: two halves of 20 minutes with a short break.",
      },
      {
        q: "What is an all out in kabaddi?",
        a: "When every player on one team has been put out. The other team gets two extra points and the whole team is revived.",
      },
      {
        q: "How do out players come back in kabaddi?",
        a: "Through revivals: each point a team scores brings back one player who is out, in the order they were put out.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Raids and the bonus line", href: "/kabaddi/learn/raids-and-bonus-line" },
      { label: "Do-or-die raids", href: "/kabaddi/learn/do-or-die-raid" },
      { label: "Take the kabaddi quiz", href: "/kabaddi/quiz" },
    ],
  },
  {
    sport: "kabaddi",
    slug: "raids-and-bonus-line",
    title: "Raids, the bonus line and super raids explained",
    description:
      "How a kabaddi raider scores: touch points, the baulk line, the bonus line and when it applies, empty raids and super raids.",
    answer:
      "A raider scores a point for every defender they touch and then escape. They can also earn a bonus point by reaching the bonus line — the line deepest in the defenders' half — while at least six defenders are on court. A raid that earns three or more points is called a super raid.",
    sections: [
      {
        h: "The two lines that matter",
        body: [
          "The baulk line is the first line in the opponents' half. A raider has to cross it for the raid to count. The bonus line sits further back, closer to the end line.",
        ],
      },
      {
        h: "The bonus point",
        body: [
          "If at least six defenders are on court, a raider who touches the bonus line with one foot, with the other foot in the air, earns a bonus point — even without touching anyone. The rule stops a full-strength defence from simply sitting back. When five or fewer defenders are on court, there is no bonus.",
        ],
      },
      {
        h: "Empty raids and super raids",
        body: [
          "A raid with no points either way is an empty raid. A raid that earns three or more points — touch points, a bonus, or both — is a super raid, and can swing a match by itself.",
        ],
      },
    ],
    faq: [
      {
        q: "When does the bonus point apply in kabaddi?",
        a: "Only when at least six defenders are on court. The raider must touch the bonus line with one foot while the other is in the air.",
      },
      {
        q: "What is a super raid?",
        a: "A single raid that earns three or more points.",
      },
      {
        q: "What is an empty raid?",
        a: "A raid in which neither side scores a point.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Kabaddi rules explained", href: "/kabaddi/learn/kabaddi-rules" },
      { label: "Super tackles explained", href: "/kabaddi/learn/super-tackle" },
    ],
  },
  {
    sport: "kabaddi",
    slug: "do-or-die-raid",
    title: "The do-or-die raid explained",
    description:
      "What a do-or-die raid is in the Pro Kabaddi League, when it happens, and why it changes how teams raid and defend.",
    answer:
      "In the Pro Kabaddi League, after a team makes two empty raids in a row, its third raid is a do-or-die raid: the raider must score at least one point, or they are out.",
    sections: [
      {
        h: "Why it exists",
        body: [
          "Without it, a team could send raiders over just to touch the baulk line and return, running down the clock. The do-or-die rule forces attacks and gives defenders a moment to gamble on a tackle.",
        ],
      },
      {
        h: "How teams play it",
        body: [
          "Teams often send their best raider for a do-or-die raid. Defences, knowing the raider must score, can hold their ground and wait for the raider to come to them.",
        ],
      },
    ],
    faq: [
      {
        q: "When does a do-or-die raid happen in kabaddi?",
        a: "In the Pro Kabaddi League, on a team's third raid after two empty raids in a row.",
      },
      {
        q: "What happens if a do-or-die raid scores nothing?",
        a: "The raider is out and the defending team gets a point.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Raids and the bonus line", href: "/kabaddi/learn/raids-and-bonus-line" },
      { label: "The Pro Kabaddi League", href: "/kabaddi/pro-kabaddi-league" },
    ],
  },
  {
    sport: "kabaddi",
    slug: "super-tackle",
    title: "The super tackle explained",
    description:
      "What a super tackle is in kabaddi, when it applies, why it's worth two points, and how short-handed defences use it.",
    answer:
      "A super tackle is a successful tackle made when the defending side has three or fewer players on court. It earns two points instead of one, rewarding a short-handed defence for stopping the raider.",
    sections: [
      {
        h: "Why it matters",
        body: [
          "A defence down to three players is close to being all out. A super tackle gives it two points, and with them two revivals — often enough to turn the match.",
        ],
      },
      {
        h: "The raider's dilemma",
        body: [
          "Facing three or fewer defenders, a raider can pick up easy touch points to force an all out, but every attempt risks a super tackle. That tension is one of kabaddi's best moments.",
        ],
      },
    ],
    faq: [
      {
        q: "How many points is a super tackle worth?",
        a: "Two points: the usual tackle point plus a bonus.",
      },
      {
        q: "When can a team make a super tackle?",
        a: "When it has three or fewer players on court at the time of the tackle.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Kabaddi rules explained", href: "/kabaddi/learn/kabaddi-rules" },
      { label: "India men's kabaddi team", href: "/kabaddi/teams/india-men" },
    ],
  },

  // ── Football (checked against the IFAB Laws of the Game and AIFF competition formats) ──
  {
    sport: "football",
    slug: "how-the-isl-works",
    title: "How the Indian Super League works",
    description:
      "The ISL explained: India's top division, how the champion has been decided, the League Winners' Shield, promotion from the I-League, and the cups around it.",
    answer:
      "The Indian Super League is the top division of Indian football. Clubs play each other home and away; for most of its history the champion was then decided by playoffs and a final, while the League Winners' Shield went to the team that topped the table. In 2025–26 the title was decided on the table alone.",
    sections: [
      {
        h: "From tournament to top flight",
        body: [
          "The ISL began in 2014 as a short franchise competition running alongside the I-League. It grew longer each season and became the recognised top division, with the I-League below it.",
        ],
      },
      {
        h: "Playoffs and the Shield",
        body: [
          "Most seasons ended with knockout playoffs among the top-placed teams and a one-off final to crown the ISL champion. From 2019–20 the side finishing first in the regular season also received the League Winners' Shield, so a season could produce two different winners — as in 2021–22, when Hyderabad won the final and Jamshedpur the Shield.",
        ],
      },
      {
        h: "Promotion",
        body: [
          "Since 2023–24 the I-League champion has been promoted into the ISL. Punjab FC were the first club to come up that way.",
        ],
      },
      {
        h: "The cups",
        body: [
          "Alongside the league, Indian clubs play the Durand Cup, which usually opens the season, and the Super Cup, a knockout competition for ISL and I-League sides.",
        ],
      },
    ],
    faq: [
      {
        q: "Is the ISL the top league in India?",
        a: "Yes. The Indian Super League is the top division of Indian football, with the I-League below it.",
      },
      {
        q: "What is the difference between the ISL Cup and the ISL Shield?",
        a: "The Shield goes to the team that finishes top of the regular-season table. The ISL Cup has usually gone to the winner of the playoff final.",
      },
      {
        q: "Can I-League clubs be promoted to the ISL?",
        a: "Yes. Since 2023–24 the I-League champion has earned promotion to the ISL.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "Every ISL champion", href: "/football/indian-super-league" },
      { label: "The Durand Cup", href: "/football/durand-cup" },
      { label: "Take the football quiz", href: "/football/quiz" },
    ],
  },
  {
    sport: "football",
    slug: "offside-rule",
    title: "The offside rule explained",
    description:
      "Football's offside rule in plain English: when a player is in an offside position, when it becomes an offence, and the restarts you can't be offside from.",
    answer:
      "A player is in an offside position if, when a teammate plays the ball, any part of their head, body or feet is in the opponents' half and closer to the opponents' goal line than both the ball and the second-last defender. Being in that position is only an offence if the player then becomes involved in play.",
    sections: [
      {
        h: "The position",
        body: [
          "The comparison is made at the moment a teammate plays or touches the ball. The \"second-last defender\" is usually the last outfield player, because the goalkeeper normally counts as the last one. Arms and hands don't count when judging position, because players can't legally play the ball with them.",
          "Level is onside: a player level with the second-last defender, or with the ball, is not offside. Nor is anyone in their own half.",
        ],
      },
      {
        h: "When it's an offence",
        body: [
          "A player in an offside position is only penalised if they become involved in active play: playing or touching the ball, blocking an opponent's line of sight or movement, or gaining an advantage — for example, from a rebound off the post or the goalkeeper.",
        ],
      },
      {
        h: "Restarts you can't be offside from",
        body: [
          "There is no offside offence when a player receives the ball directly from a goal kick, a throw-in or a corner kick.",
        ],
      },
    ],
    faq: [
      {
        q: "Is level offside in football?",
        a: "No. A player level with the second-last defender or with the ball is onside.",
      },
      {
        q: "Can you be offside from a throw-in?",
        a: "No. There is no offside from a throw-in, a goal kick or a corner kick.",
      },
      {
        q: "Can you be offside in your own half?",
        a: "No. A player has to be in the opponents' half to be in an offside position.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "VAR explained", href: "/football/learn/var-explained" },
      { label: "How the ISL works", href: "/football/learn/how-the-isl-works" },
    ],
  },
  {
    sport: "football",
    slug: "var-explained",
    title: "VAR explained: what it can and can't review",
    description:
      "How the video assistant referee works: the four kinds of decision VAR can check, the 'clear and obvious error' test, and on-field reviews at the monitor.",
    answer:
      "The video assistant referee (VAR) checks four kinds of match-changing decision: goals, penalty decisions, direct red cards and cases of mistaken identity. It only steps in for a clear and obvious error or a serious missed incident, and the on-field referee always makes the final decision.",
    sections: [
      {
        h: "What VAR checks",
        body: [
          "Every goal, penalty and direct red card is checked automatically in the background. VAR also corrects the referee if the wrong player has been cautioned or sent off.",
          "Everything else — corner kicks, throw-ins, second yellow cards, ordinary fouls in midfield — is outside VAR's remit.",
        ],
      },
      {
        h: "Clear and obvious",
        body: [
          "VAR isn't there to re-referee the match. For judgement calls it intervenes only when the original decision is clearly wrong; for factual matters, such as whether a player was offside or a foul was inside the area, it corrects the decision outright.",
        ],
      },
      {
        h: "The on-field review",
        body: [
          "For judgement calls, the VAR recommends that the referee looks at the pitch-side monitor. The referee watches the replay and either keeps or changes the decision. Factual decisions can be changed on the VAR's advice alone.",
        ],
      },
    ],
    faq: [
      {
        q: "What decisions can VAR review?",
        a: "Goals, penalty decisions, direct red cards and mistaken identity — and nothing else.",
      },
      {
        q: "Does VAR make the final decision?",
        a: "No. The on-field referee always makes the final decision, sometimes after watching the replay at the pitch-side monitor.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "The offside rule explained", href: "/football/learn/offside-rule" },
      { label: "India men's football team", href: "/football/teams/india-men" },
    ],
  },
  {
    sport: "football",
    slug: "promotion-and-the-i-league",
    title: "The I-League and promotion explained",
    description:
      "Where the I-League fits in Indian football, how its champion is promoted to the ISL, and how the national league pyramid works.",
    answer:
      "The I-League is the second tier of Indian football, below the Indian Super League. Since 2023–24 its champion has been promoted to the ISL, linking the two leagues into a single pyramid for the first time.",
    sections: [
      {
        h: "From top flight to second tier",
        body: [
          "The I-League was India's top division from 2007, succeeding the National Football League. When the ISL was recognised as the top flight, the I-League became the level below it.",
        ],
      },
      {
        h: "How promotion works",
        body: [
          "The I-League champion earns a place in the next ISL season, subject to meeting the league's club licensing rules. Punjab FC were the first club promoted this way, joining the ISL in 2023–24.",
        ],
      },
      {
        h: "Below the I-League",
        body: [
          "Under the I-League sit further national divisions and the state leagues, so a club can in principle climb from regional football to the top flight.",
        ],
      },
    ],
    faq: [
      {
        q: "Is the I-League the top league in India?",
        a: "No. It is the second tier, below the Indian Super League.",
      },
      {
        q: "Does the I-League champion get promoted to the ISL?",
        a: "Yes, since 2023–24, provided the club meets the licensing requirements.",
      },
    ],
    reviewed: "2026-10-10",
    related: [
      { label: "How the ISL works", href: "/football/learn/how-the-isl-works" },
      { label: "Every ISL champion", href: "/football/indian-super-league" },
    ],
  },
];

export const explainersFor = (sport: string) => EXPLAINERS.filter((e) => e.sport === sport);

export const getExplainer = (sport: string, slug: string) =>
  EXPLAINERS.find((e) => e.sport === sport && e.slug === slug);
