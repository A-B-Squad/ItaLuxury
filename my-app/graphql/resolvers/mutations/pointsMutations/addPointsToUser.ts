import { Context } from "@/pages/api/graphql";
import { PointType } from "@prisma/client";

interface AddPointsInput {
  userId: string;
  points: number;
  description?: string;
  PointType: PointType;
}

export const addPointsToUser = async (
  _: any,
  { userId, points, description, PointType }: AddPointsInput,
  { prisma }: Context
) => {
  try {
    // Validate the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    console.log({ userId, points, description, PointType });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Add points to the user
    const result = await prisma.$transaction(async (tx) => {
      // Create a point transaction
      const pointTransaction = await tx.pointTransaction.create({
        data: {
          userId,
          amount: points,
          type: PointType,
          description: description || "Points added by admin",
        },
      });

      // Update the user's points
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { points: user.points + points },
      });

      return { updatedUser, pointTransaction };
    });

    console.log("Transaction created:", result.pointTransaction);
    console.log("User updated:", result.updatedUser);

    return "result.updatedUser";
  } catch (error) {
    console.error("Error adding points to user:", error);
    throw error;
  }
};