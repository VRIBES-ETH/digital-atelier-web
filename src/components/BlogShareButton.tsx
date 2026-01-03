"use client";

import { Linkedin } from "lucide-react";

type BlogShareButtonProps = {
    title: string;
    text: string;
    url: string;
    className?: string;
};

export default function BlogShareButton({ title, text, url, className = "" }: BlogShareButtonProps) {

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();

        const shareData = {
            title: title,
            text: text,
            url: url,
        };

        // LinkedIn specific fallback URL (Desktop / Non-supported browsers)
        // Combines text + url for the 'feed' endpoint
        const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${text}\n\nAquí: ${url}`)}`;

        if (navigator.share) {
            try {
                // Try native share (Mobile/Tablet preferred)
                await navigator.share(shareData);
            } catch (err) {
                // User cancelled or failed, fallback shouldn't be auto-triggered usually unless generic error
                // But if it fails, we can try opening the link? 
                // Usually ignore cancellation errors.
                // If it's a real error (not AbortError), we might log it.
                if ((err as Error).name !== 'AbortError') {
                    window.open(linkedInUrl, '_blank');
                }
            }
        } else {
            // Fallback for Desktop
            window.open(linkedInUrl, '_blank');
        }
    };

    return (
        <button
            onClick={handleShare}
            className={`inline-flex items-center gap-3 text-gray-600 hover:text-[#0a66c2] transition-colors group bg-gray-50 border border-gray-100 px-6 py-2.5 rounded-full shadow-sm cursor-pointer ${className}`}
        >
            <Linkedin className="w-4 h-4 text-[#0a66c2]" />
            <span className="text-xs font-bold uppercase tracking-widest">Compartir en LinkedIn</span>
        </button>
    );
}
