import { Context } from "@/pages/api/graphql";

export const cancalPackage = async (
  _: any,
  { input }: { input: cancalPackageInput },
  { prisma }: Context
) => {
  const { packageId, cause, description } = input;
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
    if (findPackage?.status === "BACK") {
      if (cause !== "BROKEN") {
        if (products && products.length > 0) {
          for (const product of products) {
            await prisma.product.update({
              where: {
                id: product.productId,
              },
              data: {
                solde: {
                  decrement: product.productQuantity,
                },
                inventory: {
                  increment: product.productQuantity,
                },
              },
            });
          }
        }

        const productData = (products || []).map((product) => ({
          productId: product.productId,
          cause: cause,
          description: description,
        }));

        await prisma.backOrExchange.createMany({
          data: productData,
        });
      } else if (cause === "BROKEN") {
        if (products && products.length > 0) {
          for (const product of products) {
            await prisma.product.update({
              where: {
                id: product.productId,
              },
              data: {
                solde: {
                  decrement: product.productQuantity,
                },
              },
            });
          }
        }
        const productData = (products || []).map((product) => ({
          productId: product.productId,
          cause: cause,
          description: description,
        }));

        await prisma.backOrExchange.createMany({
          data: productData,
        });
      }
      return "Package Cancled successfully";
    }
  } catch (error) {
    console.log(error);
    return "An error occurred while cancelling the package.";
  }
};
