"use client";
import { useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CREATE_CHECKOUT_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import { useProductsInBasketStore, useCheckoutStore } from "@/app/store/zustand";
import { sendPurchaseNotifications } from "@/utils/sendPurchaseNotifications";
import { usePayment } from "./usePayment";
import { trackPurchase } from "@/utils/facebookEvents";
import { useAuth } from "@/app/hooks/useAuth";

interface ExtraCheckoutProps {
    userEmail: string;
    userName: string;
    userPhone: string;
    deliveryPrice: number
    userCity?: string;
    isGuest: boolean;
    paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD";
    calculateTotal: () => number | string;
}
export const useCheckout = (
    setSubmitLoading?: (val: boolean) => void
) => {
    const { toast } = useToast();
    const router = useRouter();
    const { clearBasket } = useProductsInBasketStore();
    const { checkoutProducts } = useCheckoutStore();
    const { handleOnlinePayment } = usePayment();
    const { decodedToken, } = useAuth();

    const [createCheckoutMutation, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);

    const createCheckout = (checkoutInput: any, extra: ExtraCheckoutProps) => {
        createCheckoutMutation({
            variables: { input: checkoutInput },
            refetchQueries: [
                ...(decodedToken?.userId
                    ? [{ query: BASKET_QUERY, variables: { userId: decodedToken.userId } }]
                    : []
                )],


            onCompleted: async (data) => {
                const customOrderId = data.createCheckout.customId;
                const finalValue = Number(extra.calculateTotal());
                // Track purchase with complete product data
                if (checkoutProducts && checkoutProducts.length > 0 && customOrderId) {
                    // Map products to include ALL required fields for Facebook Catalog
                    const cartItems = checkoutProducts.map((product: any) => ({
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: Number(product.price),
                        quantity: product.actualQuantity || product.quantity || 1,
                        description: product.description,
                        Brand: product.Brand,
                        Colors: product.Colors,
                        categories: product.categories,
                        productDiscounts: product.productDiscounts,
                        inventory: product.inventory,
                        isVisible: product.isVisible,
                        reference: product.reference,
                        images: product.images,
                        technicalDetails: product.technicalDetails,
                    }));

                    // Prepare user data with proper name splitting
                    const user = extra.userName ? {
                        id: decodedToken?.userId,
                        email: extra.userEmail,
                        firstName: extra.userName?.split(' ')[0] || extra.userName,
                        lastName: extra.userName?.split(' ').slice(1).join(' ') || '',
                        phone: extra.userPhone,
                        country: "tn",
                        city: extra.userCity || "",
                    } : undefined;

                    // Calculate shipping based on your business rules
                    const shippingValue = finalValue >= 499 ? 0 : extra.deliveryPrice;

                    console.log('🎉 Tracking Purchase event:', {
                        order_id: customOrderId,
                        total_value: finalValue,
                        product_count: cartItems.length,
                        shipping_value: shippingValue,
                        user: user ? 'logged_in' : 'guest'
                    });

                    // Track the purchase
                    try {
                        await trackPurchase(
                            customOrderId,
                            cartItems,
                            finalValue,
                            user,
                            shippingValue,
                        );
                        console.log('✅ Purchase event tracked successfully');
                    } catch (error) {
                        console.error("❌ Error tracking purchase:", error);
                        // Don't block the checkout flow if tracking fails
                    }
                }

                // Clear basket after successful tracking
                clearBasket();

                // Handle payment method
                if (extra.paymentMethod === "CREDIT_CARD") {
                    await handleOnlinePayment({
                        orderId: customOrderId,
                        userName: extra.userName,
                        userPhone: extra.userPhone,
                        userEmail: extra.userEmail,
                        itemCount: checkoutProducts.length,
                        paymentMethod: extra.paymentMethod,
                        calculateTotal: extra.calculateTotal,
                    });
                } else {
                    setSubmitLoading?.(true);
                    await sendPurchaseNotifications(
                        customOrderId,
                        checkoutProducts.length,
                        extra.userName,
                        finalValue
                    );
                    router.replace(`/Checkout/EndCheckout?packageId=${customOrderId}`);
                }
            },
            onError: (error) => {
                console.error("Checkout Error:", error);
                toast({
                    title: "Error",
                    description: "An error occurred during checkout. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };
    return {
        createCheckout,
        loading: loading,
    };
};