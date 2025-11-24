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
  // Clean base URL properly - handle both dev and prod
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'https://www.ita-luxury.com';
  const baseUrl = rawBaseUrl.replace(/\/$/, ''); // Remove trailing slash
  
  const currentDate = new Date();

  const safeDate = (dateString: string): Date => {
    try {
      const date = new Date(dateString);
      return Number.isNaN(date.getTime()) ? currentDate : date;
    } catch {
      return currentDate;
    }
  };

  // Static pages - Core site structure
  const staticPages: SitemapEntry[] = [
    { 
      url: `${baseUrl}`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 1.0 
    },
    { 
      url: `${baseUrl}/Collections`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    
    // Important e-commerce pages
    { 
      url: `${baseUrl}/Basket`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/Checkout`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
    { 
      url: `${baseUrl}/Contact-us`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
    { 
      url: `${baseUrl}/Delivery`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.7 
    },
    
    // Collection filters - High priority
    { 
      url: `${baseUrl}/Collections?choice=new-product`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/Collections?choice=in-discount`, 
      lastModified: currentDate, 
      changeFrequency: 'daily', 
      priority: 0.8 
    },
    
    // Legal pages
    { 
      url: `${baseUrl}/Privacy-Policy`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/Terms-of-use`, 
      lastModified: currentDate, 
      changeFrequency: 'yearly', 
      priority: 0.3 
    },
    
    // Utility pages
    { 
      url: `${baseUrl}/TrackingPackages`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
    { 
      url: `${baseUrl}/productComparison`, 
      lastModified: currentDate, 
      changeFrequency: 'monthly', 
      priority: 0.5 
    },
  ];

  try {
    // Fetch products
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
      console.warn('Failed to fetch products for sitemap:', error);
    }

    // Extract unique categories
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
          
          // Add subcategories
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

    // Extract unique brands
    const brandsMap = new Map<string, { name: string; updatedAt?: string }>();
    products.forEach(product => {
      if (product.Brand?.name && !brandsMap.has(product.Brand.name)) {
        brandsMap.set(product.Brand.name, {
          name: product.Brand.name,
          updatedAt: product.updatedAt
        });
      }
    });

    // Generate product URLs
    const dynamicProductUrls: SitemapEntry[] = products
      .slice(0, SITEMAP_CONFIG.MAX_URLS - 200) // Reserve space for categories/brands
      .map((product) => {
        const lastModified = product.updatedAt 
          ? safeDate(product.updatedAt) 
          : product.createdAt 
            ? safeDate(product.createdAt) 
            : currentDate;

        // Boost priority for recently updated products
        const isRecent = product.updatedAt && 
          Date.now() - safeDate(product.updatedAt).getTime() < 30 * 24 * 60 * 60 * 1000;
        
        const priority = isRecent 
          ? Math.min(SITEMAP_CONFIG.PRODUCT_PRIORITY + 0.1, 0.9)
          : SITEMAP_CONFIG.PRODUCT_PRIORITY;

        return {
          url: `${baseUrl}/products/${product.slug}`,
          lastModified,
          changeFrequency: 'weekly',
          priority
        };
      });

    // Generate category URLs - NO /tunisie suffix
    const categoryUrls: SitemapEntry[] = Array.from(categoriesMap.values()).map((category) => ({
      url: `${baseUrl}/Collections?category=${encodeURIComponent(category.name)}`,
      lastModified: category.updatedAt ? safeDate(category.updatedAt) : currentDate,
      changeFrequency: 'weekly',
      priority: SITEMAP_CONFIG.CATEGORY_PRIORITY
    }));

    // Generate brand URLs - NO /tunisie suffix
    const brandUrls: SitemapEntry[] = Array.from(brandsMap.values()).map((brand) => ({
      url: `${baseUrl}/Collections?brand=${encodeURIComponent(brand.name)}`,
      lastModified: brand.updatedAt ? safeDate(brand.updatedAt) : currentDate,
      changeFrequency: 'monthly',
      priority: SITEMAP_CONFIG.BRAND_PRIORITY
    }));

    // Combine all URLs
    const allUrls = [
      ...staticPages, 
      ...dynamicProductUrls, 
      ...categoryUrls, 
      ...brandUrls
    ];

    // Deduplicate
    const uniqueUrls = allUrls.reduce((acc: SitemapEntry[], current) => {
      const exists = acc.find(item => item.url === current.url);
      if (!exists) acc.push(current);
      return acc;
    }, []);

    // Sort by priority and limit
    uniqueUrls.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const finalUrls = uniqueUrls.slice(0, SITEMAP_CONFIG.MAX_URLS);

    console.log(`✅ Sitemap generated successfully:
      Total URLs: ${finalUrls.length}
      - Static pages: ${staticPages.length}
      - Products: ${dynamicProductUrls.length}
      - Categories: ${categoryUrls.length}
      - Brands: ${brandUrls.length}`);

    return finalUrls;

  } catch (error) {
    console.error('❌ Sitemap generation error:', error);
    // Return at least static pages on error
    return staticPages;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; 