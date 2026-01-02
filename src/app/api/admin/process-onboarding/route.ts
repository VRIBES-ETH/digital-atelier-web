import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export const runtime = 'edge';

// --- SCHEMAS ---

const VoiceProfileSchema = z.object({
    toneTraits: z.array(z.object({
        trait: z.string().optional().default(''),
        confidence: z.string().describe("Nivel de confianza: alta, media, o baja").optional().default('media'),
        evidence: z.string().describe("Cita literal (SOLO DEL CLIENTE, ignorar a Víctor)").optional().default(''),
        interpretation: z.string().optional().default(''),
        publishable: z.boolean().describe("¿Es seguro usar este rasgo en público?").optional().default(true)
    })).optional().default([]),
    dictionary: z.array(z.object({
        word: z.string().optional().default(''),
        context: z.string().optional().default(''),
        emotionalWeight: z.string().describe("Peso emocional: positiva, neutra, o negativa").optional().default('neutra'),
        frequency: z.string().describe("Frecuencia: alta, media, o baja").optional().default('media'),
        publishable: z.boolean().describe("Si es adecuado para LinkedIn o solo coloquial").optional().default(true)
    })).optional().default([]),
    mentalModels: z.array(z.object({
        pattern: z.string().describe("Patrón lógico: 'Si habla de X, siempre menciona Y'").optional().default(''),
        example: z.string().describe("Ejemplo del CLIENTE (Nunca del consultor)").optional().default('')
    })).optional().default([]),
    limits: z.array(z.string()).optional().default([]),
    taboos: z.array(z.string()).optional().default([]),
    authorityClaims: z.array(z.string()).optional().default([])
});

const PositioningProfileSchema = z.object({
    strongOpinions: z.array(z.object({
        statement: z.string().optional().default(''),
        evidence: z.string().describe("Cita literal (SOLO DEL CLIENTE)").optional().default(''),
        riskLevel: z.string().describe("Nivel de riesgo: bajo, medio, alto").optional().default('medio'),
        certainty: z.string().describe("Certeza editorial: alta (hecho), media (creencia), baja (sospecha)").optional().default('alta')
    })).optional().default([]),
    contrarians: z.array(z.object({
        target: z.string().describe("Contra qué compite").optional().default(''),
        argument: z.string().optional().default('')
    })).optional().default([]),
    safePromises: z.array(z.string()).optional().default([]),
    availableStories: z.array(z.object({
        headline: z.string().optional().default(''),
        details: z.string().optional().default('')
    })).optional().default([]),
    proofAssets: z.array(z.string()).optional().default([])
});

const OperationalRulesSchema = z.object({
    writingFormulas: z.array(z.object({
        name: z.string().optional().default(''),
        structure: z.string().optional().default(''),
        example: z.string().describe("Ejemplo corto de 2-3 líneas en su voz (SOLO CLIENTE)").optional().default('')
    })).optional().default([]),
    doAndDonts: z.array(z.string()).optional().default([]),
    qualityChecklist: z.array(z.string()).optional().default([]),
    rejectedPatterns: z.array(z.string().describe("Patrones o frases que el cliente ODIA o nunca diría")).optional().default([]),
    riskMatrix: z.object({
        low: z.array(z.string()).optional().default([]),
        medium: z.array(z.string()).optional().default([]),
        high: z.array(z.string()).optional().default([])
    }).optional().default({ low: [], medium: [], high: [] })
});

const ContentOutputsSchema = z.object({
    hooks: z.array(z.object({
        hook: z.string().optional().default(''),
        category: z.string().describe("Educativo, Posicionamiento, Historia, Fricción").optional().default('Posicionamiento'),
    })).optional().default([]),
    postIdeas: z.array(z.object({
        title: z.string().optional().default(''),
        intention: z.string().optional().default(''),
        cta: z.string().optional().default('')
    })).optional().default([]),
    drafts: z.array(z.string().nullable().optional()).optional().default([]),
    experiments: z.array(z.string()).optional().default([])
});

// Map model selection
const getModel = (modelId: string) => {
    switch (modelId) {
        case 'gpt-4o': return openai('gpt-4o');
        case 'claude-sonnet-4-5': return anthropic('claude-sonnet-4-5-20250929');
        case 'claude-3-5-sonnet-20240620': return anthropic('claude-3-5-sonnet-20240620');
        case 'gemini-1.5-pro': return google('models/gemini-2.5-flash');
        default: return openai('gpt-4o');
    }
};

const SPEAKER_GUARDRAILS = `
🔴 INSTRUCCIÓN DE SEGURIDAD CRÍTICA: SEPARACIÓN DE HABLANTES 🔴

La transcripción es una conversación entre dos personas:
1. EL CONSULTOR (Víctor): Ignora TODO lo que diga. Propone, enseña, pregunta.
2. EL CLIENTE (Tu Objetivo): Extrae SOLO su información. Responde, opina, cuenta.

TRUCO: Si suena a "clase magistral", es Víctor. Si suena a "trinchera", es el Cliente.
`;

