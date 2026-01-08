import { NextResponse } from 'next/server';


// Cloudflare Workers run on the Edge runtime, so we enforce it here.
export const runtime = 'edge';

export async function GET(request: Request) {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const refreshToken = process.env.LINKEDIN_REFRESH_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  // Si faltan credenciales, devolvemos datos "dummy" pero con estructura final
  // Esto permite que el frontend funcione "como si fuera real" mientras configuramos la API
  if (!clientId || !clientSecret || !refreshToken || !authorUrn) {
    console.log("LinkedIn Credentials missing, returning mock data.");
    return NextResponse.json({
      posts: [
        {
          id: "urn:li:share:1",
          content: "La 'institucionalización' de Web3 no va de ponerse corbata. Va de hablar el mismo idioma que el capital que quieres atraer. En mi último análisis para @CoinDesk explico por qué el 90% de los whitepapers fallan en Compliance audit.",
          date: "Hace 2 días",
          likes: 342,
          comments: 56,
          url: "https://linkedin.com"
        },
        {
          id: "urn:li:share:2",
          content: "Si tu CFO no entiende tu narrativa, tus inversores tampoco lo harán. Simplificar no es 'dumb down'. Es respetar el tiempo de gente muy ocupada. #Web3 #Communication #Strategy",
          date: "Hace 5 días",
          likes: 891,
          comments: 124,
          url: "https://linkedin.com"
        },
        {
          id: "urn:li:share:3",
          content: "Gran sesión con el board de una Top 10 DeFi protocol. La conclusión es clara: la era del 'hype' murió. Estamos en la era del 'Utility & Revenue'. Tu copy debe reflejar eso.",
          date: "Hace 1 semana",
          likes: 567,
          comments: 89,
          url: "https://linkedin.com"
        }
      ]
    });
  }

  try {
    // 1. Refresh Access Token (Simplified flow for demo purposes)
    // 1. Refresh Access Token (Simplified flow for demo purposes)
    const tokenBody = new URLSearchParams();
    tokenBody.append('grant_type', 'refresh_token');
    tokenBody.append('refresh_token', refreshToken);
    tokenBody.append('client_id', clientId);
    tokenBody.append('client_secret', clientSecret);

    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenBody
    });

    // Check if token response is ok
    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error("LinkedIn Token Refresh Error:", errorBody);
      throw new Error(`Token refresh failed: ${tokenResponse.statusText} - ${errorBody}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("Failed to refresh token: No access token in response");

    // 2. Fetch Posts
    // Using the modern rest/posts API
    // Documentation: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api
    const response = await fetch(`https://api.linkedin.com/rest/posts?q=author&author=${encodeURIComponent(authorUrn)}&count=3`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'LinkedIn-Version': '202510',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LinkedIn Posts API Error Body:", errorText);
      throw new Error(`LinkedIn Posts fetch failed: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Helper to clean LinkedIn raw text
    const cleanText = (text: string) => {
      return text
        .replace(/@\[([^\]]+)\]\(urn:li:[^)]+\)/g, '$1') // Remove mentions formatting
        .replace(/\\n/g, '\n'); // Fix escaped newlines if any
    };

    // Helper to fetch image URL
    const fetchImage = async (imageUrn: string): Promise<string | undefined> => {
      try {
        const encodedUrn = encodeURIComponent(imageUrn);
        const imgRes = await fetch(`https://api.linkedin.com/rest/images/${encodedUrn}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'LinkedIn-Version': '202510',
            'X-Restli-Protocol-Version': '2.0.0'
          }
        });
        if (!imgRes.ok) return undefined;
        const imgData = await imgRes.json();
        // content.downloadUrl is usually where the public URL is
        return imgData.ingestOptions?.ingestUrl || imgData.downloadUrl; // Fallback check
      } catch (e) {
        console.error("Error fetching image:", e);
        return undefined;
      }
    };

    // Transform data safely
    const postsPromises = data.elements?.map(async (item: any) => {
      let imageUrl = undefined;
      const mediaId = item.content?.media?.id;
      if (mediaId && mediaId.startsWith("urn:li:image:")) {
        // Fetch image details
        // We can do this in parallel but let's await inside map for simplicity then Promise.all the map
        imageUrl = await fetchImage(mediaId);
      }

      return {
        id: item.id,
        content: cleanText(item.commentary || "Contenido no disponible"),
        date: new Date(item.createdAt || Date.now()).toLocaleDateString(),
        likes: 0,
        comments: 0,
        url: `https://www.linkedin.com/feed/update/${item.id}`,
        imageUrl: imageUrl
      };
    }) || [];

    const posts = await Promise.all(postsPromises);

    return NextResponse.json({ posts });

  } catch (error) {
    console.error("LinkedIn API Error:", error);
    // In case of error (even if keys exist but fail), fallback to mock data or error
    // For now, let's return error to debug
    return NextResponse.json({ error: "Failed to fetch real data", details: String(error) }, { status: 500 });
  }
}
