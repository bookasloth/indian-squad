export interface CommunityPost {
  /** Unique feed-row key. Equals id for a normal row; a reblog row of the same
   *  post gets its own key so both can coexist. */
  rowId: string;
  id: string;
  body: string;
  parentId: string | null;
  createdAt: string;
  // author
  userId: string | null;
  authorName: string; // resolved display name (profile, or legacy author_name)
  username: string | null; // for profile links; null for legacy name-only posts
  avatarUrl: string | null;
  // engagement
  likeCount: number;
  likedByViewer: boolean;
  bookmarkedByViewer: boolean;
  reblogCount: number;
  rebloggedByViewer: boolean;
  /** Username of the reblogger when this row is a reblog, else null. */
  rebloggedBy: string | null;
  poll: Poll | null;
  // client-only optimistic flag
  pending?: boolean;
}

export interface PollOption {
  i: number;
  label: string;
}

export interface Poll {
  options: PollOption[];
  closesAt: string | null;
  closed: boolean;
  counts: Record<number, number>;
  total: number;
  viewerChoice: number | null;
}

export const POLL_MIN_OPTIONS = 2;
export const POLL_MAX_OPTIONS = 4;
export const POLL_OPTION_MAX = 80;

/** Validate + normalize composer poll options. Returns trimmed non-empty labels. */
export function validatePollOptions(raw: unknown): { ok: true; options: string[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) return { ok: false, error: "Invalid poll." };
  const options = raw
    .map((o) => (typeof o === "string" ? o.replace(/\s+/g, " ").trim() : ""))
    .filter((o) => o.length > 0 && o.length <= POLL_OPTION_MAX);
  if (options.length < POLL_MIN_OPTIONS) return { ok: false, error: "A poll needs at least two options." };
  if (options.length > POLL_MAX_OPTIONS) return { ok: false, error: "A poll can have at most four options." };
  return { ok: true, options };
}

/** The signed-in viewer, as the feed needs it. */
export interface Viewer {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export const BODY_MAX = 1000;

/** Normalize whitespace + trim. Stored as text; React escapes on render. */
export function sanitize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export type ValidatedBody = { ok: true; body: string } | { ok: false; error: string };

export function validateBody(raw: unknown): ValidatedBody {
  if (typeof raw !== "string") return { ok: false, error: "A message is required." };
  const body = sanitize(raw);
  if (body.length < 1 || body.length > BODY_MAX) {
    return { ok: false, error: `Message must be 1–${BODY_MAX} characters.` };
  }
  return { ok: true, body };
}