export async function POST(req: NextRequest) {
    try {
        const { transcript, modelId } = await req.json();

        if (!transcript) {
            return NextResponse.json({ success: false, error: "No se proporcionó transcripción." }, { status: 400 });
        }

        const model = getModel(modelId);

        // --- STAGE 1: CORE PROFILING (Parallel) ---
        const [voiceResult, positioningResult] = await Promise.all([
            generateObject({
                model,
                schema: VoiceProfileSchema,
                prompt: `
${SPEAKER_GUARDRAILS}

Actúa como analista de identidad narrativa.
Tu objetivo NO es describir al cliente, sino ESPECIFICARLO para que nadie más pueda sonar como él.
Analiza esta transcripción:
${transcript}

INSTRUCCIONES DE IDENTIDAD (NO GENÉRICA):
1. **Tone Traits**: PROHIBIDO usar adjetivos vacíos como "Profesional", "Pragmático" o "Experto".
   - Busca el MATIZ: "Cínico con la burocracia", "Obsesivo con el margen", "Alergia al humo".
   - CADA rasgo debe implicar una historia vivida.
2. **Mental Models**: No quiero opiniones. Quiero REGLAS DE LÓGICA DE NEGOCIO.
   - Mal: "Le gusta que las cosas estén claras".
   - Bien: "Si no lo puedes explicar en 3 pasos, es una estafa".
   - Bien: "Primero la rentabilidad, luego la narrativa".
`
            }),
            generateObject({
                model,
                schema: PositioningProfileSchema,
                prompt: `
${SPEAKER_GUARDRAILS}

Actúa como estratega de marca personal "Surgical".
Analiza y extrae el MAPA DE POSICIONAMIENTO.
Analiza esta transcripción:
${transcript}

INSTRUCCIONES DE POSICIONAMIENTO:
1. **Strong Opinions**: Busca la fricción real.
   - No quiero "La IA es el futuro".
   - Quiero "La IA sin datos propios es basura".
2. **Contrarians**: ¿A quién está insultando educadamente? (Bancos, Gurús, Consultoras).
3. **Certeza**: Distingue entre lo que SABE por datos (Alta) y lo que INTUYE por experiencia (Media).
`
            })
        ]);

        const voiceProfile = voiceResult.object;
        const positioningProfile = positioningResult.object;

        // --- STAGE 2: EXECUTION & CONTENT (Parallel) ---
        const contextPrompt = `
CONTEXTO YA EXTRAÍDO:
Perfil de Voz: ${JSON.stringify(voiceProfile)}
Posicionamiento: ${JSON.stringify(positioningProfile)}

TRANSCRIPCIÓN (Referencia):
${transcript.substring(0, 3000)}...
`;

        const [rulesResult, contentResult] = await Promise.all([
            generateObject({
                model,
                schema: OperationalRulesSchema,
                prompt: `
${SPEAKER_GUARDRAILS}
${contextPrompt}

Tarea: Crea "CHAPTER 3: OPERATIONAL RULES".

INSTRUCCIONES DE ESTILO (CRÍTICO):
1. **Gestión Emocional**: NO elimines la emoción. ENCAPSÚLALA.
   - Regla: "Solo muestra emoción (frustración/alegría) si está ligada a un resultado o proceso de negocio".
   - Evita el drama vacío. Busca el "dolor profesional" (impostos, empleados, errores caros).
2. **Rejected Patterns**: Identifica frases de "LinkedIn Guru" que él odiaría ("Sinergias", "Abrir el melón", "Zona de confort").
3. **Writing Formulas**: Extrae su esqueleto lógico. ¿Empieza con dato o con golpe?
`
            }),
            generateObject({
                model,
                schema: ContentOutputsSchema,
                prompt: `
${SPEAKER_GUARDRAILS}
${contextPrompt}

Tarea: Crea "CHAPTER 4: CONTENT OUTPUTS".

INSTRUCCIONES DE CREACIÓN (RAW & DIRTY):
1. **Hooks**:
   - Genera 15 hooks. 
   - La mitad deben ser de FRICCIÓN/NEGATIVIDAD ("Por qué dejé de contratar MBAs", "El error de 50.000€ que cometí").
   - Prohibido "Descubre...", "5 claves para...". ¡Eso es basura genérica!

2. **Drafts**:
   - Escribe 2 borradores en PRIMERA PERSONA REAL.
   - QUIERO SUCIDEDAD: Dudas, paréntesis, muletillas, frases cortantes.
   - Si suena a nota de prensa, HAS FALLADO.
   - Tiene que sonar a una nota de voz transcrita después de un mal día o un gran éxito.
`
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                voiceProfile,
                positioningProfile,
                operationalRules: rulesResult.object,
                contentOutputs: contentResult.object,
                modelUsed: modelId
            }
        });

    } catch (error: any) {
        console.error("AI Error:", error);
        return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
    }
}
