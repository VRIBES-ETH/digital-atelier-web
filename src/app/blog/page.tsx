import { getPublishedPosts, BlogPost } from "@/app/actions/blog";
import BlogGrid from "@/components/BlogGrid";
import { Metadata } from "next";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Blog | Digital Atelier Solutions",
    description: "Insights sobre comunicación estratégica, ghostwriting e identidad digital para líderes Blockchain.",
    openGraph: {
        title: "Blog | Digital Atelier Solutions",
        description: "Insights sobre comunicación estratégica, ghostwriting e identidad digital para líderes Blockchain.",
    },
};

export default async function BlogIndexPage() {
    let posts: BlogPost[] = [];

    try {
        posts = await getPublishedPosts();
    } catch (error) {
        console.warn('Failed to fetch posts:', error);
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24">
                <BlogGrid posts={posts} />
            </div>
        </div>
    );
}
