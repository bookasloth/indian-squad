import { avatarColor } from "@/lib/utils";

/**
 * Member avatar. With `src` (a stored profile photo) it renders that image;
 * without, it falls back to the member's initials on a deterministic color
 * derived from `seed` (the stable username), so the look is assigned once and
 * never changes.
 */
export function CommunityAvatar({
  seed,
  src,
  size = 40,
}: {
  seed: string;
  src?: string | null;
  size?: number;
}) {
  const initials = seed
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <span
        className="inline-flex shrink-0 overflow-hidden rounded-full"
        style={{ width: size, height: size }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white"
      style={{ width: size, height: size, background: avatarColor(seed), fontSize: size * 0.4 }}
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}
