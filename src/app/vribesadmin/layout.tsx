import { Inter, Space_Grotesk } from 'next/font/google';
import '../globals.css';

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
        <div className={`${inter.variable} ${spaceGrotesk.variable} fixed inset-0 z-[100] bg-zinc-950 text-gray-200 antialiased font-sans h-screen overflow-hidden flex flex-col`}>
            {/* Minimal Admin Header */}
            <header className="h-14 border-b border-zinc-800 flex items-center px-6 bg-black/50 backdrop-blur-md z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
                    <span className="font-display font-bold text-sm tracking-widest text-white">DAS ADMIN</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto relative">
                {children}
            </main>
        </div>
    );
}
