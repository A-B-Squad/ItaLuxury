import { BreadcrumbList, WithContext } from "schema-dts";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN ?? "https://ita-luxury.com").replace(/\/$/, "");

export const generateBreadcrumbSchema = (
  breadcrumbPath: any[], 
  currentUrl: string
): WithContext<BreadcrumbList> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${currentUrl}#breadcrumb`,
  "itemListElement": breadcrumbPath.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.label,
    // Handle both relative and absolute URLs
    "item": item.href.startsWith('http') ? item.href : `${baseUrl}${item.href}`
  }))
});