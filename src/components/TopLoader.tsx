"use client";

import NextTopLoader from 'nextjs-toploader';

export default function TopLoader() {
    return (
        <NextTopLoader
            color="#FF4F11" // das-accent
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #FF4F11,0 0 5px #FF4F11"
        />
    );
}
