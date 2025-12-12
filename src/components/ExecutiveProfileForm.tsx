"use client";

import { useState } from "react";
import { Save, Plus, Trash2, Linkedin, Globe, MessageSquare, User } from "lucide-react";
import { updateProfile } from "@/app/_dashboard/actions";

interface ProfileData {
    headline: string;
    key_experience: string;
    main_language: string;
    tone_of_voice: string;
    content_pillars: { title: string; description: string }[];
}

export default function ExecutiveProfileForm({ profile, linkedinProfile }: { profile: any, linkedinProfile: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        headline: profile?.headline || "",
        key_experience: profile?.key_experience || "",
        main_language: profile?.main_language || "Español (Neutro)",
        tone_of_voice: profile?.tone_of_voice || "Autoritario & Directo",
        content_pillars: Array.isArray(profile?.content_pillars) ? profile.content_pillars : []
    });

    const handlePillarChange = (index: number, field: 'title' | 'description', value: string) => {
        const newPillars = [...formData.content_pillars];
        newPillars[index] = { ...newPillars[index], [field]: value };
        setFormData({ ...formData, content_pillars: newPillars });
    };

    const addPillar = () => {
        setFormData({
            ...formData,
            content_pillars: [...formData.content_pillars, { title: "", description: "" }]
        });
    };

    const removePillar = (index: number) => {
        const newPillars = formData.content_pillars.filter((_, i) => i !== index);
        setFormData({ ...formData, content_pillars: newPillars });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append("headline", formData.headline);
        data.append("keyExperience", formData.key_experience);
        data.append("mainLanguage", formData.main_language);
        data.append("toneOfVoice", formData.tone_of_voice);
        data.append("contentPillars", JSON.stringify(formData.content_pillars));

        const res = await updateProfile(data);
        setIsLoading(false);

        if (res.success) {
            alert(res.message);
        } else {
            alert("Error: " + res.message);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Identity & Settings */}
            <div className="lg:col-span-4 space-y-6">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        {linkedinProfile?.picture ? (
                            <img src={linkedinProfile.picture} alt={linkedinProfile.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-50" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-50">
                                <User className="w-12 h-12 text-gray-300" />
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm">
                            <Linkedin className="w-5 h-5 text-[#0077b5]" />
                        </div>
                    </div>

                    <h2 className="font-poppins font-bold text-xl text-das-dark">{linkedinProfile?.name || "Usuario"}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">CEO & FOUNDER</p>

                    <div className="flex gap-2 mt-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded-sm border border-blue-100">LinkedIn</span>
                        <span className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wide rounded-sm border border-gray-200">Twitter/X</span>
                    </div>
                </div>

                {/* Language & Tone */}
                <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                        <Globe className="w-4 h-4 text-das-accent" />
                        <h3 className="font-bold text-sm uppercase tracking-wider text-das-dark">Idioma & Tono</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Idioma Principal</label>
                            <select
                                value={formData.main_language}
                                onChange={(e) => setFormData({ ...formData, main_language: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-sm text-sm focus:border-das-dark outline-none bg-white"
                            >
                                <option>Español (Neutro)</option>
                                <option>Español (España)</option>
                                <option>Inglés (US)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tono de Voz</label>
                            <select
                                value={formData.tone_of_voice}
                                onChange={(e) => setFormData({ ...formData, tone_of_voice: e.target.value })}
                                className="w-full p-2 border border-gray-200 rounded-sm text-sm focus:border-das-dark outline-none bg-white"
                            >
                                <option>Autoritario & Directo</option>
                                <option>Inspirador & Visionario</option>
                                <option>Educativo & Técnico</option>
                                <option>Cercano & Personal</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Bio & Pillars */}
            <div className="lg:col-span-8 space-y-6">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="font-poppins font-bold text-2xl text-das-dark">Perfil Ejecutivo</h1>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-das-dark text-white px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
                        >
                            {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar Cambios
                        </button>
                    </div>

                    <p className="text-gray-500 text-sm mb-8">Esta información alimenta el contexto de tu Ghostwriter.</p>

                    {/* Bio Professional */}
                    <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm mb-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                            <User className="w-4 h-4 text-das-accent" />
                            <h3 className="font-bold text-sm uppercase tracking-wider text-das-dark">Bio Profesional</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Headline (LinkedIn)</label>
                                <input
                                    type="text"
                                    value={formData.headline}
                                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="Ej: Building the future of Web3..."
                                    className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-das-dark outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Experiencia Clave</label>
                                <textarea
                                    value={formData.key_experience}
                                    onChange={(e) => setFormData({ ...formData, key_experience: e.target.value })}
                                    placeholder="Describe tu experiencia más relevante..."
                                    className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-das-dark outline-none transition-colors min-h-[120px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Pillars */}
                    <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-das-accent" />
                                <h3 className="font-bold text-sm uppercase tracking-wider text-das-dark">Pilares de Contenido</h3>
                            </div>
                            <button
                                type="button"
                                onClick={addPillar}
                                className="text-xs font-bold text-das-accent uppercase hover:text-orange-600 flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" /> Añadir Pilar
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {formData.content_pillars.map((pillar, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-sm hover:border-gray-300 transition-colors group relative bg-gray-50/30">
                                    <button
                                        type="button"
                                        onClick={() => removePillar(index)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>

                                    <div className="mb-3">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pilar {index + 1}</label>
                                        <input
                                            type="text"
                                            value={pillar.title}
                                            onChange={(e) => handlePillarChange(index, 'title', e.target.value)}
                                            placeholder="Título del pilar"
                                            className="w-full bg-transparent border-b border-gray-200 focus:border-das-dark outline-none text-sm font-bold text-gray-800 pb-1"
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            value={pillar.description}
                                            onChange={(e) => handlePillarChange(index, 'description', e.target.value)}
                                            placeholder="Descripción breve..."
                                            className="w-full bg-transparent border-none outline-none text-xs text-gray-600 resize-none h-16"
                                        />
                                    </div>
                                </div>
                            ))}

                            {formData.content_pillars.length === 0 && (
                                <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-100 rounded-sm">
                                    <p className="text-sm text-gray-400">No has definido pilares de contenido aún.</p>
                                    <button
                                        type="button"
                                        onClick={addPillar}
                                        className="mt-2 text-xs font-bold text-das-accent uppercase hover:underline"
                                    >
                                        Crear el primero
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
