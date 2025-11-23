import { SearchParamsProductSearch } from "@/app/types";

export default function generateDescription(searchParams: SearchParamsProductSearch): string {
  const parts: string[] = [];
  const maxLength = 160;

  // Primary action based on choice
  if (searchParams.choice === "new-product") {
    parts.push("Découvrez nos dernières nouveautés et produits récemment ajoutés");
  } else if (searchParams.choice === "in-discount") {
    parts.push("Profitez de nos meilleures promotions, soldes et réductions exclusives");
  } else if (searchParams.query) {
    parts.push(`Trouvez les meilleurs produits pour "${searchParams.query}"`);
  } else {
    parts.push("Explorez notre vaste collection de produits de qualité");
  }

  // Add specific filters with natural language
  if (searchParams.category) {
    parts.push(`dans la catégorie ${searchParams.category}`);
  }

  if (searchParams.brand) {
    parts.push(`de la marque ${searchParams.brand}`);
  }

  if (searchParams.color) {
    parts.push(`disponible en couleur ${searchParams.color}`);
  }

  if (searchParams.price) {
    parts.push(`avec des prix jusqu'à ${searchParams.price} dinars tunisiens`);
  }

  parts.push(
    "Livraison rapide et gratuite disponible dans toute la Tunisie.",
    "Achetez en ligne en toute sécurité avec ita-luxury."
  );

  let description = parts.join(" ");

  // Ensure optimal length
  if (description.length > maxLength) {
    description = description.substring(0, maxLength - 3) + '...';
  }

  return description;
}

export function generateSchemaDescription(searchParams: SearchParamsProductSearch): string {
  const description = generateDescription(searchParams);
  return description.replace(/ avec ita-luxury\.$/, '.');
}