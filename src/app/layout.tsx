import type { Metadata } from "next";
import { Poppins, Raleway, Barlow } from "next/font/google";
import "./globals.css";

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
  title: "Digital Atelier Solutions | Comunicación Web3 Institucional",
  description: "Agencia Boutique Copywriting & Ghostwriting para líderes Web3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${poppins.variable} ${raleway.variable} ${barlow.variable} antialiased bg-das-light text-das-dark font-raleway`}
      >
        {children}
      </body>
    </html>
  );
}
