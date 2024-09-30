import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    token,
    amount,
    type,
    description,
    acceptedPaymentMethods,
    lifespan,
    checkoutForm,
    addPaymentFeesToAmount,
    firstName,
    lastName,
    phoneNumber,
    email,
    orderId,
    webhook,
    silentWebhook,
    successUrl,
    failUrl,
    theme,
  } = body;

  const apiKey = process.env.NEXT_PUBLIC_KONNECT_API_KEY;
  const receiverWalletId = process.env.NEXT_PUBLIC_KONNECT_WALLET_ID;
  const apiUrl = process.env.NEXT_PUBLIC_TEST_API;

  
  if (!apiKey || !receiverWalletId || !apiUrl) {
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        receiverWalletId,
        token,
        amount,
        type,
        description,
        acceptedPaymentMethods,
        lifespan,
        checkoutForm,
        addPaymentFeesToAmount,
        firstName,
        lastName,
        phoneNumber,
        email,
        orderId,
        webhook,
        silentWebhook,
        successUrl,
        failUrl,
        theme,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Payment initialization error:", errorData);
      return NextResponse.json(
        {
          message: "Error initializing payment",
          error: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        message: "Error initializing payment",
        error: error,
      },
      { status: 500 }
    );
  }
}
