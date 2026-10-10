import { SPORTS, SQUAD_SPORTS, site } from "@/lib/site";
import { abs } from "@/lib/seo";

// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants.
// Built from the same data as the pages, so it stays current on every deploy.
export const dynamic = "force-static";

export function GET() {
  const sports = SPORTS.map((s) => {
    const tools = SQUAD_SPORTS.includes(s.slug)
      ? `\n  - [${s.label} players](${abs(`/${s.slug}/players`)}): India's men's and women's squads\n  - [${s.label} Playing XI builder](${abs(`/${s.slug}/xi`)})\n  - [${s.label} quiz](${abs(`/${s.slug}/quiz`)})`
      : "";
    return `- [${s.label}](${abs(`/${s.slug}`)}): ${s.blurb}${tools}`;
  }).join("\n");

  const body = `# ${site.name}

> ${site.description}

${site.name} is a fan club, not a news or live-scores service. It is not affiliated with any team, league, federation or governing body. Facts and figures on the site are hand-maintained; see Sources for how they are kept and where coverage stops.

## Sports

${sports}

## Fan club

- [Community](${abs("/community")}): fan discussion for every sport, with per-sport feeds
- [Events](${abs("/events")}): watch-parties, tournaments and meetups, run by us and by partner organisers
- [Partners](${abs("/partners")}): how turfs, academies and clubs list sports events
- [Shop](${abs("/shop")}): club merchandise
- [Newsletter](${abs("/newsletter")})

## About and trust

- [About](${abs("/about")})
- [Sources](${abs("/sources")}): where our numbers come from
- [Editorial policy](${abs("/editorial-policy")}): who writes, how pages are checked
- [Corrections](${abs("/corrections")}): fixes we have made
- [Contact](${abs("/contact")}): ${site.email}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
