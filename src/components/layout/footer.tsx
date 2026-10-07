import Link from "next/link";
import { site } from "@/lib/site";

const LINKS = [
  { href: "/players", label: "Players" },
  { href: "/xi", label: "Playing XI" },
  { href: "/quiz", label: "Quiz" },
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-of-use", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} — a fan club for Indian sport. The 12th Man. Not affiliated with the BCCI. A
          personal project by{" "}
          <a href={site.owner.url} className="underline underline-offset-4 transition-ui hover:text-foreground">
            {site.owner.name}
          </a>
          .
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="transition-ui hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
