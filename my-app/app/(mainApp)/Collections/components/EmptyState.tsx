
import React, { useCallback } from 'react'
import { useRouter } from "next/navigation";

import { FaRegTrashAlt } from 'react-icons/fa'

const EmptyState = () => {
    const router = useRouter();

    const handleClearFilters = useCallback(() => {
        router.push("/Collections/tunisie?page=1");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L7 0v10l2-1zm6 0l2-1v10l-2-1z"
                    />
                </svg>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
            </h3>

            <p className="text-gray-500 text-center mb-8 max-w-md">
                Nous n'avons trouvé aucun produit correspondant à vos critères de recherche.
                Essayez d'ajuster vos filtres.
            </p>

            <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white rounded-lg hover:bg-secondaryColor transition-colors font-medium"
            >
                <FaRegTrashAlt className="w-4 h-4" />
                Réinitialiser les filtres
            </button>
        </div>)
}

export default EmptyState