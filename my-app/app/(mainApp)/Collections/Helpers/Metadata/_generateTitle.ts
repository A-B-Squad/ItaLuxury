import { SearchParamsProductSearch } from "@/app/types";

export default function generateTitle(searchParams: SearchParamsProductSearch): string {
    const titleParts: string[] = [];
    const maxLength = 60;
    const DateNow=new Date()

    // Primary section based on choice
    if (searchParams.choice === "new-product") {
        titleParts.push(`Nouveaux Produits ${DateNow.getFullYear()} `);
    } else if (searchParams.choice === "in-discount") {
        titleParts.push("Promotions et Soldes");
    } else if (searchParams.query) {
        titleParts.push(`Résultats pour "${searchParams.query}"`);
    } else {
        titleParts.push("Collection Complète");
    }

    // Secondary filters (most important first)
    if (searchParams.category) {
        titleParts.push(searchParams.category);
    }
    
    if (searchParams.brand) {
        titleParts.push(searchParams.brand);
    }

    // Tertiary filters
    if (searchParams.color) {
        titleParts.push(`Couleur ${searchParams.color}`);
    }

    if (searchParams.price) {
        titleParts.push(`Jusqu'à ${searchParams.price} TND`);
    }

    // Pagination (only if not first page)
    if (searchParams.page && searchParams.page !== "1") {
        titleParts.push(`Page ${searchParams.page}`);
    }

    // Build title with length optimization
    let title = titleParts.join(" | ");
    
    // Add brand name and truncate if too long
    const fullTitle = `${title} - ita-luxury`;
    
    if (fullTitle.length > maxLength) {
        // Remove less important elements to fit length
        const simplifiedParts = [...titleParts];
        while (fullTitle.length > maxLength && simplifiedParts.length > 1) {
            simplifiedParts.pop();
            title = `${simplifiedParts.join(" | ")} - ita-luxury`;
        }
    }

    return fullTitle.length <= maxLength ? fullTitle : fullTitle.substring(0, maxLength - 3) + '...';
}

// For schema.org usage
export function generateSchemaTitle(searchParams: SearchParamsProductSearch): string {
    const title = generateTitle(searchParams);
    return title.replace(/ - ita-luxury$/, ''); 
}