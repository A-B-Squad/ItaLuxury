import { MetadataRoute } from "next";

interface Product {
  id: string;
  name: string;
  slug: string;
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

type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure consistent HTTPS base URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/^http:/, 'https:') || 'https://www.ita-luxury.com';
  const currentDate = new Date();

  // Static pages with consistent URL structure (REMOVED trailing slashes)
  const staticPages: SitemapEntry[] = [
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
    // Fetch products with better error handling
    const productsApiUrl = `${baseUrl}/api/products`;
    let products: Product[] = [];

    try {
      const productsResponse = await fetch(productsApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Sitemap Generator',
        },
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (Array.isArray(productsData)) {
          products = productsData;
        }
      } else {
        console.warn(`Products API returned ${productsResponse.status}: ${productsResponse.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to fetch products for sitemap:', error);
    }

    // Fetch categories with better error handling
    const categoriesApiUrl = `${baseUrl}/api/categories`;
    let categories: Category[] = [];

    try {
      const categoriesResponse = await fetch(categoriesApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Sitemap Generator',
        },
      });

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (Array.isArray(categoriesData)) {
          categories = categoriesData;
        }
      } else {
        console.warn(`Categories API returned ${categoriesResponse.status}: ${categoriesResponse.statusText}`);
      }
    } catch (error) {
      console.warn('Failed to fetch categories for sitemap:', error);
    }

    // Generate product URLs with consistent structure
    const dynamicProductUrls: SitemapEntry[] = products
      .filter(product => product?.id && product?.name)
      .map((product) => {
        const productUrl = `${baseUrl}/products/tunisie?slug=${product.slug}`;

        return {
          url: productUrl,
          lastModified: product.updatedAt ? new Date(product.updatedAt) : currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8
        };
      });

    // Generate category URLs with consistent structure
    const categoryUrls: SitemapEntry[] = categories
      .filter(category => category?.id && category?.name)
      .map((category) => {
        const categoryUrl = `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(category.name)}`;

        return {
          url: categoryUrl,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.8
        };
      });

    // Combine all URLs and ensure no duplicates
    const allUrls = [...staticPages, ...dynamicProductUrls, ...categoryUrls];
    const uniqueUrls = allUrls.filter((url, index, self) =>
      index === self.findIndex(u => u.url === url.url)
    );

    console.log(`Generated sitemap with ${uniqueUrls.length} URLs`);
    return uniqueUrls;

  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;