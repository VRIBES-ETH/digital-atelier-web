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
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24">
                {/* Minimalist Header */}
                <div className="mb-16 md:mb-24 reveal">
                    <h1 className="font-poppins font-bold text-5xl md:text-7xl mb-6 tracking-tight text-das-dark">
                        Insights.
                    </h1>
                    <p className="font-raleway text-xl md:text-2xl text-gray-500 max-w-2xl leading-relaxed">
                        Narrativa corporativa, identidad digital y el futuro de la comunicación estratégica.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="flex flex-col h-full">
                                {post.featured_image && (
                                    <div className="aspect-[4/3] overflow-hidden mb-6 bg-gray-50 rounded-sm">
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-gray-400 font-barlow tracking-widest uppercase mb-3">
                                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                                            month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="font-poppins font-bold text-2xl mb-3 text-das-dark group-hover:text-das-accent transition-colors leading-tight">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 font-raleway text-base leading-relaxed line-clamp-3 mb-4 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-das-accent text-sm font-bold border-b border-transparent group-hover:border-das-accent self-start transition-all pb-0.5">
                                        Leer más
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-gray-400 font-raleway text-lg">Próximamente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
