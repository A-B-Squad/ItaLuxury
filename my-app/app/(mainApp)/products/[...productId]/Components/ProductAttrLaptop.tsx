import React, { memo, useState } from "react";

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttrLaptop: React.FC<ProductAttrProps> = memo(({ attributes }) => {
    if (!attributes?.length) return null;

    return (
        <div className="hidden lg:block container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-100">
                    <button
                        className={`px-6 py-4 text-sm font-medium text-black border-b-2 border-black
                  `}
                    >
                        Détails du produit
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div>
                        <table className="w-full text-gray-800">
                            <tbody>
                                {attributes.map((attribute, index) => (
                                    <tr
                                        key={index}
                                        className={`
                                                border-b border-gray-100 
                                                hover:bg-blue-50 
                                                transition-colors duration-300
                                                ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                            `}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 w-1/3 uppercase tracking-wider">
                                            {attribute.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-normal w-2/3">
                                            {attribute.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductAttrLaptop;
