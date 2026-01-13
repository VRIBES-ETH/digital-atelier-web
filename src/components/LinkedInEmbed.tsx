import React from 'react';

interface LinkedInEmbedProps {
    url: string;
    height?: number;
    title?: string;
}

export const LinkedInEmbed: React.FC<LinkedInEmbedProps> = ({
    url,
    height = 500,
    title = "LinkedIn Post"
}) => {
    // If the URL is a full post URL instead of an embed URL, we might need a transform helper,
    // but for now we expect the embed URL or we'll handle partials.
    const embedUrl = url.includes('/embed/') ? url : url.replace('/feed/update/', '/embed/feed/update/');

    return (
        <div className="w-full my-12 overflow-hidden bg-white rounded-sm border border-gray-100 shadow-sm leading-none">
            <iframe
                src={embedUrl}
                height={height}
                width="100%"
                frameBorder="0"
                allowFullScreen={true}
                title={title}
                className="w-full h-auto min-h-[500px]"
                style={{ display: 'block' }}
            ></iframe>
        </div>
    );
};

export default LinkedInEmbed;
