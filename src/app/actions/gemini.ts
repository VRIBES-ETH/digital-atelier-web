'use server';

import { z } from 'zod';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const GenerateSchema = z.object({
    prompt: z.string().min(1),
});

export async function generateGeminiContent(prompt: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("Server Action: GEMINI_API_KEY is missing from environment variables.");
        throw new Error("GEMINI_API_KEY is not configured on the server.");
    }

    const validated = GenerateSchema.safeParse({ prompt });
    if (!validated.success) {
        throw new Error("Invalid input");
    }

    try {
        const payload = {
            contents: [{ parts: [{ text: validated.data.prompt }] }]
        };

        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", response.status, errorText);
            throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Gemini Action Error:", error);
        // Throw the actual error message to help with debugging if it propagates to the client
        if (error instanceof Error) {
            throw new Error(`Gemini Error: ${error.message}`);
        }
        throw new Error("Failed to generate content.");
    }
}
