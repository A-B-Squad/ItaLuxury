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

  let whereCondition: any = {};

  console.log("====================================");
  console.log(categoryIds);
  console.log(colorIds, "iiiiii");
  console.log("====================================");

  if (query) {
    whereCondition = {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    };
  }

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
      Colors: { id: { in: colorIds } },
    };
  }

  try {
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: {
        categories: true,
        productDiscounts: {
          include: {
            Discount: true,
          },
        },
        baskets: true,
        reviews: true,
        favoriteProducts: true,
        attributes: true,
        Colors: true,
      },
    });
    console.log("====================================");
    console.log(products);
    console.log("====================================");
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return error;
  }
};
