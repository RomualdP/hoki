import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider, AppHeader } from "../components/layout";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const bangers = localFont({
  src: [
    {
      path: "../assets/fonts/Bangers.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-manga",
  display: "swap",
  fallback: ["cursive", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Hoki - Gestion d'équipes de volleyball",
  description:
    "La plateforme complète pour gérer vos équipes, matchs et tournois de volleyball",
  keywords: ["volleyball", "sport", "équipe", "tournoi", "match", "gestion"],
  authors: [{ name: "Hoki Team" }],
};

export const viewport = {
  width: "device-width",
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
        className={`${roboto.variable} ${poppins.variable} ${bangers.variable} antialiased min-h-screen bg-background`}
      >
        <AuthProvider>
          <AppHeader />
          <main className="pl-64">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
