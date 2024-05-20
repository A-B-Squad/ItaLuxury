import { Context } from "@/pages/api/graphql";

export const companyInfo = async (_: any, __: any, { prisma }: Context) => {
  try {
    const info = await prisma.companyInfo.findFirst();
  
    return info;
  } catch (error) {
    // Handle errors
    console.error("Error fetching company information:", error);
    return new Error("Failed to fetch company information");
  }
};
