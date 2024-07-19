import { Context } from "@/pages/api/graphql";

interface updateCustomerCheckoutInput {
  checkoutId: string;
  userName: string;
  userId: string;
  governorateId: string;
  phone: number[];
  address: string;
}

export const updateCustomerCheckout = async (
  _: any,
  { input }: { input: updateCustomerCheckoutInput },
  { prisma }: Context
) => {
  try {
    const { checkoutId, userName, userId, governorateId, phone, address } =
      input;

    console.log(input);

    // Fetch the existing checkout
    const existingCheckout = await prisma.checkout.findUnique({
      where: { id: checkoutId },
    });
console.log(existingCheckout);

    if (!existingCheckout) {
      throw new Error("Checkout not found");
    }

    // Prepare the update data
    const updateData: any = {};

    if (userName) updateData.userName = userName;
    if (userId) updateData.userId = userId;
    if (governorateId) updateData.governorateId = governorateId;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    // Perform the update
    await prisma.checkout.update({
      where: { id: checkoutId },
      data: updateData,
      include: { productInCheckout: true },
    });

    return "updated Checkout";
  } catch (error) {
    console.log(error);

    console.error("Error updating checkout:", error);
    throw error;
  }
};
