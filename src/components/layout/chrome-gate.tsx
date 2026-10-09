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

function isBare(pathname: string | null) {
  return !!pathname && BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Hides site chrome (header/footer) on the bare auth routes, which carry their
 * own centered shell. Renders children everywhere else. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  return isBare(usePathname()) ? null : <>{children}</>;
}

/** Page container for <main>. Decided client-side (not via headers() in the root
 * layout) so the layout stays static and content pages can prerender. Same element
 * either way, so switching between bare and framed routes never remounts the page. */
export function MainFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={isBare(usePathname()) ? undefined : "mx-auto w-full max-w-6xl px-4 py-10"}>
      {children}
    </div>
  );
}
