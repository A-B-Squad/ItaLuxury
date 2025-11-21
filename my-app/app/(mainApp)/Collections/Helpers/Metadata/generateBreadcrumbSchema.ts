import { SearchParamsProductSearch } from "@/app/types";
import generateCanonicalUrl from "./_generateCanonicalUrl";

export interface BreadcrumbItem {
    name: string;
    item: string;
    position: number;
}

export function generateBreadcrumbSchema(searchParams: SearchParamsProductSearch, baseUrl: string): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    let position = 1;

    // Home
    breadcrumbs.push({
        name: "Accueil",
        item: baseUrl,
        position: position++
    });

    // Collections base
    breadcrumbs.push({
        name: "Collections",
        item: `${baseUrl}/Collections/tunisie`,
        position: position++
    });

    // Choice-based breadcrumb
    if (searchParams.choice === "new-product") {
        breadcrumbs.push({
            name: "Nouveaux Produits",
            item: `${baseUrl}/Collections/tunisie?choice=new-product`,
            position: position++
        });
    } else if (searchParams.choice === "in-discount") {
        breadcrumbs.push({
            name: "Promotions",
            item: `${baseUrl}/Collections/tunisie?choice=in-discount`,
            position: position++
        });
    }

    // Category breadcrumb
    if (searchParams.category) {
        breadcrumbs.push({
            name: searchParams.category,
            item: `${baseUrl}/Collections/tunisie?category=${encodeURIComponent(searchParams.category)}`,
            position: position++
        });
    }

    // Brand breadcrumb
    if (searchParams.brand) {
        breadcrumbs.push({
            name: searchParams.brand,
            item: `${baseUrl}/Collections/tunisie?brand=${encodeURIComponent(searchParams.brand)}`,
            position: position++
        });
    }

    // Current page (filtered results)
    if (searchParams.category || searchParams.brand || searchParams.choice) {
        breadcrumbs.push({
            name: "Résultats",
            item: generateCanonicalUrl(searchParams),
            position: position
        });
    }

    return breadcrumbs;
}