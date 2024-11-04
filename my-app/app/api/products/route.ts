import { NextRequest, NextResponse } from "next/server";

interface Product {
    id: string;
    name: string;
    categories: Array<{
        id: string;
        name: string;
        description?: string;
    }>;
}

export async function GET(req: NextRequest) {
    try {
        if (!process.env.NEXT_PUBLIC_API_URL) {
            console.error("NEXT_PUBLIC_API_URL is not defined");
            return NextResponse.json([], { status: 500 });
        }

        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
          query SearchProducts($input: ProductSearchInput!) {
            searchProducts(input: $input) {
              totalCount
              results {
                products {
                  id
                  name
                  images
                  categories {
                    id
                    name
                    description
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
                        pageSize: 50000,
                        query: "",
                    },
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.statusText}`);
        }

        const { data } = await response.json();
        const products = data?.searchProducts?.results?.products || [];
console.log(data);

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching product data:', error);
        return NextResponse.json([], { status: 500 });
    }
}