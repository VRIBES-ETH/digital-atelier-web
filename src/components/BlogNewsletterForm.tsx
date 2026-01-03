"use client";

import { useState } from "react";
import { Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

export default function BlogNewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        const formBody = "userGroup=Newsletter&email=" + encodeURIComponent(email);

        try {
            const res = await fetch("https://app.loops.so/api/newsletter-form/cm2rflmgu01h51390iumvl8na", {
                method: "POST",
                body: formBody,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            if (res.ok) {
                setStatus("success");
                setMessage("¡Suscripción confirmada! Revisa tu email.");
                setEmail("");
            } else {
                const data = await res.json();
                setStatus("error");
                setMessage(data.message || "Error al suscribirse.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Algo salió mal. Por favor intenta de nuevo.");
        }
    };

    if (status === "success") {
        return (
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-500/30 text-green-100 p-4 rounded-sm animate-fade-in">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="font-bold">{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    disabled={status === "loading"}
                    className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 rounded-sm flex-1 outline-none focus:border-das-accent transition-colors disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-das-accent text-white font-bold px-6 py-3 rounded-sm hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>Suscribirse <ArrowRight className="w-4 h-4" /></>
                    )}
                </button>
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 text-red-300 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <p>{message}</p>
                </div>
            )}
        </form>
    );
}
