export interface CommunityPost {
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
  // client-only optimistic flag
  pending?: boolean;
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
