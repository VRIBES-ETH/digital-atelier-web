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
    return <>{children}</>;
}
