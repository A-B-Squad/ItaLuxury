import { SearchParamsProductSearch } from '../../types/product';

export default function generateCanonicalUrl(searchParams: SearchParamsProductSearch): string {
    if (!process.env.NEXT_PUBLIC_BASE_URL_DOMAIN) return "";

    const queryParams = new URLSearchParams();
    const relevantParams: (keyof SearchParamsProductSearch)[] = ['choice', 'category', 'color', 'price', 'brand'];

    relevantParams.forEach(param => {
        if (searchParams[param]) queryParams.set(param, searchParams[param]!);
    });

    if (searchParams.page && searchParams.page !== "1") {
        queryParams.set("page", searchParams.page);
    }

    const queryString = queryParams.toString();
    return `${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/Collections${queryString ? `/tunisie?${queryString}` : "/tunisie"}`;
}
