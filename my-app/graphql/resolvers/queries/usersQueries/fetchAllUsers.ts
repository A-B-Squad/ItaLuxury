import { Context } from "@/pages/api/graphql";

export const fetchAllUsers = async (_: any, __: any, { prisma }: Context) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        pointTransactions: true,
        Voucher: true,
        reviews: {
          include: {
            product: true,
          },
        },
        ContactUs: true,
        checkout: {

          include: {
            package: true,
            Governorate: true,
            productInCheckout:{
              include:{
                product:true
              }
            }

          },
        },
      },
    });
    return users;
  } catch (error) {
    console.log("Failed to fetch users", error);
    return error;
  }
};
