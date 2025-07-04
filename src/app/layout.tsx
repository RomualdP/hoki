import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "../components/layout";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const animeAce = localFont({
  src: [
    {
      path: "../assets/fonts/animeace2_reg.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/animeace2_bld.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/animeace2_ital.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-anime-ace",
  display: "swap",
  fallback: ["cursive", "sans-serif"],
});

export const metadata: Metadata = {
  title: "VolleyApp - Gestion d'équipes de volleyball",
  description: "La plateforme complète pour gérer vos équipes, matchs et tournois de volleyball",
  keywords: ["volleyball", "sport", "équipe", "tournoi", "match", "gestion"],
  authors: [{ name: "VolleyApp Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${roboto.variable} ${animeAce.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
