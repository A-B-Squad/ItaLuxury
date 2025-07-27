import { Context } from "@/pages/api/graphql";

export const getUserPoints = async (
  _: any,
  { userId }: { userId: string },
  { prisma }: Context
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true }
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user.points;
  } catch (error) {
    console.error("Error fetching user points:", error);
    throw error;
  }
};