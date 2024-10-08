import { Context } from "@/pages/api/graphql";

// Function to check if a date is before or equal to the current date
const isDateBeforeOrEqual = (date: number | Date) => {
  const currentDate = new Date();
  // Adjust current date by 1 hour to match your time zone
  currentDate.setHours(currentDate.getHours() + 1);
  return date <= currentDate;
};

export const deleteAutoProductDiscount = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        productDiscounts: {
          include: {
            Discount: true,
          },
        },
      },
    });

    for (const product of products) {
      const expiredDiscountIds = product.productDiscounts
        .filter((discount: { dateOfEnd: string | number | Date; }) => isDateBeforeOrEqual(new Date(discount.dateOfEnd)))
        .map((expiredDiscount: { id: string; }) => expiredDiscount.id);

      if (expiredDiscountIds.length > 0) {
        await prisma.productDiscount.deleteMany({
          where: {
            id: {
              in: expiredDiscountIds,
            },
          },
        });
      }

      const validProductDiscounts = product.productDiscounts.filter(
        (discount: { dateOfEnd: string | number | Date; }) => {
          return !isDateBeforeOrEqual(new Date(discount.dateOfEnd));
        }
      );

      await prisma.product.update({
        where: { id: product.id },
        data: {
          productDiscounts: {
            set: validProductDiscounts.map((validDiscount: { id: string; }) => ({
              id: validDiscount.id,
            })),
          },
        },
      });
    }

    return "All Discounts Deleted Successfully";
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw new Error("Failed to delete discounts");
  }
};
