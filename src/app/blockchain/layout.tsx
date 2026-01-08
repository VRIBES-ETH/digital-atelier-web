import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Ghostwriting Blockchain para Ejecutivos y Finanzas | Digital Atelier",
    description: "Servicio de Escritor Fantasma (Ghostwriting) para líderes en Finanzas, Fintech y Blockchain. Eleva tu perfil ejecutivo y autoridad en LinkedIn sin escribir una sola palabra.",
    openGraph: {
        title: "Ghostwriting Blockchain para Ejecutivos y Finanzas | Digital Atelier",
        description: "Servicio de Escritor Fantasma (Ghostwriting) para líderes en Finanzas y Blockchain. Posiciona tu autoridad y marca personal.",
        type: 'website',
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Digital Atelier - Ghostwriting Blockchain",
    "image": "https://digitalateliersolutions.agency/opengraph-image.png",
    "@id": "https://digitalateliersolutions.agency",
    "url": "https://digitalateliersolutions.agency/blockchain",
    "telephone": "+34600000000", /* Replace if available */
    "priceRange": "$$$",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "ES"
    },
    "description": "Servicio de Escritor Fantasma (Ghostwriting) para líderes en Finanzas, Fintech y Blockchain. Posicionamiento de autoridad sin escribir una palabra.",
    "serviceArea": {
        "@type": "GeoShape",
        "addressCountry": "Global"
    },
    "offers": {
        "@type": "Offer",
        "name": "Ghostwriting Ejecutivo",
        "price": "900",
        "priceCurrency": "USD",
        "availability": "https://schema.org/LimitedAvailability"
    },
    "founder": {
        "@type": "Person",
        "name": "Víctor Ribes",
        "jobTitle": "Blockchain Ghostwriter",
        "url": "https://www.linkedin.com/in/vribes/",
        "sameAs": [
            "https://twitter.com/vribestech",
            "https://www.blockcha-in.com"
        ]
    },
    "knowsAbout": ["Blockchain", "Fintech", "MiCA Regulation", "Corporate Communications"],
    "review": {
        "@type": "Review",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5"
        },
        "author": {
            "@type": "Person",
            "name": "CEO Fintech (Confidencial)"
        },
        "reviewBody": "Víctor, sé que debo empezar a publicar... entre el board y compliance siempre queda para mañana."
    }
};

export default function BlockchainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
