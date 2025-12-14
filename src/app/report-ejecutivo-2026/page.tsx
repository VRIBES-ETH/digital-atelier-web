import { Metadata } from 'next';
import ReportView from './ReportView';

export const metadata: Metadata = {
    title: 'Informe Estratégico 2026 | Digital Atelier Solutions',
    description: 'Análisis de tendencias en Digital Assets, RWA, Tokenización y Desarrollo de Marca Profesional bajo el nuevo algoritmo de LinkedIn.',
};

export default function ReportPage() {
    return <ReportView />;
}
