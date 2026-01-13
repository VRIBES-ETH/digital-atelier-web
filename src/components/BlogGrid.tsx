'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BlogPost } from '@/app/actions/blog';
import { ArrowRight } from 'lucide-react';

interface BlogGridProps {
    posts: BlogPost[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 1.11, 0.81, 0.99] } }
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20"
        >
            {posts.map((post) => (
                <motion.div key={post.id} variants={item}>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="group block"
                    >
                        <article className="flex flex-col h-full border-b border-transparent hover:border-gray-100 transition-colors pb-8">
                            {/* Image Container */}
                            {post.featured_image && (
                                <div className="aspect-[3/2] overflow-hidden mb-8 bg-gray-50 relative rounded-sm shadow-sm">
                                    <div className="absolute inset-0 bg-das-dark/0 group-hover:bg-das-dark/5 transition-colors duration-500 z-10"></div>
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {/* Info Container */}
                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-5">
                                    <div className="text-[10px] font-bold text-gray-400 font-barlow tracking-[0.2em] uppercase opacity-80">
                                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                                            month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-[10px] font-bold text-das-accent font-barlow tracking-[0.2em] uppercase px-2.5 py-1 border border-das-accent/20 rounded-sm">
                                        {post.category || "Market Intelligence"}
                                    </div>
                                </div>

                                <h2 className="font-playfair font-bold text-2xl lg:text-[28px] mb-4 text-das-dark group-hover:text-das-accent transition-colors leading-[1.15] tracking-tight">
                                    {post.title}
                                </h2>

                                <p className="text-gray-500 font-raleway text-[15px] leading-relaxed line-clamp-3 mb-6">
                                    {post.excerpt}
                                </p>

                                {/* Action Link */}
                                <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-das-dark uppercase tracking-widest font-barlow group-hover:text-das-accent transition-colors">
                                    <span>Leer Análisis</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </div>
                            </div>
                        </article>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
