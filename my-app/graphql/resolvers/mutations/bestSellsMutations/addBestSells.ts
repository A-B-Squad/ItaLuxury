import { Context } from "@/pages/api/graphql";

export const addBestSells = async (
  _: any,
  { categoryId, productId }: { categoryId: string; productId: string },
  { prisma }: Context
) => {
//dupplicate  
  try {
    await prisma.bestSales.create({
      data: {
        categoryId,
        productId,
      },
    });
    return "product  added to best sells successfully";
  } catch (error) {
    return "An unexpected error occurred";
  }
};
