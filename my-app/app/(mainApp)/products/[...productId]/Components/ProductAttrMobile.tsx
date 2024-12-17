import React from 'react';

interface Attribute {
    name: string;
    value: string;
}

interface ProductAttrProps {
    attributes: Attribute[];
}

const ProductAttrMobile: React.FC<ProductAttrProps> = ({ attributes }) => {
    return (
        attributes?.length > 0 && (
            <div className="my-8 block lg:hidden w-full  bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <h3 className="text-lg font-semibold text-white w-full p-4 bg-gradient-to-r from-primaryColor to-secondaryColor rounded-t-lg">
                    Information de produit
                </h3>

                {/* Mobile View (Card Style) */}
                <div className="">
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


            </div>
        )
    );
};

export default ProductAttrMobile;
