import { Context } from "@/pages/api/graphql";

export const createCategory = async (
  _: any,
  { input }: { input: CreateCategoryInput },
  { prisma }: Context
) => {
  try {
    const { name, parentId, bigImage, smallImage, description } = input;
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
    if (error instanceof Error) {
      // Log the full error for debugging
      console.error("Error creating category:", error);

      // Handle specific Prisma error codes
      if ((error as any).code === "P2002") {
        throw new Error(
          "A category with this name already exists. Please choose a different name."
        );
      }

      // Handle generic errors
      throw new Error(`An error occurred: ${error.message}`);
    } else {
      // Handle unexpected error types
      throw new Error("An unknown error occurred");
    }
  }
};
