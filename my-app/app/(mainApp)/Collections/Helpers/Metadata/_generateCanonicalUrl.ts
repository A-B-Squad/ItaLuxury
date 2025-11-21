import { SearchParamsProductSearch } from "@/app/types";

export default function generateCanonicalUrl(searchParams: SearchParamsProductSearch): string {
    if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) return "";

    const baseDomain = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN.replace(/\/$/, "");
    const queryParams = new URLSearchParams();
    
    // Define priority order for URL parameters
    const relevantParams: (keyof SearchParamsProductSearch)[] = [
        'category', 'choice', 'brand', 'color', 'price', 'query'
    ];

    // Add parameters in consistent order for better caching
    relevantParams.forEach(param => {
        const value = searchParams[param];
        if (value && String(value).trim()) {
            queryParams.set(param, String(value).trim());
        }
    });

    // Only include page if it's not the first page
    if (searchParams.page && searchParams.page !== "1") {
        queryParams.set("page", searchParams.page);
    }

    const queryString = queryParams.toString();
    
    // Clean URL structure without redundant parameters
    if (!queryString) {
        return `${baseDomain}/Collections/tunisie`;
    }

    return `${baseDomain}/Collections/tunisie?${queryString}`;
}

