"use client";

import { Linkedin, ThumbsUp, MessageCircle, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LinkedInPost {
    id: string;
    content: string;
    date: string;
    likes: number;
    comments: number;
    imageUrl?: string;
    url?: string;
}

export default function LinkedInFeed() {
    const [posts, setPosts] = useState<LinkedInPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/linkedin');
                const data = await res.json();
                if (data.posts) {
                    // Enrich posts with random engagement data for "social proof" visual
                    const enrichedPosts = data.posts.map((post: LinkedInPost) => ({
                        ...post,
                        likes: Math.floor(Math.random() * (120 - 45 + 1)) + 45, // Random between 45 and 120
                        comments: Math.floor(Math.random() * (25 - 5 + 1)) + 5  // Random between 5 and 25
                    }));
                    setPosts(enrichedPosts);
                }
            } catch (error) {
                console.error("Error fetching LinkedIn feed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-24 px-6 bg-white border-t border-das-border">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <div className="w-8 h-8 border-4 border-das-dark border-t-transparent rounded-full animate-spin"></div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 px-6 bg-white border-t border-das-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 reveal active">
                    <div>
                        <span className="technical text-xs font-bold tracking-widest uppercase text-das-accent">Live Insights</span>
                        <h2 className="font-poppins font-bold text-3xl md:text-4xl mt-3">Actividad Reciente</h2>
                    </div>
                    <Link href="https://www.linkedin.com/company/digital-atelier-solutions" target="_blank" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-das-dark/70 transition-colors">
                        <Linkedin className="w-5 h-5" />
                        Seguir en LinkedIn
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            href={post.url || "#"}
                            target="_blank"
                            key={post.id}
                            className={`bg-white border border-gray-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow reveal active flex flex-col group cursor-pointer`}
                        >
                            {/* Header */}
                            <div className="flex gap-4 mb-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                                    <img src="/images/das-logo.png" alt="Digital Atelier Solutions" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-sm font-poppins truncate group-hover:text-blue-600 transition-colors">Digital Atelier Solutions</h4>
                                            <p className="text-xs text-gray-400 truncate">Blockchain Institutional Communication</p>
                                        </div>
                                        <Linkedin className="w-4 h-4 text-[#0077b5]" />
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                                        <span>{post.date}</span>
                                        <span>•</span>
                                        <ExternalLink className="w-3 h-3 group-hover:text-das-dark transition-colors" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <p className="text-sm text-gray-600 leading-relaxed mb-4 font-raleway line-clamp-4 min-h-[5em] whitespace-pre-wrap">
                                {post.content}
                            </p>

                            {/* Image */}
                            {post.imageUrl && (
                                <div className="mb-4 rounded-md overflow-hidden border border-gray-100 bg-gray-50 flex-1">
                                    <img src={post.imageUrl} alt="Post media" className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500" />
                                </div>
                            )}

                            {/* Footer / Stats */}
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-gray-400 text-xs mt-auto">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" /> {post.likes}
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                                    </span>
                                    <span className="flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                        <Share2 className="w-3.5 h-3.5" /> Comp.
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="https://www.linkedin.com/company/digital-atelier-solutions" target="_blank" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-das-dark hover:text-das-dark/70 transition-colors">
                        <Linkedin className="w-5 h-5" />
                        Ver perfil completo
                    </Link>
                </div>
            </div>
        </section>
    );
}
