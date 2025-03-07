import React, { memo, useState, useCallback } from "react";
import RatingStarsLaptop from "./RatingStarsLaptop";
import { useToast } from "@/components/ui/use-toast";

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
    productId: string;
    userId: string;
    toast: any;
}

const ProductAttrLaptop: React.FC<ProductAttrProps> = memo(({ attributes, productId, userId, toast }) => {
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

    const handleTabChange = useCallback((tab: 'details' | 'reviews') => {
        setActiveTab(tab);
    }, []);

    if (!attributes?.length) return null;

    return (
        <div className="hidden lg:block container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    <button
                        onClick={() => handleTabChange('details')}
                        className={`px-6 py-4 text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primaryColor
                            ${activeTab === 'details'
                                ? 'text-primaryColor border-b-2 border-primaryColor bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        aria-selected={activeTab === 'details'}
                        role="tab"
                    >
                        Détails du produit
                    </button>
                    <button
                        onClick={() => handleTabChange('reviews')}
                        className={`px-6 py-4 text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primaryColor
                            ${activeTab === 'reviews'
                                ? 'text-primaryColor border-b-2 border-primaryColor bg-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        aria-selected={activeTab === 'reviews'}
                        role="tab"
                    >
                        Avis clients
                    </button>
                </div>

                {/* Content */}
                <div className="p-6" role="tabpanel" aria-label={activeTab === 'details' ? 'Détails du produit' : 'Avis clients'}>
                    {activeTab === 'details' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-gray-800 border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Caractéristique
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Valeur
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {attributes.map((attribute, index) => (
                                        <tr
                                            key={`${attribute.name}-${index}`}
                                            className="hover:bg-gray-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                                {attribute.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {attribute.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="w-full">
                            <RatingStarsLaptop
                                productId={productId}
                                userId={userId}
                                toast={toast}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});


export default ProductAttrLaptop;