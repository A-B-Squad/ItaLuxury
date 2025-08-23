export const sendPurchaseNotifications = async (
    orderId: string,
    productsNumber: number,
    userName: string,
    orderTotal: number
) => {
    try {
        const response = await fetch("/api/send-notification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderId,
                productsNumber,
                userName,
                orderTotal,
            }),
        });

        if (response.ok) {
            console.log("Notification sent successfully!");
        } else {
            console.error("Failed to send notification:", await response.json());
        }
    } catch (error) {
        console.error("Error sending notification:", error);
    }
};
