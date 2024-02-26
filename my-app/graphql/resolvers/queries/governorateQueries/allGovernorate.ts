import { Context } from "@/pages/api/graphql";

export const allGovernorate = async (_: any, __: any, { prisma }: Context) => {
  try {
    const allGovernorate = prisma.governorate.findMany();
    return allGovernorate;
  } catch (error) {
    console.log(`Failed to fetch All Governorate`, error);
    return new Error(`Failed to fetch All Governorate`);
  }
};
