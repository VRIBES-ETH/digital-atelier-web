import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ghostwriting Blockchain para Ejecutivos | Digital Atelier',
    description: 'Servicio boutique de Escritor Fantasma y Ghostwriting especializado en Blockchain y Fintech. Posicionamos a CEOs como líderes de industria en LinkedIn.',
    alternates: {
        canonical: 'https://www.digitalateliersolutions.agency/blockchain',
    },
    openGraph: {
        title: 'Ghostwriting Blockchain para Ejecutivos | Digital Atelier',
        description: 'Elevamos tu marca personal al estándar institucional. Expertos en narrativa para infraestructura blockchain y RWA.',
        url: 'https://www.digitalateliersolutions.agency/blockchain',
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
                                "name": "¿Qué hace exactamente un Ghostwriter Blockchain?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Un Escritor Fantasma (Ghostwriter) especializado en Blockchain traduce conocimiento técnico y visión estratégica en contenido de alto impacto para LinkedIn, con experiencia en MiCA y protocolos institucionales."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Es seguro para CEOs de empresas reguladas (Fintech)?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí. Se aplica una metodología Compliance-First donde todo el contenido es validado para evitar riesgos regulatorios con la CNMV, SEC o bajo normativa MiCA."
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
