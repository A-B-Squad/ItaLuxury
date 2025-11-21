import { useToast } from "@/components/ui/use-toast";

export const usePayment = () => {
    const { toast } = useToast();

    const handleOnlinePayment = async ({
        orderId,
        userName,
        userPhone,
        userEmail,
        itemCount,
        paymentMethod,
        calculateTotal,
    }: {
        orderId: string;
        userName: string;
        userPhone: string;
        userEmail: string;
        itemCount: number;
        paymentMethod: string;
        calculateTotal: () => number | string;

    }) => {
        if (paymentMethod === "CREDIT_CARD") {
            const orderTotal = Math.round(Number(calculateTotal()) * 1000);

            try {
                const response = await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: "TND",
                        amount: orderTotal,
                        type: "immediate",
                        description: "Online payment for order",
                        acceptedPaymentMethods: ["wallet", "bank_card", "e-DINAR"],
                        lifespan: 10,
                        checkoutForm: false,
                        addPaymentFeesToAmount: true,
                        firstName: userName.split(" ")[0] || "",
                        lastName: userName.split(" ")[1] || "",
                        phoneNumber: userPhone,
                        email: userEmail,
                        orderId: `${orderId}`,
                        webhook: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/api/webhook/payment?orderId=${orderId}&userName=${encodeURIComponent(
                            userName
                        )}&itemCount=${itemCount}&orderTotal=${orderTotal}&status=PAYED_NOT_DELIVERED`,
                        silentWebhook: true,
                        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Checkout/EndCheckout?packageId=${orderId}&status=PAYED_NOT_DELIVERED`,
                        failUrl: `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Checkout/EndCheckout?packageId=${orderId}&status=PAYMENT_REFUSED`,
                        theme: "light",
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Payment initialization error:", errorData);
                    toast({
                        title: "Error",
                        description: `Payment initialization failed: ${errorData.message || "Unknown error"
                            }`,
                        variant: "destructive",
                    });
                    return;
                }

                const data = await response.json();
                if (data.payUrl) {
                    window.location.href = data.payUrl;
                } else {
                    throw new Error("No payment URL received");
                }
            } catch (error) {
                console.error("Payment initialization failed:", error);
                toast({
                    title: "Error",
                    description: `Unable to process CREDIT_CARD payment: ${error}`,
                    variant: "destructive",
                });
            }
        }
    };

    return {handleOnlinePayment} 
};
