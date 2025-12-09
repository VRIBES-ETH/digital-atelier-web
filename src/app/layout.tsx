import type { Metadata } from "next";
import { Poppins, Raleway, Barlow } from "next/font/google";
import "./globals.css";
import TopLoader from "@/components/TopLoader";
import CookieBanner from "@/components/CookieBanner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Digital Atelier Solutions | Ghostwriting & Strategic Comms",
  description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes Web3 y finanzas descentralizadas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${raleway.variable} ${barlow.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${raleway.variable} ${barlow.variable} antialiased bg-das-light text-das-dark font-raleway`}
      >
        <TopLoader />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
