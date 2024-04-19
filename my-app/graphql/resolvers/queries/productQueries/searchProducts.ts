import { Context } from "@/pages/api/graphql";

export const searchProducts = async (
  _: any,
  {
    input,
    page = 1,
    pageSize = 10,
  }: { input: ProductSearchInput; page?: number; pageSize?: number },
  { prisma }: Context
) => {
  const { query, minPrice, maxPrice, categoryIds, colorIds } = input;

  let whereCondition: any = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ],
  };

  if (minPrice !== undefined && maxPrice !== undefined) {
    whereCondition = {
      ...whereCondition,
      AND: [{ price: { gte: minPrice } }, { price: { lte: maxPrice } }],
    };
  }

  if (categoryIds && categoryIds.length > 0) {
    whereCondition = {
      ...whereCondition,
      categories: { some: { id: { in: categoryIds } } },
    };
  }

  if (colorIds && colorIds.length > 0) {
    whereCondition = {
      ...whereCondition,
      colors: { some: { id: { in: colorIds } } },
    };
  }

  const products = await prisma.product.findMany({
    where: whereCondition,
  });

  return products;
};
