"use client";

import { useState } from "react";
import IdeaModal from "@/components/IdeaModal";
import { Plus } from "lucide-react";

interface IdeaModalWrapperProps {
    variant?: "default" | "small";
}

export default function IdeaModalWrapper({ variant = "default" }: IdeaModalWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {variant === "default" ? (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-white text-gray-600 font-medium transition-colors"
                >
                    Añadir idea al Bucket
                </button>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium"
                >
                    <Plus size={14} />
                    Añadir Idea
                </button>
            )}

            <IdeaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
