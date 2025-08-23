import { Context } from "@apollo/client";

export const deleteBrand = async (
  _: any,
  { brandId }: { brandId: string },
  { prisma }: Context
) => {
  try {

    await prisma.product.updateMany({
      where: {
        brandId: brandId,
      },
      data: {
        brandId: null,
      },
    });
    // Delete the brand
    await prisma.brand.delete({
      where: {
        id: brandId,
      },
    });

    return "Brand deleted successfully";
  } catch (error) {
    console.log(error);
    return "An unexpected error occurred";
  }
};
