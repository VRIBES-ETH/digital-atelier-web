import type { Metadata } from "next";
import { Poppins, Raleway, Barlow, Inter, Manrope } from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalateliersolutions.agency'),
  title: "Digital Atelier Solutions | Ghostwriting & Strategic Comms",
  description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes Web3 y finanzas descentralizadas.",
  appleWebApp: {
    title: "DAS®",
    statusBarStyle: "default",
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${raleway.variable} ${barlow.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${raleway.variable} ${barlow.variable} ${inter.variable} ${manrope.variable} antialiased bg-das-light text-das-dark font-raleway`}
      >
        <TopLoader />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
