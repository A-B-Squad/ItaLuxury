// app/api/facebook-credentials/route.ts
import { NextResponse } from "next/server";
const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: Request) {
  if (!GRAPHQL_ENDPOINT) {
    return NextResponse.json(
      { error: "API URL is not defined" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query getApiCredentials($integrationFor: String) {
            getApiCredentials(integrationFor: $integrationFor) {
              api_id
              access_token
              domainVerification
            }
          }
        `,
        variables: { integrationFor: "FACEBOOK" },
      }),
    });

    const result = await response.json();

    if (result.data && result.data.getApiCredentials) {
      return NextResponse.json(result.data.getApiCredentials);
    } else {
      return NextResponse.json({ error: "No data received" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching API credentials:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
