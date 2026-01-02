'use server';

import { z } from 'zod';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

const GenerateSchema = z.object({
    prompt: z.string().min(1),
});

export async function generateGeminiContent(prompt: string) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("Server Action: GEMINI_API_KEY is missing.");
        return { success: false, error: "Configuration Error: GEMINI_API_KEY is missing on server." };
    }

    const validated = GenerateSchema.safeParse({ prompt });
    if (!validated.success) {
        return { success: false, error: "Validation Error: Invalid prompt input." };
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
            return { success: false, error: `Google API Error (${response.status}): ${errorText}` };
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            return { success: false, error: "API Response Error: No content generated." };
        }

        return { success: true, data: content };

    } catch (error) {
        console.error("Gemini Action Exception:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: `Server Exception: ${errorMessage}` };
    }
}
