import { Context } from "@apollo/client";


const deleteSubcategories = async (prisma: any, categoryId: string) => {
  const subcategories = await prisma.category.findMany({
    where: { parentId: categoryId },
  });

  for (const subcategory of subcategories) {
    await deleteSubcategories(prisma, subcategory.id);
    await prisma.category.delete({
      where: { id: subcategory.id },
    });
  }
};

export const deleteCategory = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    // Recursively delete subcategories
    // await deleteSubcategories(prisma, id);

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return "deleted Category";
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Error("Failed to delete category");
  }
};
