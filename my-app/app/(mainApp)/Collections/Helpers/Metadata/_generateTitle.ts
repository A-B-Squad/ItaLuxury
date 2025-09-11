import { SearchParamsProductSearch } from "@/app/types";

export default function generateTitle(searchParams: SearchParamsProductSearch): string {
    const titleParts: string[] = [];

    if (searchParams.choice === "new-product") {
        titleParts.push("Nouveaux Produits");
    } else if (searchParams.choice === "in-discount") {
        titleParts.push("Produits en Promotion");
    } else {
        titleParts.push("Tous Les Produits");
    }

    if (searchParams.category) titleParts.push(searchParams.category);
    if (searchParams.color) titleParts.push(`Couleur: ${searchParams.color}`);
    if (searchParams.brand) titleParts.push(`Marque: ${searchParams.brand}`);
    if (searchParams.price) titleParts.push(`Prix Max: ${searchParams.price} TD`);
    if (searchParams.page && searchParams.page !== "1") titleParts.push(`Page ${searchParams.page}`);

    return `${titleParts.join(" | ")} - ita-luxury`;
}