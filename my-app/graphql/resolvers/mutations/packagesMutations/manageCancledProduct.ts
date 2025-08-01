import { Context } from "@/pages/api/graphql";

export const cancalPackageProduct = async (
  _: any,
  { input }: { input: CancalPackageProductInput },
  { prisma }: Context
) => {
  const { packageId, cause, productId, productQuantity } = input;
  try {
    const findPackage = await prisma.package.findFirst({
      where: { id: packageId },
    });

    if (findPackage?.status === "BACK") {
      if (cause !== "BROKEN") {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            solde: {
              decrement: productQuantity,
            },
            inventory: { increment: productQuantity },
          },
        });
      } else if (cause === "BROKEN") {
        await prisma.product.update({
          where: {
            id: productId,
          },
          data: {
            solde: {
              decrement: productQuantity,
            },
          },
        });
      }
  

      return "Package Cancled successfully";
    }
  } catch (error) {
    console.log(error);
    return "An error occurred while cancelling the package.";
  }
};
