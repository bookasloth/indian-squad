export type Role = "batter" | "bowler" | "all-rounder" | "wicketkeeper";

export interface Player {
  slug: string;
  name: string;
  role: Role;
  battingStyle: string;
  bowlingStyle?: string;
  caps: { test?: number; odi?: number; t20?: number };
  photoUrl?: string;
  bio: string;
  active: boolean;
}

// ponytail: typed seed, hand-maintained. Caps are approximate and go stale as
// players keep playing — edit this file when the roster or counts change.
// No DB in v1 (see docs/SPEC.md).
export const players: Player[] = [
  {
    slug: "rohit-sharma",
    name: "Rohit Sharma",
    role: "batter",
    battingStyle: "Right-handed",
    caps: { test: 67, odi: 273, t20: 159 },
    bio: "Opening batter and former captain, known for his timing and record ODI double-centuries. Now plays ODIs only.",
    active: true,
  },
  {
    slug: "virat-kohli",
    name: "Virat Kohli",
    role: "batter",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm medium",
    caps: { test: 123, odi: 302, t20: 125 },
    bio: "One of the most prolific run-scorers in the game; retired from Tests and T20Is, still a force in ODIs.",
    active: true,
  },
  {
    slug: "shubman-gill",
    name: "Shubman Gill",
    role: "batter",
    battingStyle: "Right-handed",
    caps: { test: 32, odi: 50, t20: 22 },
    bio: "Top-order batter with a classical technique, tipped as a long-term format leader.",
    active: true,
  },
  {
    slug: "yashasvi-jaiswal",
    name: "Yashasvi Jaiswal",
    role: "batter",
    battingStyle: "Left-handed",
    caps: { test: 19, odi: 0, t20: 23 },
    bio: "Aggressive left-handed opener who made a rapid rise through domestic cricket.",
    active: true,
  },
  {
    slug: "suryakumar-yadav",
    name: "Suryakumar Yadav",
    role: "batter",
    battingStyle: "Right-handed",
    caps: { test: 1, odi: 37, t20: 76 },
    bio: "Explosive middle-order batter and T20 specialist with 360-degree range.",
    active: true,
  },
  {
    slug: "shreyas-iyer",
    name: "Shreyas Iyer",
    role: "batter",
    battingStyle: "Right-handed",
    caps: { test: 14, odi: 64, t20: 51 },
    bio: "Middle-order batter who anchors and accelerates through the middle overs.",
    active: true,
  },
  {
    slug: "kl-rahul",
    name: "KL Rahul",
    role: "wicketkeeper",
    battingStyle: "Right-handed",
    caps: { test: 58, odi: 80, t20: 72 },
    bio: "Versatile top-order batter who also keeps wicket in limited-overs cricket.",
    active: true,
  },
  {
    slug: "rishabh-pant",
    name: "Rishabh Pant",
    role: "wicketkeeper",
    battingStyle: "Left-handed",
    caps: { test: 44, odi: 31, t20: 76 },
    bio: "Counter-attacking wicketkeeper-batter known for game-changing innings.",
    active: true,
  },
  {
    slug: "sanju-samson",
    name: "Sanju Samson",
    role: "wicketkeeper",
    battingStyle: "Right-handed",
    caps: { test: 0, odi: 16, t20: 42 },
    bio: "Wicketkeeper-batter with clean striking and a growing white-ball role.",
    active: true,
  },
  {
    slug: "ishan-kishan",
    name: "Ishan Kishan",
    role: "wicketkeeper",
    battingStyle: "Left-handed",
    caps: { test: 2, odi: 27, t20: 32 },
    bio: "Left-handed wicketkeeper-batter who opens aggressively in white-ball cricket.",
    active: true,
  },
  {
    slug: "hardik-pandya",
    name: "Hardik Pandya",
    role: "all-rounder",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast-medium",
    caps: { test: 11, odi: 92, t20: 115 },
    bio: "Seam-bowling all-rounder and finisher, central to India's white-ball balance.",
    active: true,
  },
  {
    slug: "ravindra-jadeja",
    name: "Ravindra Jadeja",
    role: "all-rounder",
    battingStyle: "Left-handed",
    bowlingStyle: "Slow left-arm orthodox",
    caps: { test: 76, odi: 197, t20: 74 },
    bio: "Elite spin-bowling all-rounder and one of the finest fielders in the game.",
    active: true,
  },
  {
    slug: "axar-patel",
    name: "Axar Patel",
    role: "all-rounder",
    battingStyle: "Left-handed",
    bowlingStyle: "Slow left-arm orthodox",
    caps: { test: 15, odi: 64, t20: 71 },
    bio: "Left-arm spinner and lower-order hitter valued for control and utility.",
    active: true,
  },
  {
    slug: "washington-sundar",
    name: "Washington Sundar",
    role: "all-rounder",
    battingStyle: "Left-handed",
    bowlingStyle: "Right-arm off-break",
    caps: { test: 11, odi: 22, t20: 42 },
    bio: "Off-spinning all-rounder useful with the new ball and in the middle order.",
    active: true,
  },
  {
    slug: "ravichandran-ashwin",
    name: "Ravichandran Ashwin",
    role: "all-rounder",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm off-break",
    caps: { test: 106, odi: 116, t20: 65 },
    bio: "Master off-spinner and canny lower-order batter, a Test-match wicket machine.",
    active: false,
  },
  {
    slug: "jasprit-bumrah",
    name: "Jasprit Bumrah",
    role: "bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast",
    caps: { test: 45, odi: 89, t20: 70 },
    bio: "Spearhead fast bowler with a unique action, lethal yorkers, and all-phase skill.",
    active: true,
  },
  {
    slug: "mohammed-siraj",
    name: "Mohammed Siraj",
    role: "bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast-medium",
    caps: { test: 37, odi: 44, t20: 14 },
    bio: "Wholehearted seamer who swings the new ball and hits hard lengths.",
    active: true,
  },
  {
    slug: "mohammed-shami",
    name: "Mohammed Shami",
    role: "bowler",
    battingStyle: "Right-handed",
    bowlingStyle: "Right-arm fast",
    caps: { test: 64, odi: 101, t20: 23 },
    bio: "Seam-bowling craftsman with a classic wrist position and big-tournament pedigree.",
    active: true,
  },
  {
    slug: "kuldeep-yadav",
    name: "Kuldeep Yadav",
    role: "bowler",
    battingStyle: "Left-handed",
    bowlingStyle: "Left-arm wrist-spin",
    caps: { test: 13, odi: 109, t20: 40 },
    bio: "Left-arm wrist-spinner who turns the ball both ways and takes wickets in clusters.",
    active: true,
  },
  {
    slug: "arshdeep-singh",
    name: "Arshdeep Singh",
    role: "bowler",
    battingStyle: "Left-handed",
    bowlingStyle: "Left-arm medium-fast",
    caps: { test: 0, odi: 14, t20: 63 },
    bio: "Left-arm seamer and death-overs specialist with a reliable yorker.",
    active: true,
  },
];

export function getPlayer(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

export const ROLES: Role[] = ["batter", "all-rounder", "wicketkeeper", "bowler"];
