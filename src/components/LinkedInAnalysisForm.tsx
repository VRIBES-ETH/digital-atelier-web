"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle, Linkedin, Mail } from "lucide-react";

export default function LinkedInAnalysisForm() {
    const [email, setEmail] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/analisis-linkedin", {
                method: "POST",
                body: JSON.stringify({ email, linkedinUrl }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("¡Solicitud recibida! Pronto recibirás tu análisis en tu correo.");
                setEmail("");
                setLinkedinUrl("");
            } else {
                setStatus("error");
                setMessage(data.message || "Algo salió mal. Inténtalo de nuevo.");
            }
        } catch (error: any) {
            setStatus("error");
            setMessage("Error de conexión. Inténtalo más tarde.");
        }
    };

    if (status === "success") {
        return (
            <div className="w-full max-w-md bg-green-50/50 backdrop-blur-sm border border-green-100 p-6 rounded-lg flex flex-col items-center text-center gap-3 animate-fade-in shadow-sm">
                <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-poppins font-semibold text-lg text-green-800">¡Solicitud Enviada!</h3>
                <p className="text-green-700 text-sm">{message}</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-xs font-semibold uppercase tracking-wider text-green-800 hover:text-green-950 underline"
                >
                    Enviar otra solicitud
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
            <div className="space-y-1.5">
                <label htmlFor="linkedin" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Link de tu perfil de LinkedIn
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-das-accent transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </div>
                    <input
                        id="linkedin"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/in/tu-perfil/"
                        required
                        className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 text-das-dark text-sm rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-das-accent focus:ring-1 focus:ring-das-accent/20 transition-all placeholder:text-gray-400 shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                    Tu correo (para enviarte el informe)
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-das-accent transition-colors">
                        <Mail className="w-5 h-5" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@empresa.com"
                        required
                        className="w-full bg-white/80 backdrop-blur-sm border border-gray-200 text-das-dark text-sm rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:border-das-accent focus:ring-1 focus:ring-das-accent/20 transition-all placeholder:text-gray-400 shadow-sm"
                    />
                </div>
            </div>

            {status === "error" && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm border border-red-100 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{message}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full bg-das-dark text-white px-6 py-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-das-dark/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden mt-2"
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                    {status === "loading" ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <span>Recibir diagnóstico DAS®</span>
                            {/* Arrow icon intended */}
                        </>
                    )}
                </div>
                <div className="absolute insert-0 bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p className="text-[10px] text-center text-gray-400">
                Al solicitar el análisis, aceptas recibir comunicaciones de Digital Atelier Solutions.

            </p>
        </form>
    );
}
