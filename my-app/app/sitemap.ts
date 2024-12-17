import { MetadataRoute } from "next";

interface Product {
  id: string;
  name: string;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ;

  const staticUrls = [
    { url: `${baseUrl}/api/facebookApi`, lastModified: new Date() },
    { url: `${baseUrl}/ForgotPassword`, lastModified: new Date() },
    { url: `${baseUrl}/signin`, lastModified: new Date() },
    { url: `${baseUrl}/signup`, lastModified: new Date() },
    { url: `${baseUrl}/Basket`, lastModified: new Date() },
    { url: `${baseUrl}/Checkout`, lastModified: new Date() },
    { url: `${baseUrl}/Contact-us`, lastModified: new Date() },
    { url: `${baseUrl}/Delivery`, lastModified: new Date() },
    { url: `${baseUrl}/FavoriteList`, lastModified: new Date() },
    { url: `${baseUrl}/Privacy-Policy`, lastModified: new Date() },
    { url: `${baseUrl}/Terms-of-use`, lastModified: new Date() },
    { url: `${baseUrl}/TrackingPackages`, lastModified: new Date() },
    { url: `${baseUrl}`, lastModified: new Date() },
    { url: `${baseUrl}/productComparison`, lastModified: new Date() },
  ];

  try {
    const apiUrl = `${baseUrl}/api/products`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      return staticUrls;
    }

    const products: Product[] = await response.json();

    if (!Array.isArray(products)) {
      console.error('Invalid product data received');
      return staticUrls;
    }

    const dynamicProductUrls = products
      .filter(product => product && product.id && product.name)
      .map((product) => ({
        url: `${baseUrl}/products/tunisie?productId=${product.id}`,
        lastModified: new Date(),

      }));



    return [...staticUrls, ...dynamicProductUrls];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticUrls;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; 