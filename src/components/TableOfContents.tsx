'use client';

import { useEffect, useState } from 'react';
import { Linkedin, Share2 } from 'lucide-react';

type Heading = {
    id: string;
    text: string;
    level: number;
};

export default function TableOfContents({ headings, shareUrl }: { headings: Heading[], shareUrl: string }) {
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Update active state manually for immediate feedback
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className="sticky top-32 space-y-8">
            {/* Navigation */}
            <div>
                <h4 className="font-barlow font-bold text-xs uppercase tracking-widest text-gray-400 mb-6">
                    En este artículo
                </h4>
                <nav className="border-l border-gray-200">
                    <ul className="space-y-4">
                        {headings.map((heading) => (
                            <li key={heading.id} className={`pl-4 ${heading.level === 3 ? 'ml-4' : ''}`}>
                                <a
                                    href={`#${heading.id}`}
                                    onClick={(e) => scrollToHeading(heading.id, e)}
                                    className={`text-sm transition-colors duration-200 block leading-tight ${activeId === heading.id
                                            ? 'text-das-accent font-bold border-l-2 border-das-accent -ml-[17px] pl-[15px]'
                                            : 'text-gray-500 hover:text-das-dark'
                                        }`}
                                >
                                    {heading.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Sticky Actions */}
            <div className="pt-8 border-t border-gray-100">
                <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-500 hover:text-[#0a66c2] transition-colors group mb-6"
                >
                    <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#0a66c2]/10 flex items-center justify-center transition-colors">
                        <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Compartir</span>
                </a>

                {/* Mini Subscribe - Placeholder for now, or link to footer */}
                <div className="bg-gray-50 p-6 rounded-sm">
                    <h5 className="font-playfair font-bold text-das-dark mb-2">Market Intelligence</h5>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Análisis institucional sobre activos digitales.
                    </p>
                    <button
                        onClick={() => document.getElementById('newsletter-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full bg-white border border-gray-200 text-das-dark text-xs font-bold py-2 rounded-sm hover:border-das-dark transition-colors uppercase tracking-widest"
                    >
                        Suscribirse
                    </button>
                </div>
            </div>
        </div>
    );
}
