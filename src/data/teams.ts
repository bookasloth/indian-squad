import type { SportSlug } from "@/lib/site";
import type { Qa } from "@/lib/seo";
import { COMPETITIONS } from "@/data/competitions";

export interface Team {
  sport: SportSlug;
  slug: string;
  name: string;
  kind: "national" | "franchise";
  description: string;
  intro: string[];
  facts: { label: string; value: string }[];
  /** Every name the team has appeared under in competition data (old names included). */
  names: string[];
  /** Honours not covered by competition pages yet. */
  otherHonours?: string[];
  /** Where the squad lives on this site, if anywhere. */
  squadHref?: string;
  faq: Qa[];
}

// ponytail: no captains or coaches — they change often and are easy to get
// wrong. Titles and finals are derived from src/data/competitions.ts.
const ipl = (
  slug: string,
  name: string,
  city: string,
  ground: string,
  since: string,
  names: string[],
  note: string,
): Team => ({
  sport: "cricket",
  slug,
  name,
  kind: "franchise",
  description: `${name}: IPL titles, finals, home ground and history of the ${city} franchise.`,
  intro: [note],
  facts: [
    { label: "City", value: city },
    { label: "Home ground", value: ground },
    { label: "In the IPL since", value: since },
  ],
  names,
  faq: [],
});

