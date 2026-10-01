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
