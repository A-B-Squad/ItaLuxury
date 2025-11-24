import { SearchParamsProductSearch } from "@/app/types";

export default function generateTitle(searchParams: SearchParamsProductSearch): string {
    const titleParts: string[] = [];
    const maxLength = 60;
    const currentYear = new Date().getFullYear();

    // Primary section based on choice
    if (searchParams.choice === "new-product") {
        titleParts.push(`Nouveautés ${currentYear}`);
    } else if (searchParams.choice === "in-discount") {
        titleParts.push("Promotions");
    } else if (searchParams.query) {
        titleParts.push(searchParams.query);
    }

    // Add filters (most important first)
    if (searchParams.category) {
        titleParts.push(searchParams.category);
    }
    
    if (searchParams.brand) {
        titleParts.push(searchParams.brand);
    }

    if (searchParams.color) {
        titleParts.push(searchParams.color);
    }

    // Only add price if it's a significant filter
    if (searchParams.price && !searchParams.choice && !searchParams.query) {
        titleParts.push(`-${searchParams.price}DT`);
    }

    // Pagination (only if not first page)
    if (searchParams.page && searchParams.page !== "1") {
        titleParts.push(`P${searchParams.page}`);
    }

    // Default if no filters
    if (titleParts.length === 0) {
        titleParts.push("Collections");
    }

    // Build title with brand suffix
    const titleContent = titleParts.join(" | ");
    let fullTitle = `${titleContent} - ita-luxury`;
    
    // Truncate if too long
    if (fullTitle.length > maxLength) {
        const maxContentLength = maxLength - " - ita-luxury".length;
        const truncatedContent = titleContent.substring(0, maxContentLength - 3) + "...";
        fullTitle = `${truncatedContent} - ita-luxury`;
    }

    return fullTitle;
}