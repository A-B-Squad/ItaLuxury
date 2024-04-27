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
  const { query, minPrice, maxPrice, categoryId, colorId } = input;

  try {
    let whereCondition: any = {};

    if (query) {
      whereCondition.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereCondition.AND = [
        { price: { gte: minPrice } },
        { price: { lte: maxPrice } },
      ];
    }

    if (categoryId) {
      whereCondition.categories = { some: { id: categoryId } };
    }

    if (colorId) {
      whereCondition.Colors = { id: colorId};
    }

    // If no specific filters are provided, return all products
    if (!query && minPrice === undefined && maxPrice === undefined && !categoryId && !colorId) {
      // No filters applied, fetch all products
      const allProducts = await prisma.product.findMany({
        take: pageSize,
        skip: (page - 1) * pageSize,
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
      
      return allProducts;
    }

    // Fetch products based on specified filters
    const products = await prisma.product.findMany({
      where: whereCondition,
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        categories: {
          include:{
            subcategories:true
          }
        },
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

    return products;
  } catch (error) {
    console.error(error);
    return error
  }
};
