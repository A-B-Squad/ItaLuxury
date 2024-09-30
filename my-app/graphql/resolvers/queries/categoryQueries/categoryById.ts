import { Context } from "@/pages/api/graphql";

export const categoryById = async (
  _: any,
  { categoryId }: { categoryId: string },
  { prisma }: Context
) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        products: true, 
        subcategories: true, 
        
      },
    });

    if (!category) {
      return new Error(`Category with  not found`);
    }

    return category;
  } catch (error) {
    console.log(`Failed to fetch category `, error);
    return new Error(`Failed to fetch category `);
  }
};
