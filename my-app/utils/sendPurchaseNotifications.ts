export const sendPurchaseNotifications = async (
    orderId: string,
    productsNumber: number,
    userName: string,
    orderTotal: number
) => {
    try {
        // Send both Pusher and Slack notifications simultaneously
        const [pusherResponse, slackResponse] = await Promise.all([
            // Pusher notification
            fetch("/api/send-notification/pusher", {
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
            }),
            // Slack notification
            fetch("/api/send-notification/slack", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId,
                    total: orderTotal,
                    itemCount: productsNumber,
                }),
            })
        ]);

        // Check Pusher response
        if (pusherResponse.ok) {
            console.log("✅ Pusher notification sent successfully!");
        } else {
            console.error("❌ Failed to send Pusher notification:", await pusherResponse.json());
        }

        // Check Slack response
        if (slackResponse.ok) {
            console.log("✅ Slack notification sent successfully!");
        } else {
            console.error("❌ Failed to send Slack notification:", await slackResponse.json());
        }

    } catch (error) {
        console.error("❌ Error sending notifications:", error);
    }
};