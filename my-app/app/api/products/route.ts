import { NextRequest, NextResponse } from "next/server";



interface GraphQLResponse {
    data?: {
        searchProducts?: {
            totalCount: number;
            results: {
                products: Product[];
            };
        };
    };
    errors?: Array<{
        message: string;
    }>;
}

export async function GET(req: NextRequest) {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
            throw new Error("NEXT_PUBLIC_API_URL is not defined");
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {

            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",

            body: JSON.stringify({
                query: `
          query SearchProducts($input: ProductSearchInput!) {
  searchProducts(input: $input) {
    totalCount
    results {
      products {
        id
        name
        slug
        price
        reference
        description
        createdAt
        updatedAt
        inventory
        images
        categories {
          id
          name
          subcategories {
            id
            name
            parentId
            subcategories {
              id
              name
              parentId
            }
          }
        }
        Colors {
          id
          color
          Hex
        }
        productDiscounts {
          price
          newPrice
        }
      }
    }
  }
}

        `,
                variables: {
                    input: {
                        brandName: null,
                        categoryName: null,
                        choice: null,
                        colorName: null,
                        maxPrice: 100000000,
                        minPrice: 1,
                        page: 1,
                        pageSize: 10000,
                        query: "",
                        visibleProduct: true,
                    },
                },
            }),


        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.status} ${response.statusText}`);
        }

        const graphqlResponse: GraphQLResponse = await response.json();

        // Check for GraphQL errors
        if (graphqlResponse.errors?.length) {
            console.error('GraphQL Errors:', graphqlResponse.errors);
            throw new Error(graphqlResponse.errors[0].message);
        }

        // Extract products with proper null checking
        const products = graphqlResponse.data?.searchProducts?.results?.products;

        if (!products) {
            console.warn('No products found in the response');
            return NextResponse.json([], {
                status: 200,
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
                }
            });
        }

        return NextResponse.json(products, {
            status: 200,
            headers: {
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
            }
        });

    } catch (error) {
        console.error('Error fetching product data:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

export const dynamic = 'force-dynamic';