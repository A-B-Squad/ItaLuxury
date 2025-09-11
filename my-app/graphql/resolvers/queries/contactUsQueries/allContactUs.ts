import { Context } from "@apollo/client";

export const allContactUs = async (_: any, __: any, { prisma }: Context) => {
  try {
    const contactUs = prisma.contactUs.findMany();
    return contactUs;
  } catch (error) {
    console.log(`Failed to fetch All contactUs`, error);
    return new Error(`Failed to fetch All contactUs`);
  }
};
