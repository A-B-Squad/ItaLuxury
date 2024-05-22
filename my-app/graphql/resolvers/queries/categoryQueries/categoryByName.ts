import { Context } from "@/pages/api/graphql";

export const categoryByName = async (
  _: any,
  { categoryName }: { categoryName: string },
  { prisma }: Context
) => {
  try {
    const category = await prisma.category.findUnique({
      where: {
        name: categoryName
      },
      include: {
        products: true, // Include products related to the category
        subcategories: true // Include subcategories related to the category
      }
    });

    if (!category) {
      return new Error(`Category with name ${categoryName} not found`);
    }

    return category;
  } catch (error) {
    console.log(`Failed to fetch category with name ${categoryName}`, error);
    return new Error(`Failed to fetch category with name ${categoryName}`);
  }
};
