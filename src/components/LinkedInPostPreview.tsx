import { MoreHorizontal, ThumbsUp, MessageSquare, Repeat, Send, Globe } from "lucide-react";

interface LinkedInPostPreviewProps {
    authorName: string;
    authorHeadline?: string;
    authorImage?: string; // URL or initials if null
    content: string;
    imageUrl?: string;
    referenceLink?: string;
}

export default function LinkedInPostPreview({
    authorName,
    authorHeadline,
    authorImage,
    content,
    imageUrl,
    referenceLink
}: LinkedInPostPreviewProps) {

    // Function to get initials if no image
    const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || "??";

    return (
        <div className="bg-[#1D2226] text-white rounded-lg overflow-hidden border border-gray-700 font-sans max-w-[550px] mx-auto shadow-xl">
            {/* Header */}
            <div className="p-3 flex gap-3 items-start">
                {authorImage ? (
                    <img src={authorImage} alt={authorName} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold">
                        {getInitials(authorName)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-sm hover:text-blue-400 cursor-pointer hover:underline decoration-blue-400 decoration-1 underline-offset-2">{authorName}</h3>
                            <p className="text-xs text-gray-400 truncate">{authorHeadline || "Personal Brand"}</p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <span>now</span>
                                <span>•</span>
                                <Globe className="w-3 h-3" />
                            </div>
                        </div>
                        <button className="text-gray-400 hover:bg-gray-700 p-1 rounded-full transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-3 pb-2">
                <p className="text-sm whitespace-pre-wrap leading-relaxed text-white break-words">
                    {content || "No content available"}
                </p>
                {referenceLink && (
                    <a href={referenceLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline mt-2 block truncate">
                        {referenceLink}
                    </a>
                )}
            </div>

            {/* Media */}
            {imageUrl && (
                <div className="mt-2">
                    <img
                        src={imageUrl}
                        alt="Post content"
                        className="w-full h-auto object-cover max-h-[500px]"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* Footer Actions */}
            <div className="px-3 py-1 border-t border-gray-700 mt-2">
                <div className="flex justify-between items-center py-1">
                    <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-700 rounded-md transition-colors text-gray-300 font-bold text-sm flex-1 justify-center">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="hidden sm:inline">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-700 rounded-md transition-colors text-gray-300 font-bold text-sm flex-1 justify-center">
                        <MessageSquare className="w-5 h-5" />
                        <span className="hidden sm:inline">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-700 rounded-md transition-colors text-gray-300 font-bold text-sm flex-1 justify-center">
                        <Repeat className="w-5 h-5" />
                        <span className="hidden sm:inline">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 px-3 py-3 hover:bg-gray-700 rounded-md transition-colors text-gray-300 font-bold text-sm flex-1 justify-center">
                        <Send className="w-5 h-5" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
