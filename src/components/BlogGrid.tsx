'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/app/actions/blog';
import { ArrowRight } from 'lucide-react';

interface BlogGridProps {
    posts: BlogPost[];
}

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function BlogGrid({ posts }: BlogGridProps) {
    if (posts.length === 0) {
        return (
            <div className="py-20 text-center opacity-50">
                <p className="text-gray-400 font-barlow uppercase tracking-widest text-sm">Próximamente</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
            {posts.map((post) => (
                <motion.div key={post.id} variants={item}>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="group block"
                    >
                        <article className="flex flex-col h-full transition-all duration-300">
                            {/* Image Container - More compact aspect ratio */}
                            {post.featured_image && (
                                <div className="aspect-[16/10] overflow-hidden mb-6 bg-gray-50 relative rounded-sm shadow-sm border border-gray-100/50">
                                    <div className="absolute inset-0 bg-das-dark/0 group-hover:bg-das-dark/5 transition-colors duration-700 z-10"></div>
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Info Container */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-[9px] font-bold text-gray-400 font-barlow tracking-[0.2em] uppercase opacity-70">
                                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                                            month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-[9px] font-bold text-das-accent font-barlow tracking-[0.15em] uppercase px-2 py-0.5 border border-das-accent/10 rounded-sm bg-das-accent/[0.02]">
                                        {post.category || "Market Intelligence"}
                                    </div>
                                </div>

                                <h2 className="font-playfair font-bold text-xl lg:text-[22px] mb-3 text-das-dark group-hover:text-das-accent transition-colors leading-[1.2] tracking-tight">
                                    {post.title}
                                </h2>

                                <p className="text-gray-500 font-raleway text-[14px] leading-relaxed line-clamp-3 opacity-90">
                                    {post.excerpt}
                                </p>

                                {/* Subtle interaction indicator */}
                                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-2 text-[9px] font-bold text-gray-300 uppercase tracking-widest font-barlow group-hover:text-das-accent group-hover:border-das-accent/20 transition-all duration-500">
                                    <span>Ver análisis completo</span>
                                    <ArrowRight className="w-3 h-3 transition-transform duration-500 group-hover:translate-x-1" />
                                </div>
                            </div>
                        </article>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
