export interface Post {
  id: string;
  author_name: string;
  body: string;
  parent_id: string | null;
  created_at: string;
}

export const NAME_MAX = 40;
export const BODY_MAX = 1000;

// Collapse whitespace and trim. Stored text is rendered as text (React escapes
// it on output), so no HTML is ever interpreted — this just normalizes input.
export function sanitize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export type ValidatedPost =
  | { ok: true; name: string; body: string }
  | { ok: false; error: string };

export function validatePost(rawName: unknown, rawBody: unknown): ValidatedPost {
  if (typeof rawName !== "string" || typeof rawBody !== "string") {
    return { ok: false, error: "Name and message are required." };
  }
  const name = sanitize(rawName);
  const body = sanitize(rawBody);
  if (name.length < 1 || name.length > NAME_MAX) {
    return { ok: false, error: `Name must be 1–${NAME_MAX} characters.` };
  }
  if (body.length < 1 || body.length > BODY_MAX) {
    return { ok: false, error: `Message must be 1–${BODY_MAX} characters.` };
  }
  return { ok: true, name, body };
}
