import { Context } from "@/pages/api/graphql";

export const updatePackage = async (
  _: any,
  { input }: { input: UpdatePackageInput },
  { prisma }: Context
) => {
  try {
    const { packageId, status } = input;

    // const findPackage = await prisma.package.findFirst({
    //   where: { id: packageId },
    //   include: {
    //     Checkout: {
    //       include: {
    //         products: true,
    //       },
    //     },
    //   },
    // });

    // if (status === "BACK" && cause !== "BROKEN") {
    //   const products = findPackage?.Checkout?.products;

    //   if (products && products.length > 0) {
    //     for (const product of products) {
    //       await prisma.product.update({
    //         where: {
    //           id: product.productId,
    //         },
    //         data: {
    //           solde: {
    //             decrement: product.productQuantity, // Decrement by the quantity of the product
    //           },
    //           inventory: {
    //             increment: product.productQuantity, // Increment by the quantity of the product
    //           },
    //         },
    //       });
    //     }
    //   }

    // }

    // if (status === "EXCHANGE" && cause === "BROKEN") {
    //   const products = findPackage?.Checkout?.products;

    //   if (products && products.length > 0) {
    //     for (const product of products) {
    //       await prisma.product.update({
    //         where: {
    //           id: product.productId,
    //         },
    //         data: {
    //           solde: {
    //             decrement: product.productQuantity, // Decrement by the quantity of the product
    //           },
    //           inventory: {
    //             increment: product.productQuantity, // Increment by the quantity of the product
    //           },
    //         },
    //       });
    //     }
    //   }

    // }

    await prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        id: packageId,
        status,
      },
    });
    return `package ${status}`;
  } catch (error) {
    console.error("Error updating package:", error);
    return new Error("Failed to update package");
  }
};
