"use client";

import Link from "next/link";

interface Color {
    id: string;
    color: string;
    Hex: string;
}

interface Product {
    id: string;
    name: string;
    Colors: Color | null; // Single Color object
}

interface ColorVariantsProps {
    currentProductId: string;
    groupProductVariant?: {
        id: string;
        groupProductName: string;
        Products: Product[];
    };
    currentColors: Color | null; // Single Color object
}

const ColorVariants = ({
    currentProductId,
    groupProductVariant,
    currentColors,
}: ColorVariantsProps) => {
    // Build color variants list
    let colorVariants: {
        productId: string;
        productName: string;
        color: Color | null;
        isCurrentProduct: boolean;
    }[] = [];

    if (groupProductVariant && groupProductVariant.Products.length > 1) {
        colorVariants = groupProductVariant.Products.map((product) => ({
            productId: product.id,
            productName: product.name,
            color: product.Colors,
            isCurrentProduct: product.id === currentProductId,
        }));
    }

    // If not enough color variants, don't render
    if (!colorVariants || colorVariants.length <= 1) {
        return null;
    }

    return (
        <div className="color-variants mt-4 border-t border-gray-200 pt-4">
            <h3 className="text-base font-semibold text-gray-700 mb-3 tracking-wide">
                Couleurs disponibles
            </h3>

            <div className="flex flex-wrap gap-2">
                {colorVariants.map((variant) =>
                    variant.isCurrentProduct ? (
                        <button
                            key={variant.productId}
                            disabled
                            className="relative w-10 h-10 rounded-full border-2 border-blue-500 ring-2 ring-blue-200 cursor-default transition-all duration-200"
                            style={{ backgroundColor: variant.color?.Hex || "#ccc" }}
                            title={`${variant.color?.color || "Inconnue"} (Sélectionné)`}
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full border border-blue-500"></div>
                            </div>
                            <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
                        </button>
                    ) : (
                        // Other products
                        <Link
                            key={variant.productId}
                            href={`/products/tunisie?productId=${variant.productId}`}
                            className="relative w-10 h-10 rounded-full border-2 border-gray-300 hover:border-gray-400 cursor-pointer hover:scale-105 transition-all duration-200 block"
                            style={{ backgroundColor: variant.color?.Hex || "#ccc" }}
                            title={variant.color?.color || "Inconnue"}
                        >
                            <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none"></div>
                        </Link>
                    )
                )}
            </div>

            {/* Show current color name */}
            {currentColors && (
                <p className="text-sm text-gray-600 mt-2">
                    Couleur actuelle:{" "}
                    <span className="font-medium">{currentColors.color}</span>
                </p>
            )}
        </div>
    );
};

export default ColorVariants;
