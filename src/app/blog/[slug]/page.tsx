import { getPublishedPosts, getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";
import { Linkedin, Share2 } from "lucide-react";
import BlogNewsletterForm from "@/components/BlogNewsletterForm";


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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
                <div className="mb-6 opacity-20">
                    <svg className="w-24 h-24 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                </div>
                <h1 className="font-poppins font-bold text-3xl md:text-5xl mb-4 text-das-dark">Artículo No Encontrado</h1>
                <p className="text-xl font-raleway text-gray-500 mb-8 max-w-md">
                    Es posible que la URL haya cambiado o el artículo haya sido eliminado.
                </p>
                <Link href="/blog" className="bg-das-dark text-white font-bold px-8 py-3 rounded-full hover:bg-black transition-colors">
                    Volver al Blog
                </Link>
            </div>
        );
    }

    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`He estado leyendo "${post.title}" de Víctor Ribes.\n\nLectura recomendada para entender hacia dónde va el mercado.\n\nAquí: https://digitalateliersolutions.agency/blog/${slug}`)}`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.seo_title || post.title,
        "image": post.featured_image ? [post.featured_image] : [],
        "datePublished": post.created_at,
        "dateModified": post.updated_at,
        "author": {
            "@type": "Person",
            "name": "Víctor Ribes",
            "url": "https://www.linkedin.com/in/vribes/"
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
                <header className="mb-12 md:mb-16">
                    <div className="text-sm font-bold text-das-accent font-barlow tracking-widest uppercase mb-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <Link href="/blog" className="opacity-50 hover:opacity-100 transition-opacity">Blog</Link>
                            <span className="opacity-30">/</span>
                            <span>{new Date(post.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                        </div>

                        {/* Share Button Top */}
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#0a66c2] transition-colors border border-gray-200 hover:border-[#0a66c2] px-3 py-1.5 rounded-full"
                        >
                            <Linkedin className="w-3 h-3" />
                            COMPARTIR
                        </a>
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

            {/* Author & Share Footer */}
            <div className="mt-20 pt-10 border-t border-gray-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    {/* Author */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                            <img src="/images/victor-ribes.jpg" alt="Víctor Ribes" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Escrito por</p>
                            <h3 className="font-poppins font-bold text-das-dark text-lg">Víctor Ribes</h3>
                            <a href="https://www.linkedin.com/in/victorribes/" target="_blank" className="flex items-center gap-1 text-sm text-[#0a66c2] hover:underline mt-0.5">
                                <Linkedin className="w-3 h-3" />
                                <span>Conectar en LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Share */}
                    <div>
                        <a
                            href={shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#0a66c2] text-white px-6 py-3 rounded-sm font-bold shadow-lg hover:bg-[#004182] transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            Compartir Artículo
                        </a>
                    </div>
                </div>
            </div>

            {/* Newsletter Integration */}
            <div className="mt-20 bg-das-dark text-white p-8 md:p-12 rounded-sm relative overflow-hidden">
                <div className="relative z-10 max-w-xl">
                    <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
                        Inteligencia de Mercado Blockchain
                    </h3>
                    <p className="text-gray-400 font-raleway mb-8 leading-relaxed">
                        Únete a +700 ejecutivos que reciben mis análisis sobre blockchain, digital assets, tokenización y su impacto en los mercados de capitales.
                    </p>
                    {/* Reusing existing component but forcing light mode styles via context or just wrapper if possible. 
                        Since NewsletterForm has its own styles, we wrap it or trust it looks good. 
                        Let's try to trust the component but if it has hardcoded dark/light, we might need a distinct one.
                        Checking the view_file of NewsletterForm would confirm. Assuming it fits or I can inline a simple form if needed to match design.
                        Actually, let's use a Direct Loops Form for maximum control here to ensure it fits the design.
                    */}
                    <BlogNewsletterForm />                    <p className="text-[10px] text-gray-500 mt-4 uppercase tracking-widest">Cero Spam. Baja en 1 click.</p>
                </div>

                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-das-accent opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="mt-12 text-center">
                <Link href="/blog" className="inline-flex items-center gap-2 text-das-dark hover:text-das-accent font-barlow font-bold uppercase tracking-widest text-xs transition-colors">
                    ← Volver a Insights
                </Link>
            </div>
        </div>
    );
}
