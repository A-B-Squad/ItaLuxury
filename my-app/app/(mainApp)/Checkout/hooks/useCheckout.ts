"use client";
import { useMutation } from "@apollo/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { CREATE_CHECKOUT_MUTATION } from "@/graphql/mutations";
import { BASKET_QUERY } from "@/graphql/queries";
import { useProductsInBasketStore, useCheckoutStore } from "@/app/store/zustand";
import { sendGTMEvent } from "@next/third-parties/google";
import triggerEvents from "@/utlils/events/trackEvents";
import { sendPurchaseNotifications } from "@/utlils/sendPurchaseNotifications";
import { usePayment } from "./usePayment";

interface ExtraCheckoutProps {
    userEmail: string;
    userName: string;
    userPhone: string;
    isGuest: boolean;
    paymentMethod: "CASH_ON_DELIVERY" | "CREDIT_CARD";
    calculateTotal: () => number | string;
}
export const useCheckout = (
    decodedToken?: any,
    setSubmitLoading?: (val: boolean) => void
) => {
    const { toast } = useToast();
    const router = useRouter();
    const { clearBasket } = useProductsInBasketStore();
    const { checkoutProducts } = useCheckoutStore();
    const { handleOnlinePayment, paymentLoading } = usePayment();

    const [createCheckoutMutation, { loading }] = useMutation(CREATE_CHECKOUT_MUTATION);

    const createCheckout = (checkoutInput: any, extra: ExtraCheckoutProps) => {
        createCheckoutMutation({
            variables: { input: checkoutInput },
            refetchQueries: [
                {
                    query: BASKET_QUERY,
                    variables: { userId: decodedToken?.userId },
                },
            ],
            onCompleted: async (data) => {
                const customOrderId = data.createCheckout.customId;
                clearBasket();

                const finalValue = Number(extra.calculateTotal());
                const totalItems = checkoutProducts.reduce(
                    (sum, product) => sum + (product?.actualQuantity || product?.quantity || 0),
                    0
                );

                // items tracking
                const itemsWithPrices = checkoutProducts.map((product) => ({
                    item_name: product.name,
                    item_category: product.categories?.[0]?.name || "",
                    id: product.id,
                    quantity: product.actualQuantity || product.quantity,
                    price:
                        product.productDiscounts?.length > 0
                            ? Number(product.productDiscounts[0].newPrice)
                            : Number(product.price),
                }));

                const facebookContents = checkoutProducts.map((product) => ({
                    id: product.id,
                    quantity: product.actualQuantity || product.quantity,
                    item_price:
                        product.productDiscounts?.length > 0
                            ? Number(product.productDiscounts[0].newPrice)
                            : Number(product.price),
                }));

                // 🔹 GTM
                sendGTMEvent({
                    event: "purchase",
                    ecommerce: {
                        currency: "TND",
                        value: finalValue,
                        items: itemsWithPrices,
                        transaction_id: customOrderId,
                    },
                    user_data: {
                        em: [extra.userEmail?.toLowerCase()],
                        fn: [extra.userName],
                        ph: [extra.userPhone],
                        country: ["tn"],
                        ct: checkoutInput.governorateId,
                        external_id: decodedToken?.userId,
                    },
                    facebook_data: {
                        currency: "TND",
                        value: finalValue,
                        content_type: "product_group",
                        contents: facebookContents,
                        content_name: "Purchase",
                        num_items: totalItems,
                        content_category: "Checkout",
                        delivery_category: checkoutInput.freeDelivery
                            ? "free_shipping"
                            : "shipping",
                        payment_method:
                            extra.paymentMethod === "CREDIT_CARD"
                                ? "credit_card"
                                : "cash_on_delivery",
                        transaction_id: customOrderId,
                    },
                });

                // 🔹 Custom tracker
                triggerEvents("Purchase", {
                    user_data: {
                        em: [extra.userEmail?.toLowerCase()],
                        fn: [extra.userName],
                        ph: [extra.userPhone],
                        country: ["tn"],
                        ct: checkoutInput.governorateId,
                        external_id: decodedToken?.userId,
                    },
                    custom_data: {
                        currency: "TND",
                        value: finalValue,
                        content_type: "product_group",
                        contents: facebookContents,
                        content_name: "Purchase",
                        content_ids: checkoutProducts.map((product) => product.id),
                        num_items: totalItems,
                        content_category: "Checkout",
                        delivery_category: checkoutInput.freeDelivery
                            ? "free_shipping"
                            : "shipping",
                        payment_method:
                            extra.paymentMethod === "CREDIT_CARD"
                                ? "credit_card"
                                : "cash_on_delivery",
                        transaction_id: customOrderId,
                    },
                });

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
                    description:
                        "An error occurred during checkout. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    return {
        createCheckout,
        loading: loading || paymentLoading,
    };
};
