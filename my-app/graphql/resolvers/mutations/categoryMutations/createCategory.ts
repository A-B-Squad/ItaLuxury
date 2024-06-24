import { Context } from "@/pages/api/graphql";

export const createCategory = async (
  _: any,
  { input }: { input: CreateCategoryInput },
  { prisma }: Context
) => {
  try {
    const { name, parentId,
      bigImage,
      smallImage,
      description

    } = input;
    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name,
        parentId: parentId || null,
        bigImage: bigImage || null,
        smallImage,
        description,
      },
    });

    // If parentId is provided, link the category as a subcategory
    if (parentId) {
      await prisma.category.update({
        where: { id: parentId },
        data: {
          subcategories: {
            connect: {
              id: newCategory.id,
            },
          },
        },
      });
    }
    return "new Category created";
  } catch (error) {
    console.log(error, "============================");

    console.error("Error creating category:", error);
    return new Error("Failed to create category");
  }
};
