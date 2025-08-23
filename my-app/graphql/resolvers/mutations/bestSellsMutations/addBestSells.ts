import { Context } from "@apollo/client";

export const addBestSells = async (
  _: any,
  { categoryId, productId }: { categoryId: string; productId: string },
  { prisma }: Context
) => {
  try {
    // Vérifiez si le produit est déjà ajouté à la catégorie
    const existingBestSell = await prisma.bestSales.findFirst({
      where: {
        categoryId,
        productId,
      },
    });

    if (existingBestSell) {
      return "Product is already added to best sells";
    }

    // Créez une nouvelle entrée si elle n'existe pas encore
    await prisma.bestSales.create({
      data: {
        categoryId,
        productId,
      },
    });

    return "Product added to best sells successfully";
  } catch (error) {
    console.error("Error adding product to best sells:", error);
    return "An unexpected error occurred";
  }
};
