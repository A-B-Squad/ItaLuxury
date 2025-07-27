import { Context } from "@/pages/api/graphql";

export const getUserVouchers = async (
  _: any,
  { userId, includeUsed = false }: { userId: string; includeUsed?: boolean },
  { prisma }: Context
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const whereClause: any = { userId };
    
    // Only include unused vouchers if includeUsed is false
    if (!includeUsed) {
      whereClause.isUsed = false;
      whereClause.expiresAt = { gt: new Date() }; // Not expired
    }

    const vouchers = await prisma.voucher.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        checkout: {
          select: {
            id: true,
            createdAt: true
          }
        }
      }
    });

    return vouchers;
  } catch (error) {
    console.error("Error fetching user vouchers:", error);
    throw error;
  }
};