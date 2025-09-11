import QuickActionButton from "@/app/components/ProductBox/components/QuickActionButton";
import FavoriteProductButton from "@/app/components/ProductBox/FavoriteProductButton";
import { useProductComparisonStore } from "@/app/store/zustand";
import { useAuth } from "@/app/hooks/useAuth";
import React, { useCallback } from "react";
import { FaRegEye } from "react-icons/fa";
import { IoGitCompare } from "react-icons/io5";

interface ProductProps {
    product: any;
    isFavorite: boolean;
    openProductDetails: (product: any) => void;
    toast: any
}

const ProductActions = ({
    product,
    toast,
    isFavorite,
    openProductDetails
}: ProductProps) => {
    const { addToComparison, comparisonList } = useProductComparisonStore();
    const { decodedToken } = useAuth();

    const onAddToCompare = useCallback(() => {
        const isProductAlreadyInCompare = comparisonList.some(
            (p: any) => p.id === product.id
        );
        if (!isProductAlreadyInCompare) {
            addToComparison(product);
            toast({
                title: "Produit ajouté à la comparaison",
                description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
                className: "bg-primaryColor text-white",
            });
        } else {
            toast({
                title: "Produit déjà dans la comparaison",
                description: `Le produit "${product?.name}" est déjà dans votre liste de comparaison.`,
                className: "bg-amber-600 text-white",
            });
        }
    }, [product, comparisonList, addToComparison, toast]);

    return (
        <div className="flex items-center space-x-2 opacity-100 transform-none">
            <div className="transition-transform duration-200 hover:scale-105">
                <QuickActionButton
                    icon={<FaRegEye className="text-sm" />}
                    onClick={() => openProductDetails(product)}
                    title="Aperçu rapide"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                />
            </div>

            <div className="transition-transform duration-200 hover:scale-105">
                <QuickActionButton
                    icon={<IoGitCompare className="text-sm" />}
                    onClick={onAddToCompare}
                    title="Ajouter au comparatif"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                />
            </div>

            <div className="transition-transform duration-200 hover:scale-105">
                <FavoriteProductButton
                    isFavorite={isFavorite}
                    productId={product?.id}
                    productName={product?.name}
                    className="h-9 w-9 flex items-center justify-center rounded-full"
                />
            </div>
        </div>
    );
};


export default React.memo(ProductActions);
