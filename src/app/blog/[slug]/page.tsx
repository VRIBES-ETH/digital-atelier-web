import { getPublishedPosts, getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";


export const dynamicParams = false; // Disable fallback to ensure no worker logic is generated

export async function generateStaticParams() {
    try {
        const posts = await getPublishedPosts();
        if (!posts || posts.length === 0) throw new Error("No posts found");

        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        console.warn('Build: Failed to fetch posts, generating placeholder page:', error);
        return [{ slug: 'welcome' }];
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
        // Fallback for the 'welcome' placeholder or if fetch fails during valid build
        return (
            <div className="max-w-4xl mx-auto px-6 py-24 text-center">
                <h1 className="font-poppins font-bold text-3xl mb-4">Blog</h1>
                <p>Cargando contenido o configuración pendiente...</p>
                <div className="mt-8">
                    <a href="/blog" className="text-das-accent hover:underline">← Volver al índice</a>
                </div>
            </div>
        );
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
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article>
                {/* Header */}
                {/* Header */}
                <header className="mb-12 md:mb-16">
                    <div className="text-sm font-bold text-das-accent font-barlow tracking-widest uppercase mb-6 flex items-center gap-3">
                        <Link href="/blog" className="opacity-50 hover:opacity-100 transition-opacity">Blog</Link>
                        <span className="opacity-30">/</span>
                        <span>{new Date(post.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h1 className="font-poppins font-bold text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1] text-das-dark">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-xl md:text-2xl text-gray-500 font-raleway font-light leading-relaxed max-w-3xl">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {/* Featured Image */}
                {post.featured_image && (
                    <div className="mb-16 -mx-6 md:mx-0 md:rounded-sm overflow-hidden bg-gray-50">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </div>
                )}

                {/* Content - Optimized for Reading */}
                <div className="prose prose-lg md:prose-xl max-w-none font-raleway text-gray-800 leading-loose 
                    prose-headings:font-poppins prose-headings:font-bold prose-headings:text-das-dark
                    prose-p:mb-8 prose-p:leading-8
                    prose-li:marker:text-das-accent
                    prose-img:rounded-sm prose-img:w-full prose-img:my-10
                    prose-a:text-das-accent prose-a:no-underline prose-a:border-b prose-a:border-das-accent/30 hover:prose-a:border-das-accent hover:prose-a:text-das-accent/80 transition-all
                    prose-blockquote:border-das-accent prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:font-poppins prose-blockquote:text-gray-600
                ">
                    <ReactMarkdown
                        components={{
                            h2: ({ node, ...props }) => <h2 className="text-3xl md:text-4xl mt-16 mb-8 tracking-tight" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-2xl md:text-3xl mt-12 mb-6" {...props} />,
                            img: ({ node, ...props }) => (
                                <figure className="my-10">
                                    <img className="w-full rounded-sm" {...props} />
                                    {props.alt && <figcaption className="text-center text-sm text-gray-500 mt-3 font-barlow italic">{props.alt}</figcaption>}
                                </figure>
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>

            <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                <Link href="/blog" className="inline-flex items-center gap-2 text-das-dark hover:text-das-accent font-barlow font-bold uppercase tracking-widest text-xs transition-colors">
                    ← Volver a Insights
                </Link>
            </div>
        </div>
    );
}
