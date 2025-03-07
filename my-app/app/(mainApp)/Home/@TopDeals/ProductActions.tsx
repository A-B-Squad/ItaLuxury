import QuickActionButton from "@/app/components/ProductBox/components/QuickActionButton";
import FavoriteProductButton from "@/app/components/ProductBox/FavoriteProductButton";
import { useProductComparisonStore } from "@/app/store/zustand";
import { useAuth } from "@/lib/auth/useAuth";
import { useCallback } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
import { motion } from "framer-motion";

interface ProductProps {
    product: any;
    onAddToBasket: (product: any, quantity: number) => void;
    isFavorite: boolean;
    openProductDetails: (product: any) => void;
    toast: any
}

const ProductActions = ({
    product,
    onAddToBasket,
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

    // Animation variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div 
            className="flex items-center space-x-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <QuickActionButton
                    icon={<FaRegEye className="text-sm" />}
                    onClick={() => openProductDetails(product)}
                    title="Aperçu rapide"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <QuickActionButton
                    icon={<IoGitCompare className="text-sm" />}
                    onClick={onAddToCompare}
                    title="Ajouter au comparatif"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                />
            </motion.div>
            
            <motion.div variants={itemVariants}>
                <FavoriteProductButton
                    isFavorite={isFavorite}
                    productId={product?.id}
                    userId={decodedToken?.userId}
                    productName={product?.name}
                    className="h-9 w-9 flex items-center justify-center rounded-full"
                />
            </motion.div>
        </motion.div>
    );
};

export default ProductActions;