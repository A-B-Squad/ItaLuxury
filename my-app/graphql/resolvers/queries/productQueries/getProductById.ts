import { Context } from "@/pages/api/graphql";

export const productById = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {

        categories: {
          include: { subcategories: { include: { subcategories: true } } },
        }, // Include categories related to products
        productDiscounts: true, // Include product discount related to the product
        baskets: true, // Include baskets related to the product
        reviews: true, // Include reviews related to the product
        favoriteProducts: true, // Include favorite products related to the product
        Colors: true,
        Brand: true,
      },
    });
    if (!product) {
      return new Error("Product not found");
    }

    return product;
  } catch (error) {
    console.log("Failed to fetch products", error);
    return new Error("Failed to fetch products");
  }
};
