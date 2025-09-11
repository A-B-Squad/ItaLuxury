import { Context } from "@apollo/client";

interface UseVoucherInput {
  voucherCode: string;
  checkoutId?: string;
  isInStore?: boolean;
  amountUsed?: number;
  expiresAt: string
}
export const useVoucher = async (
  _: any,
  { input }: { input: UseVoucherInput },
  { prisma }: Context
) => {
  try {
    const { voucherCode, checkoutId, isInStore = false, amountUsed } = input;

    // Find the voucher
    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode },
      include: {
        user: true
      }
    });

    if (!voucher) {
      throw new Error(`Voucher with code ${voucherCode} not found`);
    }

    // Check if voucher is already used
    if (voucher.isUsed) {
      throw new Error(`Voucher with code ${voucherCode} has already been used`);
    }

    // Check if voucher is expired
    if (new Date() > voucher.expiresAt) {
      throw new Error(`Voucher with code ${voucherCode} has expired`);
    }

    if (isInStore) {
      // For in-store purchases, admin directly marks the voucher as used
      const updatedVoucher = await prisma.voucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
          amount: amountUsed || voucher.amount,
        },
      });

      return {
        success: true,
        message: `Voucher used in store. Amount: ${amountUsed || voucher.amount} TND`,
        voucher: updatedVoucher
      };
    } else {
      // For online purchases
      if (!checkoutId) {
        throw new Error("Checkout ID is required for online voucher use");
      }

      // Find the checkout
      const checkout = await prisma.checkout.findUnique({
        where: { id: checkoutId },
      });

      if (!checkout) {
        throw new Error(`Checkout with ID ${checkoutId} not found`);
      }

      // Calculate the amount to use (minimum of voucher amount and checkout total)
      const amountToUse = Math.min(voucher.amount, checkout.total);

      // Update checkout with voucher discount
      const updatedCheckout = await prisma.checkout.update({
        where: { id: checkoutId },
        data: {
          total: Math.max(0, checkout.total - amountToUse),
          Voucher: {
            connect: { id: voucher.id },
          },
          paymentMethod: "CASH_ON_DELIVERY"
        },
      });

      // Mark voucher as used
      const updatedVoucher = await prisma.voucher.update({
        where: { id: voucher.id },
        data: {
          isUsed: true,
          usedAt: new Date(),
          checkoutId,
          amount: amountToUse,
        },
      });

      return {
        success: true,
        message: `Voucher applied to checkout. Amount used: ${amountToUse} TND`,
        voucher: updatedVoucher,
        checkout: updatedCheckout
      };
    }
  } catch (error) {
    console.error("Error using voucher:", error);
    throw error;
  }
};