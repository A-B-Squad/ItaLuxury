import QuickActionButton from "@/app/components/ProductBox/components/QuickActionButton";
import FavoriteProductButton from "@/app/components/ProductBox/FavoriteProductButton";
import { useComparedProductsStore } from "@/app/store/zustand";
import { JwtPayload } from "jsonwebtoken";
import { useCallback } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaBasketShopping } from "react-icons/fa6";
import { IoGitCompare } from "react-icons/io5";
interface DecodedToken extends JwtPayload {
    userId: string;
}
interface ProductProps {
    product: any;
    onAddToBasket: (product: any, quantity: number) => void;
    decodedToken: DecodedToken | null;
    isFavorite: boolean;
    setIsFavorite: (value: boolean) => void;
    openProductDetails: (product: any) => void;
    toast: any
}
{/* Quick action buttons */ }

const ProductActions = ({
    product,
    onAddToBasket,
    decodedToken, toast,
    isFavorite,
    setIsFavorite,
    openProductDetails
}: ProductProps) => {

    const { addProductToCompare, productsInCompare } = useComparedProductsStore(
        (state) => ({
            addProductToCompare: state.addProductToCompare,
            productsInCompare: state.products,
        })
    );

    const onAddToCompare = useCallback(() => {
        const isProductAlreadyInCompare = productsInCompare.some(
            (p: any) => p.id === product.id
        );
        if (!isProductAlreadyInCompare) {
            addProductToCompare(product);
        } else {
            toast({
                title: "Produit ajouté à la comparaison",
                description: `Le produit "${product?.name}" a été ajouté à la comparaison.`,
                className: "bg-primaryColor text-white",
            });
        }
    }, [product, productsInCompare, addProductToCompare]);

    return (
        <ul className="plus_button lg:opacity-0 group-hover:opacity-100 absolute right-3 z-40 top-14 flex flex-col gap-3">

            <QuickActionButton
                icon={<FaRegEye color="white" className="text-xs md:text-base" />}
                onClick={() => openProductDetails(product)}
                title="aperçu rapide"
            />
            <QuickActionButton
                icon={<FaBasketShopping color="white" className="text-xs md:text-base" />}
                onClick={() => {
                    onAddToBasket(product, 1);
                }} title="Ajouter au panier"
                disabled={product.inventory <= 0}
                isAddToCart={true}
            />
            <QuickActionButton
                icon={<IoGitCompare color="white" className="text-xs md:text-base" />}
                onClick={onAddToCompare}
                title="Ajouter au comparatif"
            />
            <FavoriteProductButton
                isFavorite={isFavorite}
                setIsFavorite={setIsFavorite}
                productId={product?.id}
                userId={decodedToken?.userId}
                productName={product?.name}
            />
        </ul>


    )
};

export default ProductActions