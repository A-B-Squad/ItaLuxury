import { useEffect, useCallback } from "react";
import { trackViewCart, trackRemoveFromCart } from "@/utils/facebookEvents";

export const useBasketTracking = (products: any[], totalPrice: number, userData: any) => {
    // Track ViewCart on page load
    useEffect(() => {
        if (!products || products.length === 0) return;

        const cartItems = products.map((product) => {
            const productPrice = product.productDiscounts?.length > 0
                ? product.productDiscounts[0].newPrice
                : product.price;

            const quantity = product.quantity || product.actualQuantity || 0;

            return {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: Number(productPrice),
                quantity: quantity,
                isVisible: product.isVisible === undefined ? true : product.isVisible,
                reference: product.reference ?? product.id,
                description: product.description ?? product.name,
                inventory: product.inventory ?? 0,
                images: product.images ?? [],
                categories: product.categories ?? [],
                productDiscounts: product.productDiscounts ?? [],
                Brand: product.Brand ?? { name: 'ita-luxury' },
                Colors: product.Colors ?? null,
                technicalDetails: product.technicalDetails,
                reviews: product.reviews ?? [],
                GroupProductVariant: product.GroupProductVariant,
                solde: product.solde,
            };
        });

        const user = userData ? {
            id: userData.id,
            email: userData.email,
            phone: userData.number,
            firstName: userData.fullName?.split(' ')[0] || userData.fullName,
            lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
            city: userData.city || "",
            country: "tn",
        } : undefined;

        trackViewCart(cartItems, Number(totalPrice), user)
            .then(() => console.log("✅ ViewCart tracked successfully"))
            .catch(error => console.error("❌ Error tracking ViewCart:", error));

    }, [products, totalPrice, userData]);

    const trackProductRemoval = useCallback(async (product: any) => {
        const productToTrack = {
            id: product.id,
            name: product.name,
            slug: product.slug ?? `product-${product.id}`,
            price: Number(product.price) || 0,
            quantity: product.quantity || product.actualQuantity || 1,
            description: product.description ?? product.name,
            Brand: product.Brand ?? { name: 'ita-luxury' },
            Colors: product.Colors ?? null,
            categories: product.categories ?? [],
            productDiscounts: product.productDiscounts ?? [],
            inventory: product.inventory ?? 0,
            isVisible: product.isVisible === undefined ? true : product.isVisible,
            reference: product.reference ?? product.id,
            images: product.images ?? [],
        };

        const user = userData ? {
            id: userData.id,
            email: userData.email,
            phone: userData.number,
            firstName: userData.fullName?.split(' ')[0] || userData.fullName,
            lastName: userData.fullName?.split(' ').slice(1).join(' ') || '',
            city: userData.city || "",
            country: "tn",
        } : undefined;

        try {
            await trackRemoveFromCart(productToTrack, user);
            console.log("✅ RemoveFromCart tracked successfully");
        } catch (error) {
            console.error("❌ Error tracking RemoveFromCart:", error);
        }
    }, [userData]);

    return { trackProductRemoval };
};