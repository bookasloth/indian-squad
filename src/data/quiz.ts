export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
}

// ponytail: typed seed, hand-maintained. India-focused cricket trivia.
export const quiz: QuizQuestion[] = [
  {
    id: "q1",
    question: "Who was the first Indian to score a double century in ODIs?",
    options: ["Rohit Sharma", "Virender Sehwag", "Sachin Tendulkar", "Sourav Ganguly"],
    correctIndex: 2,
    category: "Records",
  },
  {
    id: "q2",
    question: "Who captained India to the 1983 World Cup title?",
    options: ["Sunil Gavaskar", "Kapil Dev", "Mohinder Amarnath", "Mansoor Ali Khan Pataudi"],
    correctIndex: 1,
    category: "History",
  },
  {
    id: "q3",
    question: "Which Indian bowler has the most Test wickets?",
    options: ["Ravichandran Ashwin", "Harbhajan Singh", "Anil Kumble", "Kapil Dev"],
    correctIndex: 2,
    category: "Records",
  },
  {
    id: "q4",
    question: "In which year did India win their first ICC T20 World Cup?",
    options: ["2007", "2011", "2013", "2016"],
    correctIndex: 0,
    category: "History",
  },
  {
    id: "q5",
    question: 'Which batter is nicknamed "The Wall"?',
    options: ["VVS Laxman", "Gautam Gambhir", "Cheteshwar Pujara", "Rahul Dravid"],
    correctIndex: 3,
    category: "Players",
  },
  {
    id: "q6",
    question: "In which city is the Eden Gardens stadium?",
    options: ["Mumbai", "Kolkata", "Chennai", "Delhi"],
    correctIndex: 1,
    category: "Trivia",
  },
  {
    id: "q7",
    question: "How many ODI centuries did Sachin Tendulkar score?",
    options: ["40", "45", "49", "51"],
    correctIndex: 2,
    category: "Records",
  },
  {
    id: "q8",
    question: "Who captained India to the 2011 World Cup title?",
    options: ["MS Dhoni", "Sachin Tendulkar", "Virender Sehwag", "Gautam Gambhir"],
    correctIndex: 0,
    category: "History",
  },
  {
    id: "q9",
    question: "Which Indian holds the highest individual ODI score (264)?",
    options: ["Virat Kohli", "Sachin Tendulkar", "Shubman Gill", "Rohit Sharma"],
    correctIndex: 3,
    category: "Records",
  },
  {
    id: "q10",
    question: "Which Indian captain has the most Test match wins?",
    options: ["MS Dhoni", "Virat Kohli", "Sourav Ganguly", "Rohit Sharma"],
    correctIndex: 1,
    category: "Records",
  },
];

// ponytail: hand-maintained, facts checked 10 Oct 2026. Rules questions follow
// the FIH Rules of Hockey.
export const hockeyQuiz: QuizQuestion[] = [
  { id: "h1", question: "How many Olympic gold medals has India won in men's hockey?", options: ["6", "7", "8", "9"], correctIndex: 2, category: "History" },
  { id: "h2", question: "In which year did India win the men's Hockey World Cup?", options: ["1971", "1973", "1975", "1982"], correctIndex: 2, category: "History" },
  { id: "h3", question: "India's most recent Olympic hockey gold came at which Games?", options: ["Tokyo 1964", "Munich 1972", "Moscow 1980", "Los Angeles 1984"], correctIndex: 2, category: "History" },
  { id: "h4", question: "India won men's hockey bronze at Tokyo 2020 and at which next Olympics?", options: ["Paris 2024", "Rio 2016", "London 2012", "None — they missed out"], correctIndex: 0, category: "Recent" },
  { id: "h5", question: "Who has the most caps for India's men's hockey team?", options: ["PR Sreejesh", "Harmanpreet Singh", "Dhanraj Pillay", "Manpreet Singh"], correctIndex: 3, category: "Records" },
  { id: "h6", question: "Who has the most caps for India's women's hockey team?", options: ["Rani Rampal", "Savita Punia", "Vandana Katariya", "Salima Tete"], correctIndex: 1, category: "Records" },
  { id: "h7", question: "From how far out is a penalty stroke taken?", options: ["5 metres", "6.4 metres", "7 metres", "10 metres"], correctIndex: 1, category: "Rules" },
  { id: "h8", question: "How long is a player suspended for a green card?", options: ["2 minutes", "5 minutes", "10 minutes", "The rest of the match"], correctIndex: 0, category: "Rules" },
  { id: "h9", question: "How is an international hockey match divided?", options: ["Two halves of 35 minutes", "Four quarters of 15 minutes", "Three periods of 20 minutes", "Four quarters of 12 minutes"], correctIndex: 1, category: "Rules" },
  { id: "h10", question: "Who won the 2025 men's Asia Cup, played in Rajgir?", options: ["South Korea", "Malaysia", "India", "Japan"], correctIndex: 2, category: "Recent" },
  { id: "h11", question: "Which country won the 2026 men's Hockey World Cup?", options: ["Netherlands", "Belgium", "Australia", "Germany"], correctIndex: 3, category: "Recent" },
  { id: "h12", question: "India won men's hockey gold at the 2026 Asian Games by beating which team in the final?", options: ["Pakistan", "Malaysia", "Japan", "South Korea"], correctIndex: 1, category: "Recent" },
];

