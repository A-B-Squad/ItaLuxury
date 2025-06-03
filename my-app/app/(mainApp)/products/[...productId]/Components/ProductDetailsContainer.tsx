import React, { memo } from "react";
import RatingStars from "./RatingStars";
import ProductAttrLaptop from "./ProductAttrLaptop";

interface ProductDetailsContainerProps {
    productId: string;
    userId?: string;
    toast: any;
    technicalDetails: string;
}

const ProductDetailsContainer = memo(({
    productId,
    userId,
    toast,
    technicalDetails
}: ProductDetailsContainerProps) => {
    // Check if there are any technical details to display
    const hasDetails = technicalDetails && technicalDetails.trim().length > 0;

    return (
        <div className="w-full max-w-7xl bg-white mx-auto mt-10 space-y-6 border border-gray-200 rounded-lg shadow-sm px-4 py-6">
            {/* Technical Details Section */}
            {hasDetails && (
                <ProductAttrLaptop technicalDetails={technicalDetails} />
            )}

            {/* Ratings Section */}
            <RatingStars
                productId={productId}
                userId={userId}
                toast={toast}
            />
        </div>
    );
});

ProductDetailsContainer.displayName = "ProductDetailsContainer";

export default ProductDetailsContainer;