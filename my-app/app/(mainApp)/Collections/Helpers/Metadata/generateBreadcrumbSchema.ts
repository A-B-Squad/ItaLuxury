import { SearchParamsProductSearch } from "@/app/types";
import generateCanonicalUrl from "./_generateCanonicalUrl";

export interface BreadcrumbItem {
    name: string;
    item: string;
    position: number;
}

export function generateBreadcrumbSchema(searchParams: SearchParamsProductSearch, baseUrl: string): BreadcrumbItem[] {
    let position = 1;

    // Collect all breadcrumb items
    const items: Omit<BreadcrumbItem, 'position'>[] = [
        {
            name: "Accueil",
            item: baseUrl
        },
        {
            name: "Collections",
            item: `${baseUrl}/Collections/tunisie`
        }
    ];

    // Choice-based breadcrumb
    if (searchParams.choice === "new-product") {
        items.push({
            name: "Nouveaux Produits",
            item: `${baseUrl}/Collections/tunisie?choice=new-product`
        });
    } else if (searchParams.choice === "in-discount") {
        items.push({
            name: "Promotions",
            item: `${baseUrl}/Collections/tunisie?choice=in-discount`
        });
    }

    // Category breadcrumb
    if (searchParams.category) {
        items.push({
            name: searchParams.category,
            item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}`
        });
    }

    // Brand breadcrumb
    if (searchParams.brand) {
        items.push({
            name: searchParams.brand,
            item: `${baseUrl}/Collections/tunisie?brand=${encodeURIComponent(searchParams.brand)}`
        });
    }

    // Current page (filtered results)
    if (searchParams.category || searchParams.brand || searchParams.choice) {
        items.push({
            name: "Résultats",
            item: generateCanonicalUrl(searchParams)
        });
    }

    return items.map(item => ({
        ...item,
        position: position++
    }));
}