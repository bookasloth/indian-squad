import type { SportSlug } from "@/lib/site";
import type { Qa } from "@/lib/seo";

export interface Edition {
  year: string;
  winner: string;
  runnerUp: string;
  host?: string;
}

export interface Medal {
  year: string;
  player: string;
  event: string;
  medal: "Gold" | "Silver" | "Bronze" | "Champion" | "Runner-up";
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
  /** Set when `editions` covers only recent years: the page labels the list
   * "since X" and hides the all-time titles tally, which would mislead. */
  since?: string;
  /** India's medals, for individual-sport events where a full winners list
   * isn't the point (badminton Olympics, World Championships). Newest first.
   * Leave `editions` empty when this is the main table. */
  medals?: Medal[];
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

  // ── Hockey (men's results; checked 10 October 2026) ──
  {
    sport: "hockey",
    slug: "olympics",
    name: "Olympic men's hockey",
    short: "Olympics",
    description:
      "India are the most successful nation in Olympic men's hockey: 8 golds and 13 medals. Every Olympic hockey champion since 1908, with runners-up and hosts.",
    intro: [
      "India have won more Olympic medals in men's hockey than any other country: eight golds, one silver and four bronzes. Six of those golds came in a row, from 1928 to 1956.",
      "After the last gold in Moscow in 1980, India waited 41 years for another medal, then won bronze at both Tokyo 2020 and Paris 2024.",
    ],
    facts: [
      { label: "First Olympic tournament", value: "1908, London" },
      { label: "India's golds", value: "8 (1928–1956, 1964, 1980)" },
      { label: "India's medals", value: "13 — 8 gold, 1 silver, 4 bronze" },
      { label: "Run by", value: "FIH and the IOC" },
      { label: "Most recent champion", value: "Netherlands, 2024" },
      { label: "Next Games", value: "Los Angeles 2028" },
    ],
    india:
      "Gold in 1928, 1932, 1936, 1948, 1952, 1956, 1964 and 1980; silver in 1960; bronze in 1968, 1972, 2020 and 2024.",
    editions: [
      { year: "2024", winner: "Netherlands", runnerUp: "Germany", host: "Paris" },
      { year: "2020", winner: "Belgium", runnerUp: "Australia", host: "Tokyo" },
      { year: "2016", winner: "Argentina", runnerUp: "Belgium", host: "Rio de Janeiro" },
      { year: "2012", winner: "Germany", runnerUp: "Netherlands", host: "London" },
      { year: "2008", winner: "Germany", runnerUp: "Spain", host: "Beijing" },
      { year: "2004", winner: "Australia", runnerUp: "Netherlands", host: "Athens" },
      { year: "2000", winner: "Netherlands", runnerUp: "South Korea", host: "Sydney" },
      { year: "1996", winner: "Netherlands", runnerUp: "Spain", host: "Atlanta" },
      { year: "1992", winner: "Germany", runnerUp: "Australia", host: "Barcelona" },
      { year: "1988", winner: "Great Britain", runnerUp: "West Germany", host: "Seoul" },
      { year: "1984", winner: "Pakistan", runnerUp: "West Germany", host: "Los Angeles" },
      { year: "1980", winner: "India", runnerUp: "Spain", host: "Moscow" },
      { year: "1976", winner: "New Zealand", runnerUp: "Australia", host: "Montreal" },
      { year: "1972", winner: "West Germany", runnerUp: "Pakistan", host: "Munich" },
      { year: "1968", winner: "Pakistan", runnerUp: "Australia", host: "Mexico City" },
      { year: "1964", winner: "India", runnerUp: "Pakistan", host: "Tokyo" },
      { year: "1960", winner: "Pakistan", runnerUp: "India", host: "Rome" },
      { year: "1956", winner: "India", runnerUp: "Pakistan", host: "Melbourne" },
      { year: "1952", winner: "India", runnerUp: "Netherlands", host: "Helsinki" },
      { year: "1948", winner: "India", runnerUp: "Great Britain", host: "London" },
      { year: "1936", winner: "India", runnerUp: "Germany", host: "Berlin" },
      { year: "1932", winner: "India", runnerUp: "Japan", host: "Los Angeles" },
      { year: "1928", winner: "India", runnerUp: "Netherlands", host: "Amsterdam" },
      { year: "1920", winner: "Great Britain", runnerUp: "Denmark", host: "Antwerp" },
      { year: "1908", winner: "Great Britain", runnerUp: "Ireland (within Great Britain)", host: "London" },
    ],
    faq: [
      {
        q: "How many Olympic gold medals has India won in hockey?",
        a: "Eight, all in men's hockey: 1928, 1932, 1936, 1948, 1952, 1956, 1964 and 1980. No country has won more.",
      },
      {
        q: "When did India last win an Olympic hockey medal?",
        a: "At Paris 2024, where India won bronze — their second bronze in a row after Tokyo 2020.",
      },
      {
        q: "When did India last win Olympic gold in hockey?",
        a: "In 1980 at the Moscow Olympics, beating Spain in the final.",
      },
      {
        q: "How many Olympic hockey medals has India won in total?",
        a: "Thirteen in men's hockey: eight gold, one silver (1960) and four bronze (1968, 1972, 2020 and 2024).",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "FIH and Olympic records",
  },
  {
    sport: "hockey",
    slug: "hockey-world-cup",
    name: "Men's FIH Hockey World Cup",
    short: "Hockey World Cup",
    description:
      "The men's Hockey World Cup since 1971: every champion, runner-up and host. India won in 1975; Germany won the 2026 edition in Belgium and the Netherlands.",
    intro: [
      "The men's Hockey World Cup is hockey's world championship outside the Olympics, usually held every four years. It was first played in Barcelona in 1971.",
      "India won the title once, in Kuala Lumpur in 1975, two years after losing the 1973 final. India have hosted it four times: Bombay in 1982, New Delhi in 2010, and Odisha in 2018 and 2023.",
    ],
    facts: [
      { label: "First edition", value: "1971, Barcelona" },
      { label: "Run by", value: "FIH" },
      { label: "Teams", value: "16" },
      { label: "Most titles", value: "Pakistan and Germany, 4 each" },
      { label: "India's title", value: "1975" },
      { label: "Latest champion", value: "Germany, 2026" },
    ],
    india: "Champions in 1975, runners-up in 1973 and third in 1971.",
    editions: [
      { year: "2026", winner: "Germany", runnerUp: "Spain", host: "Belgium and Netherlands" },
      { year: "2023", winner: "Germany", runnerUp: "Belgium", host: "India (Odisha)" },
      { year: "2018", winner: "Belgium", runnerUp: "Netherlands", host: "India (Bhubaneswar)" },
      { year: "2014", winner: "Australia", runnerUp: "Netherlands", host: "Netherlands" },
      { year: "2010", winner: "Australia", runnerUp: "Germany", host: "India (New Delhi)" },
      { year: "2006", winner: "Germany", runnerUp: "Australia", host: "Germany" },
      { year: "2002", winner: "Germany", runnerUp: "Australia", host: "Malaysia" },
      { year: "1998", winner: "Netherlands", runnerUp: "Spain", host: "Netherlands" },
      { year: "1994", winner: "Pakistan", runnerUp: "Netherlands", host: "Australia" },
      { year: "1990", winner: "Netherlands", runnerUp: "Pakistan", host: "Pakistan" },
      { year: "1986", winner: "Australia", runnerUp: "England", host: "England" },
      { year: "1982", winner: "Pakistan", runnerUp: "West Germany", host: "India (Bombay)" },
      { year: "1978", winner: "Pakistan", runnerUp: "Netherlands", host: "Argentina" },
      { year: "1975", winner: "India", runnerUp: "Pakistan", host: "Malaysia" },
      { year: "1973", winner: "Netherlands", runnerUp: "India", host: "Netherlands" },
      { year: "1971", winner: "Pakistan", runnerUp: "Spain", host: "Spain" },
    ],
    faq: [
      {
        q: "Has India won the Hockey World Cup?",
        a: "Yes, once — in 1975 in Kuala Lumpur, beating Pakistan in the final. India were also runners-up in 1973.",
      },
      {
        q: "Who won the 2026 men's Hockey World Cup?",
        a: "Germany, who beat Spain in the final. The tournament was co-hosted by Belgium and the Netherlands.",
      },
      {
        q: "Which country has won the most Hockey World Cups?",
        a: "Pakistan and Germany, with four titles each. Australia and the Netherlands have three each.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "FIH records",
  },
  {
    sport: "hockey",
    slug: "asian-games",
    name: "Asian Games men's hockey",
    short: "Asian Games",
    description:
      "Men's hockey at the Asian Games since 1958. India have won gold five times, most recently at Aichi-Nagoya 2026, and the title carries a direct Olympic place.",
    intro: [
      "Men's hockey has been part of the Asian Games since 1958, and the gold medal is usually the quickest route to the Olympics: the winner qualifies directly.",
      "India have won gold five times — 1966, 1998, 2014, 2022 and 2026 — and silver nine times, mostly in finals against Pakistan in the early decades.",
    ],
    facts: [
      { label: "First tournament", value: "1958, Tokyo" },
      { label: "India's golds", value: "5" },
      { label: "Most golds", value: "Pakistan, 8" },
      { label: "Prize", value: "Gold medallist qualifies for the Olympics" },
      { label: "Latest champion", value: "India, 2026" },
    ],
    india: "Gold in 1966, 1998, 2014, 2022 and 2026; nine silvers and three bronzes.",
    editions: [
      { year: "2026", winner: "India", runnerUp: "Malaysia", host: "Aichi-Nagoya, Japan" },
      { year: "2022", winner: "India", runnerUp: "Japan", host: "Hangzhou, China" },
      { year: "2018", winner: "Japan", runnerUp: "Malaysia", host: "Jakarta, Indonesia" },
      { year: "2014", winner: "India", runnerUp: "Pakistan", host: "Incheon, South Korea" },
      { year: "2010", winner: "Pakistan", runnerUp: "Malaysia", host: "Guangzhou, China" },
      { year: "2006", winner: "South Korea", runnerUp: "China", host: "Doha, Qatar" },
      { year: "2002", winner: "South Korea", runnerUp: "India", host: "Busan, South Korea" },
      { year: "1998", winner: "India", runnerUp: "South Korea", host: "Bangkok, Thailand" },
      { year: "1994", winner: "South Korea", runnerUp: "India", host: "Hiroshima, Japan" },
      { year: "1990", winner: "Pakistan", runnerUp: "India", host: "Beijing, China" },
      { year: "1986", winner: "South Korea", runnerUp: "Pakistan", host: "Seoul, South Korea" },
      { year: "1982", winner: "Pakistan", runnerUp: "India", host: "New Delhi, India" },
      { year: "1978", winner: "Pakistan", runnerUp: "India", host: "Bangkok, Thailand" },
      { year: "1974", winner: "Pakistan", runnerUp: "India", host: "Tehran, Iran" },
      { year: "1970", winner: "Pakistan", runnerUp: "India", host: "Bangkok, Thailand" },
      { year: "1966", winner: "India", runnerUp: "Pakistan", host: "Bangkok, Thailand" },
      { year: "1962", winner: "Pakistan", runnerUp: "India", host: "Jakarta, Indonesia" },
      { year: "1958", winner: "Pakistan", runnerUp: "India", host: "Tokyo, Japan" },
    ],
    faq: [
      {
        q: "How many times has India won Asian Games gold in hockey?",
        a: "Five times in men's hockey: 1966, 1998, 2014, 2022 and 2026.",
      },
      {
        q: "Who won men's hockey at the 2026 Asian Games?",
        a: "India, who beat Malaysia in the final in Japan to retain the title they won in 2022.",
      },
      {
        q: "Does the Asian Games hockey winner qualify for the Olympics?",
        a: "Yes. The men's gold medallist earns a direct place at the next Olympic Games.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "OCA and FIH records",
  },
  {
    sport: "hockey",
    slug: "asia-cup",
    name: "Men's Hockey Asia Cup",
    short: "Asia Cup",
    description:
      "The men's Hockey Asia Cup since 1982: every champion and runner-up. India have won four titles, most recently at home in Rajgir in 2025.",
    intro: [
      "The men's Asia Cup is Asia's continental championship, first played in Karachi in 1982. The winner qualifies for the next World Cup.",
      "India have won it four times — 2003, 2007, 2017 and 2025 — and finished runners-up five times. The 2025 title, won at home in Rajgir, booked India's place at the 2026 World Cup.",
    ],
    facts: [
      { label: "First edition", value: "1982, Karachi" },
      { label: "Run by", value: "Asian Hockey Federation" },
      { label: "Most titles", value: "South Korea, 5" },
      { label: "India's titles", value: "4" },
      { label: "Prize", value: "Winner qualifies for the World Cup" },
    ],
    india: "Champions in 2003, 2007, 2017 and 2025; runners-up five times.",
    editions: [
      { year: "2025", winner: "India", runnerUp: "South Korea", host: "Rajgir, India" },
      { year: "2022", winner: "South Korea", runnerUp: "Malaysia", host: "Jakarta, Indonesia" },
      { year: "2017", winner: "India", runnerUp: "Malaysia", host: "Dhaka, Bangladesh" },
      { year: "2013", winner: "South Korea", runnerUp: "India", host: "Ipoh, Malaysia" },
      { year: "2009", winner: "South Korea", runnerUp: "Pakistan", host: "Kuantan, Malaysia" },
      { year: "2007", winner: "India", runnerUp: "South Korea", host: "Chennai, India" },
      { year: "2003", winner: "India", runnerUp: "Pakistan", host: "Kuala Lumpur, Malaysia" },
      { year: "1999", winner: "South Korea", runnerUp: "Pakistan", host: "Kuala Lumpur, Malaysia" },
      { year: "1994", winner: "South Korea", runnerUp: "India", host: "Hiroshima, Japan" },
      { year: "1989", winner: "Pakistan", runnerUp: "India", host: "New Delhi, India" },
      { year: "1985", winner: "Pakistan", runnerUp: "India", host: "Dhaka, Bangladesh" },
      { year: "1982", winner: "Pakistan", runnerUp: "India", host: "Karachi, Pakistan" },
    ],
    faq: [
      {
        q: "How many times has India won the hockey Asia Cup?",
        a: "Four times: 2003, 2007, 2017 and 2025.",
      },
      {
        q: "Who won the 2025 men's Hockey Asia Cup?",
        a: "India, who beat South Korea in the final in Rajgir, Bihar, and qualified for the 2026 World Cup.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "Asian Hockey Federation records",
  },
  {
    sport: "hockey",
    slug: "fih-pro-league",
    name: "Men's FIH Pro League",
    short: "Pro League",
    description:
      "The FIH Pro League: the top men's national teams playing home-and-away every season since 2019. Every winner and runner-up, and India's best finish.",
    intro: [
      "The FIH Pro League is an annual league for the world's top national teams, played home and away across the season since 2019. It replaced the old World League and Champions Trophy.",
      "India's best finish is third, in 2021–22. The Netherlands have been the most successful side.",
    ],
    facts: [
      { label: "First season", value: "2019" },
      { label: "Format", value: "Round-robin league, home and away" },
      { label: "Run by", value: "FIH" },
      { label: "Most titles", value: "Netherlands, 3" },
      { label: "India's best", value: "3rd, 2021–22" },
    ],
    india: "Third in 2021–22 and fourth in 2020–21 and 2022–23.",
    editions: [
      { year: "2025–26", winner: "Belgium", runnerUp: "England" },
      { year: "2024–25", winner: "Netherlands", runnerUp: "Belgium" },
      { year: "2023–24", winner: "Australia", runnerUp: "Netherlands" },
      { year: "2022–23", winner: "Netherlands", runnerUp: "Great Britain" },
      { year: "2021–22", winner: "Netherlands", runnerUp: "Belgium" },
      { year: "2020–21", winner: "Belgium", runnerUp: "Australia" },
      { year: "2019", winner: "Australia", runnerUp: "Belgium" },
    ],
    faq: [
      {
        q: "What is India's best finish in the FIH Pro League?",
        a: "Third place, in the 2021–22 season.",
      },
      {
        q: "Who has won the most FIH Pro League titles?",
        a: "The Netherlands, with three. Australia and Belgium have two each.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "FIH records",
  },
  {
    sport: "hockey",
    slug: "hockey-india-league",
    name: "Hockey India League (HIL)",
    short: "HIL",
    description:
      "The Hockey India League: India's franchise hockey league, first run 2013–2017 and revived in 2024–25 with a women's competition. Every men's champion.",
    intro: [
      "The Hockey India League is India's franchise league, mixing the national team's players with overseas stars. It ran for five seasons from 2013 to 2017, then returned in 2024–25 after a seven-year break.",
      "The revival added a women's league: Odisha Warriors won the first women's title in 2025 and SG Pipers the second in 2025–26.",
    ],
    facts: [
      { label: "First season", value: "2013" },
      { label: "Run by", value: "Hockey India" },
      { label: "Revived", value: "2024–25, with a women's league" },
      { label: "Most men's titles", value: "Kalinga Lancers, 2" },
    ],
    india: "Every HIL side is built around India's national-team players, with a limited number of overseas signings.",
    editions: [
      { year: "2026", winner: "Kalinga Lancers", runnerUp: "Ranchi Royals" },
      { year: "2024–25", winner: "Rarh Bengal Tigers", runnerUp: "Hyderabad Toofans" },
      { year: "2017", winner: "Kalinga Lancers", runnerUp: "Dabang Mumbai" },
      { year: "2016", winner: "Punjab Warriors", runnerUp: "Kalinga Lancers" },
      { year: "2015", winner: "Ranchi Rays", runnerUp: "Punjab Warriors" },
      { year: "2014", winner: "Delhi Waveriders", runnerUp: "Punjab Warriors" },
      { year: "2013", winner: "Ranchi Rhinos", runnerUp: "Delhi Waveriders" },
    ],
    faq: [
      {
        q: "Who won the 2026 Hockey India League?",
        a: "Kalinga Lancers won the men's title, beating Ranchi Royals in the final — their second HIL title after 2017.",
      },
      {
        q: "Is there a women's Hockey India League?",
        a: "Yes. A women's league began with the 2024–25 revival. Odisha Warriors won the first title and SG Pipers the second.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "Hockey India records",
  },

  // ── Kabaddi (checked 10 October 2026) ──
  {
    sport: "kabaddi",
    slug: "pro-kabaddi-league",
    name: "Pro Kabaddi League (PKL)",
    short: "PKL",
    description:
      "The Pro Kabaddi League: India's franchise kabaddi league since 2014. Every champion and runner-up across 12 seasons, and the teams with the most titles.",
    intro: [
      "The Pro Kabaddi League is a franchise league that turned kabaddi into prime-time television in India. It began in 2014 with eight teams and has had twelve since 2017.",
      "Patna Pirates are the most successful side, with three titles in a row between 2016 and 2017. Dabang Delhi K.C. won the twelfth season in 2025.",
    ],
    facts: [
      { label: "First season", value: "2014" },
      { label: "Teams", value: "12" },
      { label: "Seasons played", value: "12" },
      { label: "Most titles", value: "Patna Pirates, 3" },
      { label: "Latest champion", value: "Dabang Delhi K.C., 2025" },
    ],
    india:
      "PKL squads are built around Indian players, with a small number of overseas signings — most of them from Iran.",
    editions: [
      { year: "2025", winner: "Dabang Delhi K.C.", runnerUp: "Puneri Paltan" },
      { year: "2024", winner: "Haryana Steelers", runnerUp: "Patna Pirates" },
      { year: "2023–24", winner: "Puneri Paltan", runnerUp: "Haryana Steelers" },
      { year: "2022", winner: "Jaipur Pink Panthers", runnerUp: "Puneri Paltan" },
      { year: "2021–22", winner: "Dabang Delhi K.C.", runnerUp: "Patna Pirates" },
      { year: "2019", winner: "Bengal Warriors", runnerUp: "Dabang Delhi K.C." },
      { year: "2018–19", winner: "Bengaluru Bulls", runnerUp: "Gujarat Fortune Giants" },
      { year: "2017", winner: "Patna Pirates", runnerUp: "Gujarat Fortune Giants" },
      { year: "2016 (Season 4)", winner: "Patna Pirates", runnerUp: "Jaipur Pink Panthers" },
      { year: "2016 (Season 3)", winner: "Patna Pirates", runnerUp: "U Mumba" },
      { year: "2015", winner: "U Mumba", runnerUp: "Bengaluru Bulls" },
      { year: "2014", winner: "Jaipur Pink Panthers", runnerUp: "U Mumba" },
    ],
    faq: [
      {
        q: "Which team has won the most Pro Kabaddi titles?",
        a: "Patna Pirates, with three — seasons 3, 4 and 5, won in a row in 2016 and 2017. Jaipur Pink Panthers and Dabang Delhi K.C. have two each.",
      },
      {
        q: "Who won Pro Kabaddi Season 12?",
        a: "Dabang Delhi K.C. won the 2025 season, beating Puneri Paltan in the final in Delhi for their second title.",
      },
      {
        q: "When did the Pro Kabaddi League start?",
        a: "In 2014. Jaipur Pink Panthers won the first season, beating U Mumba in the final.",
      },
      {
        q: "How many teams play in the Pro Kabaddi League?",
        a: "Twelve, since the league expanded from eight teams in 2017.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "Pro Kabaddi League records",
  },
  {
    sport: "kabaddi",
    slug: "asian-games",
    name: "Asian Games kabaddi",
    short: "Asian Games",
    description:
      "Kabaddi at the Asian Games since 1990: India's men have won 9 of 10 golds, and India's women 4 of 5. Every men's final, with hosts.",
    intro: [
      "Kabaddi has been an Asian Games sport since Beijing 1990, and India have dominated it. The men won the first seven golds, lost only in 2018 to Iran, and have won again in 2022 and 2026.",
      "Women's kabaddi joined the Games in 2010. India's women have won gold four times — 2010, 2014, 2022 and 2026 — and silver in 2018.",
    ],
    facts: [
      { label: "In the Games since", value: "1990 (women since 2010)" },
      { label: "India men's golds", value: "9 of 10" },
      { label: "India women's golds", value: "4 of 5" },
      { label: "Only other men's champion", value: "Iran, 2018" },
      { label: "Latest Games", value: "Aichi-Nagoya 2026" },
    ],
    india: "Men: gold every time except 2018 (bronze). Women: gold in 2010, 2014, 2022 and 2026; silver in 2018.",
    editions: [
      { year: "2026", winner: "India", runnerUp: "Iran", host: "Aichi-Nagoya, Japan" },
      { year: "2022", winner: "India", runnerUp: "Iran", host: "Hangzhou, China" },
      { year: "2018", winner: "Iran", runnerUp: "South Korea", host: "Jakarta, Indonesia" },
      { year: "2014", winner: "India", runnerUp: "Iran", host: "Incheon, South Korea" },
      { year: "2010", winner: "India", runnerUp: "Iran", host: "Guangzhou, China" },
      { year: "2006", winner: "India", runnerUp: "Pakistan", host: "Doha, Qatar" },
      { year: "2002", winner: "India", runnerUp: "Bangladesh", host: "Busan, South Korea" },
      { year: "1998", winner: "India", runnerUp: "Pakistan", host: "Bangkok, Thailand" },
      { year: "1994", winner: "India", runnerUp: "Bangladesh", host: "Hiroshima, Japan" },
      { year: "1990", winner: "India", runnerUp: "Bangladesh", host: "Beijing, China" },
    ],
    faq: [
      {
        q: "How many Asian Games kabaddi golds has India won?",
        a: "Thirteen: nine in men's kabaddi (every Games since 1990 except 2018) and four in women's kabaddi (2010, 2014, 2022 and 2026).",
      },
      {
        q: "When did India lose the Asian Games kabaddi title?",
        a: "In 2018, when Iran won both the men's and women's golds in Jakarta. India's men took bronze and the women silver.",
      },
      {
        q: "Who won kabaddi at the 2026 Asian Games?",
        a: "India won both the men's and the women's gold in Japan.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "Olympic Council of Asia records",
  },
  {
    sport: "kabaddi",
    slug: "kabaddi-world-cup",
    name: "Kabaddi World Cup",
    short: "World Cup",
    description:
      "The men's Kabaddi World Cup (standard style): India have won all three editions — 2004, 2007 and 2016 — each time beating Iran in the final.",
    intro: [
      "The Kabaddi World Cup, run by the International Kabaddi Federation in the standard style played in the PKL and at the Asian Games, has been held three times. India have won every one.",
      "Each final has been India against Iran: Mumbai in 2004, Panvel in 2007 and Ahmedabad in 2016.",
    ],
    facts: [
      { label: "Run by", value: "International Kabaddi Federation" },
      { label: "Editions", value: "3 (2004, 2007, 2016)" },
      { label: "India's titles", value: "3 of 3" },
      { label: "Every runner-up", value: "Iran" },
    ],
    india: "Champions in 2004, 2007 and 2016, beating Iran in all three finals.",
    editions: [
      { year: "2016", winner: "India", runnerUp: "Iran", host: "Ahmedabad, India" },
      { year: "2007", winner: "India", runnerUp: "Iran", host: "Panvel, India" },
      { year: "2004", winner: "India", runnerUp: "Iran", host: "Mumbai, India" },
    ],
    faq: [
      {
        q: "How many Kabaddi World Cups has India won?",
        a: "All three men's standard-style World Cups: 2004, 2007 and 2016.",
      },
      {
        q: "Who did India beat in the 2016 Kabaddi World Cup final?",
        a: "Iran, in Ahmedabad. Iran were also India's opponents in the 2004 and 2007 finals.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "International Kabaddi Federation records",
  },

  // ── Football (checked 10 October 2026) ──
  {
    sport: "football",
    slug: "indian-super-league",
    name: "Indian Super League (ISL)",
    short: "ISL",
    description:
      "The Indian Super League since 2014: every champion, from ATK's first title to East Bengal in 2025–26, plus how the title has been decided.",
    intro: [
      "The Indian Super League is India's top football division. It began in 2014 as a short franchise tournament and has become the national league, with promotion from the I-League.",
      "Until 2024–25 the champion was decided by a playoff final, with the League Winners' Shield going to the side that topped the table from 2019–20. In 2025–26 the title went to the league leaders, East Bengal. Clubs are listed under their current names: ATK played as Atlético de Kolkata in 2014 and 2016, and Mohun Bagan SG as ATK Mohun Bagan from 2020 to 2023.",
    ],
    facts: [
      { label: "First season", value: "2014" },
      { label: "Level", value: "Top division of Indian football" },
      { label: "Run by", value: "AIFF" },
      { label: "Most titles", value: "ATK, 3" },
      { label: "Latest champion", value: "East Bengal, 2025–26" },
    ],
    india: "The ISL is where most of India's national-team players play their club football.",
    editions: [
      { year: "2025–26", winner: "East Bengal", runnerUp: "Mohun Bagan SG (league runners-up)" },
      { year: "2024–25", winner: "Mohun Bagan SG", runnerUp: "Bengaluru" },
      { year: "2023–24", winner: "Mumbai City", runnerUp: "Mohun Bagan SG" },
      { year: "2022–23", winner: "Mohun Bagan SG", runnerUp: "Bengaluru" },
      { year: "2021–22", winner: "Hyderabad", runnerUp: "Kerala Blasters" },
      { year: "2020–21", winner: "Mumbai City", runnerUp: "Mohun Bagan SG" },
      { year: "2019–20", winner: "ATK", runnerUp: "Chennaiyin" },
      { year: "2018–19", winner: "Bengaluru", runnerUp: "Goa" },
      { year: "2017–18", winner: "Chennaiyin", runnerUp: "Bengaluru" },
      { year: "2016", winner: "ATK", runnerUp: "Kerala Blasters" },
      { year: "2015", winner: "Chennaiyin", runnerUp: "Goa" },
      { year: "2014", winner: "ATK", runnerUp: "Kerala Blasters" },
    ],
    faq: [
      {
        q: "Who won the ISL in 2025–26?",
        a: "East Bengal, their first ISL title. The 2025–26 champion was decided on the league table rather than by a playoff final.",
      },
      {
        q: "Which club has won the most ISL titles?",
        a: "ATK, with three (2014, 2016 and 2019–20). Chennaiyin, Mumbai City and Mohun Bagan SG have two each.",
      },
      {
        q: "What is the ISL League Winners' Shield?",
        a: "The trophy for the club that finishes top of the regular-season table, awarded since 2019–20 alongside the playoff title.",
      },
      {
        q: "Have Kerala Blasters won the ISL?",
        a: "Not yet. They have reached three finals — 2014, 2016 and 2021–22 — and lost all three.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "AIFF and ISL records",
  },
  {
    sport: "football",
    slug: "super-cup",
    name: "Super Cup",
    short: "Super Cup",
    description:
      "India's knockout Super Cup since 2018: every winner and runner-up. Goa have won it three times, including back-to-back in 2025 and 2025–26.",
    intro: [
      "The Super Cup is India's national knockout cup for clubs from the ISL and I-League. It began in 2018, replacing the Federation Cup, and was paused between 2020 and 2022.",
      "Goa are the most successful side, with three titles, the last two in a row.",
    ],
    facts: [
      { label: "First edition", value: "2018" },
      { label: "Format", value: "Knockout cup" },
      { label: "Run by", value: "AIFF" },
      { label: "Most titles", value: "Goa, 3" },
    ],
    india: "A cup for Indian clubs; the winner earns a continental place in some seasons.",
    editions: [
      { year: "2025–26", winner: "Goa", runnerUp: "East Bengal" },
      { year: "2025", winner: "Goa", runnerUp: "Jamshedpur" },
      { year: "2024", winner: "East Bengal", runnerUp: "Odisha" },
      { year: "2023", winner: "Odisha", runnerUp: "Bengaluru" },
      { year: "2019", winner: "Goa", runnerUp: "Chennaiyin" },
      { year: "2018", winner: "Bengaluru", runnerUp: "East Bengal" },
    ],
    faq: [
      {
        q: "Who has won the most Super Cups in Indian football?",
        a: "Goa, with three: 2019, 2025 and 2025–26.",
      },
      {
        q: "When did the Super Cup start?",
        a: "In 2018, replacing the Federation Cup. Bengaluru won the first edition, beating East Bengal in the final.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "AIFF records",
  },
  {
    sport: "football",
    slug: "durand-cup",
    name: "Durand Cup",
    short: "Durand Cup",
    description:
      "The Durand Cup, first played in 1888, is one of the oldest football tournaments in the world. Recent winners since 2010, and how it fits the Indian season.",
    intro: [
      "The Durand Cup was first played in 1888, making it Asia's oldest club football competition and one of the oldest anywhere. It now opens the Indian season each summer, with ISL, I-League and armed-forces sides taking part.",
      "Kolkata's two giants, Mohun Bagan and East Bengal, have the richest history in it. In the most recent edition, in 2026, East Bengal beat Mohun Bagan in the final.",
    ],
    facts: [
      { label: "First played", value: "1888" },
      { label: "Format", value: "Group stage then knockouts" },
      { label: "Usual window", value: "July–August" },
      { label: "Latest champion", value: "East Bengal, 2026" },
    ],
    india: "Played every year it can be, the Durand Cup is the traditional curtain-raiser of the Indian football season.",
    since: "2010",
    editions: [
      { year: "2026", winner: "East Bengal", runnerUp: "Mohun Bagan" },
      { year: "2025", winner: "NorthEast United", runnerUp: "Diamond Harbour" },
      { year: "2024", winner: "NorthEast United", runnerUp: "Mohun Bagan" },
      { year: "2023", winner: "Mohun Bagan", runnerUp: "East Bengal" },
      { year: "2022", winner: "Bengaluru", runnerUp: "Mumbai City" },
      { year: "2021", winner: "Goa", runnerUp: "Mohammedan" },
      { year: "2019", winner: "Gokulam Kerala", runnerUp: "Mohun Bagan" },
      { year: "2016", winner: "Army Green", runnerUp: "NEROCA" },
      { year: "2014", winner: "Salgaocar", runnerUp: "Pune" },
      { year: "2013", winner: "Mohammedan", runnerUp: "ONGC" },
      { year: "2012", winner: "Air India", runnerUp: "Dodsal" },
      { year: "2011", winner: "Churchill Brothers", runnerUp: "Prayag United" },
      { year: "2010", winner: "Chirag United", runnerUp: "JCT" },
    ],
    faq: [
      {
        q: "How old is the Durand Cup?",
        a: "It was first played in 1888, making it the oldest club football competition in Asia.",
      },
      {
        q: "Who won the 2026 Durand Cup?",
        a: "East Bengal, who beat Mohun Bagan in the final.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "Durand Cup records",
  },
  {
    sport: "football",
    slug: "saff-championship",
    name: "SAFF Championship",
    short: "SAFF Championship",
    description:
      "The SAFF Championship, South Asia's men's football title: India have won it nine times, most recently at home in 2023. Every winner and runner-up.",
    intro: [
      "The SAFF Championship is the men's championship of the South Asian Football Federation, first played in 1993. India are by far its most successful side, with nine titles.",
      "India won the most recent completed edition at home in Bengaluru in 2023, beating guest side Kuwait on penalties. The 2009 title was won by an under-23 India team.",
    ],
    facts: [
      { label: "First edition", value: "1993" },
      { label: "Run by", value: "South Asian Football Federation" },
      { label: "India's titles", value: "9" },
      { label: "Most titles", value: "India, 9" },
    ],
    india: "Champions nine times — 1993, 1997, 1999, 2005, 2009, 2011, 2015, 2021 and 2023 — and runners-up four times.",
    editions: [
      { year: "2023", winner: "India", runnerUp: "Kuwait", host: "India" },
      { year: "2021", winner: "India", runnerUp: "Nepal", host: "Maldives" },
      { year: "2018", winner: "Maldives", runnerUp: "India", host: "Bangladesh" },
      { year: "2015", winner: "India", runnerUp: "Afghanistan", host: "India" },
      { year: "2013", winner: "Afghanistan", runnerUp: "India", host: "Nepal" },
      { year: "2011", winner: "India", runnerUp: "Afghanistan", host: "India" },
      { year: "2009", winner: "India", runnerUp: "Maldives", host: "Bangladesh" },
      { year: "2008", winner: "Maldives", runnerUp: "India", host: "Maldives and Sri Lanka" },
      { year: "2005", winner: "India", runnerUp: "Bangladesh", host: "Pakistan" },
      { year: "2003", winner: "Bangladesh", runnerUp: "Maldives", host: "Bangladesh" },
      { year: "1999", winner: "India", runnerUp: "Bangladesh", host: "India" },
      { year: "1997", winner: "India", runnerUp: "Maldives", host: "Nepal" },
      { year: "1995", winner: "Sri Lanka", runnerUp: "India", host: "Sri Lanka" },
      { year: "1993", winner: "India", runnerUp: "Sri Lanka", host: "Pakistan" },
    ],
    faq: [
      {
        q: "How many SAFF Championships has India won?",
        a: "Nine: 1993, 1997, 1999, 2005, 2009, 2011, 2015, 2021 and 2023.",
      },
      {
        q: "Who won the 2023 SAFF Championship?",
        a: "India, who beat Kuwait on penalties in the final in Bengaluru.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "SAFF records",
  },
  {
    sport: "football",
    slug: "afc-asian-cup",
    name: "AFC Asian Cup",
    short: "Asian Cup",
    description:
      "The AFC Asian Cup, Asia's men's championship since 1956: every winner and runner-up. India finished second in 1964, their best result.",
    intro: [
      "The AFC Asian Cup is Asia's continental championship for men's national teams, first played in 1956. Japan have won it a record four times.",
      "India's best finish came in 1964 in Israel, when they were runners-up in a four-team round-robin. India have also played in the finals in 1984, 2011, 2019 and 2023.",
    ],
    facts: [
      { label: "First edition", value: "1956" },
      { label: "Run by", value: "Asian Football Confederation" },
      { label: "Most titles", value: "Japan, 4" },
      { label: "India's best", value: "Runners-up, 1964" },
      { label: "Next edition", value: "2027, Saudi Arabia" },
    ],
    india: "Runners-up in 1964; group stage in 1984, 2011, 2019 and 2023.",
    editions: [
      { year: "2023", winner: "Qatar", runnerUp: "Jordan", host: "Qatar" },
      { year: "2019", winner: "Qatar", runnerUp: "Japan", host: "United Arab Emirates" },
      { year: "2015", winner: "Australia", runnerUp: "South Korea", host: "Australia" },
      { year: "2011", winner: "Japan", runnerUp: "Australia", host: "Qatar" },
      { year: "2007", winner: "Iraq", runnerUp: "Saudi Arabia", host: "Indonesia, Malaysia, Thailand and Vietnam" },
      { year: "2004", winner: "Japan", runnerUp: "China", host: "China" },
      { year: "2000", winner: "Japan", runnerUp: "Saudi Arabia", host: "Lebanon" },
      { year: "1996", winner: "Saudi Arabia", runnerUp: "United Arab Emirates", host: "United Arab Emirates" },
      { year: "1992", winner: "Japan", runnerUp: "Saudi Arabia", host: "Japan" },
      { year: "1988", winner: "Saudi Arabia", runnerUp: "South Korea", host: "Qatar" },
      { year: "1984", winner: "Saudi Arabia", runnerUp: "China", host: "Singapore" },
      { year: "1980", winner: "Kuwait", runnerUp: "South Korea", host: "Kuwait" },
      { year: "1976", winner: "Iran", runnerUp: "Kuwait", host: "Iran" },
      { year: "1972", winner: "Iran", runnerUp: "South Korea", host: "Thailand" },
      { year: "1968", winner: "Iran", runnerUp: "Burma", host: "Iran" },
      { year: "1964", winner: "Israel", runnerUp: "India", host: "Israel" },
      { year: "1960", winner: "South Korea", runnerUp: "Israel", host: "South Korea" },
      { year: "1956", winner: "South Korea", runnerUp: "Israel", host: "Hong Kong" },
    ],
    faq: [
      {
        q: "What is India's best result at the Asian Cup?",
        a: "Runners-up in 1964, behind hosts Israel in a four-team round-robin.",
      },
      {
        q: "How many times has India played in the Asian Cup?",
        a: "Five: 1964, 1984, 2011, 2019 and 2023.",
      },
      {
        q: "Who has won the most Asian Cups?",
        a: "Japan, with four titles: 1992, 2000, 2004 and 2011.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "AFC records",
  },

  // ── Badminton (checked 10 October 2026) ──
  {
    sport: "badminton",
    slug: "thomas-cup",
    name: "Thomas Cup",
    short: "Thomas Cup",
    description:
      "The Thomas Cup, badminton's men's team world championship since 1949. India won it for the first time in 2022, beating Indonesia 3–0 in the final. Every winner.",
    intro: [
      "The Thomas Cup is the world team championship for men's badminton, first contested in 1948–49. Each tie is played over five matches: three singles and two doubles.",
      "India won it for the first time in 2022 in Bangkok, beating 14-time champions Indonesia 3–0 in the final — one of the biggest results in Indian badminton history.",
    ],
    facts: [
      { label: "First edition", value: "1949" },
      { label: "Format", value: "Team event: 3 singles, 2 doubles" },
      { label: "Run by", value: "BWF" },
      { label: "Most titles", value: "Indonesia, 14" },
      { label: "India's title", value: "2022" },
    ],
    india: "Champions in 2022, beating Indonesia 3–0 in the final in Bangkok.",
    editions: [
      { year: "2026", winner: "China", runnerUp: "France", host: "Horsens, Denmark" },
      { year: "2024", winner: "China", runnerUp: "Indonesia", host: "Chengdu, China" },
      { year: "2022", winner: "India", runnerUp: "Indonesia", host: "Bangkok, Thailand" },
      { year: "2020", winner: "Indonesia", runnerUp: "China", host: "Aarhus, Denmark" },
      { year: "2018", winner: "China", runnerUp: "Japan", host: "Bangkok, Thailand" },
      { year: "2016", winner: "Denmark", runnerUp: "Indonesia", host: "Kunshan, China" },
      { year: "2014", winner: "Japan", runnerUp: "Malaysia", host: "New Delhi, India" },
      { year: "2012", winner: "China", runnerUp: "South Korea", host: "Wuhan, China" },
      { year: "2010", winner: "China", runnerUp: "Indonesia", host: "Kuala Lumpur, Malaysia" },
      { year: "2008", winner: "China", runnerUp: "South Korea", host: "Jakarta, Indonesia" },
      { year: "2006", winner: "China", runnerUp: "Denmark", host: "Sendai and Tokyo, Japan" },
      { year: "2004", winner: "China", runnerUp: "Denmark", host: "Jakarta, Indonesia" },
      { year: "2002", winner: "Indonesia", runnerUp: "Malaysia", host: "Guangzhou, China" },
      { year: "2000", winner: "Indonesia", runnerUp: "China", host: "Kuala Lumpur, Malaysia" },
      { year: "1998", winner: "Indonesia", runnerUp: "Malaysia", host: "Hong Kong" },
      { year: "1996", winner: "Indonesia", runnerUp: "Denmark", host: "Hong Kong" },
      { year: "1994", winner: "Indonesia", runnerUp: "Malaysia", host: "Jakarta, Indonesia" },
      { year: "1992", winner: "Malaysia", runnerUp: "Indonesia", host: "Kuala Lumpur, Malaysia" },
      { year: "1990", winner: "China", runnerUp: "Malaysia", host: "Nagoya and Tokyo, Japan" },
      { year: "1988", winner: "China", runnerUp: "Malaysia", host: "Kuala Lumpur, Malaysia" },
      { year: "1986", winner: "China", runnerUp: "Indonesia", host: "Jakarta, Indonesia" },
      { year: "1984", winner: "Indonesia", runnerUp: "China", host: "Kuala Lumpur, Malaysia" },
      { year: "1982", winner: "China", runnerUp: "Indonesia", host: "London, England" },
      { year: "1979", winner: "Indonesia", runnerUp: "Denmark", host: "Jakarta, Indonesia" },
      { year: "1976", winner: "Indonesia", runnerUp: "Malaysia", host: "Bangkok, Thailand" },
      { year: "1973", winner: "Indonesia", runnerUp: "Denmark", host: "Jakarta, Indonesia" },
      { year: "1970", winner: "Indonesia", runnerUp: "Malaysia", host: "Kuala Lumpur, Malaysia" },
      { year: "1967", winner: "Malaysia", runnerUp: "Indonesia", host: "Jakarta, Indonesia" },
      { year: "1964", winner: "Indonesia", runnerUp: "Denmark", host: "Tokyo, Japan" },
      { year: "1961", winner: "Indonesia", runnerUp: "Thailand", host: "Jakarta, Indonesia" },
      { year: "1958", winner: "Indonesia", runnerUp: "Malaya", host: "Singapore" },
      { year: "1955", winner: "Malaya", runnerUp: "Denmark", host: "Singapore" },
      { year: "1952", winner: "Malaya", runnerUp: "United States", host: "Singapore" },
      { year: "1949", winner: "Malaya", runnerUp: "Denmark", host: "Preston, England" },
    ],
    faq: [
      {
        q: "When did India win the Thomas Cup?",
        a: "In 2022, in Bangkok. India beat Indonesia, the most successful nation in the event's history, 3–0 in the final.",
      },
      {
        q: "Which country has won the most Thomas Cups?",
        a: "Indonesia, with 14 titles. China have won 12.",
      },
      {
        q: "How is a Thomas Cup tie played?",
        a: "Each tie is five matches — three singles and two doubles — and the first team to win three takes the tie.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BWF records",
  },
  {
    sport: "badminton",
    slug: "uber-cup",
    name: "Uber Cup",
    short: "Uber Cup",
    description:
      "The Uber Cup, badminton's women's team world championship since 1957. Every winner, China's dominance, and India's medals.",
    intro: [
      "The Uber Cup is the women's equivalent of the Thomas Cup, first held in 1957 and now played alongside it. China have dominated it since the 1980s.",
      "India reached the semi-finals of the very first Uber Cup and won bronze medals in 2014 and 2016, but have not yet reached a final.",
    ],
    facts: [
      { label: "First edition", value: "1957" },
      { label: "Format", value: "Team event: 3 singles, 2 doubles" },
      { label: "Run by", value: "BWF" },
      { label: "Most titles", value: "China" },
      { label: "India's best", value: "Semi-finals (1957, 2014, 2016)" },
    ],
    india: "Semi-finalists in 1957, and bronze medallists in 2014 and 2016.",
    editions: [
      { year: "2026", winner: "South Korea", runnerUp: "China", host: "Horsens, Denmark" },
      { year: "2024", winner: "China", runnerUp: "Indonesia", host: "Chengdu, China" },
      { year: "2022", winner: "South Korea", runnerUp: "China", host: "Bangkok, Thailand" },
      { year: "2020", winner: "China", runnerUp: "Japan", host: "Aarhus, Denmark" },
      { year: "2018", winner: "Japan", runnerUp: "Thailand", host: "Bangkok, Thailand" },
      { year: "2016", winner: "China", runnerUp: "South Korea", host: "Kunshan, China" },
      { year: "2014", winner: "China", runnerUp: "Japan", host: "New Delhi, India" },
      { year: "2012", winner: "China", runnerUp: "South Korea", host: "Wuhan, China" },
      { year: "2010", winner: "South Korea", runnerUp: "China", host: "Kuala Lumpur, Malaysia" },
      { year: "2008", winner: "China", runnerUp: "Indonesia", host: "Jakarta, Indonesia" },
      { year: "2006", winner: "China", runnerUp: "Netherlands", host: "Sendai and Tokyo, Japan" },
      { year: "2004", winner: "China", runnerUp: "South Korea", host: "Jakarta, Indonesia" },
      { year: "2002", winner: "China", runnerUp: "South Korea", host: "Guangzhou, China" },
      { year: "2000", winner: "China", runnerUp: "Denmark", host: "Kuala Lumpur, Malaysia" },
      { year: "1998", winner: "China", runnerUp: "Indonesia", host: "Hong Kong" },
      { year: "1996", winner: "Indonesia", runnerUp: "China", host: "Hong Kong" },
      { year: "1994", winner: "Indonesia", runnerUp: "China", host: "Jakarta, Indonesia" },
      { year: "1992", winner: "China", runnerUp: "South Korea", host: "Kuala Lumpur, Malaysia" },
      { year: "1990", winner: "China", runnerUp: "South Korea", host: "Nagoya and Tokyo, Japan" },
      { year: "1988", winner: "China", runnerUp: "South Korea", host: "Kuala Lumpur, Malaysia" },
      { year: "1986", winner: "China", runnerUp: "Indonesia", host: "Jakarta, Indonesia" },
      { year: "1984", winner: "China", runnerUp: "England", host: "Kuala Lumpur, Malaysia" },
      { year: "1981", winner: "Japan", runnerUp: "Indonesia", host: "Tokyo, Japan" },
      { year: "1978", winner: "Japan", runnerUp: "Indonesia", host: "Auckland, New Zealand" },
      { year: "1975", winner: "Indonesia", runnerUp: "Japan", host: "Jakarta, Indonesia" },
      { year: "1972", winner: "Japan", runnerUp: "Indonesia", host: "Tokyo, Japan" },
      { year: "1969", winner: "Japan", runnerUp: "Indonesia", host: "Tokyo, Japan" },
      { year: "1966", winner: "Japan", runnerUp: "United States", host: "Wellington, New Zealand" },
      { year: "1963", winner: "United States", runnerUp: "England", host: "Wilmington, United States" },
      { year: "1960", winner: "United States", runnerUp: "Denmark", host: "Philadelphia, United States" },
      { year: "1957", winner: "United States", runnerUp: "Denmark", host: "Lancashire, England" },
    ],
    faq: [
      {
        q: "Has India won the Uber Cup?",
        a: "Not yet. India's best results are semi-final places in 1957, 2014 and 2016, with bronze medals in the last two.",
      },
      {
        q: "Who won the 2026 Uber Cup?",
        a: "South Korea, who beat China in the final in Horsens, Denmark.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BWF records",
  },
  {
    sport: "badminton",
    slug: "olympics",
    name: "Olympic badminton",
    short: "Olympics",
    description:
      "India's Olympic badminton medals: Saina Nehwal's bronze in 2012, and P. V. Sindhu's silver in 2016 and bronze in 2020 — the first Indian woman with two individual Olympic medals.",
    intro: [
      "Badminton became a full Olympic sport at Barcelona 1992. India's first medal came at London 2012, when Saina Nehwal won bronze in women's singles.",
      "P. V. Sindhu then won silver at Rio 2016 and bronze at Tokyo 2020, becoming the first Indian woman to win two individual Olympic medals. At Paris 2024, Lakshya Sen came fourth in men's singles.",
    ],
    facts: [
      { label: "Olympic sport since", value: "1992" },
      { label: "India's medals", value: "3 (1 silver, 2 bronze)" },
      { label: "First Indian medal", value: "Saina Nehwal, bronze, 2012" },
      { label: "Best result", value: "Silver, P. V. Sindhu, 2016" },
      { label: "Next Games", value: "Los Angeles 2028" },
    ],
    india: "Three medals, all in women's singles: bronze in 2012 and 2020, silver in 2016.",
    editions: [],
    medals: [
      { year: "2020", player: "P. V. Sindhu", event: "Women's singles", medal: "Bronze" },
      { year: "2016", player: "P. V. Sindhu", event: "Women's singles", medal: "Silver" },
      { year: "2012", player: "Saina Nehwal", event: "Women's singles", medal: "Bronze" },
    ],
    faq: [
      {
        q: "How many Olympic medals has India won in badminton?",
        a: "Three: Saina Nehwal's bronze in 2012, and P. V. Sindhu's silver in 2016 and bronze in 2020.",
      },
      {
        q: "Who won India's first Olympic badminton medal?",
        a: "Saina Nehwal, with bronze in women's singles at London 2012.",
      },
      {
        q: "Did India win a badminton medal at Paris 2024?",
        a: "No. Lakshya Sen came closest, finishing fourth in men's singles.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BWF and Olympic records",
  },
  {
    sport: "badminton",
    slug: "bwf-world-championships",
    name: "BWF World Championships",
    short: "World Championships",
    description:
      "India's medals at the BWF World Championships, from Prakash Padukone's bronze in 1983 to P. V. Sindhu's gold in 2019 and the home championships in New Delhi in 2026.",
    intro: [
      "The BWF World Championships crown individual world champions in five events: men's and women's singles and doubles, and mixed doubles.",
      "P. V. Sindhu is India's only world champion, winning women's singles in Basel in 2019 — the last of her five World Championship medals. India hosted the championships in New Delhi in 2026.",
    ],
    facts: [
      { label: "First edition", value: "1977" },
      { label: "Events", value: "5 (singles, doubles, mixed)" },
      { label: "Run by", value: "BWF" },
      { label: "India's world champion", value: "P. V. Sindhu, 2019" },
      { label: "Most Indian medals", value: "P. V. Sindhu, 5" },
    ],
    india: "One gold, four silvers and eleven bronzes, led by P. V. Sindhu's five medals.",
    editions: [],
    medals: [
      { year: "2026", player: "Treesa Jolly / Gayatri Gopichand", event: "Women's doubles", medal: "Bronze" },
      { year: "2025", player: "Satwiksairaj Rankireddy / Chirag Shetty", event: "Men's doubles", medal: "Bronze" },
      { year: "2023", player: "H. S. Prannoy", event: "Men's singles", medal: "Bronze" },
      { year: "2022", player: "Satwiksairaj Rankireddy / Chirag Shetty", event: "Men's doubles", medal: "Bronze" },
      { year: "2021", player: "Kidambi Srikanth", event: "Men's singles", medal: "Silver" },
      { year: "2021", player: "Lakshya Sen", event: "Men's singles", medal: "Bronze" },
      { year: "2019", player: "P. V. Sindhu", event: "Women's singles", medal: "Gold" },
      { year: "2019", player: "B. Sai Praneeth", event: "Men's singles", medal: "Bronze" },
      { year: "2018", player: "P. V. Sindhu", event: "Women's singles", medal: "Silver" },
      { year: "2017", player: "P. V. Sindhu", event: "Women's singles", medal: "Silver" },
      { year: "2017", player: "Saina Nehwal", event: "Women's singles", medal: "Bronze" },
      { year: "2015", player: "Saina Nehwal", event: "Women's singles", medal: "Silver" },
      { year: "2014", player: "P. V. Sindhu", event: "Women's singles", medal: "Bronze" },
      { year: "2013", player: "P. V. Sindhu", event: "Women's singles", medal: "Bronze" },
      { year: "2011", player: "Jwala Gutta / Ashwini Ponnappa", event: "Women's doubles", medal: "Bronze" },
      { year: "1983", player: "Prakash Padukone", event: "Men's singles", medal: "Bronze" },
    ],
    faq: [
      {
        q: "Who is India's only badminton world champion?",
        a: "P. V. Sindhu, who won women's singles at the 2019 World Championships in Basel.",
      },
      {
        q: "How many World Championship medals has P. V. Sindhu won?",
        a: "Five: bronze in 2013 and 2014, silver in 2017 and 2018, and gold in 2019.",
      },
      {
        q: "Who won India's first World Championship medal in badminton?",
        a: "Prakash Padukone, with bronze in men's singles in 1983.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BWF records",
  },
  {
    sport: "badminton",
    slug: "all-england-open",
    name: "All England Open",
    short: "All England",
    description:
      "The All England Open, badminton's oldest and most prestigious tournament. Prakash Padukone (1980) and Pullela Gopichand (2001) are India's champions.",
    intro: [
      "The All England Open, played in Birmingham each March, is the oldest tournament in badminton and was the unofficial world championship for decades. It is now a Super 1000 event on the BWF World Tour.",
      "Two Indians have won it, both in men's singles: Prakash Padukone in 1980 and Pullela Gopichand in 2001. Saina Nehwal (2015) and Lakshya Sen (2022) reached the final.",
    ],
    facts: [
      { label: "First held", value: "1899" },
      { label: "Venue", value: "Birmingham, England" },
      { label: "Tier", value: "BWF World Tour Super 1000" },
      { label: "Indian champions", value: "Padukone 1980, Gopichand 2001" },
    ],
    india: "Champions: Prakash Padukone (1980) and Pullela Gopichand (2001). Finalists: Saina Nehwal (2015) and Lakshya Sen (2022).",
    editions: [],
    medals: [
      { year: "2022", player: "Lakshya Sen", event: "Men's singles", medal: "Runner-up" },
      { year: "2015", player: "Saina Nehwal", event: "Women's singles", medal: "Runner-up" },
      { year: "2001", player: "Pullela Gopichand", event: "Men's singles", medal: "Champion" },
      { year: "1980", player: "Prakash Padukone", event: "Men's singles", medal: "Champion" },
    ],
    faq: [
      {
        q: "Which Indians have won the All England Open?",
        a: "Prakash Padukone in 1980 and Pullela Gopichand in 2001, both in men's singles.",
      },
      {
        q: "Has an Indian woman reached the All England final?",
        a: "Yes. Saina Nehwal reached the women's singles final in 2015.",
      },
    ],
    reviewed: "10 October 2026",
    checkedAgainst: "BWF records",
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
