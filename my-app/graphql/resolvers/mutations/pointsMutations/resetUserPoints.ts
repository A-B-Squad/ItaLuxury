import { Context } from "@/pages/api/graphql";

interface ResetPointsInput {
  userId: string;
  reason?: string;
}

export const resetUserPoints = async (
  _: any,
  { input }: { input: ResetPointsInput },
  { prisma }: Context
) => {
  try {
    const { userId, reason } = input;

    // Validate the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Reset the user's points
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Create a point transaction for the reset
      if (user.points > 0) {
        await tx.pointTransaction.create({
          data: {
            userId,
            amount: user.points,
            type: "ADJUSTMENT",
            description: reason || "Points reset by admin",
          },
        });
      }

      // Update the user's points to 0
      return tx.user.update({
        where: { id: userId },
        data: { points: 0 },
      });
    });

    return updatedUser;
  } catch (error) {
    console.error("Error resetting user points:", error);
    throw error;
  }
};