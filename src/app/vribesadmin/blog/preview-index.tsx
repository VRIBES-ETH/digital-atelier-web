import { getPublishedPosts, BlogPost } from "@/app/actions/blog";
import Link from "next/link";
import { Metadata } from "next";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-24 md:pt-12">

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="flex flex-col h-full">
                                {post.featured_image && (
                                    <div className="aspect-[3/2] overflow-hidden mb-6 bg-gray-100 relative">
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 flex flex-col pt-2">
                                    <div className="text-[10px] font-bold text-gray-400 font-barlow tracking-[0.2em] uppercase mb-4">
                                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                                            month: 'long', year: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="font-playfair font-bold text-2xl mb-3 text-das-dark group-hover:text-das-accent transition-colors leading-[1.15]">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-500 font-raleway text-sm leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="py-20 text-center opacity-50">
                        <p className="text-gray-400 font-barlow uppercase tracking-widest text-sm">Próximamente</p>
                    </div>
                )}
            </div>
        </div>
    );
}
