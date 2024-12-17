import { NextResponse } from 'next/server';
import PushNotifications from '@pusher/push-notifications-server';

interface AdminNotificationData {
  orderId: string;
  productsNumber: number;
  userName: string;
  orderTotal: number;
}

export async function POST(request: Request) {
  const beamsClient = new PushNotifications({

    instanceId: process.env.NEXT_PUBLIC_PUSHER_INSTANCE_ID!,
    secretKey: process.env.NEXT_PUBLIC_PUSHER_SECRET_KEY!
  });

  try {
    const { orderId, productsNumber, userName, orderTotal } = await request.json() as AdminNotificationData;

    const publishResponse = await beamsClient.publishToInterests(['admin'], {
      web: {
        notification: {
          title: '📦 Nouvelle commande reçue!',
          body: `🛍️ ${userName} a commandé ${productsNumber} produit(s) 💰 Total : ${orderTotal.toFixed(2)} TND.`,
          deep_link: `https://admin.ita-luxury.com/Orders`,
        },
      },
    });

    return NextResponse.json({ success: true, response: publishResponse });
  } catch (error) {
    return NextResponse.json({ success: false, error: error as string }, { status: 500 });
  }
}