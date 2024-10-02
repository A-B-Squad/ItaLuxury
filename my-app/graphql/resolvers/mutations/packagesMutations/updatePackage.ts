import { Context } from "@/pages/api/graphql";

export const updatePackage = async (
  _: any,
  { input }: { input: UpdatePackageInput },
  { prisma }: Context
) => {
  try {
    const { packageId, status } = input;

  
    await prisma.package.update({
      where: {
        id: packageId,
      },
      data: {
        id: packageId,
        status,
      },
    });
    return `package ${status}`;
  } catch (error) {
    console.error("Error updating package:", error);
    return new Error("Failed to update package");
  }
};
