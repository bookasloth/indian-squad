import type { SportSlug } from "@/lib/site";
// Type-only imports: scripts/sync-cricsheet.mjs loads this file with plain Node.
import type { Format } from "@/lib/cricsheet";

export interface RecordRow {
  player: string;
  /** The figure being ranked, formatted for display (e.g. "15,921"). Rows tie when equal. */
  value: string;
  /** Second column: matches for internationals, teams for the IPL. */
  detail: string;
  span: string;
  /** Still playing, so the figure will keep moving. */
  active?: boolean;
  /** Cricsheet player identifier: matches after the list's `since` date are added
   * automatically (src/lib/cricsheet.ts). */
  cricsheet?: string;
}

export interface RecordList {
  sport: SportSlug;
  slug: string;
  title: string;
  /** Short label for the records index and FAQ ("Test runs"). */
  metric: string;
  /** Column heading for `value`. */
  valueLabel: string;
  detailLabel: string;
  description: string;
  /** Our words. The first sentence names the record holder. */
  intro: string[];
  /** Question the FAQ answers from the top row, e.g. "Who has scored the most Test runs for India?" */
  question: string;
  rows: RecordRow[];
  /** Date the figures were checked. */
  asOf: string;
  /** Live updates: which matches count, which stat, and the ISO date the hand-checked
   * baseline runs up to. Matches after it are added from Cricsheet. */
  live?: { format: Format; stat: "runs" | "wickets"; since: string };
}

