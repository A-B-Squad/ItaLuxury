import { Context } from "@/pages/api/graphql";


export const updateCategory = async (
  _: any,
  { id, input }: { id: string, input: UpdateCategoryInput },
  { prisma }: Context
) => {
  try {
    const { name } = input;

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name
      }
    });

    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    return new Error("Failed to update category");
  }
};
