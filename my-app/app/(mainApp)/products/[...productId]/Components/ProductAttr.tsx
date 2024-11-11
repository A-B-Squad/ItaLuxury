import React from 'react';

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttr: React.FC<ProductAttrProps> = ({ attributes }) => {
    return (
        attributes && (
            <div className="my-8  lg:my-12 lg:mx-auto w-full lg:w-10/12 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <h3 className="text-lg font-semibold text-white w-full p-4 bg-gradient-to-r from-primaryColor to-secondaryColor rounded-t-lg">
                    Information de produit
                </h3>

                {/* Mobile View (Card Style) */}
                <div className="block lg:hidden">
                    <div className="px-4 py-5 space-y-4">
                        {attributes.map((attribute, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-md shadow-sm bg-gray-50"
                            >
                                <span className="block text-xs font-semibold text-gray-600 tracking-wide">
                                    {attribute?.name.toUpperCase()}
                                </span>
                                <span className="block mt-1 text-sm text-gray-900 font-medium break-words">
                                    {attribute?.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop View (Table Style) */}
                <div className="hidden lg:block">
                    <table className="w-full text-gray-800">
                        <tbody>
                            {attributes.map((attribute, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                                >
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-700 w-1/3">
                                        {attribute.name.toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 font-medium break-words w-2/3">
                                        {attribute.value}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    );
};

export default ProductAttr;
