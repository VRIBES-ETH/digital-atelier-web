import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  metadataBase: new URL('https://www.digitalateliersolutions.agency'),
  title: {
    default: "DAS® | Copywriting & Ghostwriting Blockchain",
    template: "%s | DAS®"
  },
  description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional. Expertos en posicionamiento ejecutivo, contenido técnico y liderazgo de pensamiento para la industria Blockchain.",
  keywords: ["Ghostwriting", "Blockchain", "Comunicación Estratégica", "Digital Assets", "Personal Branding", "Executive Communication", "Copywriting", "Finanzas Descentralizadas"],
  authors: [{ name: "Victor Ribes", url: "https://www.linkedin.com/in/victorribes/" }],
  creator: "Digital Atelier Solutions",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.digitalateliersolutions.agency",
    title: "DAS® | Copywriting & Ghostwriting Blockchain",
    description: "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional. Expertos en posicionamiento ejecutivo, contenido técnico y liderazgo de pensamiento para la industria Blockchain.",
    siteName: "Digital Atelier Solutions",
    images: [
      {
        url: "https://www.digitalateliersolutions.agency/images/og-default.jpg",
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
    images: ["https://www.digitalateliersolutions.agency/images/og-default.jpg"],
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
    canonical: './',
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
        suppressHydrationWarning
      >

        <TopLoader />
        {children}
        <CookieBanner />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Digital Atelier Solutions",
                "image": "https://www.digitalateliersolutions.agency/images/og-default.jpg",
                "@id": "https://www.digitalateliersolutions.agency",
                "url": "https://www.digitalateliersolutions.agency",
                "telephone": "",
                "priceRange": "$$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "ES"
                },
                "founder": {
                  "@id": "https://www.digitalateliersolutions.agency/#founder"
                },
                "sameAs": [
                  "https://www.linkedin.com/company/digital-atelier-solutions",
                  "https://twitter.com/vribes_eth",
                  "https://www.linkedin.com/in/victorribes/"
                ],
                "description": "Agencia boutique de comunicación estratégica y ghostwriting para líderes en blockchain y finanzas. Elevamos tu narrativa al estándar institucional.",
                "knowsAbout": [
                  {
                    "@type": "Thing",
                    "name": "Blockchain",
                    "sameAs": "https://en.wikipedia.org/wiki/Blockchain"
                  },
                  {
                    "@type": "Thing",
                    "name": "Ghostwriting",
                    "sameAs": "https://en.wikipedia.org/wiki/Ghostwriter"
                  },
                  {
                    "@type": "Thing",
                    "name": "Cryptocurrency Regulation (MiCA)",
                    "sameAs": "https://en.wikipedia.org/wiki/Markets_in_Crypto-Assets"
                  },
                  {
                    "@type": "Thing",
                    "name": "DeFi",
                    "sameAs": "https://en.wikipedia.org/wiki/Decentralized_finance"
                  },
                  {
                    "@type": "Thing",
                    "name": "Asset tokenization (RWA)",
                    "sameAs": "https://en.wikipedia.org/wiki/Asset_tokenization"
                  }
                ],
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Servicios DAS",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Ghostwriting Ejecutivo para LinkedIn",
                        "description": "Posicionamos a líderes del sector blockchain como autoridades de industria."
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Comunicación Estratégica Corporativa",
                        "description": "Gestión de branding institucional para empresas de activos digitales."
                      }
                    }
                  ]
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "@id": "https://www.digitalateliersolutions.agency/#founder",
                "name": "Víctor Ribes",
                "jobTitle": "Principal & Founder at Digital Atelier Solutions",
                "description": "Expert in strategic communication and ghostwriting for the blockchain and fintech ecosystem since 2016. Specialized in institutional narratives and regulatory compliance (MiCA).",
                "url": "https://www.linkedin.com/in/victorribes/",
                "sameAs": [
                  "https://twitter.com/vribes_eth",
                  "https://www.linkedin.com/in/victorribes/",
                  "https://www.blockcha-in.com"
                ],
                "knowsAbout": ["Blockchain", "Digital Assets", "Executive Branding", "MiCA Regulation", "Corporate Strategy"]
              }
            ])
          }}
        />
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "5aef2dbbab57493e87e6345bab17cb18"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
