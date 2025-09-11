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
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                {/* Header */}
                <div className="text-lg font-semibold text-slate-800 w-full py-4 px-5 bg-slate-50/80 flex items-center gap-3 border-b border-gray-100">
                    <IoDocumentTextOutline className="text-xl text-slate-600" />
                    <span>Spécifications Techniques</span>
                </div>

                {/* Content area  */}
                <div className="bg-white px-5 py-6">
                    <div
                        className="prose max-w-none text-slate-700 text-base leading-relaxed tracking-wide"
                        style={{
                            lineHeight: '1.7',
                            fontSize: '16px',
                            fontWeight: '400',
                        }}
                        dangerouslySetInnerHTML={{ __html: technicalDetails }}
                    />
                </div>
            </div>
        </div>
    );
});


export default ProductAttrMobile;