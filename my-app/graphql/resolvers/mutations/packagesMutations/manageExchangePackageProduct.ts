import { Context } from "@/pages/api/graphql";

export const exchangePackageProduct = async (
  _: any,
  { input }: { input: manageExchangePackageProductInput },
  { prisma }: Context
) => {
  const { packageId, cause, productId, description, productQuantity } = input;

  try {
    const findPackage = await prisma.package.findFirst({
      where: { id: packageId },
      include: {
        Checkout: {
          include: {
            products: true,
          },
        },
      },
    });

    const products = findPackage?.Checkout?.products;
    if (findPackage?.status === "EXCHANGE") {
      if (cause === "BROKEN" && products && products.length > 0) {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            inventory: {
              decrement: productQuantity,
            },
          },
        });
      }

      await prisma.backOrExchange.create({
        data: {
          productId: productId,
          cause: cause,
          description: description,
        },
      });
      await prisma.package.update({
        where: { id: packageId },
        data: {
          status: "PROCESSING",
        },
      });
    }
  } catch (error) {
    return "Error exchanging package";
  }
};
