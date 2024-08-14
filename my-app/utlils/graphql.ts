// utils/graphql.ts

export async function fetchGraphQLData(query: string, variables = {}) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }
  
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
      method: "POST",
      cache:"no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const { data, errors } = await response.json();
  
    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error('GraphQL query failed');
    }
  
    return data;
  }