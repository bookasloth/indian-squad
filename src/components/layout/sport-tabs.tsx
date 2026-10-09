"use client";

import { usePathname } from "next/navigation";
import { PillNav } from "@/components/layout/pill-nav";

/** Tab row for a sport hub. Active = the deepest tab whose href prefixes the path,
 * so /cricket/players/rohit-sharma lights up "Players", not "Overview". */
export function SportTabs({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const active =
    items
      .map((i) => i.href)
      .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
      .sort((a, b) => b.length - a.length)[0] ?? pathname;
  return <PillNav variant="tabs" items={items} active={active} />;
}
