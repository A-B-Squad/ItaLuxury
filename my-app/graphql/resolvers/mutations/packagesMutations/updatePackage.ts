import { Context } from "@/pages/api/graphql";

export const updatePackage = async (
  _: any,
  { input }: { input: UpdatePackageInput },
  { prisma }: Context
) => {
  try {
    const { packageId, status } = input;

    const findPackege = await prisma.package.findFirst({
      where: { id: packageId }, include: {
       Checkout:true
      }
    })
    // Create the package with the provided data
console.log(findPackege);

    if (status === "BACK") {

    }

    const newPackage = await prisma.package.update({
      where: {
        id: packageId
      },
      data: {
        id: packageId,
        status
      },
      include: {
        Checkout: true
      }
    });
    return newPackage;



  } catch (error) {
    // Handle errors
    console.error("Error creating package:", error);
    return new Error("Failed to create package");
  }
};
