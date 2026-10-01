"use client";

import { usePathname } from "next/navigation";

/** Route prefixes that render standalone, without the global header/footer. */
const BARE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

/** Hides site chrome (header/footer) on the bare auth routes, which carry their
 * own centered shell. Renders children everywhere else. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (!pathname) return <>{children}</>;
  if (BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }
  return <>{children}</>;
}
