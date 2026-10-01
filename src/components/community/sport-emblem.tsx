import { cn } from "@/lib/utils";

// Simple, recognizable inline emblems per sport. Colored via `text-brand`
// (the per-sport accent) and given a subtle, reduced-motion-safe animation.
const EMBLEMS: Record<string, { anim: string; svg: React.ReactNode }> = {
  cricket: {
    anim: "sport-anim-bounce",
    svg: (
      <>
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3.2 V20.8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="1.5 2" />
      </>
    ),
  },
  football: {
    anim: "sport-anim-spin",
    svg: (
      <>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <polygon points="12,8 15,10.2 13.8,13.8 10.2,13.8 9,10.2" fill="currentColor" />
        <path d="M12 3v2.2M4.5 9l2 1.4M19.5 9l-2 1.4M7 19l1-2.4M17 19l-1-2.4" stroke="currentColor" strokeWidth="1.2" />
      </>
    ),
  },
  f1: {
    anim: "sport-anim-wave",
    svg: (
      <>
        <path d="M5 3 V21" stroke="currentColor" strokeWidth="1.6" />
        <g fill="currentColor">
          <rect x="6" y="4" width="3" height="3" />
          <rect x="12" y="4" width="3" height="3" />
          <rect x="9" y="7" width="3" height="3" />
          <rect x="15" y="7" width="3" height="3" />
          <rect x="6" y="10" width="3" height="3" />
          <rect x="12" y="10" width="3" height="3" />
        </g>
        <rect x="6" y="4" width="12" height="9" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </>
    ),
  },
  badminton: {
    anim: "sport-anim-arc",
    svg: (
      <>
        <circle cx="12" cy="18" r="2.4" fill="currentColor" />
        <path d="M10 16 L6 6 M12 16.4 L12 5 M14 16 L18 6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 6 Q12 3 18 6" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </>
    ),
  },
  hockey: {
    anim: "sport-anim-swing",
    svg: (
      <>
        <path d="M8 3 V15 Q8 19 12 19 H17" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="19.5" cy="19" r="1.8" fill="currentColor" />
      </>
    ),
  },
  kabaddi: {
    anim: "sport-anim-bounce",
    svg: (
      <>
        <circle cx="13" cy="6" r="2.2" fill="currentColor" />
        <path d="M13 8.4 L13 14 L9 20 M13 11 L18 13 M13 11 L8.5 13.5 M13 14 L16.5 20" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M3 11 h2.5 M3.5 14 h2" stroke="currentColor" strokeWidth="1.2" opacity="0.6" />
      </>
    ),
  },
};

export function SportEmblem({
  sport,
  size = 40,
  animate = true,
  className,
}: {
  sport: string;
  size?: number;
  animate?: boolean;
  className?: string;
}) {
  const emblem = EMBLEMS[sport];
  if (!emblem) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      strokeLinejoin="round"
      aria-hidden
      className={cn("text-brand", animate && emblem.anim, className)}
    >
      {emblem.svg}
    </svg>
  );
}
