import { sendPurchaseNotifications } from "@/utlils/sendPurchaseNotifications";
import { NextRequest, NextResponse } from "next/server";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");
    const userName = searchParams.get("userName");
    const itemCount = searchParams.get("itemCount");
    const orderTotal = searchParams.get("orderTotal");

    if (!orderId || !status || !GRAPHQL_ENDPOINT) {
      return NextResponse.json(
        { error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    // GraphQL mutation logic here
    const mutation = `
      mutation UpdateStatusPayOnlinePackage($packageId: ID!, $paymentStatus: Status) {
        updateStatusPayOnlinePackage(
          packageId: $packageId
          paymentStatus: $paymentStatus
        )
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          packageId: orderId,
          paymentStatus: status,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      return NextResponse.json(
        { error: "Failed to update payment status" },
        { status: 500 }
      );
    }


    if (status === "PAYED_NOT_DELIVERED") {
      await sendPurchaseNotifications(
        orderId,
        Number(itemCount),
        userName || "Client",
        Number(orderTotal)
      );
    }

    return NextResponse.json(
      {
        message: "Payment status updated successfully",
        packageId: orderId,
        status: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';