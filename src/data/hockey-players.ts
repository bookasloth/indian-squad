import type { Team } from "@/data/players";

export type HockeyPosition = "goalkeeper" | "defender" | "midfielder" | "forward";

export interface HockeyPlayer {
  slug: string;
  name: string;
  team: Team;
  position: HockeyPosition;
  caps: number;
  goals: number;
  /** Optional line of our own, only for facts we can stand behind. */
  note?: string;
}

/** Caps and goals as of the 2026 Asian Games (men's counted 3 Oct, women's 2 Oct). */
export const HOCKEY_AS_OF = "early October 2026";

// ponytail: the 2026 Asian Games squads, hand-copied. Refresh after each tournament;
// a player dropping out of the squad just means removing the row.
const p = (name: string, team: Team, position: HockeyPosition, caps: number, goals: number, note?: string): HockeyPlayer => ({
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  team,
  position,
  caps,
  goals,
  note,
});

export const hockeyPlayers: HockeyPlayer[] = [
  // Men
  p("Suraj Karkera", "men", "goalkeeper", 102, 0),
  p("Mohith H. S.", "men", "goalkeeper", 27, 0),
  p("Harmanpreet Singh", "men", "defender", 277, 240, "A drag-flicker and India's leading scorer in modern records, most of his goals coming from penalty corners."),
  p("Jarmanpreet Singh", "men", "defender", 171, 8),
  p("Amit Rohidas", "men", "defender", 257, 38),
  p("Jugraj Singh", "men", "defender", 115, 41),
  p("Sanjay Rana", "men", "defender", 103, 11),
  p("Sumit Walmiki", "men", "defender", 192, 8),
  p("Yashdeep Siwach", "men", "defender", 37, 0),
  p("Hardik Singh", "men", "midfielder", 194, 16),
  p("Manpreet Singh", "men", "midfielder", 430, 24, "India's most-capped men's player."),
  p("Rajinder Singh", "men", "midfielder", 57, 7),
  p("Raj Kumar Pal", "men", "midfielder", 99, 9),
  p("Nilakanta Sharma", "men", "midfielder", 162, 19),
  p("Vivek Prasad", "men", "midfielder", 204, 23),
  p("Mandeep Singh", "men", "forward", 301, 128),
  p("Dilpreet Singh", "men", "forward", 135, 54),
  p("Shilanand Lakra", "men", "forward", 81, 19),
  p("Sukhjeet Singh", "men", "forward", 137, 49),
  p("Abhishek Nain", "men", "forward", 148, 66),
  // Women
  p("Savita Punia", "women", "goalkeeper", 326, 0, "India's most-capped women's player."),
  p("Bichu Devi Kharibam", "women", "goalkeeper", 78, 0),
  p("Sushila Chanu Pukhrambam", "women", "defender", 275, 7),
  p("Ishika Chaudhary", "women", "defender", 94, 1),
  p("Jyoti Rumavat", "women", "defender", 116, 8),
  p("Lalthantluangi", "women", "defender", 12, 2),
  p("Shilpi Dabas", "women", "defender", 17, 0),
  p("Nikki Pradhan", "women", "midfielder", 219, 3),
  p("Salima Tete", "women", "midfielder", 168, 21),
  p("Neha Goyal", "women", "midfielder", 215, 26),
  p("Sunelita Toppo", "women", "midfielder", 65, 10),
  p("Sakshi Rana", "women", "midfielder", 30, 7),
  p("Deepika Soreng", "women", "midfielder", 12, 1),
  p("Rutuja Pisal", "women", "midfielder", 43, 16),
  p("Lalremsiami Hmarzote", "women", "forward", 200, 54),
  p("Navneet Kaur", "women", "forward", 224, 84),
  p("Deepika Sehrawat", "women", "forward", 82, 60),
  p("Beauty Dungdung", "women", "forward", 45, 6),
  p("Baljeet Kaur", "women", "forward", 56, 3),
  p("Ishika Sambharwal", "women", "forward", 22, 8),
];
