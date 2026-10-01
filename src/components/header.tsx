"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const NAV = [
  { href: "/players", label: "Players" },
  { href: "/xi", label: "Playing XI" },
  { href: "/quiz", label: "Quiz" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
] as const;

export function Header({ userSlot }: { userSlot?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight">
          Indian Squad
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-btn px-3 py-2 transition-ui hover:bg-accent",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {userSlot}
        </div>
      </div>
    </header>
  );
}
