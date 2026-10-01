/**
 * Single source of truth for site-wide identity. Reskinned for indian-squad
 * (the source site's extra nav/company config was dropped).
 */
export const site = {
  name: "Indian Squad",
  alias: "Indian Squad",
  shortName: "IS",
  role: "Indian cricket fan hub",
  domain: "indian-squad.vercel.app",
  url: "https://indian-squad.vercel.app",
  email: "hello@indian-squad.app",
  location: "India",
  tagline: "Everything about the Indian cricket squad, in one place.",
  description:
    "Indian Squad — player profiles, a Playing XI builder, a cricket quiz, and a fan community for the Indian cricket team.",
} as const;
