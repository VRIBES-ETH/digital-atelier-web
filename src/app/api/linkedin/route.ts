import { NextResponse } from 'next/server';
import { linkedinClient } from '@/lib/linkedin';

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
    const tokenResponse = await fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    // Check if token response is ok
    if (!tokenResponse.ok) {
      throw new Error(`Token refresh failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) throw new Error("Failed to refresh token: No access token in response");

    // 2. Fetch Posts
    // Using the UGC Posts API or Shares API depending on the URN type (person vs organization)
    // Here we use a generic request structure suitable for most retrieval cases
    const response = await fetch(`https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${authorUrn})&count=3`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0'
      }
    });

    if (!response.ok) {
      throw new Error(`LinkedIn Posts fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform data safely
    const posts = data.elements?.map((item: any) => ({
      id: item.id,
      content: item.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text || "Contenido no disponible",
      date: new Date(item.created?.time || Date.now()).toLocaleDateString(),
      likes: 0, // In a real scenario, this requires a separate API call for socialMetadata
      comments: 0
    })) || [];

    return NextResponse.json({ posts });

  } catch (error) {
    console.error("LinkedIn API Error:", error);
    // In case of error (even if keys exist but fail), fallback to mock data or error
    // For now, let's return error to debug
    return NextResponse.json({ error: "Failed to fetch real data", details: String(error) }, { status: 500 });
  }
}
