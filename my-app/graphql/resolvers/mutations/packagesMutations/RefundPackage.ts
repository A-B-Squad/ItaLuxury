import { Context } from "@apollo/client";

interface RefundPackageInput {
  packageId: string;
  cause: string;
  brokenProducts: { productId: string; quantity: number }[];
}

// ==================== HELPER FUNCTIONS ====================

// Check if package is refundable
const isPackageRefundable = (packageData: any): boolean => {
  return packageData && packageData.status === "PAYED_AND_DELIVERED";
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

// Build product update data based on refund cause
const buildRefundUpdateData = (
  refundQuantity: number,
  brokenQuantity: number,
  cause: string
) => {
  const updateData: any = {
    solde: { decrement: refundQuantity },
  };

  if (cause === "BROKEN") {
    updateData.broken = { increment: brokenQuantity };
    updateData.inventory = { increment: refundQuantity - brokenQuantity };
  } else {
    updateData.inventory = { increment: refundQuantity };
  }

  return updateData;
};

// Create broken product record if needed
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

// Process single product refund
const processProductRefund = async (
  prisma: any,
  product: any,
  brokenProducts: { productId: string; quantity: number }[],
  cause: string
) => {
  const brokenQuantity = getBrokenQuantity(product.productId, brokenProducts);
  const refundQuantity = product.productQuantity;

  const updateData = buildRefundUpdateData(
    refundQuantity,
    brokenQuantity,
    cause
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

// Process all products for refund
const processAllProductRefunds = async (
  prisma: any,
  products: any[],
  brokenProducts: { productId: string; quantity: number }[],
  cause: string
) => {
  if (!products || products.length === 0) {
    return;
  }

  for (const product of products) {
    await processProductRefund(prisma, product, brokenProducts, cause);
  }
};

// Update package to refunded status
const updatePackageToRefunded = async (prisma: any, packageId: string) => {
  await prisma.package.update({
    where: { id: packageId },
    data: {
      status: "REFUNDED",
      returnedAt: new Date(),
    },
  });
};

// ==================== MAIN FUNCTION ====================

export const refundPackage = async (
  _: any,
  { input }: { input: RefundPackageInput },
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

    // Validate package is refundable
    if (!isPackageRefundable(findPackage)) {
      throw new Error("Package not found or not in a refundable state");
    }

    // Process all products
    const products = findPackage.Checkout?.productInCheckout;
    await processAllProductRefunds(prisma, products, brokenProducts, cause);

    // Update package status
    await updatePackageToRefunded(prisma, packageId);

    return "Package refunded successfully";
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while refunding the package.");
  }
};