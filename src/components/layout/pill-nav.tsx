"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

const STYLES = {
  chips: {
    row: "flex flex-wrap gap-2",
    item: "rounded-full border px-3 py-1 text-sm transition-ui",
    on: "border-brand bg-brand text-brand-foreground",
    off: "border-border text-muted-foreground hover:bg-accent",
  },
  tabs: {
    // Scrolls sideways on phones instead of clipping the last tab.
    row: "flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none]",
    item: "-mb-px whitespace-nowrap border-b-2 px-4 py-2 text-sm transition-ui",
    on: "border-foreground font-semibold text-foreground",
    off: "border-transparent text-muted-foreground hover:text-foreground",
  },
} as const;

/** Chip row or tab row of links (community chips/tabs, sport hub tabs). The clicked item turns selected on click, before the
 * server responds; the server's `active` takes over again once the new page lands
 * (a click recorded against an older `active` is ignored — no reset effect needed). */
export function PillNav({ items, active, variant }: { items: Item[]; active: string; variant: keyof typeof STYLES }) {
  const [clicked, setClicked] = useState<{ from: string; href: string } | null>(null);
  const current = clicked?.from === active ? clicked.href : active;
  const s = STYLES[variant];
  const Row = variant === "chips" ? "nav" : "div";

  return (
    <Row className={s.row}>
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={href === current ? "page" : undefined}
          onClick={(e) => {
            // New-tab/window clicks don't navigate this page — don't fake a selection.
            if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) setClicked({ from: active, href });
          }}
          className={cn(s.item, href === current ? s.on : s.off)}
        >
          {label}
        </Link>
      ))}
    </Row>
  );
}
