import { NextRequest, NextResponse } from "next/server";

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
                    query GetAllProductsForGoogleFeed {
                        getAllProductsForGoogleFeed {
                            id
                            title
                            description
                            link
                            image_link
                            additional_image_link
                            price
                            sale_price
                            availability
                            brand
                            gtin
                            mpn
                            condition
                            product_type
                            google_product_category
                            color
                            item_group_id
                            inventory
                            createdAt
                            updatedAt
                        }
                    }
                `
            }),
        });

        if (!response.ok) {
            throw new Error(`API response error: ${response.status} ${response.statusText}`);
        }

        const graphqlResponse = await response.json();

        // Check for GraphQL errors
        if (graphqlResponse.errors?.length) {
            console.error('GraphQL Errors:', graphqlResponse.errors);
            throw new Error(graphqlResponse.errors[0].message);
        }

        // Extract products with proper null checking
        const products = graphqlResponse.data?.getAllProductsForGoogleFeed;

        if (!products || products.length === 0) {
            console.warn('No products found in the response');
            // Return empty feed XML
            const emptyFeed = generateGoogleMerchantXML([]);
            return new NextResponse(emptyFeed, {
                status: 200,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8',
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
                }
            });
        }

        // Generate XML feed
        const xml = generateGoogleMerchantXML(products);

        return new NextResponse(xml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
            }
        });

    } catch (error) {
        console.error('Error generating Google Merchant feed:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

function generateGoogleMerchantXML(products: any[]): string {
    const escapeXml = (str: string | null | undefined): string => {
        if (!str) return '';
        return String(str)
            .replaceAll(/&/g, '&amp;')
            .replaceAll(/</g, '&lt;')
            .replaceAll(/>/g, '&gt;')
            .replaceAll(/"/g, '&quot;')
            .replaceAll(/'/g, '&apos;');
    };

    const items = products.map(product => {
        const additionalImages = product.additional_image_link
            ? product.additional_image_link.split(',').filter(Boolean)
            : [];

        return `    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.title)}</g:title>
      ${product.description ? `<g:description>${escapeXml(product.description)}</g:description>` : ''}
      <g:link>${escapeXml(product.link)}</g:link>
      ${product.image_link ? `<g:image_link>${escapeXml(product.image_link)}</g:image_link>` : ''}
      ${additionalImages.map((img: string | null | undefined) => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:price>${escapeXml(product.price)}</g:price>
      ${product.sale_price ? `<g:sale_price>${escapeXml(product.sale_price)}</g:sale_price>` : ''}
      <g:availability>${escapeXml(product.availability)}</g:availability>
      ${product.brand ? `<g:brand>${escapeXml(product.brand)}</g:brand>` : ''}
      ${product.gtin ? `<g:gtin>${escapeXml(product.gtin)}</g:gtin>` : ''}
      ${product.mpn ? `<g:mpn>${escapeXml(product.mpn)}</g:mpn>` : ''}
      <g:condition>${escapeXml(product.condition)}</g:condition>
      ${product.product_type ? `<g:product_type>${escapeXml(product.product_type)}</g:product_type>` : ''}
      ${product.google_product_category ? `<g:google_product_category>${escapeXml(product.google_product_category)}</g:google_product_category>` : ''}
      ${product.color ? `<g:color>${escapeXml(product.color)}</g:color>` : ''}
      ${product.item_group_id ? `<g:item_group_id>${escapeXml(product.item_group_id)}</g:item_group_id>` : ''}
      
      <!-- CRITICAL: Tunisia shipping information (THIS WAS MISSING!) -->
      <g:shipping>
        <g:country>TN</g:country>
        <g:service>Standard</g:service>
        <g:price>8.00 TND</g:price>
      </g:shipping>
      
      <!-- CRITICAL: Target Tunisia only (THIS WAS MISSING!) -->
      <g:target_country>TN</g:target_country>
      <g:content_language>fr</g:content_language>
      
      <!-- Additional recommended fields -->
      <g:shipping_weight>0.5 kg</g:shipping_weight>
      <g:identifier_exists>yes</g:identifier_exists>
    </item>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>ita luxury - Produits Tunisie</title>
    <link>https://www.ita-luxury.com</link>
    <description>Boutique en ligne de produits électroniques et accessoires en Tunisie</description>
${items}
  </channel>
</rss>`;
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;