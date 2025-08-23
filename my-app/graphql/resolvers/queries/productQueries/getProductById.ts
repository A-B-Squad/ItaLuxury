import { Context } from "@apollo/client";
import { Category } from "@prisma/client";

// Utilise directement les catégories passées depuis le produit
function sortCategoriesHierarchically(categories: Category[]) {
  const map: Record<string, Category & { children?: any[] }> = {};
  const result: Category[] = [];

  // Mise en map
  categories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] };
  });

  // Construction de la hiérarchie
  categories.forEach(cat => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children!.push(map[cat.id]);
    } else {
      result.push(map[cat.id]);
    }
  });

  // Retourne une version linéaire et ordonnée par niveau
  const linearSorted: Category[] = [];

  function flatten(category: Category & { children?: Category[] }) {
    linearSorted.push(category);
    category.children?.forEach(flatten);
  }

  result.forEach(flatten);

  return linearSorted;
}

export const productById = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          include: { subcategories: { include: { subcategories: true } } },
        },
        productDiscounts: true,
        baskets: true,
        reviews: true,
        favoriteProducts: true,
        Colors: true,
        Brand: true,
        GroupProductVariant: {
          include: {
            Products: {
              include: {
                Colors: true
              }
            }
          }
        }
      },
    });
    if (!product) {
      return new Error("Product not found");
    }
    const sortedCategories = sortCategoriesHierarchically(product.categories);

    return { ...product, categories: sortedCategories };
  } catch (error) {
    console.log("Failed to fetch products", error);
    return new Error("Failed to fetch products");
  }
};
