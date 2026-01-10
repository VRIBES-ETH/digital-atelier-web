import { Inter, Space_Grotesk } from 'next/font/google';
import '@/app/globals.css';
import AdminHeader from './components/AdminHeader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });

export const runtime = 'edge';

export const metadata = {
    title: 'DAS Admin | Client Suite',
    description: 'Internal Operations Dashboard',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${inter.variable} ${spaceGrotesk.variable} min-h-screen bg-zinc-950 text-gray-200 antialiased font-sans flex flex-col`}>
            <AdminHeader />
            <main className="flex-1 relative">
                {children}
            </main>
        </div>
    );
}
