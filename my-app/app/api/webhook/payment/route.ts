import { NextRequest, NextResponse } from "next/server";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const paymentRef = url.searchParams.get("payment_ref");
    const packageId = url.searchParams.get("packageId");
    const status = url.searchParams.get("status");

    if (!packageId || !status || !GRAPHQL_ENDPOINT) {
      return NextResponse.json(
        { error: "Missing packageId or status" },
        { status: 400 }
      );
    }

    console.log(url,"######################################################");
    
    // Map the status if necessary (in this case, it's already in the correct format)
    const paymentStatus = status;

    // Construct the GraphQL mutation
    const mutation = `
      mutation UpdateStatusPayOnlinePackage($packageId: ID!, $paymentStatus: Status) {
        updateStatusPayOnlinePackage(
          packageId: $packageId
          paymentStatus: $paymentStatus
        )
      }
    `;

    // Send the GraphQL mutation
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          packageId: packageId,
          paymentStatus: paymentStatus,
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

    console.log(
      `Payment status updated successfully for order ${packageId}: ${paymentStatus}`
    );

    return NextResponse.json(
      {
        message: "Payment status updated successfully",
        paymentRef: paymentRef,
        packageId: packageId,
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
