import React, { memo } from 'react';
import { IoDocumentTextOutline } from 'react-icons/io5';

interface ProductAttrProps {
    technicalDetails: string
}

const ProductAttrMobile: React.FC<ProductAttrProps> = memo(({ technicalDetails }) => {
    const hasDetails = technicalDetails && technicalDetails.trim().length > 0;

    if (!hasDetails) return null;

    return (
        <div className="my-6 block lg:hidden w-full">
            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="text-base font-medium text-primaryColor w-full py-3 px-4 bg-gray-50 flex items-center gap-2">
                    <IoDocumentTextOutline className="text-xl" />
                    <span>Spécifications Techniques</span>
                </div>
                <div className="bg-white px-4 py-3">
                    <div
                        className="prose max-w-none text-gray-800 text-md font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: technicalDetails }}
                    />
                </div>
            </div>
        </div>
    );
});

export default ProductAttrMobile;