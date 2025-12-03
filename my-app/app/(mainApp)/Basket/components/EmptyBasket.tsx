import Link from 'next/link'
import React from 'react'
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi'

const EmptyBasket = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-gray-100 p-6 rounded-full mb-6">
                <FiShoppingBag size={60} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Votre panier est vide
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Découvrez nos produits et ajoutez-les à votre panier pour commencer vos
                achats.
            </p>
            <Link
                href="/Collections?page=1"
                className="flex items-center justify-center gap-2 bg-primaryColor hover:bg-amber-200 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
                <FiArrowLeft />
                Continuer mes achats
            </Link>
        </div>)
}

export default EmptyBasket