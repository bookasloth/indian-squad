// Team-selection rules for the XI builder, shared by every sport. Dep-free so the
// test can import it directly.

export const XI_SIZE = 11;

/** A role count the XI must satisfy, e.g. at least one wicketkeeper, exactly one goalkeeper. */
export interface XIRule {
  role: string;
  min: number;
  max?: number;
  /** Shown when the rule fails. */
  message: string;
}

/** Status of a selection, given the role of each chosen player. */
export function xiStatus(roles: string[], rules: XIRule[]): { valid: boolean; message: string } {
  if (roles.length < XI_SIZE) return { valid: false, message: `Pick ${XI_SIZE - roles.length} more.` };
  for (const r of rules) {
    const n = roles.filter((x) => x === r.role).length;
    if (n < r.min || (r.max !== undefined && n > r.max)) return { valid: false, message: r.message };
  }
  return { valid: true, message: "Valid XI — ready to share." };
}
