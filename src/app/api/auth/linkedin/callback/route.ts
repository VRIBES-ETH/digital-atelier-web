import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' });
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`;

    try {
        const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: clientId!,
                client_secret: clientSecret!,
            }),
        });

        const data = await response.json();

        if (data.error) {
            return NextResponse.json(data);
        }

        return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; padding: 40px; max-width: 800px; mx: auto;">
          <h1>✅ LinkedIn Authorization Success!</h1>
          <p>Here is your <strong>Refresh Token</strong>. Copy this value and paste it into your <code>.env.local</code> file.</p>
          
          <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; word-break: break-all; border: 1px solid #ddd;">
            <strong>LINKEDIN_REFRESH_TOKEN=</strong>${data.refresh_token}
          </div>
          
          <p style="margin-top: 20px; color: #666;">Access Token (expires in ${data.expires_in}s): ${data.access_token.substring(0, 20)}...</p>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' },
        });

    } catch (error) {
        return NextResponse.json({ error: String(error) });
    }
}
