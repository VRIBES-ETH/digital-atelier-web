import { getPublishedPosts, getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Metadata } from "next";
import { Linkedin, Share2 } from "lucide-react";
import BlogNewsletterForm from "@/components/BlogNewsletterForm";
import BlogShareButton from "@/components/BlogShareButton";


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
            images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630 }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.seo_title || post.title,
            description: post.seo_description || post.excerpt,
            images: post.featured_image ? [post.featured_image] : [],
        },
    };
}

// Helper to extract headings
function getHeadings(content: string) {
    const regex = /^(#{2,3})\s+(.+)$/gm;
    const headings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        // slugify
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ id, text, level });
    }
    return headings;
}

// Helper to slugify for IDs (must match content generation)
const slugify = (text: string) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

import TableOfContents from "@/components/TableOfContents";

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

    const shareText = `He estado leyendo "${post.title}" de Víctor Ribes.\n\nLectura recomendada para entender hacia dónde va el mercado.`;
    const postUrl = `https://digitalateliersolutions.agency/blog/${slug}`;
    const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${shareText}\n\nAquí: ${postUrl}`)}`;
    const headings = getHeadings(post.content);

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
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header / Hero Section */}
            <header className="pt-12 md:pt-20 pb-12 text-center max-w-5xl mx-auto px-6">
                {/* Meta & Breadcrumbs */}
                <div className="border-t border-b border-gray-200 py-4 mb-10 flex items-center justify-center gap-6 md:gap-8">
                    <Link href="/blog" className="text-xs md:text-sm font-bold text-das-accent font-barlow tracking-[0.2em] uppercase hover:text-black transition-colors">
                        Market Intelligence
                    </Link>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <div className="text-xs md:text-sm font-medium text-gray-500 font-barlow tracking-widest uppercase">
                        {new Date(post.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                </div>

                {/* Title */}
                <h1 className="font-playfair font-bold text-3xl md:text-5xl lg:text-6xl mb-6 leading-[1.1] text-das-dark tracking-tight max-w-4xl mx-auto">
                    {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl md:text-2xl text-gray-600 font-raleway font-normal leading-relaxed max-w-3xl mx-auto">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Featured Image - Full Width Constraint */}
            {post.featured_image && (
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-16 md:mb-24">
                    <div className="rounded-sm overflow-hidden bg-gray-50 shadow-sm relative aspect-[21/9]">
                        <div className="absolute inset-0 border border-black/5 rounded-sm z-10 pointer-events-none"></div>
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}

            {/* Main Content Grid */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-8 pb-24">

                {/* Mobile Share Button (Visible only on small screens) */}
                <div className="lg:hidden mb-10 flex justify-center">
                    <BlogShareButton
                        title={post.title}
                        text={shareText}
                        url={postUrl}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                    {/* Left Sidebar (TOC) - Desktop Only */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <TableOfContents headings={headings} shareUrl={shareUrl} />
                    </aside>

                    {/* Main Content Column */}
                    <div className="lg:col-span-7 lg:col-start-5">
                        <article className="prose prose-md md:prose-lg max-w-none font-raleway text-gray-800 leading-loose text-justify hyphens-auto
                            prose-headings:font-playfair prose-headings:font-bold prose-headings:text-das-dark
                            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:tracking-tight
                            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5
                            prose-p:mb-6 prose-p:leading-7 prose-p:text-base md:prose-p:text-lg md:prose-p:leading-8
                            prose-li:marker:text-das-accent
                            prose-img:rounded-sm prose-img:w-full prose-img:my-10 prose-img:shadow-sm
                            prose-a:text-das-accent prose-a:no-underline prose-a:border-b prose-a:border-das-accent/30 hover:prose-a:border-das-accent hover:prose-a:text-das-accent/80 transition-all
                            prose-blockquote:border-l-4 prose-blockquote:border-das-accent prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:font-playfair prose-blockquote:text-xl prose-blockquote:text-das-dark
                            first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-playfair first-letter:font-bold first-letter:text-das-dark first-letter:-mt-1
                        ">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = slugify(text); // Ensure ID generation matches TOC
                                        return <h2 id={id} className="text-2xl md:text-3xl mt-12 mb-6 tracking-tight font-playfair scroll-mt-24" {...props}>{children}</h2>;
                                    },
                                    h3: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = slugify(text);
                                        return <h3 id={id} className="text-xl md:text-2xl mt-10 mb-5 font-playfair scroll-mt-24" {...props}>{children}</h3>;
                                    },
                                    p: ({ node, ...props }) => <div className="mb-6 leading-7 text-base md:text-lg md:leading-8 text-gray-800 font-raleway" {...props} />,
                                    img: ({ node, ...props }) => (
                                        <figure className="my-16 md:-mx-12">
                                            <img className="w-full rounded-sm shadow-sm" {...props} />
                                            {props.alt && <figcaption className="text-center text-sm text-gray-500 mt-4 font-barlow uppercase tracking-widest">{props.alt}</figcaption>}
                                        </figure>
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </article>

                        {/* Mobile Share Button (Bottom) */}
                        <div className="lg:hidden mt-12 mb-8 flex justify-center">
                            <BlogShareButton
                                title={post.title}
                                text={shareText}
                                url={postUrl}
                            />
                        </div>

                        {/* Author Footer (Inside Content Column) */}
                        <div className="mt-20 pt-10 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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
                            </div>
                        </div>

                        {/* Newsletter (Inside Content Column) */}
                        <div id="newsletter-form" className="mt-16 bg-das-dark text-white p-8 md:p-12 rounded-sm relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-poppins font-bold text-2xl md:text-3xl mb-4">
                                    Inteligencia de Mercado Blockchain
                                </h3>
                                <p className="text-gray-400 font-raleway mb-8 leading-relaxed">
                                    Únete a +700 ejecutivos que reciben mis análisis sobre blockchain, digital assets, tokenización y su impacto en los mercados de capitales.
                                </p>
                                <BlogNewsletterForm />
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-das-accent opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
