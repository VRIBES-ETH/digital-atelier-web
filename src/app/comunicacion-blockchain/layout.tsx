import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Agencia de Comunicación Blockchain y Copywriting Financiero | Digital Atelier",
    description: "Gestión integral de marca en LinkedIn para empresas Blockchain y Fintech. Copywriting técnico, Whitepapers y Estrategia Corporativa (No solo PR).",
    openGraph: {
        title: "Agencia de Comunicación Blockchain y Copywriting Financiero",
        description: "Tu tecnología es compleja. Tu comunicación no puede serlo. Gestión de marca y perfiles corporativos en LinkedIn.",
        type: 'website',
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Digital Atelier - Comunicación Corporativa Blockchain",
    "image": "https://digitalateliersolutions.agency/opengraph-image.png",
    "@id": "https://digitalateliersolutions.agency",
    "url": "https://digitalateliersolutions.agency/comunicacion-blockchain",
    "priceRange": "$$$$",
    "description": "Agencia boutique de comunicación corporativa y copywriting para empresas Blockchain y Fintech.",
    "knowsAbout": ["Corporate Communications", "Crisis Management", "Employee Advocacy", "MiCA", "Technical Writing"],
    "founder": {
        "@type": "Person",
        "name": "Víctor Ribes",
        "jobTitle": "Strategic Communications Lead",
        "url": "https://www.linkedin.com/in/vribes/"
    }
};

export default function CommunicationLayout({
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
