import { Context } from "@/pages/api/graphql";

export const createPackageComments = async (
  _: any,
  { packageId, comments }: { packageId: string; comments: string[] },
  { prisma }: Context
) => {
  try {
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
    });

    if (!existingPackage) {
      throw new Error("Package not found");
    }

    await prisma.package.update({
      where: { id: packageId },
      data: {
        comments: { set: comments }, 
      },
    });

    return "Package updated successfully.";
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};
