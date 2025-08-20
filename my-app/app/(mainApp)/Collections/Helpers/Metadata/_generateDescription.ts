import { SearchParamsProductSearch } from "@/app/types";

export default function generateDescription(searchParams: SearchParamsProductSearch): string {
    const parts: string[] = [];
  
    if (searchParams.choice === "new-product") {
      parts.push("Découvrez nos dernières nouveautés");
    } else if (searchParams.choice === "in-discount") {
      parts.push("Profitez de nos meilleures promotions et réductions");
    } else {
      parts.push("Explorez notre collection complète");
    }
  
    if (searchParams.category) parts.push(`dans la catégorie ${searchParams.category}`);
    if (searchParams.color) parts.push(`en ${searchParams.color}`);
    if (searchParams.brand) parts.push(`de la marque ${searchParams.brand}`);
    if (searchParams.price) parts.push(`à des prix jusqu'à ${searchParams.price} TD`);
  
    return `${parts.join(" ")}. Livraison disponible en Tunisie.`;
  }
  