// ponytail: hand-maintained, facts checked 10 Oct 2026.
export const kabaddiQuiz: QuizQuestion[] = [
  { id: "k1", question: "How many players does each kabaddi team have on court?", options: ["5", "6", "7", "9"], correctIndex: 2, category: "Rules" },
  { id: "k2", question: "How many points is a super tackle worth?", options: ["1", "2", "3", "4"], correctIndex: 1, category: "Rules" },
  { id: "k3", question: "A raider can earn a bonus point only when at least how many defenders are on court?", options: ["4", "5", "6", "7"], correctIndex: 2, category: "Rules" },
  { id: "k4", question: "In the Pro Kabaddi League, a do-or-die raid comes after how many empty raids in a row?", options: ["One", "Two", "Three", "Four"], correctIndex: 1, category: "Rules" },
  { id: "k5", question: "Which team won the first Pro Kabaddi League season in 2014?", options: ["U Mumba", "Patna Pirates", "Jaipur Pink Panthers", "Bengaluru Bulls"], correctIndex: 2, category: "PKL" },
  { id: "k6", question: "Which team has won the most Pro Kabaddi titles?", options: ["Patna Pirates", "Dabang Delhi K.C.", "Jaipur Pink Panthers", "U Mumba"], correctIndex: 0, category: "PKL" },
  { id: "k7", question: "Who won Pro Kabaddi Season 12 in 2025?", options: ["Puneri Paltan", "Haryana Steelers", "Dabang Delhi K.C.", "Patna Pirates"], correctIndex: 2, category: "PKL" },
  { id: "k8", question: "How many of the ten Asian Games men's kabaddi golds has India won?", options: ["7", "8", "9", "10"], correctIndex: 2, category: "India" },
  { id: "k9", question: "Which country beat India to Asian Games kabaddi gold in 2018?", options: ["Pakistan", "Bangladesh", "South Korea", "Iran"], correctIndex: 3, category: "India" },
  { id: "k10", question: "Where was the 2016 Kabaddi World Cup, won by India, held?", options: ["Mumbai", "Ahmedabad", "Patna", "Panvel"], correctIndex: 1, category: "India" },
  { id: "k11", question: "Who has the most caps for India's men's kabaddi team?", options: ["Anup Kumar", "Pardeep Narwal", "Ajay Thakur", "Rahul Chaudhari"], correctIndex: 2, category: "Records" },
  { id: "k12", question: "How long is each half of a kabaddi match?", options: ["15 minutes", "20 minutes", "25 minutes", "30 minutes"], correctIndex: 1, category: "Rules" },
];

