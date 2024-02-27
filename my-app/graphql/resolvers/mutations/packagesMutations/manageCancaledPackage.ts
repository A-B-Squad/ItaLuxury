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

    if (cause !== "CANCEL") {
      const products = findPackage?.Checkout?.products;
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
        productQuantity:product.productQuantity
      }));

      await prisma.backOrExchange.createMany({
        data: productData,
      });
    }
  } catch (error) {
    console.log(error);
    return "An error occurred while cancelling the package.";
  }
};
