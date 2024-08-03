import { Context } from "@/pages/api/graphql";

export const createProduct = async (
  // Defining an async function called createProduct
  _: any,
  { input }: { input: ProductInput }, // Destructuring the second argument into input
  { prisma }: Context
) => {
  try {
    const {
      name,
      price,
      isVisible,
      purchasePrice,
      reference,
      description,
      inventory,
      images,
      categories,
      attributeInputs,
      colorsId,
      discount,
      brandId,
    } = input;

    // Creating a new product using prisma
    const productCreate = await prisma.product.create({
      // Defining the data for the new product
      data: {
        name,
        price,
        purchasePrice,
        isVisible,
        reference,
        description,
        inventory,
        images,
        colorsId,
        brandId,
        categories: {
          // Connecting the new product to existing categories
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
        attributes: { create: attributeInputs },
      },
      include: {
        Colors: true,
        Brand: true,
      },
    });

    // // If discount is provided
    if (discount) {
      // Looping through each discount input
      for (const discountInput of discount) {
        // Creating a new product discount
        await prisma.productDiscount.create({
          data: {
            productId: productCreate.id,
            newPrice: discountInput.newPrice,
            price,
            dateOfEnd: new Date(discountInput.dateOfEnd),
            dateOfStart: new Date(discountInput.dateOfStart),
            discountId: discountInput.discountId || null,
          },
        });
      }
    }

    return "product Created";
  } catch (error: any) {
    // Handle errors gracefully
    console.error("Error creating product:", error);
    return error;
  }
};
