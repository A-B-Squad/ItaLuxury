import { Context } from "@apollo/client";

export const deleteBundle = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    await prisma.bundle.delete({
      where: { id },
    });

    return "Bundle deleted successfully";
  } catch (error) {
    throw new Error("Failed to delete bundle");
  }
};