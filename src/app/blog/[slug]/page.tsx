import { getPostBySlug, getPublishedPosts } from '@/app/actions/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Clock } from 'lucide-react';
import { Metadata } from 'next';
import BlogNewsletterForm from '@/components/BlogNewsletterForm';
import BlogCTA from '@/components/BlogCTA';
import BlogShareButton from '@/components/BlogShareButton';
import TableOfContents from '@/components/TableOfContents';
import Link from 'next/link';
import React from 'react';

export const dynamicParams = true;

const slugify = (text: string) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

const extractHeadings = (markdown: string) => {
    const lines = markdown.split('\n');
    const headings: any[] = [];
    lines.forEach(line => {
        const match = line.match(/^(##|###) (.*)/);
        if (match) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = slugify(text);
            headings.push({ id, text, level });
        }
    });
    return headings;
};

const calculateReadingTime = (markdown: string) => {
    const wordsPerMinute = 200;
    const words = markdown.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
};

export async function generateStaticParams() {
    const posts = await getPublishedPosts();
    if (!posts || posts.length === 0) return [];
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: any }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found | Digital Atelier Solutions',
        };
    }

    const postUrl = `https://www.digitalateliersolutions.agency/blog/${post.slug}`;

    return {
        title: `${post.seo_title || post.title} | Digital Atelier Solutions`,
        description: post.seo_description || post.excerpt,
        keywords: post.tags || [],
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            images: post.featured_image ? [{ url: post.featured_image }] : [],
            type: 'article',
            publishedTime: post.created_at,
            authors: [post.contributor_name || 'Víctor Ribes'],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: post.featured_image ? [post.featured_image] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: any }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.featured_image,
        "datePublished": post.created_at,
        "dateModified": post.updated_at || post.created_at,
        "author": {
            "@type": "Person",
            "name": post.contributor_name || "Víctor Ribes",
            "url": "https://www.linkedin.com/in/victorribes/"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Digital Atelier Solutions",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.digitalateliersolutions.agency/images/logo-dark.png"
            }
        },
        "description": post.excerpt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://www.digitalateliersolutions.agency/blog/${post.slug}`
        },
        "keywords": post.tags || [],
        "articleSection": "Blockchain Market Intelligence"
    };

    const postUrl = `https://www.digitalateliersolutions.agency/blog/${post.slug}`;
    const shareText = `Análisis Estratégico: ${post.title}`;
    const headings = extractHeadings(post.content);
    const readingTime = calculateReadingTime(post.content);

    return (
        <div className="min-h-screen bg-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />


            {/* Navbar Placeholder / Minimal */}
            <nav className="h-14 border-b border-gray-100 flex items-center px-6 justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-das-dark rounded-sm flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">DA</span>
                    </div>
                </Link>
                <div className="flex gap-6">
                    <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-das-dark transition-colors font-barlow">Blog</Link>
                    <Link href="/#contacto" className="text-xs font-bold uppercase tracking-widest text-das-accent font-barlow">Contacto</Link>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-20">
                {/* 1. Header Section - CENTERED */}
                <header className="mb-16 text-center max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="text-[10px] font-bold text-das-accent uppercase tracking-widest px-2 py-0.5 bg-das-accent/5 rounded-sm font-barlow">
                            {post.category || "Market Intelligence"}
                        </span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-barlow">
                            {new Date(post.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-barlow">
                            <Clock className="w-3 h-3 text-das-accent/60" />
                            {readingTime} MIN DE LECTURA
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-[72px] font-playfair font-bold text-das-dark leading-[1.05] mb-8 tracking-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-500 font-raleway leading-relaxed max-w-3xl mx-auto">
                        {post.excerpt}
                    </p>
                </header>

                {/* 2. Featured Image - HERO WIDTH */}
                {post.featured_image && (
                    <div className="mb-20 relative aspect-[21/9] overflow-hidden rounded-sm shadow-2xl border border-gray-100">
                        <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* 3. Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Sidebar: TOC ONLY */}
                    <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
                        <TableOfContents headings={headings} shareUrl={postUrl} />
                    </aside>

                    {/* Main Content Column */}
                    <div className="lg:col-span-9 max-w-3xl">
                        {/* Article Content */}
                        <article className="
                            prose prose-lg max-w-none 
                            prose-headings:font-playfair prose-headings:text-das-dark prose-headings:tracking-tight
                            prose-p:font-raleway prose-p:text-gray-800 prose-p:leading-8
                            prose-strong:text-das-dark prose-strong:font-bold
                            prose-ul:list-disc prose-li:text-gray-700
                            prose-li:marker:text-das-accent
                            prose-img:rounded-sm prose-img:w-full prose-img:my-10 prose-img:shadow-sm
                            prose-a:text-das-accent prose-a:no-underline prose-a:border-b prose-a:border-das-accent/30 hover:prose-a:border-das-accent hover:prose-a:text-das-accent/80 transition-all
                            prose-blockquote:border-l-4 prose-blockquote:border-das-accent prose-blockquote:bg-transparent prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:font-playfair prose-blockquote:text-xl prose-blockquote:text-das-dark
                        ">
                            <ReactMarkdown
                                components={{
                                    h2: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = slugify(text);
                                        return <h2 id={id} className="text-2xl md:text-3xl mt-12 mb-6 tracking-tight font-playfair scroll-mt-24" {...props}>{children}</h2>;
                                    },
                                    h3: ({ node, children, ...props }) => {
                                        const text = String(children);
                                        const id = slugify(text);
                                        return <h3 id={id} className="text-xl md:text-2xl mt-10 mb-5 font-playfair scroll-mt-24" {...props}>{children}</h3>;
                                    },
                                    p: ({ node, children, ...props }) => {
                                        if (node?.children?.some((child: any) => child.tagName === 'img')) {
                                            return <div className="mb-6">{children}</div>;
                                        }
                                        return <p {...props}>{children}</p>;
                                    },
                                    img: ({ node, ...props }) => (
                                        <figure className="my-16">
                                            <img className="w-full rounded-sm shadow-sm" {...props} />
                                            {props.alt && <figcaption className="text-center text-sm text-gray-500 mt-4 font-barlow uppercase tracking-widest">{props.alt}</figcaption>}
                                        </figure>
                                    ),
                                    blockquote: ({ node, children, ...props }) => {
                                        const findRawText = (n: any): string => {
                                            if (n.value) return n.value;
                                            if (n.children) return n.children.map(findRawText).join(' ');
                                            return '';
                                        };
                                        const allText = findRawText(node as any);
                                        const isExecutive = /Resumen Ejecutivo|Claves Estratégicas/i.test(allText);

                                        if (isExecutive) {
                                            return (
                                                <div className="executive-summary-card not-prose">
                                                    {children}
                                                </div>
                                            );
                                        }
                                        return <blockquote {...props}>{children}</blockquote>;
                                    },
                                    a: ({ node, href, children, ...props }) => {
                                        const isInternal = href?.startsWith('/') || href?.includes('digitalateliersolutions.agency');
                                        return (
                                            <a
                                                href={href}
                                                target={isInternal ? undefined : '_blank'}
                                                rel={isInternal ? undefined : 'noopener noreferrer'}
                                                {...props}
                                            >
                                                {children}
                                            </a>
                                        );
                                    },
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>

                            {/* Dynamic CTA Injection */}
                            <div className="mt-12">
                                <BlogCTA type={(post.title.toLowerCase().includes('linkedin') || post.title.toLowerCase().includes('marca')) ? 'linkedin_audit' : 'report_2026'} />
                            </div>
                        </article>

                        {/* Mobile Share Button */}
                        <div className="lg:hidden mt-12 mb-8 flex justify-center">
                            <BlogShareButton
                                title={post.title}
                                text={shareText}
                                url={postUrl}
                            />
                        </div>

                        {/* Author Footer */}
                        <div className="mt-20 pt-10 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative">
                                        <img src="/images/victor-ribes.jpg" alt={post.contributor_name || "Víctor Ribes"} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 font-barlow">Escrito por</p>
                                        <h3 className="font-poppins font-bold text-das-dark text-lg">{post.contributor_name || "Víctor Ribes"}</h3>
                                        <a href="https://www.linkedin.com/in/victorribes/" target="_blank" className="flex items-center gap-1 text-sm text-[#0a66c2] hover:underline mt-0.5">
                                            <span>Conectar en LinkedIn</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
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
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
