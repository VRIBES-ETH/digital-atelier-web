"use client";

import { useState } from "react";
import IdeaModal from "@/components/IdeaModal";
import { Plus, Lightbulb } from "lucide-react";

interface Idea {
    id: string;
    content: string;
    internal_notes?: string;
    reference_link?: string;
    created_at: string;
}

interface IdeasWidgetProps {
    ideas: Idea[];
}

export default function IdeasWidget({ ideas }: IdeasWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

    const handleOpenCreate = () => {
        setSelectedIdea(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (idea: Idea) => {
        setSelectedIdea(idea);
        setIsModalOpen(true);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Próximos Temas</h3>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{ideas.length}</span>
            </div>

            {ideas.length > 0 ? (
                <ul className="space-y-3">
                    {ideas.map((idea) => (
                        <li key={idea.id}>
                            <button
                                onClick={() => handleOpenEdit(idea)}
                                className="block w-full text-left group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 p-1.5 bg-yellow-50 text-yellow-600 rounded-md group-hover:bg-yellow-100 transition-colors">
                                        <Lightbulb size={14} />
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors line-clamp-2">
                                        {idea.content}
                                    </span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-4">
                    <p className="text-xs text-gray-400 mb-3">No tienes ideas guardadas.</p>
                    <button
                        onClick={handleOpenCreate}
                        className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium mx-auto"
                    >
                        <Plus size={14} />
                        Añadir Idea
                    </button>
                </div>
            )}

            {ideas.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-center">
                    <button
                        onClick={handleOpenCreate}
                        className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                    >
                        <Plus size={14} />
                        Añadir Idea
                    </button>
                </div>
            )}

            <IdeaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ideaToEdit={selectedIdea}
            />
        </div>
    );
}
