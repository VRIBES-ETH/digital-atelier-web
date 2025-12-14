"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate limit check
        const time = new Date();
        const timestamp = time.valueOf();
        const previousTimestamp = localStorage.getItem("newsletter-form-timestamp");

        if (previousTimestamp && Number(previousTimestamp) + 60000 > timestamp) {
            setStatus("error");
            setMessage("Demasiados intentos. Por favor, espera un momento.");
            return;
        }
        localStorage.setItem("newsletter-form-timestamp", timestamp.toString());

        setStatus("loading");

        // userGroup tag for segmentation in Loops
        const formBody = "userGroup=LinkedIn%20Newsletter&mailingLists=&email=" + encodeURIComponent(email);

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
                setMessage("¡Suscripción confirmada!");
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
            localStorage.setItem("newsletter-form-timestamp", '');
        }
    };

    if (status === "success") {
        return (
            <div className="w-full flex items-center justify-center gap-2 text-green-700 bg-green-50 p-4 rounded-lg font-medium animate-fade-in border border-green-100">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p>{message}</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="flex-1 bg-white border border-gray-200 text-gray-900 text-base rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-gray-300"
                />
                <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] shadow-sm active:scale-[0.98]"
                >
                    {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        "Subscribe"
                    )}
                </button>
            </div>
            {status === "error" && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm animate-fade-in px-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p>{message}</p>
                </div>
            )}
        </form>
    );
}
