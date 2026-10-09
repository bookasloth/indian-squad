"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SportEmblem } from "@/components/community/sport-emblem";
import { SPORTS, site } from "@/lib/site";

const NAV = [
  { href: "/community", label: "Community" },
  { href: "/events", label: "Events" },
  { href: "/shop", label: "Shop" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/about", label: "About" },
] as const;

export function Header({ userSlot }: { userSlot?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
        <Link href="/" aria-label={site.name} className="shrink-0 font-heading text-lg font-bold tracking-tight">
          {/* Short mark on phones leaves room for the nav (Sports menu first). */}
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto text-sm">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap rounded-btn px-3 py-2 outline-none transition-ui hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring data-[state=open]:bg-accent",
                SPORTS.some((s) => pathname === `/${s.slug}` || pathname.startsWith(`/${s.slug}/`))
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Sports <ChevronDown className="size-3.5" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SPORTS.map((s) => (
                <DropdownMenuItem key={s.slug} asChild>
                  <Link href={`/${s.slug}`} data-sport={s.slug}>
                    <SportEmblem sport={s.slug} size={18} animate={false} />
                    {s.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
