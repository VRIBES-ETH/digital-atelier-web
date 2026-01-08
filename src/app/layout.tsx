import type { Metadata, Viewport } from "next";
import { Poppins, Raleway, Barlow, Inter, Manrope, Playfair_Display } from "next/font/google";
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

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalateliersolutions.agency'),
  title: {
    default: "Digital Atelier Solutions | Ghostwriting & Strategic Comms",
    template: "%s | DAS®"
  },
  description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional.",
  keywords: ["Ghostwriting", "Blockchain", "Comunicación Estratégica", "Digital Assets", "Personal Branding", "Executive Communication", "Copywriting", "Finanzas Descentralizadas"],
  authors: [{ name: "Victor Ribes", url: "https://www.linkedin.com/in/victorribes/" }],
  creator: "Digital Atelier Solutions",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://digitalateliersolutions.agency",
    title: "Digital Atelier Solutions | Ghostwriting & Strategic Comms",
    description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional.",
    siteName: "Digital Atelier Solutions",
    images: [
      {
        url: "https://digitalateliersolutions.agency/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Atelier Solutions - Strategic Blockchain Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Atelier Solutions | DAS®",
    description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional.",
    images: ["https://digitalateliersolutions.agency/images/og-default.jpg"],
    creator: "@vribes_eth",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
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
    <html lang="es" className={`${poppins.variable} ${raleway.variable} ${barlow.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${raleway.variable} ${barlow.variable} ${inter.variable} ${manrope.variable} ${playfair.variable} antialiased bg-das-light text-das-dark font-raleway`}
      >
        <TopLoader />
        {children}
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Digital Atelier Solutions",
              "image": "https://digitalateliersolutions.agency/images/og-default.jpg",
              "@id": "https://digitalateliersolutions.agency",
              "url": "https://digitalateliersolutions.agency",
              "telephone": "",
              "priceRange": "$$$",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "ES"
              },
              "founder": {
                "@type": "Person",
                "name": "Víctor Ribes",
                "url": "https://www.linkedin.com/in/vribes/",
                "sameAs": [
                  "https://twitter.com/vribes_eth",
                  "https://www.linkedin.com/in/vribes/"
                ]
              },
              "sameAs": [
                "https://www.linkedin.com/company/digital-atelier-solutions",
                "https://twitter.com/vribes_eth"
              ],
              "description": "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional.",
              "knowsAbout": ["Blockchain", "Ghostwriting", "Corporate Communication", "DeFi", "RWA"]
            })
          }}
        />
      </body>
    </html>
  );
}
