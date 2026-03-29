import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Le Moniteur IT — Veille Technologique",
  description:
    "L'essentiel du flux, la clarté du journal. Veille IT & IA en temps réel, synthétisée par intelligence artificielle.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://veilles.sl-information.fr"
  ),
  openGraph: {
    title: "Le Moniteur IT",
    description: "L'essentiel du flux, la clarté du journal.",
    siteName: "Le Moniteur IT",
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
