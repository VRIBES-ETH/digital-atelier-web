import { NextResponse } from "next/server";
import { Resend } from 'resend';

export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, linkedinUrl } = await req.json();

        if (!email || !linkedinUrl) {
            return NextResponse.json(
                { message: "Por favor, completa todos los campos." },
                { status: 400 }
            );
        }

        // 1. Add to Loops.so (Reusing the form ID from the existing codebase)
        // We use the public form endpoint as seen in LoopsForm.tsx
        const loopsFormId = "cm2rflmgu01h51390iumvl8na";
        const loopsBody = new URLSearchParams();
        loopsBody.append("userGroup", "Analisis LinkedIn");
        loopsBody.append("email", email);
        // We attempt to pass the LinkedIn URL. 
        // Note: For this to work in Loops, a custom field 'linkedinUrl' or similar might need to be mapped in the Loops form settings.
        // We'll append it generally.
        loopsBody.append("linkedinProfile", linkedinUrl); // Changed to camelCase to match typical Loops custom fields
        loopsBody.append("source", "Analisis LinkedIn Page");

        const loopsRes = await fetch(`https://app.loops.so/api/newsletter-form/${loopsFormId}`, {
            method: "POST",
            body: loopsBody,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!loopsRes.ok) {
            console.error("Failed to add to Loops", await loopsRes.text());
            // We don't block the user flow if Loops fails, but good to know.
        }

        // 2. Send Notification Email via Resend
        try {
            const { data, error } = await resend.emails.send({
                from: 'Digital Atelier <notifications@digitalateliersolutions.agency>',
                to: ['vribes@digitalateliersolutions.agency'],
                subject: '🚀 Nuevo Lead: Análisis LinkedIn',
                html: `
                    <div style="font-family: sans-serif; color: #333;">
                        <h2>Nuevo Lead para Análisis LinkedIn</h2>
                        <p>Has recibido una nueva solicitud desde la web.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>LinkedIn:</strong> <a href="${linkedinUrl}" target="_blank">${linkedinUrl}</a></p>
                        <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #888;">Este correo fue enviado automáticamente por Digital Atelier System.</p>
                    </div>
                `
            });

            if (error) {
                console.error("Resend Error:", error);
            } else {
                console.log("Email sent successfully:", data);
            }
        } catch (emailError) {
            console.error("Error sending email:", emailError);
        }

        return NextResponse.json({ success: true, message: "Solicitud recibida" });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { message: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
