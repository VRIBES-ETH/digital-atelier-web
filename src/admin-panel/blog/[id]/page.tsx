import PostEditor from '../editor';
import { getPostByIdAdmin } from '@/app/actions/blog';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPostByIdAdmin(id);

    if (!post) {
        notFound();
    }

    return <PostEditor post={post} />;
}
