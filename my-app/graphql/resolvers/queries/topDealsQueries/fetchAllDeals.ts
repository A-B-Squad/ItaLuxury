import { Context } from "@apollo/client";

export const allDeals = async (_: any, __: any, { prisma }: Context) => {
  try {
    const products = await prisma.topDeals.findMany(



      {
        include: {
          product: {

            include: {
              productDiscounts: true,

              Colors: true,
              categories: {
                include: {
                  subcategories: {
                    include: { subcategories: true },
                  },
                },
              },
            },
          },
        },
      });

    // Flag to check if there is any product with a discount
    let hasDiscount = false;

    for (let index = 0; index < products.length; index++) {
      const product = products[index];

      if (product.product && product.product.productDiscounts.length > 0) {
        hasDiscount = true;
        break; // No need to check further once we found a discount
      }
    }

    // If no products have discounts, update the visibility status
    if (!hasDiscount) {
      // First, find the ID of the "topDeals" section
      const section = await prisma.content_visibility.findFirst({
        where: {
          section: "TOP DEAL",
        },
      });

      if (section) {
        // Update the visibility status using the found ID
        await prisma.content_visibility.update({
          where: {
            id: section.id,
          },
          data: { visibility_status: false },
        });
        await prisma.topDeals.deleteMany();
      }
    }

    return products;
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw new Error("Failed to fetch products");
  }
};
