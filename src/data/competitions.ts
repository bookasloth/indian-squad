import type { SportSlug } from "@/lib/site";
import type { Qa } from "@/lib/seo";

export interface Edition {
  year: string;
  winner: string;
  runnerUp: string;
  host?: string;
}

export interface Competition {
  sport: SportSlug;
  slug: string;
  name: string;
  /** Short label for cards and breadcrumbs. */
  short: string;
  /** Meta description: one sentence, answer-first. */
  description: string;
  /** Opening paragraphs. The first one answers "what is it" on its own. */
  intro: string[];
  facts: { label: string; value: string }[];
  /** How India has done, in a sentence or two. */
  india: string;
  /** Newest first. */
  editions: Edition[];
  faq: Qa[];
  /** Date the facts on the page were last checked (human-readable). */
  reviewed: string;
  checkedAgainst: string;
}

// ponytail: hand-maintained. Winners, runners-up and hosts only — no margins or
// scores, which are easy to get wrong and add little. Add the new edition here
// when a tournament ends, then bump `reviewed`.
export const COMPETITIONS: Competition[] = [
  {
    sport: "cricket",
    slug: "ipl",
    name: "Indian Premier League (IPL)",
    short: "IPL",
    description:
      "The IPL is India's franchise T20 league: ten teams, two months, every season since 2008. Every champion and runner-up, the playoff format and India's most successful sides.",
    intro: [
      "The Indian Premier League is a franchise Twenty20 competition run by the BCCI. Ten city-based teams play each spring, usually from late March to the end of May, and the top four go through to the playoffs.",
      "Since the first season in 2008 it has become the biggest domestic cricket league in the world, and the place where most young Indian players first get noticed before they are picked for India.",
    ],
    facts: [
      { label: "Format", value: "Twenty20, league stage then playoffs" },
      { label: "Teams", value: "10" },
      { label: "First season", value: "2008" },
      { label: "Run by", value: "BCCI" },
      { label: "Usual window", value: "March–May" },
      { label: "Most titles", value: "Mumbai Indians and Chennai Super Kings, 5 each" },
    ],
    india:
      "Every IPL team is built around Indian players: each side can field at most four overseas players in its XI, so the league doubles as India's biggest selection shop window.",
    editions: [
      { year: "2026", winner: "Royal Challengers Bengaluru", runnerUp: "Gujarat Titans" },
      { year: "2025", winner: "Royal Challengers Bengaluru", runnerUp: "Punjab Kings" },
      { year: "2024", winner: "Kolkata Knight Riders", runnerUp: "Sunrisers Hyderabad" },
      { year: "2023", winner: "Chennai Super Kings", runnerUp: "Gujarat Titans" },
      { year: "2022", winner: "Gujarat Titans", runnerUp: "Rajasthan Royals" },
      { year: "2021", winner: "Chennai Super Kings", runnerUp: "Kolkata Knight Riders" },
      { year: "2020", winner: "Mumbai Indians", runnerUp: "Delhi Capitals" },
      { year: "2019", winner: "Mumbai Indians", runnerUp: "Chennai Super Kings" },
      { year: "2018", winner: "Chennai Super Kings", runnerUp: "Sunrisers Hyderabad" },
      { year: "2017", winner: "Mumbai Indians", runnerUp: "Rising Pune Supergiant" },
      { year: "2016", winner: "Sunrisers Hyderabad", runnerUp: "Royal Challengers Bangalore" },
      { year: "2015", winner: "Mumbai Indians", runnerUp: "Chennai Super Kings" },
      { year: "2014", winner: "Kolkata Knight Riders", runnerUp: "Kings XI Punjab" },
      { year: "2013", winner: "Mumbai Indians", runnerUp: "Chennai Super Kings" },
      { year: "2012", winner: "Kolkata Knight Riders", runnerUp: "Chennai Super Kings" },
      { year: "2011", winner: "Chennai Super Kings", runnerUp: "Royal Challengers Bangalore" },
      { year: "2010", winner: "Chennai Super Kings", runnerUp: "Mumbai Indians" },
      { year: "2009", winner: "Deccan Chargers", runnerUp: "Royal Challengers Bangalore" },
      { year: "2008", winner: "Rajasthan Royals", runnerUp: "Chennai Super Kings" },
    ],
    faq: [
      {
        q: "Who has won the most IPL titles?",
        a: "Mumbai Indians and Chennai Super Kings have won five titles each. Kolkata Knight Riders have three and Royal Challengers Bengaluru two.",
      },
      {
        q: "Who won IPL 2026?",
        a: "Royal Challengers Bengaluru won IPL 2026, beating Gujarat Titans in the final to retain the title they first won in 2025.",
      },
      {
        q: "How many teams play in the IPL?",
        a: "Ten: Chennai Super Kings, Delhi Capitals, Gujarat Titans, Kolkata Knight Riders, Lucknow Super Giants, Mumbai Indians, Punjab Kings, Rajasthan Royals, Royal Challengers Bengaluru and Sunrisers Hyderabad.",
      },
      {
        q: "How do the IPL playoffs work?",
        a: "The top four after the league stage qualify. First plays second in Qualifier 1, and the winner goes straight to the final. Third plays fourth in the Eliminator. The loser of Qualifier 1 then plays the Eliminator winner in Qualifier 2 for the other place in the final.",
      },
      {
        q: "When did the IPL start?",
        a: "The first IPL season was played in 2008. Rajasthan Royals won it, beating Chennai Super Kings in the final.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BCCI / IPL records",
  },
  {
    sport: "cricket",
    slug: "odi-world-cup",
    name: "ICC Men's Cricket World Cup (ODI)",
    short: "ODI World Cup",
    description:
      "The 50-over Cricket World Cup has been played every four years since 1975. Every winner, runner-up and host, India's two titles, and when the next one is.",
    intro: [
      "The ICC Men's Cricket World Cup is the 50-over world championship, held every four years since 1975. It is the oldest and most prestigious trophy in one-day cricket.",
      "India have won it twice — at Lord's in 1983 under Kapil Dev, and at home in 2011 under MS Dhoni — and reached two more finals, in 2003 and 2023.",
    ],
    facts: [
      { label: "Format", value: "One-day international, 50 overs a side" },
      { label: "First edition", value: "1975, England" },
      { label: "Held", value: "Every four years" },
      { label: "Run by", value: "ICC" },
      { label: "Most titles", value: "Australia, 6" },
      { label: "Next edition", value: "2027 — South Africa, Zimbabwe and Namibia" },
    ],
    india:
      "Champions in 1983 and 2011; runners-up in 2003 and 2023, both times to Australia.",
    editions: [
      { year: "2023", winner: "Australia", runnerUp: "India", host: "India" },
      { year: "2019", winner: "England", runnerUp: "New Zealand", host: "England and Wales" },
      { year: "2015", winner: "Australia", runnerUp: "New Zealand", host: "Australia and New Zealand" },
      { year: "2011", winner: "India", runnerUp: "Sri Lanka", host: "India, Sri Lanka and Bangladesh" },
      { year: "2007", winner: "Australia", runnerUp: "Sri Lanka", host: "West Indies" },
      { year: "2003", winner: "Australia", runnerUp: "India", host: "South Africa, Zimbabwe and Kenya" },
      { year: "1999", winner: "Australia", runnerUp: "Pakistan", host: "England" },
      { year: "1996", winner: "Sri Lanka", runnerUp: "Australia", host: "India, Pakistan and Sri Lanka" },
      { year: "1992", winner: "Pakistan", runnerUp: "England", host: "Australia and New Zealand" },
      { year: "1987", winner: "Australia", runnerUp: "England", host: "India and Pakistan" },
      { year: "1983", winner: "India", runnerUp: "West Indies", host: "England" },
      { year: "1979", winner: "West Indies", runnerUp: "England", host: "England" },
      { year: "1975", winner: "West Indies", runnerUp: "Australia", host: "England" },
    ],
    faq: [
      {
        q: "How many times has India won the ODI World Cup?",
        a: "Twice: in 1983, beating West Indies in the final at Lord's, and in 2011, beating Sri Lanka in the final in Mumbai.",
      },
      {
        q: "Which team has won the most Cricket World Cups?",
        a: "Australia, with six titles: 1987, 1999, 2003, 2007, 2015 and 2023.",
      },
      {
        q: "Who won the 2023 Cricket World Cup?",
        a: "Australia, who beat hosts India in the final in Ahmedabad.",
      },
      {
        q: "When and where is the next ODI World Cup?",
        a: "The 2027 Men's Cricket World Cup will be hosted by South Africa, Zimbabwe and Namibia.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "ICC records",
  },
  {
    sport: "cricket",
    slug: "t20-world-cup",
    name: "ICC Men's T20 World Cup",
    short: "T20 World Cup",
    description:
      "The T20 World Cup has been played since 2007. India are the only three-time champions (2007, 2024, 2026). Every winner, runner-up and host.",
    intro: [
      "The ICC Men's T20 World Cup is the world championship of 20-over cricket. It began in South Africa in 2007 and is now held every two years, with twenty teams since 2024.",
      "India have won it three times, more than any other side: the first edition in 2007, then back-to-back titles in 2024 and 2026 — the 2026 win the first by any team on home soil.",
    ],
    facts: [
      { label: "Format", value: "Twenty20, 20 overs a side" },
      { label: "First edition", value: "2007, South Africa" },
      { label: "Teams", value: "20 (since 2024)" },
      { label: "Run by", value: "ICC" },
      { label: "Most titles", value: "India, 3" },
    ],
    india: "Champions in 2007, 2024 and 2026; runners-up in 2014.",
    editions: [
      { year: "2026", winner: "India", runnerUp: "New Zealand", host: "India and Sri Lanka" },
      { year: "2024", winner: "India", runnerUp: "South Africa", host: "West Indies and USA" },
      { year: "2022", winner: "England", runnerUp: "Pakistan", host: "Australia" },
      { year: "2021", winner: "Australia", runnerUp: "New Zealand", host: "UAE and Oman" },
      { year: "2016", winner: "West Indies", runnerUp: "England", host: "India" },
      { year: "2014", winner: "Sri Lanka", runnerUp: "India", host: "Bangladesh" },
      { year: "2012", winner: "West Indies", runnerUp: "Sri Lanka", host: "Sri Lanka" },
      { year: "2010", winner: "England", runnerUp: "Australia", host: "West Indies" },
      { year: "2009", winner: "Pakistan", runnerUp: "Sri Lanka", host: "England" },
      { year: "2007", winner: "India", runnerUp: "Pakistan", host: "South Africa" },
    ],
    faq: [
      {
        q: "Who has won the most T20 World Cups?",
        a: "India, with three titles: 2007, 2024 and 2026. England and West Indies have won two each.",
      },
      {
        q: "Who won the 2026 T20 World Cup?",
        a: "India, who beat New Zealand by 96 runs in the final to become the first team to defend the title and the first to win it at home.",
      },
      {
        q: "Who won the first T20 World Cup?",
        a: "India won the first edition in South Africa in 2007, beating Pakistan in the final.",
      },
      {
        q: "How many teams play in the T20 World Cup?",
        a: "Twenty teams have played in each edition since 2024.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "ICC records",
  },
];

export const competitionsFor = (sport: string) => COMPETITIONS.filter((c) => c.sport === sport);

export const getCompetition = (sport: string, slug: string) =>
  COMPETITIONS.find((c) => c.sport === sport && c.slug === slug);

/** Titles per winner, most first. Derived from editions so it can't drift. */
export function titleCounts(c: Competition): { team: string; titles: number }[] {
  const counts = new Map<string, number>();
  for (const e of c.editions) counts.set(e.winner, (counts.get(e.winner) ?? 0) + 1);
  return [...counts].map(([team, titles]) => ({ team, titles })).sort((a, b) => b.titles - a.titles);
}
