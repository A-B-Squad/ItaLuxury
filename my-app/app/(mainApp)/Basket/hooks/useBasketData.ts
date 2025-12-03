import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { BASKET_QUERY } from '../../../../graphql/queries';


export const useBasketData = (userId: string | undefined, isAuthenticated: boolean, storedProducts: any[]) => {
    const [products, setProducts] = useState<any[]>([]);
    const { toast } = useToast();

    const { refetch } = useQuery(BASKET_QUERY, {
        variables: { userId },
        skip: !isAuthenticated,
        fetchPolicy: "cache-and-network",
        onCompleted: (data) => {
            const fetchedProducts = data.basketByUserId?.map((basket: any) => ({
                ...basket.Product,
                quantity: basket.quantity,
                basketId: basket.id,
            }));
            setProducts(fetchedProducts);
        },
        onError: (error) => {
            console.error("Error fetching basket:", error);
            toast({
                title: "Erreur",
                description: "Impossible de charger le panier. Veuillez réessayer.",
                className: "bg-red-500 text-white",
            });
        },
    });

    useEffect(() => {
        if (!isAuthenticated) {
            setProducts(storedProducts);
        }
    }, [storedProducts, isAuthenticated]);

    return { products, setProducts, refetch };
};
