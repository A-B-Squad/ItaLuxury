import { Context } from "@/pages/api/graphql";

export const createCheckout = async (
  _: any,
  { input }: { input: CreateCheckoutInput },
  { prisma }: Context
) => {
  try {
    const { userId, governorateId, address, total, phone, userName } = input;

    // Retrieve user's basket to get product IDs
    const userBasket = await prisma.basket.findMany({
      where: {
        userId,
      },
      include: {
        Product: true,
      },
    });

    if (!userBasket.length) {
      return new Error("User's basket not found");
    }

    // Extract product IDs and quantities from the user's basket
    const products = userBasket.map((basket) => ({
      productId: basket.productId,
      productQuantity: basket.quantity,
    }));

    // Create the checkout with the provided data and product IDs from the basket
    const newCheckout = await prisma.checkout.create({
      data: {
        userId,
        userName,
        governorateId,
        products: {
          create: products, // Associate products with the checkout
        },
        phone,
        address,
        total,
      },
    });
    //delete basket with User id
    await prisma.basket.deleteMany({
      where: { userId: userId }
    })
    // Create a new package associated with the checkout ID
    await prisma.package.create({
      data: {
        checkoutId: newCheckout.id,
        status: "PROCESSING",
      },
    });

    return newCheckout;
  } catch (error) {
    // Handle errors
    console.error("Error creating checkout:", error);
    return new Error("Failed to create checkout");
  }
};
