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
