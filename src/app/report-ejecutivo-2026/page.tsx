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
    return <ReportView />;
}
