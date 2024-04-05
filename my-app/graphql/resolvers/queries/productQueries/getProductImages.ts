import { Context } from "@/pages/api/graphql";

export const getProductImages = async (
  _: any,
  { productId, colorId }: { productId: string; colorId: string },
  { prisma }: Context
) => {
  try {
    const productColorImage = await prisma.productColorImage.findFirst({
      where: {
        productId: productId,
        colorsId: colorId
      },
      select: {
        images: true
      }
    });
    return productColorImage ? productColorImage.images : [];
  } catch (error) {
    throw new Error(`Failed to fetch product images: ${error}`);
  }
};
