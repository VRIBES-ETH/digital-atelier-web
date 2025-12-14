import Image from "next/image";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { Link2, ThumbsUp, ArrowUpRight, Linkedin, Twitter, Facebook, Mail, Link as LinkIcon, X } from "lucide-react";

export const metadata = {
    title: "Newsletter | Blockcha-In® - Víctor Ribes",
    description: "Newsletter para ejecutivos blockchain y fintech que quieren dominar LinkedIn.",
};

export default function NewsletterPage() {
    return (
        <div className="min-h-screen bg-[#E5E5E5] py-12 px-4 sm:px-6 font-sans text-gray-800">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Main Profile Card */}
                <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="shrink-0 mx-auto sm:mx-0">
                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-gray-50 bg-gray-100">
                                <Image
                                    src="/images/victor-ribes.png"
                                    alt="Víctor Ribes"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center sm:text-left space-y-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                    Blockcha-In® | Marca Profesional en LinkedIn
                                </h1>
                                <p className="text-gray-500 mt-1 font-medium">
                                    Víctor Ribes – Ghostwriter
                                </p>
                            </div>

                            <p className="text-gray-600 leading-relaxed max-w-2xl">
                                Newsletter para ejecutivos blockchain y fintech que quieren dominar LinkedIn como canal de influencia y negocio. Tu perfil como activo estratégico de oportunidades.
                            </p>

                            <div className="pt-2">
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs / Navigation */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-100">
                        <button className="flex items-center gap-2 px-6 py-4 text-gray-900 border-b-2 border-blue-600 font-medium text-sm sm:text-base">
                            <Link2 className="w-5 h-5" />
                            Links
                        </button>

                    </div>
                </div>

                {/* Links Section */}
                <div className="grid gap-4">
                    {/* Ghostwriting Service Link */}
                    <Link
                        href="https://www.blockcha-in.com"
                        target="_blank"
                        className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4"
                    >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 group-hover:opacity-90 transition-opacity">
                            <Image
                                src="/images/blockcha-in-icon.jpg"
                                alt="Blockcha-in Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">Servicios de Ghostwriting</h3>
                            <p className="text-sm text-gray-500 truncate">https://www.blockcha-in.com</p>
                        </div>
                    </Link>

                    {/* LinkedIn Link */}
                    <Link
                        href="https://www.linkedin.com/in/victorribes/"
                        target="_blank"
                        className="group bg-white rounded-xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-300 transition-colors">
                            <Linkedin className="w-6 h-6 text-gray-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">LinkedIn</h3>
                            <p className="text-sm text-gray-500 truncate">https://www.linkedin.com/in/victorribes/</p>
                        </div>
                    </Link>
                </div>

                {/* Footer */}
                <div className="flex flex-col items-center gap-4 pt-8 pb-12 text-center text-sm text-gray-500">
                    <p>© 2025 Digital Atelier Solutions. All rights reserved.</p>
                </div>

            </div>
        </div>
    );
}
