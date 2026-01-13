'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TwitterHydrator() {
    const pathname = usePathname();

    useEffect(() => {
        // Check if the twitter library is available globally
        if ((window as any).twttr && (window as any).twttr.widgets) {
            (window as any).twttr.widgets.load();
        }
    }, [pathname]);

    return null;
}
