import { Context } from "@apollo/client";

export const createOrUpdateCompanyInfo = async (
  _: any,
  { input }: { input: CompanyInfoInput },
  { prisma }: Context
) => {
  try {
    const { phone, deliveringPrice, logo, facebook, instagram, location, email } = input;

    // Check if company info already exists
    const existingCompanyInfo = await prisma.companyInfo.findFirst();

    let companyInfo;

    if (existingCompanyInfo) {
      // Update the existing company info
      companyInfo = await prisma.companyInfo.update({
        where: { id: existingCompanyInfo.id },
        data: {
          phone,
          deliveringPrice,
          logo,
          facebook,
          instagram,
          location,
          email
        },
      });
    } else {
      // Create a new company info
      companyInfo = await prisma.companyInfo.create({
        data: {
          phone,
          deliveringPrice,
          logo,
          facebook,
          instagram,
          location,
          email
        },
      });
    }

    return companyInfo;
  } catch (error) {
    // Handle errors
    console.error("Error creating or updating company info:", error);
    return new Error("Failed to create or update company info");
  }
};
