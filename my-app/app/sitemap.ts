import { MetadataRoute } from "next";

interface Product {
  id: string;
  name: string;
  updatedAt: string;
  categories: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

// Define the type for a single sitemap entry as expected by Next.js
type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN;
  const currentDate = new Date();

  // Define priority and change frequency for different types of pages
  const staticPages: SitemapEntry[] = [ // Explicitly type the array elements
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/signin`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/signup`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/ForgotPassword`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/Basket`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/Checkout`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/Contact-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/Delivery`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/FavoriteList`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/Privacy-Policy`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/Terms-of-use`, lastModified: currentDate, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/TrackingPackages`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/productComparison`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
  ];

  try {
    // Fetch products
    const productsApiUrl = `${baseUrl}/api/products`;
    const productsResponse = await fetch(productsApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!productsResponse.ok) {
      console.error(`Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`);
      return staticPages;
    }

    const products: Product[] = await productsResponse.json();

    if (!Array.isArray(products)) {
      console.error('Invalid product data received');
      return staticPages;
    }

    // Fetch categories
    const categoriesApiUrl = `${baseUrl}/api/categories`;
    const categoriesResponse = await fetch(categoriesApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    let categories: Category[] = [];
    if (categoriesResponse.ok) {
      categories = await categoriesResponse.json();
    }

    // Generate product URLs with proper priority
    const dynamicProductUrls: SitemapEntry[] = products
      .filter(product => product && product.id && product.name)
      .map((product) => {
        const priority = 0.8;

        return {
          url: `${baseUrl}/products/tunisie/?productId=${product.id}`,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
          changeFrequency: 'weekly',
          priority
        };
      });

    // Generate category URLs
    const categoryUrls: SitemapEntry[] = categories // Explicitly type the array elements
      .filter(category => category && category.id && category.name)
      .map((category) => ({
        url: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(category.name)}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8
      }));

    return [...staticPages, ...dynamicProductUrls, ...categoryUrls];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour