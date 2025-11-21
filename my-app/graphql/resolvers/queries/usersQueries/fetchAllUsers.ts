import { Context } from "@apollo/client";

export const fetchAllUsers = async (_: any, __: any, { prisma }: Context) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
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
          orderBy: {
            createdAt: "desc",
          },
          include: {
            package: true,
            Governorate: true,
            productInCheckout: {
              include: {
                product: true
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