// ponytail: hand-maintained, facts checked 10 Oct 2026. Rules follow the IFAB Laws of the Game.
export const footballQuiz: QuizQuestion[] = [
  { id: "f1", question: "Who is India's all-time top scorer in men's football?", options: ["Bhaichung Bhutia", "Sunil Chhetri", "I. M. Vijayan", "Jeje Lalpekhlua"], correctIndex: 1, category: "Records" },
  { id: "f2", question: "How many SAFF Championships has India's men's team won?", options: ["5", "7", "9", "11"], correctIndex: 2, category: "India" },
  { id: "f3", question: "In which two years did India win Asian Games football gold?", options: ["1951 and 1962", "1954 and 1966", "1958 and 1970", "1951 and 1974"], correctIndex: 0, category: "History" },
  { id: "f4", question: "India's best Olympic football finish was fourth place at which Games?", options: ["London 1948", "Helsinki 1952", "Melbourne 1956", "Rome 1960"], correctIndex: 2, category: "History" },
  { id: "f5", question: "What is India's best result at the men's AFC Asian Cup?", options: ["Winners", "Runners-up", "Semi-finals", "Quarter-finals"], correctIndex: 1, category: "History" },
  { id: "f6", question: "Which club won the Indian Super League in 2025–26?", options: ["Mohun Bagan SG", "Mumbai City", "East Bengal", "Bengaluru"], correctIndex: 2, category: "ISL" },
  { id: "f7", question: "In which year did the Indian Super League begin?", options: ["2010", "2012", "2014", "2016"], correctIndex: 2, category: "ISL" },
  { id: "f8", question: "Which club has won the most ISL titles?", options: ["ATK", "Chennaiyin", "Kerala Blasters", "Bengaluru"], correctIndex: 0, category: "ISL" },
  { id: "f9", question: "When was the Durand Cup first played?", options: ["1888", "1911", "1937", "1950"], correctIndex: 0, category: "History" },
  { id: "f10", question: "From which restart can a player NOT be offside?", options: ["A free kick", "A throw-in", "A pass from midfield", "A penalty rebound"], correctIndex: 1, category: "Rules" },
  { id: "f11", question: "Which of these can VAR NOT review?", options: ["Goals", "Penalty decisions", "Direct red cards", "Corner kicks"], correctIndex: 3, category: "Rules" },
  { id: "f12", question: "Who has the most caps for India's women's football team?", options: ["Bala Devi", "Ashalata Devi", "Sangita Basfore", "Dangmei Grace"], correctIndex: 1, category: "Records" },
];

// ponytail: hand-maintained, facts checked 10 Oct 2026. Rules follow the BWF Laws of Badminton.
export const badmintonQuiz: QuizQuestion[] = [
  { id: "b1", question: "In which year did India win the Thomas Cup?", options: ["2014", "2018", "2022", "2024"], correctIndex: 2, category: "India" },
  { id: "b2", question: "Which team did India beat in the 2022 Thomas Cup final?", options: ["China", "Indonesia", "Denmark", "Malaysia"], correctIndex: 1, category: "India" },
  { id: "b3", question: "Who won India's first Olympic medal in badminton?", options: ["P. V. Sindhu", "Saina Nehwal", "Jwala Gutta", "Aparna Popat"], correctIndex: 1, category: "Olympics" },
  { id: "b4", question: "What colour was P. V. Sindhu's medal at Rio 2016?", options: ["Gold", "Silver", "Bronze", "She didn't win one"], correctIndex: 1, category: "Olympics" },
  { id: "b5", question: "In which year did P. V. Sindhu become world champion?", options: ["2017", "2018", "2019", "2021"], correctIndex: 2, category: "Records" },
  { id: "b6", question: "Who was the first Indian to win the All England Open?", options: ["Pullela Gopichand", "Prakash Padukone", "Syed Modi", "Nandu Natekar"], correctIndex: 1, category: "History" },
  { id: "b7", question: "Pullela Gopichand won the All England Open in which year?", options: ["1995", "1999", "2001", "2005"], correctIndex: 2, category: "History" },
  { id: "b8", question: "How many points do you need to win a game of badminton (without deuce)?", options: ["11", "15", "21", "25"], correctIndex: 2, category: "Rules" },
  { id: "b9", question: "What is the most points a badminton game can reach?", options: ["25", "29", "30", "No limit"], correctIndex: 2, category: "Rules" },
  { id: "b10", question: "The whole shuttle must be below what height when served?", options: ["1.00 m", "1.15 m", "1.25 m", "The server's waist"], correctIndex: 1, category: "Rules" },
  { id: "b11", question: "Which Indian city hosted the 2026 BWF World Championships?", options: ["Hyderabad", "Bengaluru", "Mumbai", "New Delhi"], correctIndex: 3, category: "Recent" },
  { id: "b12", question: "What tier of the BWF World Tour is the India Open?", options: ["Super 300", "Super 500", "Super 750", "Super 1000"], correctIndex: 2, category: "Rules" },
];

/** Questions per sport. A sport gets a quiz page once it has an entry here. */
export const QUIZZES: Record<string, QuizQuestion[]> = {
  cricket: quiz,
  hockey: hockeyQuiz,
  kabaddi: kabaddiQuiz,
  football: footballQuiz,
  badminton: badmintonQuiz,
};

export const quizFor = (sport: string): QuizQuestion[] => QUIZZES[sport] ?? [];
