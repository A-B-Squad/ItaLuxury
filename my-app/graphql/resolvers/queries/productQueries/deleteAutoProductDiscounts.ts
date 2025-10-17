import { Context } from "@apollo/client";




export const deleteAutoProductDiscount = async (
  _: any,
  __: any,
  { prisma }: Context
) => {
  try {


    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);

    await prisma.productDiscount.deleteMany({
      where: {
        dateOfEnd: {
          lte: currentDate
        }
      }
    });
    return "All expired discounts deleted successfully";
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw new Error("Failed to delete discounts");
  }
};
