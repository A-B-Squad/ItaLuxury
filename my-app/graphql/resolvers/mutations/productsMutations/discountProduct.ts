import { Context } from "@/pages/api/graphql";

// Resolver for creating a discount for a product
export const createProductDiscount = async (
  _: any,
  { productId, input }: { productId: number; input: ProductDiscountInput },
  { prisma }: Context
) => {
  try {
    // First, ensure that the product with the provided productId exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { productDiscounts: true }, // Include productDiscounts to avoid duplicate creation
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Create the discount for the product
    const createdDiscount = await prisma.productDiscount.create({
      data: {
        // Connect the discount to the product
        product: { connect: { id: productId } },
        // Include other properties of the discount from the input
        ...input,
      },
    });

    return createdDiscount;
  } catch (error) {
    console.error("Error creating product discount:", error);
    throw new Error("Failed to create product discount.");
  }
};

// Resolver for updating a product discount
export const updateProductDiscount = async (
    _: any,
    { id, input }: { id: number; input:any },
    { prisma }: Context
  ) => {
    try {
      const updatedProductDiscount = await prisma.productDiscount.update({
        where: { id },
        data: input,
      });
      return updatedProductDiscount;
    } catch (error) {
      console.error("Error updating product discount:", error);
      throw new Error("Failed to update product discount.");
    }
  };
  
