import { Context } from "@/pages/api/graphql";


export const createCategory = async (_: any,{ input }: { input: CreateCategoryInput },{prisma}:Context) => {
    try {
        const { name, parentId } = input;        
        // Create the new category
        const newCategory = await prisma.category.create({
          data: {
            name,
            parentId: parentId || null // Set parentId to null if it's not provided
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
        return newCategory;
      } catch (error) {
        console.error("Error creating category:", error);
        throw new Error("Failed to create category");
      }

}