import { Context } from "@apollo/client";

export const createPackageComments = async (
  _: any,
  { packageId, comment }: { packageId: string; comment: string[] },
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
        comments: { set: comment },
      },
    });

    return "Package updated successfully.";
  } catch (error) {
    console.error("Error updating package:", error);
    throw new Error("Failed to update package");
  }
};
