import { Context } from "@apollo/client";

export const deleteApiCredentials = async (
  _: any,
  { id }: { id: string },
  { prisma }: Context
) => {
  try {
    await prisma.apiCredentials.deleteMany({
      where: {
        id: id,
      },
    });

    return "api deleted";
  } catch (error) {
    console.error("Error deleting API credentials:", error);
    throw new Error("Failed to create API credentials");
  }
};
