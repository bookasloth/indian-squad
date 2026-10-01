import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Brand mark. Text wordmark (the source site's hosted logo images were dropped).
 * `showWordmark={false}` renders a compact square mark with the initials — used
 * on the bare auth pages, which have no navbar to carry the brand.
 */
export function Logo({
  className,
  showWordmark = true,
  href = "/",
}: {
  className?: string;
  showWordmark?: boolean;
  href?: string | null;
}) {
  const mark = showWordmark ? (
    <span className={cn("font-display text-lg font-bold tracking-tight", className)}>
      {site.name}
    </span>
  ) : (
    <span
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-card bg-foreground font-display text-base font-bold text-background",
        className,
      )}
    >
      {site.shortName}
    </span>
  );

  if (href === null) return mark;
  return (
    <Link
      href={href}
      aria-label={`${site.name} — home`}
      className="inline-flex rounded-btn focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {mark}
    </Link>
  );
}
