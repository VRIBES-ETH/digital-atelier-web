"use client";

import dynamic from "next/dynamic";

const GuideContent = dynamic(() => import("./GuideContent"), {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500">Cargando guía...</div>
});

export const runtime = 'edge';

export default function GuidePage() {
    return <GuideContent />;
}
