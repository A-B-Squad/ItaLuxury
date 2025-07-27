import { PrismaClient } from "@prisma/client";
import { Context } from "@/pages/api/graphql";
import moment from "moment";

interface DiscountInput {
  newPrice: GLfloat;
  dateOfEnd: string;
  dateOfStart: string;
}

const updateDiscounts = async (
  prisma: PrismaClient,
  productId: string,
  price: number,
  discountInputs: DiscountInput[]
) => {
  for (const discountInput of discountInputs) {
    const dateOfEnd = moment(discountInput.dateOfEnd, 'DD/MM/YYYY HH:mm', true);
    const dateOfStart = moment(discountInput.dateOfStart, 'DD/MM/YYYY HH:mm', true);

    if (!dateOfEnd.isValid() || !dateOfStart.isValid()) {
      throw new Error(`Invalid date provided: start - ${discountInput.dateOfStart}, end - ${discountInput.dateOfEnd}`);
    }

    const discountData = {
      newPrice: discountInput.newPrice,
      dateOfEnd: dateOfEnd.toDate(),
      dateOfStart: dateOfStart.toDate(),
    };

    const existingDiscount = await prisma.productDiscount.findFirst({
      where: { productId },
    });

    if (existingDiscount) {
      await prisma.productDiscount.update({
        where: { id: existingDiscount.id },
        data: discountData,
      });
    } else {
      await prisma.productDiscount.create({
        data: {
          productId,
          price,
          ...discountData,
        },
      });
    }
  }
};

export const updateProduct = async (
  _: any,
  { productId, input }: { productId: string; input: ProductInput },
  { prisma }: Context
): Promise<string> => {
  try {
    const {
      name,
      price,
      purchasePrice,
      isVisible,
      reference,
      description,
      inventory,
      images,
      categories,
      technicalDetails,
      colorsId,
      discount,
      brandId,
    } = input;

    // Filter and validate categories - Remove empty strings, null, and undefined
    const validCategories = categories?.filter(id =>
      id && typeof id === 'string' && id.trim() !== ''
    ) || [];

    // Get current categories to disconnect
    const currentProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { categories: { select: { id: true } } },
    });

    const currentCategoryIds = currentProduct?.categories.map((cat: any) => cat.id) || [];

    // Update the product with the provided data
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        purchasePrice,
        brandId: brandId || null,
        isVisible,
        reference,
        description,
        inventory,
        colorsId,
        technicalDetails,
        images,
        updatedAt: new Date().toISOString(),
        categories: {
          // First disconnect all current categories
          disconnect: currentCategoryIds.map((id: string) => ({ id })),
          // Then connect the new valid categories
          ...(validCategories.length > 0 && {
            connect: validCategories.map((categoryId) => ({ id: categoryId })),
          }),
        },
      },
      include: {
        categories: true,
        productDiscounts: true,
      },
    });

    // Handle discounts
    if (discount && discount.length > 0) {
      // Update discounts if provided
      await updateDiscounts(prisma, productId, price, discount);
    } else {
      // Remove all existing discounts if no discount is provided
      const existingDiscounts = await prisma.productDiscount.findMany({
        where: { productId },
      });

      if (existingDiscounts.length > 0) {
        await prisma.productDiscount.deleteMany({
          where: { productId },
        });
      }
    }

    return "Product updated successfully";
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      throw new Error(`Le nom du produit "${input.name}" existe déjà`);
    }

    // Handle foreign key constraint errors for categories
    if (error.code === 'P2025') {
      throw new Error('Une ou plusieurs catégories sélectionnées n\'existent pas');
    }

    console.error("Error updating product:", error);
    throw new Error("Échec de la mise à jour du produit. Veuillez réessayer.");
  }
};