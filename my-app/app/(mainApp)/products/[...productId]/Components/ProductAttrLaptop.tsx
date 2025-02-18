import React, { memo, useState } from "react";
import RatingStarsLaptop from "./RatingStarsLaptop";

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

    if (!attributes?.length) return null;

    return (
        <div className="hidden lg:block container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-100">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-6 py-4 text-sm font-medium transition-colors duration-300
                            ${activeTab === 'details'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Détails du produit
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-4 text-sm font-medium transition-colors duration-300
                            ${activeTab === 'reviews'
                                ? 'text-black border-b-2 border-black'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Avis clients
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === 'details' ? (
                        <div>
                        <table className="w-full text-gray-800 border-collapse border border-gray-300">
                            <tbody>
                                {attributes.map((attribute, index) => (
                                    <tr
                                        key={index}
                                        className={`
                                        hover:bg-blue-50
                                        transition-colors duration-300
                                        ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                    `}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 border border-gray-300">
                                            {attribute.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 border border-gray-300">
                                            {attribute.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    ) : (
                        <div className="w-full ">
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