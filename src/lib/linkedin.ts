
export interface LinkedInPostContent {
    text: string;
    mediaUrl?: string; // Future support for images
}

export interface LinkedInPublishResult {
    success: boolean;
    urn?: string;
    error?: string;
}

/**
 * Publishes a text post to LinkedIn using the UGC API.
 * @param accessToken The user's LinkedIn access token.
 * @param authorUrn The user's LinkedIn URN (e.g., "urn:li:person:12345"). If not provided, it will be fetched.
 * @param content The content of the post.
 */
export async function publishToLinkedIn(
    accessToken: string,
    content: LinkedInPostContent,
    authorUrn?: string
): Promise<LinkedInPublishResult> {
    try {
        let finalAuthorUrn = authorUrn;

        // 1. If URN is missing, fetch it from /v2/me
        if (!finalAuthorUrn) {
            // console.log("Fetching LinkedIn Profile URN...");
            const profileResponse = await fetch("https://api.linkedin.com/v2/me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!profileResponse.ok) {
                const errorText = await profileResponse.text();
                throw new Error(`Failed to fetch LinkedIn profile: ${errorText}`);
            }

            const profileData = await profileResponse.json();
            finalAuthorUrn = `urn:li:person:${profileData.id}`;
            // console.log("Fetched URN:", finalAuthorUrn);
        }

        // Ensure URN format is correct
        if (!finalAuthorUrn.startsWith("urn:li:person:")) {
            // If it's just the ID, prepend the prefix
            if (!finalAuthorUrn.startsWith("urn:")) {
                finalAuthorUrn = `urn:li:person:${finalAuthorUrn}`;
            }
        }

        // 2. Prepare the UGC Post Body
        const body = {
            author: finalAuthorUrn,
            lifecycleState: "PUBLISHED",
            specificContent: {
                "com.linkedin.ugc.ShareContent": {
                    shareCommentary: {
                        text: content.text,
                    },
                    shareMediaCategory: "NONE", // TODO: Support IMAGE
                },
            },
            visibility: {
                "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
            },
        };

        // 3. Send Request
        // console.log("Publishing to LinkedIn...", body);
        const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Restli-Protocol-Version": "2.0.0",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`LinkedIn API Error: ${errorText}`);
        }

        const data = await response.json();
        // console.log("LinkedIn Publish Success:", data);

        return {
            success: true,
            urn: data.id, // e.g., "urn:li:share:12345"
        };

    } catch (error: any) {
        console.error("LinkedIn Publish Error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}
