import { Context } from "@apollo/client";

interface CancelPackageInput {
  packageId: string;
  cause: string;
  brokenProducts: { productId: string; quantity: number }[];
}

// ==================== HELPER FUNCTIONS ====================

// Cancellable package statuses
const CANCELLABLE_STATUSES = [
  "PROCESSING",
  "CONFIRMED",
  "TRANSFER_TO_DELIVERY_COMPANY"
];

// Check if package can be cancelled
const isPackageCancellable = (packageStatus: string): boolean => {
  return CANCELLABLE_STATUSES.includes(packageStatus);
};

// Check if inventory should be restored
const shouldRestoreInventory = (status: string): boolean => {
  return status === "TRANSFER_TO_DELIVERY_COMPANY" || status === "CONFIRMED";
};

// Find broken quantity for a product
const getBrokenQuantity = (
  productId: string,
  brokenProducts: { productId: string; quantity: number }[]
): number => {
  const brokenProduct = brokenProducts.find(
    (bp) => bp.productId === productId
  );
  return brokenProduct ? brokenProduct.quantity : 0;
};

// Build product update data
const buildProductUpdateData = (
  brokenQuantity: number,
  productQuantity: number,
  packageStatus: string
) => {
  const updateData: any = {
    broken: { increment: brokenQuantity },
  };

  if (shouldRestoreInventory(packageStatus)) {
    const notBrokenQuantity = productQuantity - brokenQuantity;
    updateData.solde = { decrement: productQuantity };
    updateData.inventory = { increment: notBrokenQuantity };
  }

  return updateData;
};

// Create broken product record
const createBrokenProductRecord = async (
  prisma: any,
  productId: string,
  brokenQuantity: number,
  cause: string
) => {
  if (brokenQuantity > 0) {
    await prisma.breakedProduct.create({
      data: {
        productId,
        quantity: brokenQuantity,
        cause,
      },
    });
  }
};

// Process single product cancellation
const processProductCancellation = async (
  prisma: any,
  product: any,
  brokenProducts: { productId: string; quantity: number }[],
  packageStatus: string,
  cause: string
) => {
  const brokenQuantity = getBrokenQuantity(product.productId, brokenProducts);

  const updateData = buildProductUpdateData(
    brokenQuantity,
    product.productQuantity,
    packageStatus
  );

  await prisma.product.update({
    where: { id: product.productId },
    data: updateData,
  });

  await createBrokenProductRecord(
    prisma,
    product.productId,
    brokenQuantity,
    cause
  );
};

// Process all products in package
const processAllProducts = async (
  prisma: any,
  products: any[],
  brokenProducts: { productId: string; quantity: number }[],
  packageStatus: string,
  cause: string
) => {
  if (!products || products.length === 0) {
    return;
  }

  for (const product of products) {
    await processProductCancellation(
      prisma,
      product,
      brokenProducts,
      packageStatus,
      cause
    );
  }
};

// Update package to cancelled status
const updatePackageStatus = async (prisma: any, packageId: string) => {
  await prisma.package.update({
    where: { id: packageId },
    data: {
      status: "CANCELLED",
      returnedAt: new Date(),
    },
  });
};

// ==================== MAIN FUNCTION ====================

export const cancelPackage = async (
  _: any,
  { input }: { input: CancelPackageInput },
  { prisma }: Context
) => {
  const { packageId, cause, brokenProducts } = input;

  try {
    // Fetch package with checkout details
    const findPackage = await prisma.package.findFirst({
      where: { id: packageId },
      include: {
        Checkout: {
          include: {
            productInCheckout: true,
          },
        },
      },
    });

    // Validate package exists and is cancellable
    if (!findPackage || !isPackageCancellable(findPackage.status)) {
      throw new Error("Package not found or not in a cancellable state");
    }

    // Process all products in the package
    const products = findPackage.Checkout?.productInCheckout;
    await processAllProducts(
      prisma,
      products,
      brokenProducts,
      findPackage.status,
      cause
    );

    // Update package status
    await updatePackageStatus(prisma, packageId);

    return "Package cancelled successfully";
  } catch (error) {
    console.log(error);
    throw new Error("An error occurred while cancelling the package.");
  }
};