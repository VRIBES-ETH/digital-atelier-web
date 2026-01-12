import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Comunicación Estratégica Blockchain para Empresas | DAS®',
    description: 'Agencia de comunicación B2B para proyectos blockchain regulados. Gestión de marca institucional, whitepapers y reputación corporativa.',
    alternates: {
        canonical: 'https://www.digitalateliersolutions.agency/comunicacion-blockchain',
    },
    openGraph: {
        title: 'Comunicación Estratégica Blockchain para Empresas | DAS®',
        description: 'Transformamos tecnología compleja en narrativa institucional clara para inversores y partners.',
        url: 'https://www.digitalateliersolutions.agency/comunicacion-blockchain',
        type: 'website',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "¿Cómo garantizan el cumplimiento regulatorio (MiCA/CNMV)?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Nuestra metodología 'Compliance-First' incluye un filtrado de términos de riesgo financiero y alineación con las directrices de comunicación de la CNMV para criptoactivos y la normativa MiCA europea."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿En qué se diferencian de una agencia de 'Crypto PR'?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Nos enfocamos en Gestión de Marca Corporativa y Comunicación Técnica de alta autoridad en LinkedIn, no en distribución masiva de notas de prensa de bajo valor."
                                }
                            }
                        ]
                    })
                }}
            />
            {children}
        </>
    );
}
