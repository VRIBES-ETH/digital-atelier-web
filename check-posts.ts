import { getPublishedPosts } from './src/app/actions/blog';

async function check() {
    try {
        const posts = await getPublishedPosts();
        console.log('--- Published Posts ---');
        posts.forEach(p => {
            console.log(`Title: ${p.title}`);
            console.log(`Slug: ${p.slug}`);
            console.log(`Status: ${p.status}`);
            console.log('---');
        });
    } catch (e) {
        console.error(e);
    }
}

check();