// ponytail: hand-copied top-10s, checked against public career records on the
// `asOf` date. Retired players' figures are final; `active` rows go stale and need
// a refresh after each series. Only the ranking figure and span are kept — no
// full stat lines.
export const RECORDS: RecordList[] = [
  {
    sport: "cricket",
    slug: "most-test-runs-for-india",
    title: "Most Test runs for India",
    metric: "Test runs",
    valueLabel: "Runs",
    detailLabel: "Tests",
    description:
      "India's top 10 Test run-scorers, led by Sachin Tendulkar's 15,921 — also the world record. Runs, Tests played and career span.",
    intro: [
      "Sachin Tendulkar scored 15,921 Test runs for India between 1989 and 2013 — the most by any player in Test history, not just for India.",
      "Rahul Dravid is a distant second, and Sunil Gavaskar, the first man to reach 10,000 Test runs, is third. Virat Kohli finished fourth when he retired from Tests in 2025.",
    ],
    question: "Who has scored the most Test runs for India?",
    rows: [
      { player: "Sachin Tendulkar", value: "15,921", detail: "200", span: "1989–2013" },
      { player: "Rahul Dravid", value: "13,265", detail: "163", span: "1996–2012" },
      { player: "Sunil Gavaskar", value: "10,122", detail: "125", span: "1971–1987" },
      { player: "Virat Kohli", value: "9,230", detail: "123", span: "2011–2025" },
      { player: "VVS Laxman", value: "8,781", detail: "134", span: "1996–2012" },
      { player: "Virender Sehwag", value: "8,503", detail: "103", span: "2001–2013" },
      { player: "Sourav Ganguly", value: "7,212", detail: "113", span: "1996–2008" },
      { player: "Cheteshwar Pujara", value: "7,195", detail: "103", span: "2010–2023" },
      { player: "Dilip Vengsarkar", value: "6,868", detail: "116", span: "1976–1992" },
      { player: "Mohammad Azharuddin", value: "6,215", detail: "99", span: "1984–2000" },
    ],
    live: { format: "test", stat: "runs", since: "2025-01-05" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-odi-runs-for-india",
    title: "Most ODI runs for India",
    metric: "ODI runs",
    valueLabel: "Runs",
    detailLabel: "ODIs",
    description:
      "India's top 10 run-scorers in one-day internationals, from Sachin Tendulkar's world-record 18,426 to Virat Kohli and Rohit Sharma, still adding to theirs.",
    intro: [
      "Sachin Tendulkar's 18,426 runs is the most by anyone in ODI history. Virat Kohli is second for India and still playing one-day cricket, as is Rohit Sharma in third.",
      "Every name in the top six has passed 10,000 ODI runs for India.",
    ],
    question: "Who has scored the most ODI runs for India?",
    rows: [
      { player: "Sachin Tendulkar", value: "18,426", detail: "463", span: "1989–2012" },
      { player: "Virat Kohli", value: "15,109", detail: "316", span: "2008–", active: true, cricsheet: "ba607b88" },
      { player: "Rohit Sharma", value: "12,028", detail: "290", span: "2007–", active: true, cricsheet: "740742ef" },
      { player: "Sourav Ganguly", value: "11,221", detail: "308", span: "1992–2007" },
      { player: "Rahul Dravid", value: "10,768", detail: "340", span: "1996–2011" },
      { player: "MS Dhoni", value: "10,599", detail: "347", span: "2004–2019" },
      { player: "Mohammad Azharuddin", value: "9,378", detail: "334", span: "1985–2000" },
      { player: "Yuvraj Singh", value: "8,609", detail: "301", span: "2000–2017" },
      { player: "Virender Sehwag", value: "7,995", detail: "241", span: "1999–2013" },
      { player: "Shikhar Dhawan", value: "6,793", detail: "167", span: "2010–2022" },
    ],
    live: { format: "odi", stat: "runs", since: "2026-09-30" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-t20i-runs-for-india",
    title: "Most T20I runs for India",
    metric: "T20I runs",
    valueLabel: "Runs",
    detailLabel: "T20Is",
    description:
      "India's top 10 run-scorers in T20 internationals. Rohit Sharma leads Virat Kohli by 43 runs; Suryakumar Yadav heads the players still in the side.",
    intro: [
      "Rohit Sharma is India's leading T20I run-scorer with 4,231, just ahead of Virat Kohli. Both retired from T20 internationals after winning the 2024 T20 World Cup.",
      "Suryakumar Yadav is the highest-placed player still playing, and the newer generation — Abhishek Sharma, Tilak Varma and Sanju Samson — is climbing fast.",
    ],
    question: "Who has scored the most T20I runs for India?",
    rows: [
      { player: "Rohit Sharma", value: "4,231", detail: "159", span: "2007–2024" },
      { player: "Virat Kohli", value: "4,188", detail: "125", span: "2010–2024" },
      { player: "Suryakumar Yadav", value: "3,272", detail: "113", span: "2021–", active: true, cricsheet: "271f83cd" },
      { player: "Hardik Pandya", value: "2,288", detail: "138", span: "2016–", active: true, cricsheet: "dbe50b21" },
      { player: "KL Rahul", value: "2,265", detail: "72", span: "2016–2022" },
      { player: "Abhishek Sharma", value: "1,967", detail: "64", span: "2024–", active: true, cricsheet: "f29185a1" },
      { player: "Ishan Kishan", value: "1,881", detail: "63", span: "2021–", active: true, cricsheet: "752f7486" },
      { player: "Tilak Varma", value: "1,763", detail: "67", span: "2023–", active: true, cricsheet: "b0482a1d" },
      { player: "Shikhar Dhawan", value: "1,759", detail: "68", span: "2011–2021" },
      { player: "Sanju Samson", value: "1,660", detail: "74", span: "2015–", active: true, cricsheet: "a4cc73aa" },
    ],
    live: { format: "t20i", stat: "runs", since: "2026-10-09" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-test-wickets-for-india",
    title: "Most Test wickets for India",
    metric: "Test wickets",
    valueLabel: "Wickets",
    detailLabel: "Tests",
    description:
      "India's top 10 Test wicket-takers, led by Anil Kumble's 619 and Ravichandran Ashwin's 537. Wickets, Tests played and career span.",
    intro: [
      "Anil Kumble took 619 Test wickets for India between 1990 and 2008, the most by any Indian bowler. Ravichandran Ashwin, who retired in December 2024, is second with 537.",
      "Spinners dominate the list: six of the top ten bowled spin. Kapil Dev, with 434, is India's leading fast bowler.",
    ],
    question: "Who has taken the most Test wickets for India?",
    rows: [
      { player: "Anil Kumble", value: "619", detail: "132", span: "1990–2008" },
      { player: "Ravichandran Ashwin", value: "537", detail: "106", span: "2011–2024" },
      { player: "Kapil Dev", value: "434", detail: "131", span: "1978–1994" },
      { player: "Harbhajan Singh", value: "417", detail: "103", span: "1998–2015" },
      { player: "Ravindra Jadeja", value: "348", detail: "89", span: "2012–", active: true, cricsheet: "fe93fd9d" },
      { player: "Ishant Sharma", value: "311", detail: "105", span: "2007–2021" },
      { player: "Zaheer Khan", value: "311", detail: "92", span: "2000–2014" },
      { player: "Bishan Singh Bedi", value: "266", detail: "67", span: "1966–1979" },
      { player: "BS Chandrasekhar", value: "242", detail: "58", span: "1964–1979" },
      { player: "Javagal Srinath", value: "236", detail: "67", span: "1991–2002" },
    ],
    live: { format: "test", stat: "wickets", since: "2026-01-18" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-odi-wickets-for-india",
    title: "Most ODI wickets for India",
    metric: "ODI wickets",
    valueLabel: "Wickets",
    detailLabel: "ODIs",
    description:
      "India's top 10 wicket-takers in one-day internationals, led by Anil Kumble's 334 and Javagal Srinath's 315.",
    intro: [
      "Anil Kumble is India's leading ODI wicket-taker with 334, ahead of fast bowler Javagal Srinath on 315 and Ajit Agarkar on 288.",
      "Ravindra Jadeja, Mohammed Shami and Kuldeep Yadav are the current players in the top ten, and Shami has needed far fewer matches than anyone above him.",
    ],
    question: "Who has taken the most ODI wickets for India?",
    rows: [
      { player: "Anil Kumble", value: "334", detail: "269", span: "1990–2007" },
      { player: "Javagal Srinath", value: "315", detail: "229", span: "1991–2003" },
      { player: "Ajit Agarkar", value: "288", detail: "191", span: "1998–2007" },
      { player: "Zaheer Khan", value: "269", detail: "194", span: "2000–2012" },
      { player: "Harbhajan Singh", value: "265", detail: "234", span: "1998–2015" },
      { player: "Kapil Dev", value: "253", detail: "225", span: "1978–1994" },
      { player: "Ravindra Jadeja", value: "234", detail: "212", span: "2009–", active: true, cricsheet: "fe93fd9d" },
      { player: "Mohammed Shami", value: "206", detail: "108", span: "2013–", active: true, cricsheet: "8cf9814c" },
      { player: "Kuldeep Yadav", value: "201", detail: "124", span: "2017–", active: true, cricsheet: "8d2c70ad" },
      { player: "Venkatesh Prasad", value: "196", detail: "161", span: "1994–2001" },
    ],
    live: { format: "odi", stat: "wickets", since: "2026-09-30" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-t20i-wickets-for-india",
    title: "Most T20I wickets for India",
    metric: "T20I wickets",
    valueLabel: "Wickets",
    detailLabel: "T20Is",
    description:
      "India's top 10 wicket-takers in T20 internationals, led by left-arm quick Arshdeep Singh, with Jasprit Bumrah and Hardik Pandya close behind.",
    intro: [
      "Left-arm quick Arshdeep Singh is India's leading T20I wicket-taker, ahead of Jasprit Bumrah. Both are still in the side, so the order at the top may yet change.",
      "Seven of the top ten are current players — a sign of how much more T20 cricket India now plays than a decade ago.",
    ],
    question: "Who has taken the most T20I wickets for India?",
    rows: [
      { player: "Arshdeep Singh", value: "141", detail: "95", span: "2022–", active: true, cricsheet: "244048f6" },
      { player: "Jasprit Bumrah", value: "126", detail: "100", span: "2016–", active: true, cricsheet: "462411b3" },
      { player: "Hardik Pandya", value: "114", detail: "138", span: "2016–", active: true, cricsheet: "dbe50b21" },
      { player: "Axar Patel", value: "111", detail: "108", span: "2015–", active: true, cricsheet: "2e171977" },
      { player: "Kuldeep Yadav", value: "97", detail: "55", span: "2017–", active: true, cricsheet: "8d2c70ad" },
      { player: "Yuzvendra Chahal", value: "96", detail: "80", span: "2016–2023" },
      { player: "Bhuvneshwar Kumar", value: "90", detail: "87", span: "2012–2022" },
      { player: "Varun Chakravarthy", value: "75", detail: "49", span: "2021–", active: true, cricsheet: "5b7ab5a9" },
      { player: "Ravichandran Ashwin", value: "72", detail: "65", span: "2010–2022" },
      { player: "Ravi Bishnoi", value: "71", detail: "54", span: "2022–", active: true, cricsheet: "df064e1a" },
    ],
    live: { format: "t20i", stat: "wickets", since: "2026-10-06" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-ipl-runs",
    title: "Most runs in IPL history",
    metric: "IPL runs",
    valueLabel: "Runs",
    detailLabel: "Teams",
    description:
      "The IPL's all-time leading run-scorers. Virat Kohli leads, every run of them for Royal Challengers Bengaluru.",
    intro: [
      "Virat Kohli has scored more IPL runs than anyone, and has played every season of the league for the same team, Royal Challengers Bengaluru.",
      "Rohit Sharma is second. Shikhar Dhawan and David Warner, neither of whom has played since 2024, are third and fourth.",
    ],
    question: "Who has scored the most runs in IPL history?",
    rows: [
      { player: "Virat Kohli", value: "9,336", detail: "RCB", span: "2008–", active: true, cricsheet: "ba607b88" },
      { player: "Rohit Sharma", value: "7,329", detail: "Deccan Chargers, MI", span: "2008–", active: true, cricsheet: "740742ef" },
      { player: "Shikhar Dhawan", value: "6,769", detail: "DC, Deccan Chargers, MI, SRH, PBKS", span: "2008–2024" },
      { player: "David Warner", value: "6,565", detail: "DC, SRH", span: "2009–2024" },
      { player: "KL Rahul", value: "5,815", detail: "DC, PBKS, LSG, RCB, SRH", span: "2013–", active: true, cricsheet: "b17e2f24" },
    ],
    live: { format: "ipl", stat: "runs", since: "2026-06-01" },
    asOf: "9 October 2026",
  },
  {
    sport: "cricket",
    slug: "most-ipl-wickets",
    title: "Most wickets in IPL history",
    metric: "IPL wickets",
    valueLabel: "Wickets",
    detailLabel: "Teams",
    description:
      "The IPL's all-time leading wicket-takers. Yuzvendra Chahal leads, ahead of Bhuvneshwar Kumar and Sunil Narine.",
    intro: [
      "Leg-spinner Yuzvendra Chahal has taken more IPL wickets than anyone. Bhuvneshwar Kumar is second and Sunil Narine, the only overseas player in the top five, third.",
      "Jasprit Bumrah, who has played his whole IPL career for Mumbai Indians, sits level with Ravichandran Ashwin.",
    ],
    question: "Who has taken the most wickets in IPL history?",
    rows: [
      { player: "Yuzvendra Chahal", value: "233", detail: "MI, RCB, RR, PBKS", span: "2013–", active: true, cricsheet: "57ee1fde" },
      { player: "Bhuvneshwar Kumar", value: "226", detail: "Pune Warriors, SRH, RCB", span: "2011–", active: true, cricsheet: "2e81a32d" },
      { player: "Sunil Narine", value: "207", detail: "KKR", span: "2012–", active: true, cricsheet: "9d430b40" },
      { player: "Piyush Chawla", value: "192", detail: "PBKS, KKR, CSK, MI", span: "2008–2024" },
      { player: "Ravichandran Ashwin", value: "187", detail: "CSK, RPS, PBKS, DC, RR", span: "2009–2025" },
      { player: "Jasprit Bumrah", value: "187", detail: "MI", span: "2013–", active: true, cricsheet: "462411b3" },
    ],
    live: { format: "ipl", stat: "wickets", since: "2026-06-01" },
    asOf: "9 October 2026",
  },
];

export const recordsFor = (sport: string) => RECORDS.filter((r) => r.sport === sport);

export const getRecord = (sport: string, slug: string) => RECORDS.find((r) => r.sport === sport && r.slug === slug);

/** Standard competition ranking: equal values share a rank (1, 2, 2, 4). */
export function ranked(rows: RecordRow[]): (RecordRow & { rank: number })[] {
  return rows.map((r) => ({
    ...r,
    rank: rows.findIndex((x) => x.value === r.value) + 1,
  }));
}
