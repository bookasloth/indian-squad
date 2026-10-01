import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/header";
import { HeaderUser } from "@/components/layout/header-user";
import { Footer } from "@/components/layout/footer";
import { ChromeGate } from "@/components/layout/chrome-gate";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Indian Squad",
    template: "%s — Indian Squad",
  },
  description:
    "Indian cricket squad hub — player profiles, a Playing XI builder, a quiz, and a fan community.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const BARE_PREFIXES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const bare = BARE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${poppins.variable}`}>
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <ThemeProvider>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-input focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
            >
              Skip to content
            </a>
            <div className="flex min-h-dvh flex-col">
              <ChromeGate>
                <Header userSlot={<HeaderUser />} />
              </ChromeGate>
              <main id="main" className="flex-1">
                {bare ? (
                  children
                ) : (
                  <div className="mx-auto w-full max-w-6xl px-4 py-10">{children}</div>
                )}
              </main>
              <ChromeGate>
                <Footer />
              </ChromeGate>
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
