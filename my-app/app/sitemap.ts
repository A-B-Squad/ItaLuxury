import { MetadataRoute } from "next";

interface Product {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
  isVisible: boolean;
  categories: Array<{
    id: string;
    name: string;
    slug?: string;
    subcategories?: Array<{
      id: string;
      name: string;
      parentId?: string;
    }>;
  }>;
  inventory: number;
  Brand?: {
    id: string;
    name: string;
  };
}

type SitemapEntry = MetadataRoute.Sitemap[number];

const SITEMAP_CONFIG = {
  MAX_URLS: 50000,
  PRODUCT_PRIORITY: 0.8,
  CATEGORY_PRIORITY: 0.7,
  BRAND_PRIORITY: 0.6,
  STATIC_PRIORITY: 0.5,
} as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/^http:/, 'https:')?.replace(/\/$/, '') || 'https://www.ita-luxury.com';
  const currentDate = new Date();

  const safeDate = (dateString: string): Date => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? currentDate : date;
    } catch {
      return currentDate;
    }
  };

  // Static pages - ALL TUNISIA focused
  const staticPages: SitemapEntry[] = [
    { 
      url: `${baseUrl}`, 
      lastModified: currentDate, 
      changeFrequency: 'daily' as const, 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/Collections/tunisie`, 
      lastModified: currentDate, 
      changeFrequency: 'daily' as const, 
      priority: 0.9 
    },
    
    // IMPORTANT: Include these for Google Merchant Center verification
    { 
      url: `${baseUrl}/Basket`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/Checkout`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/Contact-us`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7 
    },
    { 
      url: `${baseUrl}/Delivery`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.7 
    },
    
    // Collection filters
    { 
      url: `${baseUrl}/Collections/tunisie?choice=new-product`, 
      lastModified: currentDate, 
      changeFrequency: 'daily' as const, 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/Collections/tunisie?choice=in-discount`, 
      lastModified: currentDate, 
      changeFrequency: 'daily' as const, 
      priority: 0.8 
    },
    
    // Auth pages
    { 
      url: `${baseUrl}/signin`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly' as const, 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/signup`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly' as const, 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/Privacy-Policy`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly' as const, 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/Terms-of-use`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly' as const, 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/TrackingPackages`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/productComparison`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly' as const, 
      priority: 0.5 
    },
  ];

  try {
    // Fetch products from your single API endpoint
    let products: Product[] = [];
    try {
      const productsApiUrl = `${baseUrl}/api/products`;
      const productsResponse = await fetch(productsApiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
      });

      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        if (Array.isArray(productsData)) {
          products = productsData.filter((product: Product) => 
            product?.id && 
            product?.slug && 
            product?.isVisible !== false &&
            (product.inventory || 0) > 0
          );
        }
      }
    } catch (error) {
      console.warn('Failed to fetch products:', error);
    }

    // Extract unique categories from products
    const categoriesMap = new Map<string, { name: string; updatedAt?: string }>();
    products.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(cat => {
          if (cat?.name && !categoriesMap.has(cat.name)) {
            categoriesMap.set(cat.name, {
              name: cat.name,
              updatedAt: product.updatedAt
            });
          }
          
          // Also add subcategories if they exist
          if (cat.subcategories && Array.isArray(cat.subcategories)) {
            cat.subcategories.forEach(subcat => {
              if (subcat?.name && !categoriesMap.has(subcat.name)) {
                categoriesMap.set(subcat.name, {
                  name: subcat.name,
                  updatedAt: product.updatedAt
                });
              }
            });
          }
        });
      }
    });

    // Extract unique brands from products
    const brandsMap = new Map<string, { name: string }>();
    products.forEach(product => {
      if (product.Brand?.name && !brandsMap.has(product.Brand.name)) {
        brandsMap.set(product.Brand.name, {
          name: product.Brand.name
        });
      }
    });

    // Generate product URLs
    const dynamicProductUrls: SitemapEntry[] = products
      .slice(0, SITEMAP_CONFIG.MAX_URLS - 100)
      .map((product) => {
        const lastModified = product.updatedAt 
          ? safeDate(product.updatedAt) 
          : product.createdAt 
            ? safeDate(product.createdAt) 
            : currentDate;

        const priority = product.updatedAt && 
          Date.now() - safeDate(product.updatedAt).getTime() < 30 * 24 * 60 * 60 * 1000
          ? SITEMAP_CONFIG.PRODUCT_PRIORITY + 0.1 
          : SITEMAP_CONFIG.PRODUCT_PRIORITY;

        return {
          url: `${baseUrl}/products/${product.slug}`,
          lastModified,
          changeFrequency: 'weekly' as const,
          priority: Math.min(priority, 0.9)
        };
      });

    // Generate category URLs - ALL Tunisia based
    const categoryUrls: SitemapEntry[] = Array.from(categoriesMap.values()).map((category) => ({
      url: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(category.name)}`,
      lastModified: category.updatedAt ? safeDate(category.updatedAt) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: SITEMAP_CONFIG.CATEGORY_PRIORITY
    }));

    // Generate brand URLs - ALL Tunisia based
    const brandUrls: SitemapEntry[] = Array.from(brandsMap.values()).map((brand) => ({
      url: `${baseUrl}/Collections/tunisie?brand=${encodeURIComponent(brand.name)}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: SITEMAP_CONFIG.BRAND_PRIORITY
    }));

    // Combine and deduplicate
    const allUrls = [
      ...staticPages, 
      ...dynamicProductUrls, 
      ...categoryUrls, 
      ...brandUrls
    ];

    const uniqueUrls = allUrls.reduce((acc: SitemapEntry[], current) => {
      const exists = acc.find(item => item.url === current.url);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    uniqueUrls.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const finalUrls = uniqueUrls.slice(0, SITEMAP_CONFIG.MAX_URLS);

    console.log(`✅ Sitemap generated: ${finalUrls.length} URLs
      - ${staticPages.length} static pages
      - ${dynamicProductUrls.length} products
      - ${categoryUrls.length} categories (extracted from products)
      - ${brandUrls.length} brands (extracted from products)`);

    return finalUrls;

  } catch (error) {
    console.error('❌ Sitemap error:', error);
    return staticPages;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;