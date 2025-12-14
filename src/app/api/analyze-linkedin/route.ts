import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { MOCK_PROFILE } from '@/lib/linkedin-mock';

export const runtime = 'edge';

// Schema for the AI Response
const AnalysisSchema = z.object({
    score: z.number().min(0).max(100),
    headline_critique: z.string(),
    summary_critique: z.string(),
    key_strengths: z.array(z.string()),
    key_weaknesses: z.array(z.string()),
    hook_suggestion: z.string(),
    improved_headline: z.string(),
});

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        // Initialize OpenAI Logic
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 1. DATA ACQUISITION
        // In "Mock Mode", we ignore the URL and always return Bill Gates.
        // In "Prod Mode", we would call RapidAPI here.
        const profileData = MOCK_PROFILE;
        console.log("Using Mock Profile:", profileData.full_name);

        // 2. AI ANALYSIS
        const prompt = `
      You are a world-class Personal Branding Expert and Ghostwriter for top executives.
      Analyze the following LinkedIn profile JSON data and provide a strict audit.
      
      TARGET AUDIENCE: High-net-worth individuals, investors, and potential partners.
      GOAL: Maximize authority, clarity, and sales conversion.

      PROFILE DATA:
      ${JSON.stringify(profileData, null, 2)}

      Return the result strictly as a valid JSON object matching this schema:
      {
        "score": number (0-100),
        "headline_critique": "Short, punchy critique of the headline. Is it clear? Does it sell?",
        "summary_critique": "Critique of the 'About' section. Is it a story or a resume?",
        "key_strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "key_weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
        "hook_suggestion": "A sample opening line for their 'About' section that grabs attention.",
        "improved_headline": "A rewritten, high-converting headline option."
      }
    `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that outputs strictly JSON." },
                { role: "user", content: prompt },
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content from OpenAI");

        // Validate with Zod
        const analysis = AnalysisSchema.parse(JSON.parse(content));

        return NextResponse.json({
            success: true,
            profile: {
                full_name: profileData.full_name,
                headline: profileData.headline,
                image: profileData.profile_pic_url,
            },
            analysis
        });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to analyze profile" },
            { status: 500 }
        );
    }
}
