import { NextResponse } from "next/server";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  if (!GRAPHQL_ENDPOINT) {
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    );
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      throw new Error('GraphQL query failed');
    }

    const credentials = result.data?.getApiCredentials;

    if (!credentials?.api_id || !credentials?.access_token) {
      throw new Error('Invalid credentials response');
    }

    return NextResponse.json(credentials);

  } catch (error) {
    console.error("Facebook credentials error:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch Facebook credentials" },
      { status: 500 }
    );
  }
}