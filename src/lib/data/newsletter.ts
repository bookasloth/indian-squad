export type SampleIssue = { no: string; title: string; summary: string };
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
  initials: string;
};

export const newsletterMeta = {
  name: "The Twelfth Man",
  cadence: "One email per week",
  promise: "Everything worth knowing about the Indian squad.",
  subscriberClaim: "Join fellow fans",
};

export const whatYoullReceive = [
  "Squad news and selection calls, explained",
  "Match previews and likely Playing XIs",
  "Player form across formats, in plain numbers",
  "A weekly cricket quiz question",
  "The best from the fan community",
];

export const issueQualities = [
  "Short enough to finish",
  "Sharp enough to settle an argument",
  "No hot takes for the sake of it",
];

export const sampleIssues: SampleIssue[] = [
  {
    no: "42",
    title: "Picking the ideal middle order",
    summary:
      "Who bats where, and why — a look at the batting options and the balance they give the XI.",
  },
  {
    no: "38",
    title: "The pace battery, ranked",
    summary:
      "How India's fast bowlers stack up by format, workload, and match-up.",
  },
  {
    no: "34",
    title: "Spin: horses for courses",
    summary: "When to play the extra spinner, and which one, home and away.",
  },
  {
    no: "29",
    title: "The wicketkeeper question",
    summary: "Glovework vs runs — weighing the keeper options across formats.",
  },
];

export const whoFor = [
  "Fans who follow every series, not just the finals",
  "Anyone who argues about the Playing XI",
  "New followers who want the context, fast",
  "Stat lovers who like it kept honest",
];

export const whatItsNot = ["Daily spam", "Rage-bait takes", "Rumour mills", "Recycled match reports"];

export const readerQuotes: Testimonial[] = [
  { quote: "The only cricket email I actually read end to end.", name: "Ankit S.", role: "Club cricketer", initials: "AS" },
  { quote: "Settles the XI debate in my group chat every week.", name: "Riya M.", role: "Lifelong fan", initials: "RM" },
  { quote: "Short, sharp, and never shouty.", name: "Arjun R.", role: "Weekend opener", initials: "AR" },
  { quote: "Finally, context instead of hot takes.", name: "Sneha P.", role: "New to cricket", initials: "SP" },
];
