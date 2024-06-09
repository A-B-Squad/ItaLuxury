import { Context } from "@/pages/api/graphql";

export const payedPackage = async (
    _: any,
    { packageId }: { packageId: string },
    { prisma }: Context
) => {
    try {
        const existingPackage = await prisma.package.findFirst({
            where: { id: packageId }
        });

        if (!existingPackage) {
            return new Error("Package not found");
        }

        const checkout = await prisma.checkout.findFirst({
            where: { id: existingPackage.checkoutId }
        });

        if (!checkout) {
            return new Error("Checkout not found");
        }

        const userId = checkout.userId;
        if (!userId) {
            return new Error("User ID not found in checkout");
        }


        await prisma.package.update({
            where: { id: packageId },
            data: {
                status: "PAYED",
            },
        });

        return "Package updated successfully.";
    } catch (error) {
        console.error("Error updating package:", error);
        return new Error("Failed to update package");
    }
};

