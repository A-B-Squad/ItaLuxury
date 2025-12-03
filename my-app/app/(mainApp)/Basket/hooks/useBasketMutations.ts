import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import {
    INCREASE_QUANTITY_MUTATION,
    DECREASE_QUANTITY_MUTATION,
    DELETE_PRODUCT_FROM_BASKET_BY_ID_MUTATION
} from "../../../../graphql/mutations"

export const useBasketMutations = (
    userId: string | undefined,
    setProducts: any,
    toggleIsUpdated: any,
    refetch: any,
    increaseProductInQtBasket: any,
    decreaseProductInQtBasket: any,
    removeProductFromBasket: any
) => {
    const { toast } = useToast();
    const [increaseQuantity] = useMutation(INCREASE_QUANTITY_MUTATION);
    const [decreaseQuantity] = useMutation(DECREASE_QUANTITY_MUTATION);
    const [deleteBasketById] = useMutation(DELETE_PRODUCT_FROM_BASKET_BY_ID_MUTATION);

    const handleIncreaseQuantity = useCallback(
        (productId: string, basketId?: string) => {
            const isAuthenticatedUser = userId && basketId;

            if (isAuthenticatedUser) {
                increaseQuantity({
                    variables: { basketId },
                    onCompleted: ({ increaseQuantity }) => {
                        setProducts((prev: any[]) =>
                            prev.map((p) =>
                                p.basketId === increaseQuantity.id
                                    ? { ...p, quantity: increaseQuantity.quantity }
                                    : p
                            )
                        );
                        toggleIsUpdated();
                    },
                    onError: (error) => {
                        if (error.message === "Not enough inventory") {
                            toast({
                                title: "Notification de Stock",
                                description: `Le produit est en rupture de stock.`,
                                className: "bg-red-500 text-white",
                            });
                        }
                    },
                });
                return;
            }

            increaseProductInQtBasket(productId, 1);
        },
        [userId, increaseQuantity, setProducts, toggleIsUpdated, toast, increaseProductInQtBasket]
    );

    const handleDecreaseQuantity = useCallback(
        (productId: string, basketId?: string) => {
            const isAuthenticatedUser = userId && basketId;

            if (isAuthenticatedUser) {
                decreaseQuantity({
                    variables: { basketId },
                    onCompleted: ({ decreaseQuantity }) => {
                        setProducts((prev: any[]) =>
                            prev.map((p) =>
                                p.basketId === decreaseQuantity.id
                                    ? { ...p, quantity: decreaseQuantity.quantity }
                                    : p
                            )
                        );
                        toggleIsUpdated();
                    },
                });
                return;
            }

            decreaseProductInQtBasket(productId);
        },
        [userId, decreaseQuantity, setProducts, toggleIsUpdated, decreaseProductInQtBasket]
    );

    const handleRemoveProduct = useCallback(
        async (productId: string, basketId?: string) => {
            const isAuthenticatedUser = userId && basketId;

            try {
                if (isAuthenticatedUser) {
                    setProducts((prev: any[]) =>
                        prev.filter((p) => p.basketId !== basketId)
                    );

                    await deleteBasketById({
                        variables: { basketId, productId },
                    });

                    refetch();
                    toggleIsUpdated();
                } else {
                    removeProductFromBasket(productId);
                    setProducts((prev: any[]) =>
                        prev.filter((p) => p.id !== productId)
                    );
                }

                toast({
                    title: "Produit supprimé",
                    description: "Le produit a été retiré de votre panier.",
                    className: "bg-green-500 text-white",
                });
            } catch (error) {
                console.error("❌ Failed to remove product:", error);
                toast({
                    title: "Erreur",
                    description: "Impossible de supprimer le produit. Veuillez réessayer.",
                    className: "bg-red-500 text-white",
                });
            }
        },
        [userId, setProducts, deleteBasketById, refetch, toggleIsUpdated, removeProductFromBasket, toast]
    );

    return {
        handleIncreaseQuantity,
        handleDecreaseQuantity,
        handleRemoveProduct
    };
};
