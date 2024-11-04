import prepRoute from "@/app/Helpers/_prepRoute";
import { MetadataRoute } from "next";



export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'http://localhost:4000';
  const response = await fetch(`${baseUrl}/api/products`);
  const productData: Product[] = await response.json();

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

  const dynamicProductUrls = productData.map((product: any) => {
    const formattedProductName = prepRoute(product.name);
    return {
      url: `${baseUrl}/products/tunisie/${formattedProductName}/?productId=${product.id}`,
      lastModified: new Date(),

    };
  });


  return [...staticUrls, ...dynamicProductUrls];

}