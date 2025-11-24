import { SearchParamsProductSearch } from "@/app/types";

export default function generateDescription(searchParams: SearchParamsProductSearch): string {
  const parts: string[] = [];
  const maxLength = 160;

  // Primary action based on choice
  if (searchParams.choice === "new-product") {
    parts.push("Découvrez nos dernières nouveautés");
  } else if (searchParams.choice === "in-discount") {
    parts.push("Profitez de nos promotions et réductions exclusives");
  } else if (searchParams.query) {
    parts.push(`Trouvez les meilleurs produits "${searchParams.query}"`);
  } else {
    parts.push("Explorez notre collection de produits de qualité");
  }

  // Add specific filters
  if (searchParams.category) {
    parts.push(`en ${searchParams.category}`);
  }

  if (searchParams.brand) {
    parts.push(`de ${searchParams.brand}`);
  }

  if (searchParams.color) {
    parts.push(`couleur ${searchParams.color}`);
  }

  if (searchParams.price) {
    parts.push(`jusqu'à ${searchParams.price}DT`);
  }

  // Add Tunisia location and call-to-action
  parts.push("Livraison rapide en Tunisie. Achetez en ligne avec ita-luxury.");

  let description = parts.join(" ");

  // Ensure optimal length
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + "...";
  }

  return description;
}