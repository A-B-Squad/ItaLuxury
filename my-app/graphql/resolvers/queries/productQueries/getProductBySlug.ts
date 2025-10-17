import { Context } from "@apollo/client";
import { Category } from "@prisma/client";






// Helper function to delete expired discounts
const deleteExpiredDiscounts = async (prisma: any) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    await prisma.productDiscount.deleteMany({
      where: {
        dateOfEnd: {
          lte: currentDate
        }
      }
    });
  } catch (error) {
    console.error("Failed to delete expired discounts:", error);
  }
};



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

export const getProductBySlug = async (
  _: any,
  { slug }: { slug: string },
  { prisma }: Context
) => {
  try {

    // Clean up expired discounts before searching
    await deleteExpiredDiscounts(prisma);

    const product = await prisma.product.findUnique({
      where: {
        slug,
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
