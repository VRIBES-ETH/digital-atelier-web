'use server';

import { generateGeminiContent } from './gemini';

export async function generateOnboardingAnalysis(conversationalTranscript: string, clientName: string, phase: string) {
    if (!conversationalTranscript || conversationalTranscript.length < 50) {
        return { success: false, error: "El transcript es demasiado corto para un análisis robusto." };
    }

    // Engineering the Prompt for 4-Layer Architecture
    const prompt = `
    Actúa como el Consultor Senior de 'Digital Atelier Solutions'. Tu trabajo es procesar esta transcripción cruda de una reunión de onboarding con un cliente nuevo (${clientName}, Fase: ${phase}) y estructurar su "Infraestructura de Autoridad".

    TRANSCRIPT DEL CLIENTE:
    """
    ${conversationalTranscript}
    """

    OBJETIVO:
    Analiza el texto y genera un objeto JSON estricto con 4 capas de profundidad.
    
    ESTRUCTURA JSON REQUERIDA (Responde SOLO con este JSON, sin markdown extra):
    {
        "voiceProfile": {
            "tone": "Descripción del tono (ej: Autoritario pero empático)",
            "keywords": ["Palabra1", "Palabra2", "Palabra3"],
            "forbiddenTerms": ["Término1", "Término2"],
            "syntaxRules": "Reglas de construcción de frases (ej: Frases cortas. Sin adverbios.)"
        },
        "positioningProfile": {
            "currentState": "Dónde está hoy según el texto",
            "desiredState": "Dónde quiere estar (Objetivo)",
            "uniqueValueProposition": "Su propuesta de valor en una frase",
            "enemy": "Contra qué lucha (El enemigo común)"
        },
        "operationalRules": {
            "postingFrequency": "Frecuencia sugerida",
            "contentPillars": ["Pilar 1", "Pilar 2", "Pilar 3"],
            "engagementPolicy": "Cómo responder comentarios"
        },
        "contentOutputs": {
            "linkedinBio": "Propuesta de 'About' para LinkedIn",
            "headline": "Propuesta de Headline",
            "firstPostDraft": "Borrador del primer post estratégico"
        }
    }
    `;

    try {
        const result = await generateGeminiContent(prompt);

        if (!result.success || !result.data) {
            return { success: false, error: result.error || "Fallo en la generación de IA." };
        }

        // Clean and Parse JSON
        let cleanJson = result.data.replace(/```json/g, '').replace(/```/g, '').trim();

        // Attempt parse
        try {
            const parsedData = JSON.parse(cleanJson);
            return { success: true, data: parsedData };
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw Content:", result.data);
            return { success: false, error: "La IA generó un formato inválido. Inténtalo de nuevo." };
        }

    } catch (error: any) {
        return { success: false, error: "Error de servidor: " + error.message };
    }
}
