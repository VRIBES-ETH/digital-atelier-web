'use client';

import { useEffect, useState } from 'react';
import { Linkedin } from 'lucide-react';

type Heading = {
    id: string;
    text: string;
    level: number;
};

export default function TableOfContents({ headings, shareUrl }: { headings: Heading[], shareUrl: string }) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Hydration delay: Wait for ReactMarkdown to finish rendering elements
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-120px 0px -70% 0px' }
            );

            if (headings) {
                headings.forEach((heading) => {
                    const element = document.getElementById(heading.id);
                    if (element) {
                        observer.observe(element);
                    }
                });
            }

            return () => observer.disconnect();
        }, 1200); // 1.2s delay to ensure content is stable and DOM elements are present

        return () => clearTimeout(timer);
    }, [headings]);

    const scrollToHeading = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
        }
    };

    const SubscriptionBox = () => (
        <div className="bg-das-dark p-7 rounded-sm border border-das-dark shadow-xl relative overflow-hidden group mt-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-das-accent/10 rounded-full blur-3xl -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
            <h5 className="font-playfair font-bold text-white mb-2 text-xl tracking-tight relative z-10">DAS® Intelligence</h5>
            <p className="text-[11px] text-gray-400 mb-6 leading-relaxed font-raleway relative z-10">
                Análisis institucionales del sector de activos digitales.
            </p>
            <button
                onClick={() => document.getElementById('newsletter-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-das-accent text-white text-[10px] font-bold py-3 rounded-sm hover:bg-das-accent/90 transition-all uppercase tracking-[0.15em] relative z-10 shadow-lg shadow-das-accent/20"
            >
                Suscribirse
            </button>
        </div>
    );

    if (!headings || headings.length === 0) return (
        <div className="sticky top-32 flex flex-col justify-end">
            <SubscriptionBox />
        </div>
    );

    return (
        <div className="sticky top-12 flex flex-col h-[calc(100vh-140px)]">
            {/* TOC Navigation - Scrollable core */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <h4 className="font-barlow font-bold text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-6 shrink-0">
                    En este artículo
                </h4>
                <nav className="border-l border-gray-100 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 flex-1">
                    <ul className="space-y-3">
                        {headings.map((heading) => (
                            <li key={heading.id} className={`pl-4 ${heading.level === 3 ? 'ml-4' : ''}`}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => scrollToHeading(heading.id, e)}
                                    className={`text-[11px] transition-all duration-300 block leading-tight tracking-wide ${activeId === heading.id
                                        ? 'text-das-accent font-bold border-l-2 border-das-accent -ml-[17px] pl-[15.5px]'
                                        : 'text-gray-400 hover:text-das-dark'
                                        }`}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Fixed Actions & CTA at the bottom */}
            <div className="pt-6 mt-6 border-t border-gray-100 shrink-0 space-y-6 bg-white">
                <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-[#0a66c2]/80 hover:text-[#0a66c2] transition-all group"
                >
                    <div className="w-9 h-9 rounded-full bg-[#0a66c2]/5 group-hover:bg-[#0a66c2]/10 flex items-center justify-center transition-all border border-[#0a66c2]/10 group-hover:border-[#0a66c2]/20">
                        <Linkedin className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Compartir Análisis</span>
                </a>

                <SubscriptionBox />
            </div>
        </div>
    );
}
