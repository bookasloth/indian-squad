import { renderEmail } from "../template";
import { type RenderedEmail, esc, p, TXN_FOOTER } from "./_shared";

const TAG = "<strong>Indian Sports Club</strong>";

function simple(subject: string, title: string, lines: string[], cta?: { label: string; href: string }): RenderedEmail {
  return {
    subject,
    html: renderEmail({
      preheader: lines[0] ?? title,
      headerTagline: TAG,
      title,
      footerNote: TXN_FOOTER,
      bodyHtml: lines.map((l) => p(esc(l))).join(""),
      cta,
    }),
    text: [title, "", ...lines, ...(cta ? ["", `${cta.label}: ${cta.href}`] : [])].join("\n"),
  };
}

type Applicant = { org_name: string; contact_name: string; phone: string; city: string; sports: string[]; email: string };

/** To us: a new partner application to review. */
export function partnerApplicationAlert(a: Applicant, reviewUrl: string): RenderedEmail {
  return simple(
    `Partner application: ${a.org_name}`,
    "New partner application",
    [`${a.org_name} (${a.city})`, `Contact: ${a.contact_name}, ${a.phone}, ${a.email}`, `Sports: ${a.sports.join(", ")}`],
    { label: "Review", href: reviewUrl },
  );
}

/** To the applicant: we got it. */
export function partnerApplicationReceived(a: { org_name: string; contact_name: string }, dashboardUrl: string): RenderedEmail {
  return simple(
    "We've got your partner application",
    "Application received",
    [
      `Hi ${a.contact_name}, thanks for applying to list ${a.org_name}'s events on Indian Sports Club.`,
      "We review every partner by hand, usually within 2 business days. You'll get an email either way.",
    ],
    { label: "Your partner dashboard", href: dashboardUrl },
  );
}

/** To the applicant: approved or not. */
export function partnerDecision(a: { org_name: string; approved: boolean }, dashboardUrl: string): RenderedEmail {
  return a.approved
    ? simple(
        `${a.org_name} is approved`,
        "You're an Indian Sports Club partner",
        ["You can now submit events from your partner dashboard. Each event is reviewed before it goes live."],
        { label: "Submit your first event", href: dashboardUrl },
      )
    : simple(
        "About your partner application",
        "We couldn't approve your application",
        [`We weren't able to approve ${a.org_name} as a partner right now. Reply to this email if you'd like to know more.`],
      );
}

/** To us: a partner event to review. */
export function partnerEventAlert(e: { title: string; org_name: string; starts_at: string }, reviewUrl: string): RenderedEmail {
  return simple(`Event to review: ${e.title}`, "New partner event", [`${e.title} by ${e.org_name}`, `Starts ${e.starts_at}`], {
    label: "Review",
    href: reviewUrl,
  });
}

/** To the partner: event live or not. */
export function partnerEventDecision(e: { title: string; approved: boolean }, url: string): RenderedEmail {
  return e.approved
    ? simple(`"${e.title}" is live`, "Your event is live", ["Share the link with your players and fans."], { label: "View event", href: url })
    : simple(`About "${e.title}"`, "We couldn't publish your event", [
        `"${e.title}" wasn't approved. Reply to this email to find out why or to fix it.`,
      ]);
}
