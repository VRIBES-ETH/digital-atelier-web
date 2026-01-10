'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminHeader() {
    const pathname = usePathname();
    
    // Hide header if we are in the blog editor/create page
    // The editor routes are /vribesadmin/blog/create OR /vribesadmin/blog/[id]
    const isEditor = pathname?.startsWith('/vribesadmin/blog/') && pathname !== '/vribesadmin/blog';

    if (isEditor) return null;

    return (
        <header className="sticky top-0 h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-black/50 backdrop-blur-md z-[100] shrink-0">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-orange-600 rounded-sm"></div>
                    <span className="font-display font-bold text-sm tracking-widest text-white">DAS ADMIN</span>
                </div>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/vribesadmin" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/vribesadmin/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                </nav>
            </div>
        </header>
    );
}
