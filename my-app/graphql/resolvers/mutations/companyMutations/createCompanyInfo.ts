import { Context } from "@/pages/api/graphql";


export const createCompanyInfo = async (
    _: any,
    { input }: { input: CompanyInfoInput },
    { prisma }: Context
  ) => {
    try {
      const { phone, deliveringPrice, logo } = input;
  
      // Create the company info with the provided data
      const newCompanyInfo = await prisma.companyInfo.create({
        data: {
          phone,
          deliveringPrice,
          logo
        },
      });
  console.log(newCompanyInfo);
  
      return newCompanyInfo;
    } catch (error) {
      // Handle errors
      console.error("Error creating company info:", error);
      return new Error("Failed to create company info");
    }
  };