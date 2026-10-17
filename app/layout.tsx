import type { Metadata, Viewport } from "next";
import { Jersey_15, Rethink_Sans, Silkscreen } from "next/font/google";
import { CatLayer } from "@/components/cat/CatLayer";
import { Nav } from "@/components/Nav";
import { SiteChrome } from "@/components/SiteChrome";
import { catInitScript } from "@/lib/cat/prefs";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const jersey = Jersey_15({ weight: "400", subsets: ["latin"], variable: "--font-jersey", display: "swap" });
const silkscreen = Silkscreen({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-silkscreen", display: "swap" });
const rethink = Rethink_Sans({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-rethink", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://sejalborkar.vercel.app"),
  title: { default: "Sejal Borkar · Product designer", template: "%s · Sejal Borkar" },
  description: "Product designer who ships. B2B SaaS, from research to merged pull requests. Drawing since 2020.",
  openGraph: {
    title: "Sejal Borkar · Product designer",
    description: "Product designer who ships. B2B SaaS, from research to merged pull requests.",
    url: "https://sejalborkar.vercel.app",
    siteName: "Sejal Borkar",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0fa" },
    { media: "(prefers-color-scheme: dark)", color: "#15131c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning className={`${jersey.variable} ${silkscreen.variable} ${rethink.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + catInitScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="type-label-s sr-only z-[70] bg-lilac px-4 py-3 text-on-pastel focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          SKIP TO CONTENT
        </a>
        <SiteChrome>
          <Nav />
          <main id="main">{children}</main>
          {/* The pixel cat (art owned by the cat studio). Pages mark perches with data-cat-perch. */}
          <div id="cat-root">
            <CatLayer />
          </div>
        </SiteChrome>
      </body>
    </html>
  );
}
