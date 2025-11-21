import { Context } from "@apollo/client";

type ProductDiscountOrderByWithRelationInput = {
  product?: {
    createdAt?: "asc" | "desc";
    price?: "asc" | "desc";
    name?: "asc" | "desc";
  };
};

export const productsDiscounts = async (
  _: any,
  { limit }: { limit?: number },
  { prisma }: Context
) => {
  try {
    const takeValue = limit ? Number(limit) : undefined;
    const oneMinutePeriod = Math.floor(Date.now() / (60 * 1000));
    const now = new Date();

    // Define an array of ordering options
    const orderOptions: ProductDiscountOrderByWithRelationInput[] = [
      { product: { createdAt: "desc" } },
      { product: { price: "asc" } },
      { product: { name: "asc" } },
    ];

    // Select the current ordering based on the one-minute period
    const currentOrdering = orderOptions[oneMinutePeriod % orderOptions.length];

    const allProductDiscounts = await prisma.productDiscount.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        dateOfStart: { lte: now },
        dateOfEnd: { gte: now },
        product: {
          isVisible: true,
        },
      },
      include: {
        product: {
          include: {
            categories: {
              include: {
                subcategories: {
                  include: { subcategories: true }
                }
              },
            },
            baskets: true,
            reviews: true,
            favoriteProducts: true,
            Colors: true,
            Brand: true,
          },
        },
      },
      take: takeValue,
      orderBy: currentOrdering,
    });

    const formattedProducts = allProductDiscounts.map(
      (productDiscount: any) => ({
        id: productDiscount.product?.id,
        name: productDiscount.product?.name,
        slug: productDiscount.product?.slug,
        price: productDiscount.product?.price,
        isVisible: productDiscount.product?.isVisible,
        reference: productDiscount.product?.reference,
        description: productDiscount.product?.description,
        inventory: productDiscount.product?.inventory,
        solde: productDiscount.product?.solde,
        images: productDiscount.product?.images,
        createdAt: productDiscount.product?.createdAt,
        technicalDetails: productDiscount.product?.technicalDetails,
        baskets: productDiscount.product?.baskets,
        categories: productDiscount.product?.categories,
        Brand: productDiscount.product?.Brand,
        Colors: productDiscount.product?.Colors,
        favoriteProducts: productDiscount.product?.favoriteProducts,
        reviews: productDiscount.product?.reviews,
        productDiscounts: [productDiscount],
      })
    );

    return formattedProducts;
  } catch (error) {
    console.error("Failed to fetch product discounts:", error);
    throw new Error("Failed to fetch product discounts");
  }
};