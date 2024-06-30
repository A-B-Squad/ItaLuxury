import { Context } from "@/pages/api/graphql";

const generateCustomId = async (prisma: any) => {
  const currentYear = new Date().getFullYear();
  const prefix = "FC";
  const suffix = currentYear.toString();

  // Obtenez le nombre total de packages pour l'année en cours
  const packagesThisYear = await prisma.package.count({
    where: {
      createdAt: {
        gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
        lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
      },
    },
  });

  // Incrémentez le compteur
  const newCount = packagesThisYear + 1;
  const formattedCount = newCount.toString().padStart(5, "0");

  // Créez l'identifiant customisé
  const customId = `${prefix}${formattedCount}/${suffix}`;
  return customId;
};

export const createCheckout = async (
  _: any,
  { input }: { input: CreateCheckoutInput },
  { prisma }: Context
) => {
  try {
    const {
      userId,
      governorateId,
      address,
      total,
      phone,
      userName,
      couponsId,
    } = input;

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
          create: products,
        },
        phone,
        address,
        total,
        couponsId: couponsId || null,
      },
    });
    if (couponsId) {
      await prisma.coupons.update({
        where: {
          id: couponsId,
        },
        data: {
          available: false,
        },
      });
    }
    //delete basket with User id
    await prisma.basket.deleteMany({
      where: { userId: userId },
    });
    const customId = await generateCustomId(prisma);

    // Create a new package associated with the checkout ID
    await prisma.package.create({
      data: {
        checkoutId: newCheckout.id,
        customId,
        status: "PROCESSING",
      },
    });

    return newCheckout;
  } catch (error) {
    // Handle errors
    console.error("Error creating checkout:", error);
    return error;
  }
};
