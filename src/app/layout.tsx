import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Header } from "@/components/header";
import { HeaderUser } from "@/components/layout/header-user";
import { Footer } from "@/components/layout/footer";
import { ChromeGate, MainFrame } from "@/components/layout/chrome-gate";
import { site } from "@/lib/site";

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
    default: site.name,
    template: `%s — ${site.name}`,
  },
  authors: [{ name: site.owner.name, url: site.owner.url }],
  creator: site.owner.name,
  publisher: site.owner.name,
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

// Static: no request data (headers/cookies) is read here, so pages without their
// own dynamic data prerender. The signed-in slot is a client island (HeaderUser).
export default function RootLayout({ children }: { children: React.ReactNode }) {
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
                <MainFrame>{children}</MainFrame>
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
