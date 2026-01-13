'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TwitterHydrator() {
    const pathname = usePathname();

    useEffect(() => {
        const loadWidgets = () => {
            // @ts-ignore
            if (window.twttr && window.twttr.widgets) {
                // @ts-ignore
                window.twttr.widgets.load();
                return true;
            }
            return false;
        };

        // Try immediately
        loadWidgets();

        // Retry after a short delay to ensure ReactMarkdown is finished
        const timer = setTimeout(loadWidgets, 1000);
        const timer2 = setTimeout(loadWidgets, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [pathname]);

    return null;
}
