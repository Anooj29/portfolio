import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { hasResume } from "@/lib/resume";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"], display: "swap" });

const description = `${site.name} — ${site.roles.join(" · ")}. ${site.intro}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — Robotics & Product Engineer`, template: `%s — ${site.name}` },
  description,
  keywords: [
    "Anooj Jilladwar",
    "robotics engineer",
    "mechanical engineer",
    "AI developer",
    "product development",
    "ROS2",
    "embedded systems",
    "electric mobility",
    "portfolio",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — Robotics & Product Engineer`,
    description,
  },
  twitter: { card: "summary_large_image", title: site.name, description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.roles.join(", "),
  email: `mailto:${site.email}`,
  url: site.url,
  sameAs: [site.socials.linkedin],
  knowsAbout: [
    "Robotics",
    "Artificial Intelligence",
    "Mechanical Design",
    "CAD",
    "Embedded Systems",
    "Product Development",
    "Electric Mobility",
    "ROS2",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const resume = hasResume();
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal-500 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        <Nav resume={resume} />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
