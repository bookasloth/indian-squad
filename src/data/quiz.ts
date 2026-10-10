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

/** Questions per sport. A sport gets a quiz page once it has an entry here. */
export const QUIZZES: Record<string, QuizQuestion[]> = { cricket: quiz, hockey: hockeyQuiz };

export const quizFor = (sport: string): QuizQuestion[] => QUIZZES[sport] ?? [];
