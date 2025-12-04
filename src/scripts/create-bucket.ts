import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createBucket() {
    const { data, error } = await supabaseAdmin
        .storage
        .createBucket('post-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
        });

    if (error) {
        console.error('Error creating bucket:', error);
    } else {
        console.log('Bucket created successfully:', data);
    }
}

createBucket();
