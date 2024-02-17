import { Context } from "@/pages/api/graphql";

export const createProduct = async (
  _: any,
  { input }: { input: ProductInput },
  { prisma }: Context
) => {
  try {
    const {
      name,
      price,
      isVisible,
      reference,
      description,
      inventory,
      images,
      createdAt,
      categoryIds,
      productDiscountIds,
      variantInputs,
      attributeInputs,
      colorsId,
    } = input;

    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
        isVisible,
        reference,
        description,
        inventory,
        images: { set: images },
        createdAt,
        categories: {
          connect: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
        productDiscounts: {
          connect: productDiscountIds.map((discountId) => ({ id: discountId })),
        },
        variants: { create: variantInputs },
        attributes: { create: attributeInputs },
        Colors: { connect: colorsId ? { id: colorsId } : undefined },
      },
    });

    return createdProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product.");
  }
};
