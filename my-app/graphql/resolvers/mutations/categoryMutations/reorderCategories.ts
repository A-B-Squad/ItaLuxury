import { Context } from "@apollo/client";

interface CategoryOrderInput {
  id: string;
  order: number;
}

export const reorderCategories = async (
  _: any,
  { categoryOrders }: { categoryOrders: CategoryOrderInput[] },
  { prisma }: Context
) => {
  try {
    // Validate input
    if (!categoryOrders || categoryOrders.length === 0) {
      throw new Error("No category orders provided");
    }

    // Update all categories with their new order in a transaction
    await prisma.$transaction(
      categoryOrders.map(({ id, order }) =>
        prisma.category.update({
          where: { id },
          data: { order },
        })
      )
    );

    return "Categories reordered successfully";
  } catch (error) {
    console.error("Error reordering categories:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to reorder categories");
  }
};