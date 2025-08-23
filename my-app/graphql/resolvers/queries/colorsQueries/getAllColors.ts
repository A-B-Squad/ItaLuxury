import { Context } from "@apollo/client";



export const colors = async (
  _: any,
  { limit }: { limit: number },
  { prisma }: Context
) => {
  try {
    const colors = await prisma.colors.findMany({
      take: limit || undefined,
      include: {
        Product: true
      },
    });
    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw new Error("Failed to fetch colors");
  }
};
