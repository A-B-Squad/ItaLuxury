import { Context } from "@/pages/api/graphql";

export const deleteProductBestSells = async (
  _: any,
  { productId }: { productId: string },
  { prisma }: Context
) => {
  try {
    await prisma.bestSales.deleteMany({
      where: {
        productId,
      },
    });

    return "product deleted successfully";
  } catch (error) {
    console.log(error);
    return "An unexpected error occurred";
  }
};
