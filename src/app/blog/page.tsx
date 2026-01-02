import { getPublishedPosts, BlogPost } from "@/app/actions/blog";
import Link from "next/link";
import { Metadata } from "next";



export const metadata: Metadata = {
    title: "Blog | Digital Atelier Solutions",
    description: "Insights sobre comunicación estratégica, ghostwriting e identidad digital para líderes Web3.",
    openGraph: {
        title: "Blog | Digital Atelier Solutions",
        description: "Insights sobre comunicación estratégica, ghostwriting e identidad digital para líderes Web3.",
    },
};

export default async function BlogIndexPage() {
    let posts: BlogPost[] = [];

    try {
        posts = await getPublishedPosts();
    } catch (error) {
        console.warn('Failed to fetch posts during build:', error);
        // Fallback to empty array, page will render with "No posts content"
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-24">
            <div className="text-center max-w-2xl mx-auto mb-20 reveal">
                <span className="text-das-accent font-barlow font-bold tracking-widest uppercase text-xs mb-4 block">
                    Knowledge Base
                </span>
                <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
                    Insights & Estrategia
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Análisis profundo sobre narrativa corporativa, reputación digital y el puente entre Web3 y las finanzas institucionales.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group block"
                    >
                        <article className="h-full flex flex-col bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                            {post.featured_image && (
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            )}
                            <div className="p-8 flex flex-col flex-1">
                                <div className="text-xs font-bold text-gray-400 font-barlow mb-4">
                                    {new Date(post.created_at).toLocaleDateString('es-ES', {
                                        day: 'numeric', month: 'long', year: 'numeric'
                                    })}
                                </div>
                                <h2 className="font-poppins font-bold text-xl mb-4 group-hover:text-das-accent transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto pt-6 border-t border-gray-50 text-xs font-bold font-barlow tracking-widest uppercase text-das-dark flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Leer Artículo <span>→</span>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-gray-500">Pronto publicaremos nuestros primeros insights.</p>
                </div>
            )}
        </div>
    );
}
