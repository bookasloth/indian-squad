"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/players", label: "Players" },
  { href: "/xi", label: "Playing XI" },
  { href: "/quiz", label: "Quiz" },
  { href: "/community", label: "Community" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link href="/" className="font-heading text-lg font-bold tracking-tight">
            Indian Squad
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {NAV.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-2 transition-colors hover:bg-surface ${
                    active ? "font-semibold text-foreground" : "text-muted"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-sm text-muted">
          Indian Squad — fan project. Not affiliated with the BCCI.
        </div>
      </footer>
    </>
  );
}
