import { Context } from "@/pages/api/graphql";

export const fetchBrands = async (_: any, __: any, { prisma }: Context) => {
  try {
    const Brands = await prisma.brand.findMany({
      include: {
        product: {
          include:{
            categories:true
          }
        },
      },
    });
    return Brands;
  } catch (error) {
    console.error("Error fetching fetchBrands:", error);
    throw new Error("Failed to fetch fetchBrands");
  }
};
