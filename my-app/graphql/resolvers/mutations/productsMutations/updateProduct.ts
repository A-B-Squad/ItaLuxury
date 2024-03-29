import { Context } from "@/pages/api/graphql";

export const updateProduct = async (
  _: any,
  { productId, input }: { productId: string; input: ProductInput },
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
      categories,
      attributeInputs,
      colorsId,
      discount,
    } = input;

    // Updating the product with the provided data
    const productUpdated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        isVisible,
        reference,
        description,
        inventory,
        images,
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        attributes: { create: attributeInputs },
      },
      include: {
        attributes: true,
        categories: true,
        productDiscounts: true,
      },
    });

    // If discount is provided
    if (discount) {
      // Iterate through the discountInput array
      for (const discountInput of discount) {
        // Check if a discount already exists for the product
        const existingDiscount = await prisma.productDiscount.findFirst({
          where: { productId, price },
        });

        // If an existing discount is found, update it
        if (existingDiscount) {
          await prisma.productDiscount.updateMany({
            where: { productId, price },
            data: {
              newPrice: discountInput.newPrice,
              dateOfEnd: new Date(discountInput.dateOfEnd).toISOString(),
              dateOfStart: new Date(discountInput.dateOfStart).toISOString(),
              discountId: discountInput.discountId,
            },
          });
          // If no existing discount is found, create a new one
        } else {
          await prisma.productDiscount.create({
            data: {
              productId,
              price: productUpdated.price,
              newPrice: discountInput.newPrice,
              dateOfEnd: new Date(discountInput.dateOfEnd).toISOString(),
              dateOfStart: new Date(discountInput.dateOfStart).toISOString(),
              discountId: discountInput.discountId,
            },
          });
        }
      }
    }

    // Return the updated product
    return productUpdated;
  } catch (error) {
    console.error("Error updating product:", error);
    return error
    return `Failed to update product." ${error}.`;

  }
};
