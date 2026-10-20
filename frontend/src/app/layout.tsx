import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { inter } from "../app/styles/fonts";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FilmsBR",
  description: "Organize sua biblioteca pessoal de filmes com dados da tmdb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
