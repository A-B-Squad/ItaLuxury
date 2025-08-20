import { Context } from "@apollo/client";

export const subcategoriesByParentId = async (
  _: any,
  { parentId }: { parentId: string },
  { prisma }: Context
) => {
  try {
    const subcategories = await prisma.category.findMany({
      where: {
        parentId
      },
      include: {
        products: true, // Include products related to subcategories
        subcategories: true // Include subcategories related to subcategories

      }
    });

    if (subcategories.length === 0) {
      return new Error(`Category with ID ${parentId} has no subcategories`);
    }

    return subcategories;
  } catch (error) {
    console.log('Failed to fetch subcategories', error);
    return new Error('Failed to fetch subcategories');
  }
};
