import { SearchParamsProductSearch } from "@/app/types";
import keywords from "@/public/scripts/keywords";

export default function generateKeywords(searchParams: SearchParamsProductSearch): string[] {
  const baseKeywords = new Set(keywords);
  const DateNow = new Date()

  // Enhanced keyword mappings with semantic groups
  const keywordMappings = {
    'new-product': [
      `nouveautés ${DateNow.getFullYear()}`, "nouvelle collection", "derniers produits",
      "produits récents", "arrivages récents", "tendances actuelles"
    ],
    'in-discount': [
      "promotion", "soldes", "réduction", "remise", "bon prix",
      "prix cassés", "offres spéciales", "économies", "rabais"
    ],
  };

  // Query-based keywords
  if (searchParams.query) {
    baseKeywords.add(searchParams.query);
    baseKeywords.add(`acheter ${searchParams.query}`);
    baseKeywords.add(`${searchParams.query} Tunisie`);
    baseKeywords.add(`${searchParams.query} prix`);
  }

  // Enhanced choice keywords
  if (searchParams.choice && searchParams.choice in keywordMappings) {
    keywordMappings[searchParams.choice as keyof typeof keywordMappings]
      .forEach(kw => baseKeywords.add(kw));
  }

  // Enhanced category keywords
  if (searchParams.category) {
    const categoryKeywords = [
      searchParams.category,
      `${searchParams.category} Tunisie`,
      `acheter ${searchParams.category}`,
      `${searchParams.category} prix`,
      `meilleur ${searchParams.category}`,
      `${searchParams.category} en ligne`
    ];
    categoryKeywords.forEach(kw => baseKeywords.add(kw));
  }

  // Enhanced brand keywords
  if (searchParams.brand) {
    const brandKeywords = [
      searchParams.brand,
      `${searchParams.brand} Tunisie`,
      `produits ${searchParams.brand}`,
      `acheter ${searchParams.brand}`,
      `${searchParams.brand} original`,
      `prix ${searchParams.brand}`
    ];
    brandKeywords.forEach(kw => baseKeywords.add(kw));
  }

  // Enhanced color keywords
  if (searchParams.color) {
    const colorKeywords = [
      searchParams.color,
      `produits ${searchParams.color}`,
      `${searchParams.color} Tunisie`,
      `couleur ${searchParams.color}`,
      `${searchParams.color} en stock`
    ];
    colorKeywords.forEach(kw => baseKeywords.add(kw));
  }

  // Enhanced location and service keywords
  const serviceKeywords = [
    "Tunisie", "acheter en ligne Tunisie", "boutique en ligne Tunisie",
    "e-commerce Tunisie", "livraison Tunisie", "shop en ligne Tunisie",
    "achat en ligne sécurisé", "paiement en ligne Tunisie",
    "meilleur prix Tunisie", "vente en ligne Tunisie"
  ];

  serviceKeywords.forEach(kw => baseKeywords.add(kw));

  // Return as array, limited to reasonable size
  return Array.from(baseKeywords).slice(0, 50);
}

// For schema.org keywords property
export function generateSchemaKeywords(searchParams: SearchParamsProductSearch): string {
  const keywords = generateKeywords(searchParams);
  return keywords.slice(0, 10).join(", ");
}