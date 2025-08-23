import { SearchParamsProductSearch } from "@/app/types";
import keywords from "@/public/scripts/keywords";

export default function generateKeywords(searchParams: SearchParamsProductSearch): string[] {
    const baseKeywords = new Set(keywords);
  
    const keywordMappings = {
      'new-product': ["nouveautés", "nouvelle collection", "derniers produits"],
      'in-discount': ["promotion", "soldes", "réduction", "remise", "bon prix"],
    };
  
    // Add choice-specific keywords
    if (searchParams.choice && searchParams.choice in keywordMappings) {
      keywordMappings[searchParams.choice as keyof typeof keywordMappings].forEach(kw => baseKeywords.add(kw));
    }
  
    // Add category keywords
    if (searchParams.category) {
      [searchParams.category, `${searchParams.category} Tunisie`].forEach(kw => baseKeywords.add(kw));
    }
  
    // Add color keywords
    if (searchParams.color) {
      [searchParams.color, `produits ${searchParams.color}`, `${searchParams.color} Tunisie`].forEach(kw => baseKeywords.add(kw));
    }
  
    // Add brand keywords
    if (searchParams.brand) {
      [searchParams.brand, `${searchParams.brand} Tunisie`, `produits ${searchParams.brand}`].forEach(kw => baseKeywords.add(kw));
    }
  
    // Add general keywords
    ["Tunisie", "acheter en ligne", "boutique en ligne", "shopping en ligne", "e-commerce Tunisie"]
      .forEach(kw => baseKeywords.add(kw));
  
    return Array.from(baseKeywords);
  }