import { Metadata } from 'next';
import ReportView from './ReportView';

export const metadata: Metadata = {
    title: 'Informe Estratégico 2026 | Digital Atelier Solutions',
    description: 'Análisis de tendencias en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn.',
    openGraph: {
        title: 'Informe Estratégico 2026 | Digital Atelier Solutions',
        description: 'Análisis de tendencias en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn.',
        url: 'https://www.digitalateliersolutions.agency/report-ejecutivo-2026',
        siteName: 'Digital Atelier Solutions',
        images: [
            {
                url: '/og-executive-2026.jpg',
                width: 1200,
                height: 630,
                alt: 'Reporte de Mercado 2026 - Digital Atelier',
            },
        ],
        locale: 'es_ES',
        type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Informe Estratégico 2026 | Digital Atelier Solutions',
        description: 'Análisis de tendencias en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn.',
        images: ['/og-executive-2026.jpg'],
    },
};

export const runtime = 'edge';

export default function ReportPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Informe Estratégico 2026: El Futuro de los Activos Digitales y Marca Profesional",
                        "description": "Un análisis profundo sobre RWA, Tokenización y el impacto del nuevo algoritmo de LinkedIn en la comunicación institucional.",
                        "image": "https://www.digitalateliersolutions.agency/og-executive-2026.jpg",
                        "author": {
                            "@type": "Person",
                            "name": "Víctor Ribes",
                            "url": "https://www.linkedin.com/in/victorribes/"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Digital Atelier Solutions",
                            "logo": {
                                "@type": "ImageObject",
                                "url": "https://www.digitalateliersolutions.agency/images/das-logo.png"
                            }
                        },
                        "datePublished": "2024-12-15",
                        "dateModified": "2026-01-12",
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": "https://www.digitalateliersolutions.agency/report-ejecutivo-2026"
                        },
                        "keywords": ["Blockchain", "RWA", "Tokenización", "LinkedIn Algorithm", "Executive Brand"]
                    })
                }}
            />
            <ReportView />
        </>
    );
}
