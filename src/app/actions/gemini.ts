'use server';

import { z } from 'zod';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

const GenerateSchema = z.object({
    prompt: z.string().min(1),
});

export async function generateGeminiContent(prompt: string) {
    if (!GEMINI_API_KEY) {
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
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Gemini Action Error:", error);
        throw new Error("Failed to generate content.");
    }
}
