import { Context } from "@/pages/api/graphql";

export const getUserPointTransactions = async (
  _: any,
  { userId, limit, offset }: { userId: string; limit?: number; offset?: number },
  { prisma }: Context
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const transactions = await prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: offset || 0,
      take: limit || 50,
      include: {
        checkout: {
          select: {
            id: true,
            total: true,
            createdAt: true
          }
        }
      }
    });

    return transactions;
  } catch (error) {
    console.error("Error fetching user point transactions:", error);
    throw error;
  }
};