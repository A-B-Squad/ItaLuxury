import { Context } from "@/pages/api/graphql";

export const updateCategory = async (
  _: any,
  { id, input }: { id: string; input: UpdateCategoryInput },
  { prisma }: Context
) => {
  try {
    const { name, parentId, bigImage, smallImage, description } = input;

    // Update the category
    await prisma.category.update({
      where: { id },
      data: {
        name,
        parentId: parentId || null,
        bigImage: bigImage || null,
        smallImage,
        description,
      },
    });

    return "Category Updated ";
  } catch (error) {
    console.error("Error updating category:", error);
    return new Error("Failed to update category");
  }
};