export const TEAMS: Team[] = [
  {
    sport: "cricket",
    slug: "india-men",
    name: "India men's cricket team",
    kind: "national",
    description:
      "India's men's cricket team: World Cup and T20 World Cup titles, Champions Trophies and Asia Cups, when they first played each format, and where to follow the squad.",
    intro: [
      "India's men's team has won five ICC world titles: the 50-over World Cup in 1983 and 2011 and the T20 World Cup in 2007, 2024 and 2026.",
      "India played their first Test at Lord's in 1932, their first one-day international in 1974 and their first T20 international in 2006. The team is selected and run by the Board of Control for Cricket in India (BCCI).",
    ],
    facts: [
      { label: "Governing body", value: "BCCI" },
      { label: "First Test", value: "1932, v England at Lord's" },
      { label: "First ODI", value: "1974, v England" },
      { label: "First T20I", value: "2006, v South Africa in Johannesburg" },
    ],
    names: ["India"],
    otherHonours: ["ICC Champions Trophy: 2002 (shared with Sri Lanka), 2013, 2025", "Asia Cup: nine titles, most recently 2025"],
    squadHref: "/cricket/players",
    faq: [
      {
        q: "How many World Cups has India won in cricket?",
        a: "Five men's world titles: the ODI World Cup in 1983 and 2011, and the T20 World Cup in 2007, 2024 and 2026.",
      },
      {
        q: "When did India play its first Test match?",
        a: "In June 1932, against England at Lord's.",
      },
      {
        q: "How many times has India won the Champions Trophy?",
        a: "Three: in 2002 (shared with Sri Lanka after the final was washed out), 2013 and 2025.",
      },
    ],
  },
  {
    sport: "cricket",
    slug: "india-women",
    name: "India women's cricket team",
    kind: "national",
    description:
      "India's women's cricket team: 2025 World Cup champions. Their history, first matches in each format, and where to follow the squad.",
    intro: [
      "India's women won their first World Cup in 2025, beating South Africa in the final at home after knocking out defending champions Australia in the semi-final.",
      "They played their first Test in 1976, against West Indies in Bengaluru, and reached the World Cup final twice before winning it, in 2005 and 2017.",
    ],
    facts: [
      { label: "Governing body", value: "BCCI" },
      { label: "First Test", value: "1976, v West Indies in Bengaluru" },
      { label: "First T20I", value: "2006, v England in Derby" },
      { label: "World Cup", value: "Champions 2025" },
    ],
    names: ["India women"],
    otherHonours: ["ICC Women's Cricket World Cup: 2025"],
    squadHref: "/cricket/players/women",
    faq: [
      {
        q: "Has India won the women's Cricket World Cup?",
        a: "Yes. India won the ICC Women's Cricket World Cup in 2025, beating South Africa in the final.",
      },
      {
        q: "When did India women play their first Test?",
        a: "In 1976, against West Indies in Bengaluru.",
      },
    ],
  },
  ipl("chennai-super-kings", "Chennai Super Kings", "Chennai", "MA Chidambaram Stadium (Chepauk)", "2008", ["Chennai Super Kings"],
    "Chennai Super Kings are one of the IPL's two most successful sides, with five titles. They have reached more IPL finals than any other team."),
  ipl("mumbai-indians", "Mumbai Indians", "Mumbai", "Wankhede Stadium", "2008", ["Mumbai Indians"],
    "Mumbai Indians share the record for IPL titles with five, all won between 2013 and 2020."),
  ipl("kolkata-knight-riders", "Kolkata Knight Riders", "Kolkata", "Eden Gardens", "2008", ["Kolkata Knight Riders"],
    "Kolkata Knight Riders have won the IPL three times, most recently in 2024."),
  ipl("royal-challengers-bengaluru", "Royal Challengers Bengaluru", "Bengaluru", "M. Chinnaswamy Stadium", "2008",
    ["Royal Challengers Bengaluru", "Royal Challengers Bangalore"],
    "Royal Challengers Bengaluru waited 18 seasons for a title, then won back-to-back in 2025 and 2026. Known as Royal Challengers Bangalore until 2024."),
  ipl("rajasthan-royals", "Rajasthan Royals", "Jaipur", "Sawai Mansingh Stadium", "2008", ["Rajasthan Royals"],
    "Rajasthan Royals won the very first IPL in 2008 and reached the final again in 2022."),
  ipl("sunrisers-hyderabad", "Sunrisers Hyderabad", "Hyderabad", "Rajiv Gandhi International Stadium", "2013", ["Sunrisers Hyderabad"],
    "Sunrisers Hyderabad joined in 2013, won the title in 2016 and have reached two more finals since."),
  ipl("gujarat-titans", "Gujarat Titans", "Ahmedabad", "Narendra Modi Stadium", "2022", ["Gujarat Titans"],
    "Gujarat Titans won the IPL in their first season, 2022, and have reached two more finals since."),
  ipl("delhi-capitals", "Delhi Capitals", "Delhi", "Arun Jaitley Stadium", "2008", ["Delhi Capitals", "Delhi Daredevils"],
    "Delhi Capitals, known as Delhi Daredevils until 2018, are still waiting for a first title; their only final was in 2020."),
  ipl("punjab-kings", "Punjab Kings", "Mullanpur (Mohali)", "Maharaja Yadavindra Singh Stadium", "2008", ["Punjab Kings", "Kings XI Punjab"],
    "Punjab Kings, known as Kings XI Punjab until 2020, have reached two finals — 2014 and 2025 — without yet winning the title."),
  ipl("lucknow-super-giants", "Lucknow Super Giants", "Lucknow", "Ekana Cricket Stadium", "2022", ["Lucknow Super Giants"],
    "Lucknow Super Giants joined in 2022 alongside Gujarat Titans and reached the playoffs in each of their first two seasons."),
];

export const teamsFor = (sport: string) => TEAMS.filter((t) => t.sport === sport);
export const getTeam = (sport: string, slug: string) => TEAMS.find((t) => t.sport === sport && t.slug === slug);

/** Finals this team played, from competition data, newest first. */
export function finalsOf(team: Team) {
  return COMPETITIONS.filter((c) => c.sport === team.sport).flatMap((c) =>
    c.editions
      .filter((e) => team.names.includes(e.winner) || team.names.includes(e.runnerUp))
      .map((e) => ({ competition: c, year: e.year, won: team.names.includes(e.winner), opponent: team.names.includes(e.winner) ? e.runnerUp : e.winner })),
  ).sort((a, b) => Number(b.year) - Number(a.year));
}

/** Team page path for a name used in competition data, if we have one. */
export function teamHref(sport: string, name: string): string | null {
  const t = TEAMS.find((x) => x.sport === sport && x.names.includes(name));
  return t ? `/${sport}/teams/${t.slug}` : null;
}
