import { Context } from "@/pages/api/graphql";

export const addBrand = async (
  _: any,
  { name, logo }: { name: string; logo: string },
  { prisma }: Context
) => {
  try {
    await prisma.brand.create({
      data: {
        name,
        logo,
      },
    });
    return "Brand added successfully";
  } catch (error) {
    return "An unexpected error occurred";
  }
};
