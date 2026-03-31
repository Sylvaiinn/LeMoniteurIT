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
  title: "Le Moniteur IT — Veille Technologique par Sylvain LECLERC",
  description:
    "Veille technologique IT & IA de Sylvain LECLERC. Actualités cybersécurité, cloud, DevOps et réseaux synthétisées en temps réel par intelligence artificielle.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://veilles.sl-information.fr"
  ),
  keywords: [
    "Sylvain LECLERC",
    "veille technologique",
    "cybersécurité",
    "cloud",
    "DevOps",
    "IT",
    "intelligence artificielle",
  ],
  openGraph: {
    title: "Le Moniteur IT — Veille Technologique par Sylvain LECLERC",
    description: "Veille IT & IA de Sylvain LECLERC. L'essentiel du flux, la clarté du journal.",
    siteName: "Le Moniteur IT",
    url: "https://veilles.sl-information.fr",
    locale: "fr_FR",
    type: "website",
  },
  alternates: { canonical: "https://veilles.sl-information.fr" },
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
