"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function LoopsForm() {
    const [email, setEmail] = useState("");
    const [botField, setBotField] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Honeypot check
        if (botField !== "") {
            setStatus("success");
            setMessage("¡Gracias por suscribirte! Solo contenido de valor, cero spam.");
            setEmail("");
            return;
        }

        // Rate limit check
        const time = new Date();
        const timestamp = time.valueOf();
        const previousTimestamp = localStorage.getItem("loops-form-timestamp");

        if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
            setStatus("error");
            setMessage("Demasiados intentos. Por favor, espera un momento.");
            return;
        }
        localStorage.setItem("loops-form-timestamp", timestamp.toString());

        setStatus("loading");

        const formBody = "userGroup=Web%20DAS%20&mailingLists=&email=" + encodeURIComponent(email);

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
                setMessage("¡Gracias por suscribirte! Solo contenido de valor, cero spam.");
                setEmail("");
            } else {
                const data = await res.json();
                setStatus("error");
                setMessage(data.message || res.statusText);
            }
        } catch (error: any) {
            setStatus("error");
            if (error.message === "Failed to fetch") {
                setMessage("Demasiados intentos. Por favor, espera un momento.");
            } else {
                setMessage(error.message || "Algo salió mal. Inténtalo de nuevo.");
            }
            localStorage.setItem("loops-form-timestamp", '');
        }
    };

    const resetForm = () => {
        setStatus("idle");
        setMessage("");
    };

    if (status === "success") {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-sm text-sm border border-green-100 animate-fade-in">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p>{message}</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col gap-2 animate-fade-in">
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-sm text-sm border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{message}</p>
                </div>
                <button
                    onClick={resetForm}
                    className="text-xs text-gray-400 hover:text-das-dark underline self-start"
                >
                    &larr; Volver
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex gap-2">
                {/* Honeypot field - hidden from humans */}
                <input
                    type="text"
                    name="b_c_312"
                    tabIndex={-1}
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    style={{ position: 'absolute', opacity: 0, zIndex: -1, width: 0, height: 0 }}
                    autoComplete="off"
                    aria-hidden="true"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="flex-1 bg-gray-50 border border-gray-200 text-das-dark text-sm rounded-sm px-4 py-3 focus:outline-none focus:border-das-dark transition-colors placeholder:text-gray-400"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-das-dark text-white px-6 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        "Suscríbete"
                    )}
                </button>
            </div>
        </form>
    );
}
