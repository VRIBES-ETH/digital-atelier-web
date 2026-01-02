import { getPublishedPosts, getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";

// export const runtime = 'edge'; // Removed for pure static generation
export const dynamicParams = false; // Disable fallback to ensure no worker logic is generated // Allow generating new pages on demand (ISR-like on Vercel, but helps on CF)

export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.warn('Failed to generate static params (likely due to missing build env vars):', error);
        return [];
    }
}

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return { title: 'Post no encontrado' };
    }

    return {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt,
        openGraph: {
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            type: 'article',
            publishedTime: post.created_at,
            images: post.featured_image ? [{ url: post.featured_image }] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.seo_title || post.title,
        "image": post.featured_image ? [post.featured_image] : [],
        "datePublished": post.created_at,
        "dateModified": post.updated_at,
        "author": {
            "@type": "Person",
            "name": "Digital Atelier Solutions" // Or dynamic based on author_id relationship
        },
        "description": post.seo_description || post.excerpt
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article>
                {/* Header */}
                <header className="text-center mb-16 reveal">
                    <div className="text-xs font-bold text-das-accent font-barlow tracking-widest uppercase mb-6">
                        {new Date(post.created_at).toLocaleDateString('es-ES', {
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </div>
                    <h1 className="font-poppins font-bold text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="mb-16 rounded-sm overflow-hidden shadow-lg reveal delay-100">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none font-sans text-gray-700 leading-loose reveal delay-200">
                    <ReactMarkdown
                        components={{
                            h2: ({ node, ...props }) => <h2 className="font-poppins font-bold text-3xl mt-12 mb-6 text-das-dark" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="font-poppins font-bold text-2xl mt-8 mb-4 text-das-dark" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-6" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                            blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-das-accent pl-6 italic text-xl text-gray-500 my-8 py-2" {...props} />,
                            a: ({ node, ...props }) => <a className="text-das-accent font-bold hover:underline" {...props} />,
                            img: ({ node, ...props }) => <img className="rounded-lg shadow-md my-8 w-full" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>

            <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                <a href="/blog" className="btn inline-flex items-center gap-2 px-8 py-4 bg-gray-50 hover:bg-gray-100 text-das-dark font-barlow font-bold uppercase tracking-widest text-xs transition-colors rounded-sm">
                    ← Volver al Blog
                </a>
            </div>
        </div>
    );
}
