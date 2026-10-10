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
  /** Franchise league short name, e.g. "IPL", "PKL". */
  league?: string;
  faq: Qa[];
}

// ponytail: no captains or coaches — they change often and are easy to get
// wrong. Titles and finals are derived from src/data/competitions.ts.
const franchise =
  (sport: SportSlug, league: string) =>
  (slug: string, name: string, city: string, ground: string, since: string, names: string[], note: string): Team => ({
    sport,
    slug,
    name,
    kind: "franchise",
    league,
    description: `${name}: ${league} titles, finals, home ground and history of the ${city} franchise.`,
    intro: [note],
    facts: [
      { label: "City", value: city },
      { label: "Home ground", value: ground },
      { label: `In the ${league} since`, value: since },
    ],
    names,
    faq: [],
  });
const ipl = franchise("cricket", "IPL");
const pkl = franchise("kabaddi", "PKL");

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
  {
    sport: "hockey",
    slug: "india-men",
    name: "India men's hockey team",
    kind: "national",
    description:
      "India's men's hockey team: 8 Olympic golds and 13 Olympic medals, the 1975 World Cup, five Asian Games golds and four Asia Cups. Records, honours and history.",
    intro: [
      "India's men are the most decorated team in Olympic hockey history, with eight gold medals between 1928 and 1980 and 13 medals in all. They won the World Cup in 1975.",
      "After a long gap, the modern side has returned to the podium: Olympic bronze at Tokyo 2020 and Paris 2024, Asian Games gold in 2022 and 2026, and the 2025 Asia Cup.",
    ],
    facts: [
      { label: "Governing body", value: "Hockey India" },
      { label: "First Olympics", value: "1928, Amsterdam (gold)" },
      { label: "Most caps", value: "Manpreet Singh, 430" },
      { label: "Top scorer (modern records)", value: "Harmanpreet Singh, 240 goals" },
    ],
    names: ["India"],
    otherHonours: ["Asian Champions Trophy: 5 titles", "Commonwealth Games: silver in 2010, 2014 and 2022"],
    faq: [
      {
        q: "How many Olympic medals has India won in men's hockey?",
        a: "Thirteen: eight gold, one silver and four bronze, the most of any nation.",
      },
      {
        q: "Who has played the most matches for India's men's hockey team?",
        a: "Manpreet Singh, with 430 caps as of October 2026.",
      },
      {
        q: "Who has scored the most goals for India in men's hockey?",
        a: "Among modern recorded internationals, Harmanpreet Singh, with 240 goals as of October 2026 — most of them from penalty corners.",
      },
    ],
  },
  {
    sport: "hockey",
    slug: "india-women",
    name: "India women's hockey team",
    kind: "national",
    description:
      "India's women's hockey team: fourth at Tokyo 2020, 1982 Asian Games champions, 2002 Commonwealth Games champions and two-time Asia Cup winners.",
    intro: [
      "India's women came fourth at the Tokyo 2020 Olympics, their best Olympic finish, narrowly losing the bronze-medal match to Great Britain.",
      "Their titles include Asian Games gold in 1982, Commonwealth Games gold in 2002 and the Asia Cup in 2004 and 2017.",
    ],
    facts: [
      { label: "Governing body", value: "Hockey India" },
      { label: "Best Olympic finish", value: "4th, Tokyo 2020" },
      { label: "Most caps", value: "Savita Punia, 326" },
      { label: "Top scorer", value: "Rani Rampal, 120 goals" },
    ],
    names: ["India women"],
    otherHonours: ["Asian Games: gold 1982", "Commonwealth Games: gold 2002", "Asia Cup: 2004, 2017"],
    faq: [
      {
        q: "What is India women's best Olympic hockey result?",
        a: "Fourth place at Tokyo 2020, after losing the bronze-medal match to Great Britain.",
      },
      {
        q: "Who has the most caps for India's women's hockey team?",
        a: "Goalkeeper Savita Punia, with 326 caps as of October 2026.",
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

  // ── Kabaddi ──
  {
    sport: "kabaddi",
    slug: "india-men",
    name: "India men's kabaddi team",
    kind: "national",
    description:
      "India's men's kabaddi team: 9 Asian Games golds out of 10 and all three Kabaddi World Cups. Honours, records and history.",
    intro: [
      "India are kabaddi's dominant nation. The men have won nine of the ten Asian Games kabaddi golds since 1990 and every one of the three standard-style Kabaddi World Cups.",
      "Their only Asian Games defeat came in 2018, when Iran — the rivals India have met in every World Cup final — took the gold.",
    ],
    facts: [
      { label: "Governing body", value: "Amateur Kabaddi Federation of India" },
      { label: "Asian Games golds", value: "9 of 10" },
      { label: "World Cups", value: "3 of 3" },
      { label: "Most caps", value: "Ajay Thakur, 110" },
    ],
    names: ["India"],
    faq: [
      {
        q: "How many times has India won kabaddi gold at the Asian Games?",
        a: "Nine times in men's kabaddi — every Games since 1990 except 2018, when Iran won.",
      },
      {
        q: "Who has played the most matches for India in kabaddi?",
        a: "Ajay Thakur, with 110 caps.",
      },
    ],
  },
  {
    sport: "kabaddi",
    slug: "india-women",
    name: "India women's kabaddi team",
    kind: "national",
    description:
      "India's women's kabaddi team: Asian Games gold in 2010, 2014, 2022 and 2026, and silver in 2018.",
    intro: [
      "Women's kabaddi joined the Asian Games in 2010, and India's women have won four of the five golds since — 2010, 2014, 2022 and 2026.",
      "The one that got away was 2018 in Jakarta, where Iran beat India in the final.",
    ],
    facts: [
      { label: "Governing body", value: "Amateur Kabaddi Federation of India" },
      { label: "Asian Games golds", value: "4 of 5" },
      { label: "Asian Games silver", value: "2018" },
    ],
    names: ["India women"],
    otherHonours: ["Asian Games: gold 2010, 2014, 2022, 2026; silver 2018"],
    faq: [
      {
        q: "Has India's women's kabaddi team won the Asian Games?",
        a: "Yes, four times: 2010, 2014, 2022 and 2026. They were runners-up to Iran in 2018.",
      },
    ],
  },
  pkl("patna-pirates", "Patna Pirates", "Patna", "Patliputra Sports Complex", "2014", ["Patna Pirates"],
    "Patna Pirates are the PKL's most successful side, with three titles won back to back in seasons 3, 4 and 5."),
  pkl("jaipur-pink-panthers", "Jaipur Pink Panthers", "Jaipur", "Sawai Mansingh Indoor Stadium", "2014", ["Jaipur Pink Panthers"],
    "Jaipur Pink Panthers won the very first PKL season in 2014 and lifted the title again in 2022."),
  pkl("dabang-delhi-kc", "Dabang Delhi K.C.", "New Delhi", "Thyagaraj Sports Complex", "2014", ["Dabang Delhi K.C.", "Dabang Delhi KC", "Dabang Delhi"],
    "Dabang Delhi K.C. have won two titles, in 2021–22 and in Season 12 in 2025, when they beat Puneri Paltan in a home final."),
  pkl("u-mumba", "U Mumba", "Mumbai", "Sardar Vallabhbhai Patel Indoor Stadium", "2014", ["U Mumba"],
    "U Mumba reached the first three PKL finals and won the second of them, in 2015."),
  pkl("bengaluru-bulls", "Bengaluru Bulls", "Bengaluru", "Kanteerava Indoor Stadium", "2014", ["Bengaluru Bulls"],
    "Bengaluru Bulls won the title in 2018–19, after losing the 2015 final."),
  pkl("bengal-warriorz", "Bengal Warriorz", "Kolkata", "Netaji Indoor Stadium", "2014", ["Bengal Warriorz", "Bengal Warriors"],
    "Bengal Warriorz, then spelled Bengal Warriors, won their only title in 2019."),
  pkl("puneri-paltan", "Puneri Paltan", "Pune", "Shree Shiv Chhatrapati Sports Complex", "2014", ["Puneri Paltan"],
    "Puneri Paltan won the 2023–24 title and have reached three finals in four seasons."),
  pkl("haryana-steelers", "Haryana Steelers", "Panchkula", "Sports University of Haryana Stadium, Sonipat", "2017", ["Haryana Steelers"],
    "Haryana Steelers won the 2024 title a season after losing the final to Puneri Paltan."),
  pkl("gujarat-giants", "Gujarat Giants", "Ahmedabad", "EKA Arena", "2017", ["Gujarat Giants", "Gujarat Fortune Giants"],
    "Gujarat Giants, then Gujarat Fortune Giants, reached the final in each of their first two seasons but are still waiting for a title."),
  pkl("tamil-thalaivas", "Tamil Thalaivas", "Chennai", "Jawaharlal Nehru Indoor Stadium", "2017", ["Tamil Thalaivas"],
    "Tamil Thalaivas joined the league in its 2017 expansion and have yet to reach a final."),
  pkl("telugu-titans", "Telugu Titans", "Hyderabad", "G. M. C. Balayogi Indoor Stadium", "2014", ["Telugu Titans"],
    "Telugu Titans are one of the PKL's eight founding teams and have yet to reach a final."),
  pkl("up-yoddhas", "UP Yoddhas", "Lucknow", "Babu Banarasi Das Indoor Stadium", "2017", ["UP Yoddhas", "UP Yoddha"],
    "UP Yoddhas joined in the 2017 expansion and have yet to reach a final."),

  // ── Football ──
  {
    sport: "football",
    slug: "india-men",
    name: "India men's football team",
    kind: "national",
    description:
      "India's men's football team, the Blue Tigers: nine SAFF Championships, Asian Games gold in 1951 and 1962, fourth at the 1956 Olympics and Asian Cup runners-up in 1964.",
    intro: [
      "India's men — the Blue Tigers — had their golden age in the 1950s and early 1960s: Asian Games gold in 1951 and 1962, fourth place at the 1956 Olympics and runners-up at the 1964 Asian Cup.",
      "In South Asia they are the team to beat, with nine SAFF Championships. Sunil Chhetri holds both the appearance and the scoring record.",
    ],
    facts: [
      { label: "Governing body", value: "All India Football Federation (AIFF)" },
      { label: "Most caps", value: "Sunil Chhetri, 157" },
      { label: "Top scorer", value: "Sunil Chhetri, 95 goals" },
      { label: "Best Olympic finish", value: "4th, 1956" },
    ],
    names: ["India"],
    otherHonours: ["Asian Games: gold 1951 and 1962", "Olympics: fourth place 1956"],
    squadHref: "/football/players",
    faq: [
      {
        q: "Who is India's all-time top scorer in men's football?",
        a: "Sunil Chhetri, with 95 international goals. He is also India's most-capped men's player, with 157 appearances.",
      },
      {
        q: "Has India ever played at the FIFA World Cup?",
        a: "No. India's best results on the world stage came at the Olympics, where they finished fourth in 1956.",
      },
      {
        q: "How many SAFF Championships has India won?",
        a: "Nine, the most of any team.",
      },
    ],
  },
  {
    sport: "football",
    slug: "india-women",
    name: "India women's football team",
    kind: "national",
    description:
      "India's women's football team: AFC Women's Asian Cup runners-up in 1980 and 1983, with records held by Ashalata Devi and Bala Devi.",
    intro: [
      "India's women reached the final of the AFC Women's Asian Cup twice in its early years, in 1980 and 1983.",
      "Defender Ashalata Devi became the first India woman to reach 100 caps, and forward Bala Devi is the team's record scorer with 48 goals.",
    ],
    facts: [
      { label: "Governing body", value: "All India Football Federation (AIFF)" },
      { label: "Best Asian Cup finish", value: "Runners-up, 1980 and 1983" },
      { label: "Most caps", value: "Ashalata Devi, 100" },
      { label: "Top scorer", value: "Bala Devi, 48 goals" },
    ],
    names: ["India women"],
    otherHonours: ["AFC Women's Asian Cup: runners-up 1980 and 1983"],
    squadHref: "/football/players/women",
    faq: [
      {
        q: "Who is the top scorer for India's women's football team?",
        a: "Bala Devi, with 48 international goals.",
      },
      {
        q: "What is India women's best result at the Asian Cup?",
        a: "Runners-up, in both 1980 and 1983.",
      },
    ],
  },
];

export const teamsFor = (sport: string) => TEAMS.filter((t) => t.sport === sport);
export const getTeam = (sport: string, slug: string) => TEAMS.find((t) => t.sport === sport && t.slug === slug);

/** Finals this team played, from competition data, newest first. */
export function finalsOf(team: Team) {
  return COMPETITIONS.filter((c) => c.sport === team.sport).flatMap((c) =>
    c.editions
      .filter((e) => team.names.includes(e.winner) || team.names.includes(e.runnerUp))
      .map((e) => ({ competition: c, year: e.year, won: team.names.includes(e.winner), opponent: team.names.includes(e.winner) ? e.runnerUp : e.winner })),
  ).sort((a, b) => parseInt(b.year) - parseInt(a.year)); // "2024–25" sorts as 2024
}

/** Team page path for a name used in competition data, if we have one. */
export function teamHref(sport: string, name: string): string | null {
  const t = TEAMS.find((x) => x.sport === sport && x.names.includes(name));
  return t ? `/${sport}/teams/${t.slug}` : null;
}
