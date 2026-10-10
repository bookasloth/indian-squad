import type { SportSlug } from "@/lib/site";
import type { Qa } from "@/lib/seo";
import { COMPETITIONS } from "@/data/competitions";

export interface Rivalry {
  sport: SportSlug;
  slug: string;
  title: string;
  /** Opponent as named in competition data. */
  opponent: string;
  description: string;
  intro: string[];
  /** Turning points, oldest first. Our words; results only, no scorelines we can't stand behind. */
  moments: { year: string; text: string }[];
  faq: Qa[];
}

// ponytail: no running head-to-head totals — they change every series and are
// easy to get wrong. World Cup finals between the two are derived from
// src/data/competitions.ts.
export const RIVALRIES: Rivalry[] = [
  {
    sport: "cricket",
    slug: "india-vs-pakistan",
    title: "India vs Pakistan",
    opponent: "Pakistan",
    description:
      "Cricket's biggest rivalry: India and Pakistan's history since 1952, their World Cup meetings, the 2007 T20 final, the 2025 Asia Cup final, and why they only meet at tournaments now.",
    intro: [
      "India against Pakistan is cricket's most-watched rivalry. The two sides first met in a Test series in 1952, and India have dominated their World Cup meetings, but Pakistan have won some of the biggest finals between them.",
      "The countries have not played a bilateral series since Pakistan's white-ball tour of India in 2012–13. They now meet only at ICC tournaments and the Asia Cup.",
    ],
    moments: [
      { year: "1952", text: "The first Test series between the two, played in India. India won the first Test, in Delhi, and the series." },
      { year: "2004", text: "India win a Test series in Pakistan for the first time, on the 'Friendship Series' tour." },
      { year: "2007", text: "India beat Pakistan in the final of the first T20 World Cup in Johannesburg." },
      { year: "2011", text: "India win the World Cup semi-final in Mohali on the way to the title." },
      { year: "2017", text: "Pakistan beat India in the Champions Trophy final at The Oval." },
      { year: "2021", text: "Pakistan beat India at a World Cup for the first time, by ten wickets at the T20 World Cup in Dubai." },
      { year: "2023", text: "India extend their unbeaten record against Pakistan at 50-over World Cups, in Ahmedabad." },
      { year: "2025", text: "The two meet in an Asia Cup final for the first time. India win by five wickets in Dubai." },
    ],
    faq: [
      {
        q: "Have India ever lost to Pakistan in an ODI World Cup?",
        a: "No. India have won every meeting between the two at 50-over World Cups, up to and including 2023.",
      },
      {
        q: "Why don't India and Pakistan play bilateral series?",
        a: "Political relations between the two countries have kept bilateral cricket off since the 2012–13 series in India. The teams meet only at multi-team events such as ICC tournaments and the Asia Cup.",
      },
      {
        q: "Who won the 2025 Asia Cup final?",
        a: "India, who beat Pakistan by five wickets in Dubai in the first Asia Cup final between the two.",
      },
    ],
  },
  {
    sport: "cricket",
    slug: "india-vs-australia",
    title: "India vs Australia",
    opponent: "Australia",
    description:
      "India vs Australia: the Border–Gavaskar Trophy, Kolkata 2001, India's first series wins in Australia, the Gabba in 2021, and two World Cup finals lost to Australia.",
    intro: [
      "India and Australia have played the most consistently competitive cricket of the modern era. Their Test series are played for the Border–Gavaskar Trophy, named after Allan Border and Sunil Gavaskar and contested since 1996–97.",
      "Australia have had the better of the big finals — two World Cups and a World Test Championship — while India have won some of Test cricket's great series, including two in a row in Australia.",
    ],
    moments: [
      { year: "2001", text: "India win in Kolkata after following on, through VVS Laxman's 281 and Rahul Dravid's 180, ending Australia's run of 16 straight Test wins." },
      { year: "2003", text: "Australia beat India in the World Cup final in Johannesburg." },
      { year: "2018–19", text: "India win a Test series in Australia for the first time." },
      { year: "2020–21", text: "India win again in Australia, sealing the series at the Gabba despite an injury-hit squad." },
      { year: "2023", text: "Australia beat India in the World Test Championship final at The Oval, then in the World Cup final in Ahmedabad." },
      { year: "2024–25", text: "Australia win the Border–Gavaskar Trophy 3–1, their first series win over India since 2014–15." },
    ],
    faq: [
      {
        q: "What is the Border–Gavaskar Trophy?",
        a: "The trophy for Test series between India and Australia, named after Allan Border and Sunil Gavaskar and first contested in 1996–97.",
      },
      {
        q: "When did India first win a Test series in Australia?",
        a: "In 2018–19. India then won again on their next tour, in 2020–21.",
      },
      {
        q: "Who won the 2024–25 Border–Gavaskar Trophy?",
        a: "Australia, 3–1 over five Tests.",
      },
    ],
  },
  {
    sport: "cricket",
    slug: "india-vs-england",
    title: "India vs England",
    opponent: "England",
    description:
      "India vs England: the oldest of India's Test rivalries, from Lord's in 1932 to the Anderson–Tendulkar Trophy, plus the NatWest final and two T20 World Cup semi-finals.",
    intro: [
      "England were India's first Test opponents, at Lord's in 1932, and the two have played more Tests against each other than India have against anyone else.",
      "Since 2025 Test series in England have been played for the Anderson–Tendulkar Trophy, named after James Anderson and Sachin Tendulkar. The first, in 2025, was drawn 2–2.",
    ],
    moments: [
      { year: "1932", text: "India play their first Test, against England at Lord's." },
      { year: "1971", text: "India win a Test series in England for the first time, sealed at The Oval." },
      { year: "1983", text: "India beat England in the World Cup semi-final at Old Trafford on their way to the title." },
      { year: "2002", text: "India chase down 326 to win the NatWest Series final at Lord's." },
      { year: "2022", text: "England beat India by ten wickets in the T20 World Cup semi-final in Adelaide." },
      { year: "2024", text: "India beat England in the T20 World Cup semi-final in Guyana, then win the final." },
      { year: "2025", text: "The first Anderson–Tendulkar Trophy series ends level at 2–2 after India win the final Test at The Oval." },
    ],
    faq: [
      {
        q: "What is the Anderson–Tendulkar Trophy?",
        a: "The trophy for India's Test series in England, named after James Anderson and Sachin Tendulkar. It was first played for in 2025.",
      },
      {
        q: "When did India first play England in a Test?",
        a: "In 1932 at Lord's. It was India's first Test match.",
      },
    ],
  },
];

export const rivalriesFor = (sport: string) => RIVALRIES.filter((r) => r.sport === sport);
export const getRivalry = (sport: string, slug: string) => RIVALRIES.find((r) => r.sport === sport && r.slug === slug);

/** World Cup finals between India and the opponent, from competition data. */
export function finalsBetween(r: Rivalry) {
  const pair = new Set(["India", r.opponent]);
  return COMPETITIONS.filter((c) => c.sport === r.sport).flatMap((c) =>
    c.editions
      .filter((e) => pair.has(e.winner) && pair.has(e.runnerUp))
      .map((e) => ({ competition: c, year: e.year, winner: e.winner })),
  );
}
