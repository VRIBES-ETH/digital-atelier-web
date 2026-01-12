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
    return <>{children}</>;
}
