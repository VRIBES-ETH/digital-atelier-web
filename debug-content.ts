import { getPostBySlug } from './src/app/actions/blog.ts';

async function check() {
    const slug = 'comunicacion-corporativa-tesorerias-activos-digitales';
    try {
        const post = await getPostBySlug(slug);
        if (post) {
            console.log('--- RAW CONTENT START ---');
            console.log(post.content);
            console.log('--- RAW CONTENT END ---');
        } else {
            console.log('Post not found');
        }
    } catch (e) {
        console.error(e);
    }
}

check();
