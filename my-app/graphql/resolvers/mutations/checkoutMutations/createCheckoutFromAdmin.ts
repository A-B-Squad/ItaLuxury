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

export const createCheckoutFromAdmin = async (
  _: any,
  { input }: { input: CreateCheckoutFromAdminInput },
  { prisma }: Context
) => {
  console.log(input);

  try {
    const {
      userId,
      governorateId,
      address,
      total,
      phone,
      userName,
      products,
      manualDiscount,
    } = input;
    console.log(input);

    const productInCheckout = products.map((product: any) => {
      const productDiscounts = product.Product?.productDiscounts;

      return {
        productId: product.productId,
        productQuantity: product.productQuantity,
        price: product.price ?? 0,
        discountedPrice:
          productDiscounts && productDiscounts.length > 0
            ? productDiscounts[0].newPrice
            : 0,
      };
    });

    const newCheckout = await prisma.checkout.create({
      data: {
        userId,
        userName,
        governorateId,
        productInCheckout: {
          create: productInCheckout,
        },
        manualDiscount,
        phone,
        address,
        total,
      },
    });

    const customId = await generateCustomId(prisma);

    const newPackage = await prisma.package.create({
      data: {
        checkoutId: newCheckout.id,
        customId,
        status: "PROCESSING",
      },
    });

    return newPackage.id;
  } catch (error) {
    // Handle errors
    console.error("Error creating checkout:", error);
    return error;
  }
};
