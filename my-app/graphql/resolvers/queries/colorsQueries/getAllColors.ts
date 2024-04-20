import { Context } from "@/pages/api/graphql";



export const colors = async (
  _: any,
  { limit }: { limit: number },
  { prisma }: Context
) => {
  try {
    const colors = await prisma.colors.findMany({
      take: limit || undefined, // Limit the number of colors returned
    });
    return colors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    throw new Error("Failed to fetch colors");
  }
};
