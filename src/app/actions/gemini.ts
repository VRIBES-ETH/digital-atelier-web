'use server';

import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function generateGeminiContent(prompt: string) {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        return { success: false, text: "API Key no configurada." };
    }

    try {
        const { text } = await generateText({
            model: google('gemini-1.5-flash'), // or gemini-pro if preferred
            prompt: prompt,
            maxTokens: 500,
            temperature: 0.7,
        });

        return { success: true, text };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { success: false, text: "Error al generar contenido con IA." };
    }
}
