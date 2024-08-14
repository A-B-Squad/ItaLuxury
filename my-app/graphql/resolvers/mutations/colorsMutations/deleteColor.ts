import { Context } from "@/pages/api/graphql";

export const deleteColor = async (
  _: any,
  { Hex }: { Hex: string },
  { prisma }: Context
) => {
  try {
    await prisma.colors.delete({
      where: {
        Hex,
      },
    });
    return "Color deleted successfully";
  } catch (error) {
    return "An unexpected error occurred";
  }
};
