import React, { memo } from "react";
import { FileText } from "lucide-react";

interface ProductAttrProps {
    technicalDetails: string;
}

const ProductAttrLaptop: React.FC<ProductAttrProps> = memo(({ technicalDetails }) => {
    // Check if there are any technical details to display
    const hasDetails = technicalDetails && technicalDetails.trim().length > 0;

    // If no details, don't render the component at all
    if (!hasDetails) {
        return null;
    }

    // Process technical details to improve formatting
    const processedDetails = technicalDetails
        .replace(/<p>/g, '<p class="mb-3 text-gray-700">')
        .replace(/<ul>/g, '<ul class="list-disc pl-5 mb-4 space-y-2">')
        .replace(/<li>/g, '<li class="text-gray-700">')
        .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">');

    return (
        <div className=" hidden lg:block container border-b  mx-auto">
            <div className="bg-white shadow-sm rounded-xl overflow-hidden  border-gray-100">
                {/* Header */}
                <div className="flex items-center">
                    <FileText size={18} className="text-primaryColor mr-2" />
                    <h2 className="text-xl font-semibold ">Détails du produit</h2>
                </div>

                {/* Content */}
                <div className="p-6 overflow-x-auto">
                    <div className="prose max-w-none">
                        <div
                            className="text-gray-700 text-md leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: processedDetails }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ProductAttrLaptop;