import { SearchParamsProductSearch } from "@/app/types";

export default function generateCanonicalUrl(searchParams: SearchParamsProductSearch): string {
    const queryParams = new URLSearchParams();
    
    // Define priority order for URL parameters (most important first)
    const relevantParams: (keyof SearchParamsProductSearch)[] = [
        'category', 
        'choice', 
        'brand', 
        'color', 
        'price', 
        'query', 
        'sort'
    ];

    // Add parameters in consistent order
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
    
    // Return clean URL path (relative, not absolute)
    if (!queryString) {
        return "/Collections";
    }

    return `/Collections?${queryString}`;
}