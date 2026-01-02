'use server';

/**
 * Robust Email Verification Action
 * 
 * Performs:
 * 1. Syntax check (Regex)
 * 2. DNS Check: Verifies if the domain has MX records using Google DNS-over-HTTPS.
 * 3. Heuristics: Blocks low-effort emails (e.g., a@a.com, test@test.com)
 * 4. Blacklist: Checks against known disposable domains.
 */

const BLACKLISTED_DOMAINS = [
    'spam.spam', 'mailinator.com', 'temp-mail.org', 'guerrillamail.com',
    '10minutemail.com', 'trashmail.com', 'yopmail.com', 'fools.com',
    'falso.com', 'fake.com', 'example.com', 'test.com', 'sharklasers.com',
    'getnada.com', 'spam.com', 'disposable.com'
];

export async function verifyEmail(email: string): Promise<{ valid: boolean; message?: string }> {
    if (!email || !email.includes('@')) {
        return { valid: false, message: "El formato del correo no es válido." };
    }

    const [localPart, domain] = email.toLowerCase().split('@');

    // 1. Basic Heuristics (Anti-low effort)
    if (localPart.length < 2 || domain.length < 3) {
        return { valid: false, message: "Por favor, utiliza un correo real y completo." };
    }

    // 2. Blacklist Check
    if (BLACKLISTED_DOMAINS.includes(domain) || domain.includes('spam') || localPart === 'test') {
        return { valid: false, message: "Este dominio de correo no está permitido." };
    }

    // 3. DNS MX Record Check (via Google DNS-over-HTTPS)
    try {
        // MX = Type 15
        const res = await fetch(`https://dns.google/resolve?name=${domain}&type=15`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            // If DNS check fails, we fallback to accepting (don't block legitimate users if Google DNS is down)
            console.error("DNS Check failed to respond");
            return { valid: true };
        }

        const data = await res.json();

        // If Answer exists, it has MX records
        if (data.Answer && data.Answer.length > 0) {
            return { valid: true };
        }

        // Check for A record as fallback (some mail servers accept A if MX missing, though rare now)
        const resA = await fetch(`https://dns.google/resolve?name=${domain}&type=1`);
        const dataA = await resA.json();

        if (dataA.Answer && dataA.Answer.length > 0) {
            return { valid: true };
        }

        return { valid: false, message: "El dominio de este correo no parece ser válido o real." };

    } catch (error) {
        console.error("Verification error:", error);
        return { valid: true }; // Safe fallback
    }
}
