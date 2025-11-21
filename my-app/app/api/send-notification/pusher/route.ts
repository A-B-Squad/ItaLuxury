import { NextResponse } from 'next/server';
import PushNotifications from '@pusher/push-notifications-server';

export async function POST(request: Request) {
  const beamsClient = new PushNotifications({
    instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE_ID!,
    secretKey: process.env.NEXT_PUBLIC_PUSHER_SECRET_KEY!
  });

  try {
    const { orderId, productsNumber, userName, orderTotal } = await request.json();

    const notificationId = `order-${orderId}-${Date.now()}`;

    const publishResponse = await beamsClient.publishToInterests(['admin-notifications'], {
      web: {
        notification: {
          title: '📦 Nouvelle commande reçue!',
          body: `🛍️ ${userName} a commandé ${productsNumber} produit(s) 💰 Total : ${orderTotal.toFixed(2)} TND.`,
          deep_link: 'https://admin.ita-luxury.com/Orders',
        },
        data: {
          link: '/Orders',
          orderId: orderId,
          notificationId: notificationId
        }
      },
    });

    return NextResponse.json({ success: true, response: publishResponse });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}