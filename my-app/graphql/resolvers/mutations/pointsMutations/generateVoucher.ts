import { Context } from "@apollo/client";
import { PointType } from "@prisma/client";
import { randomBytes } from "crypto";

interface GenerateVoucherInput {
  userId: string;
  amountUsed?: number;
  checkoutId: string;
  expiresAt: string;
}

export const generateVoucher = async (
  _: any,
  { input }: { input: GenerateVoucherInput },
  { prisma }: Context
) => {
  try {
    const { userId, amountUsed, expiresAt } = input;

    // Validate the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { pointTransactions: true },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get point settings
    const pointSettings = await prisma.pointSetting.findFirst();
    if (!pointSettings) {
      throw new Error("Point settings not configured");
    }

    // Check if user has enough points
    if (user.points < pointSettings.loyaltyThreshold) {
      throw new Error(`User does not have enough points. Required: ${pointSettings.loyaltyThreshold}, Current: ${user.points}`);
    }

    // Generate a unique voucher code
    const voucherCode = `VOC-${randomBytes(4).toString("hex").toUpperCase()}`;

    // Set voucher amount - use provided amount or default to loyalty reward value
    const voucherAmount = amountUsed || pointSettings.loyaltyRewardValue;

    // Parse the expiration date from the input
    const expirationDate = new Date(expiresAt);

    // Validate the expiration date
    if (Number.isNaN(expirationDate.getTime())) {
      throw new Error("Invalid expiration date provided");
    }

    // Ensure expiration date is in the future
    if (expirationDate <= new Date()) {
      throw new Error("Expiration date must be in the future");
    }

    // Create the voucher
    const voucher = await prisma.$transaction(async (tx: typeof prisma) => {
      // Create the voucher
      const newVoucher = await tx.voucher.create({
        data: {
          code: voucherCode,
          amount: voucherAmount,
          expiresAt: expirationDate,
          userId,
        },
      });

      // Create a point transaction for the voucher generation (negative amount to deduct points)
      await tx.pointTransaction.create({
        data: {
          userId,
          amount: -pointSettings.loyaltyThreshold, // Negative to indicate deduction
          type: PointType.ADJUSTMENT,
          description: `Points converted to voucher ${voucherCode} worth ${voucherAmount} TND`,
        },
      });

      // Deduct points from user
      await tx.user.update({
        where: { id: userId },
        data: { points: user.points - pointSettings.loyaltyThreshold },
      });

      return newVoucher;
    });

    return voucher;
  } catch (error) {
    console.error("Error generating voucher:", error);
    throw error;
  }
};