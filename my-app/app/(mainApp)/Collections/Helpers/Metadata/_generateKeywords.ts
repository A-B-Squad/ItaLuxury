import { SearchParamsProductSearch } from "@/app/types";
import keywords from "@/public/scripts/keywords";

export default function generateKeywords(searchParams: SearchParamsProductSearch): string[] {
  const keywordSet = new Set(keywords);
  const currentYear = new Date().getFullYear();

  // Choice-based keywords
  const choiceKeywords = {
    'new-product': [
      `nouveautés ${currentYear}`,
      "nouvelle collection",
      "derniers produits",
      "produits récents"
    ],
    'in-discount': [
      "promotion",
      "soldes",
      "réduction",
      "prix cassés",
      "offres spéciales"
    ],
  };

  if (searchParams.choice && searchParams.choice in choiceKeywords) {
    choiceKeywords[searchParams.choice as keyof typeof choiceKeywords]
      .forEach(kw => keywordSet.add(kw));
  }

  // Query keywords
  if (searchParams.query) {
    keywordSet.add(searchParams.query);
    keywordSet.add(`${searchParams.query} Tunisie`);
    keywordSet.add(`acheter ${searchParams.query}`);
  }

  // Category keywords
  if (searchParams.category) {
    keywordSet.add(searchParams.category);
    keywordSet.add(`${searchParams.category} Tunisie`);
    keywordSet.add(`acheter ${searchParams.category}`);
    keywordSet.add(`${searchParams.category} en ligne`);
  }

  // Brand keywords
  if (searchParams.brand) {
    keywordSet.add(searchParams.brand);
    keywordSet.add(`${searchParams.brand} Tunisie`);
    keywordSet.add(`produits ${searchParams.brand}`);
    keywordSet.add(`${searchParams.brand} original`);
  }

  // Color keywords
  if (searchParams.color) {
    keywordSet.add(searchParams.color);
    keywordSet.add(`produits ${searchParams.color}`);
    keywordSet.add(`couleur ${searchParams.color}`);
  }

  // Core Tunisia e-commerce keywords
  const coreKeywords = [
    "Tunisie",
    "acheter en ligne Tunisie",
    "boutique en ligne Tunisie",
    "e-commerce Tunisie",
    "livraison Tunisie",
    "ita-luxury",
    "ita luxury Tunisie"
  ];

  coreKeywords.forEach(kw => keywordSet.add(kw));

  // Return limited, relevant keywords
  return Array.from(keywordSet).slice(0, 40);
}