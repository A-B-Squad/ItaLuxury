import { PrismaClient } from "@prisma/client";
import { Context } from "@apollo/client";
import moment from "moment-timezone";
import { revalidateTag } from "next/cache";
import { generateUniqueSlug } from "@/app/Helpers/_slugify.ts";

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
      price: price,
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
          ...discountData,
        },
      });
    }
  }
};

export const updateProduct = async (
  _: any,
  { slug, input }: { slug: string; input: ProductInput },
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
      groupProductVariantId
    } = input;

    // Filter and validate categories - Remove empty strings, null, and undefined
    const validCategories = categories?.filter(id =>
      id && typeof id === 'string' && id.trim() !== ''
    ) || [];

    // Get current product data
    const currentProduct = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        categories: { select: { id: true } },
        isVisible: true,
        inventory: true,
        name: true
      },
    });

    if (!currentProduct) {
      throw new Error("Product not found");
    }

    // Check if isVisible or inventory has changed
    const isVisibilityChanged = isVisible !== undefined && isVisible !== currentProduct.isVisible;
    const isInventoryChanged = inventory !== undefined && inventory !== currentProduct.inventory;
    const shouldUpdateCreatedAt = isVisibilityChanged || isInventoryChanged;

    // Generate new slug if name has changed
    let ProductSlug: string | undefined;
    if (name && name !== currentProduct.name) {
      ProductSlug = await generateUniqueSlug(prisma, name, currentProduct.id);
    }

    const currentCategoryIds = currentProduct?.categories.map((cat: any) => cat.id) || [];

    // Build update data object conditionally
    const updateData: any = {
      name,
      ...(ProductSlug && { slug: ProductSlug }),
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
      // Only update createdAt if visibility or inventory changed
      ...(shouldUpdateCreatedAt && { createdAt: new Date().toISOString() }),
      categories: {
        // First disconnect all current categories
        disconnect: currentCategoryIds.map((id: string) => ({ id })),
        // Then connect the new valid categories
        ...(validCategories.length > 0 && {
          connect: validCategories.map((categoryId) => ({ id: categoryId })),
        }),
      },
      groupProductVariantId
    };

    // Update the product with the provided data
    await prisma.product.update({
      where: { slug: slug },
      data: updateData,
      include: {
        categories: true,
        productDiscounts: true,
      },
    });

    // Handle discounts
    if (discount && discount.length > 0) {
      // Update discounts if provided
      await updateDiscounts(prisma, currentProduct.id, price, discount);
    } else {
      // Remove all existing discounts if no discount is provided
      const existingDiscounts = await prisma.productDiscount.findMany({
        where: { productId: currentProduct.id },
      });

      if (existingDiscounts.length > 0) {
        await prisma.productDiscount.deleteMany({
          where: { productId: currentProduct.id },
        });
      }
    }
    revalidateTag('product');

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