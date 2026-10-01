/**
 * Single source of truth for site-wide identity. Reskinned for indian-squad
 * (the source site's extra nav/company config was dropped).
 */
export const site = {
  name: "Indian Squad",
  alias: "Indian Squad",
  shortName: "IS",
  role: "The 12th Man of Indian sport",
  domain: "indian-squad.vercel.app",
  url: "https://indian-squad.vercel.app",
  email: "hello@indian-squad.app",
  location: "India",
  tagline: "We stand united. We are the 12th Man.",
  description:
    "Indian Squad — a fan club for Indian sport. A passionate community backing Team India across cricket, hockey, kabaddi, badminton, football, and F1.",
} as const;

/** The sports the fan club follows. Cricket is the flagship (full features today). */
export const SPORTS = [
  "Cricket",
  "Hockey",
  "Kabaddi",
  "Badminton",
  "Football",
  "F1",
] as const;
