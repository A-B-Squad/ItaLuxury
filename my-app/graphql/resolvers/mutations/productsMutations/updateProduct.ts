import { PrismaClient } from "@prisma/client";
import { Context } from "@apollo/client";
import moment from "moment-timezone";
import { revalidateTag } from "next/cache";
import { generateUniqueSlug } from "@/app/Helpers/_slugify.ts";

interface DiscountInput {
  newPrice: GLfloat;
  dateOfEnd: string;
  dateOfStart: string;
  isActive?: boolean;
  isDeleted?: boolean;
  productId?: string;
  discountType?: string;
  discountValue?: number;
}

interface ProductInput {
  name?: string;
  price: number;
  purchasePrice?: number;
  isVisible?: boolean;
  reference?: string;
  description?: string;
  inventory?: number;
  images?: any;
  categories?: string[];
  technicalDetails?: any;
  colorsId?: string;
  discount?: DiscountInput[];
  brandId?: string;
  groupProductVariantId?: string;
}

// ==================== HELPER FUNCTIONS ====================

// Filter valid categories
const filterValidCategories = (categories?: string[]): string[] => {
  return categories?.filter(id =>
    id && typeof id === 'string' && id.trim() !== ''
  ) || [];
};

// Check if createdAt should be updated
const shouldUpdateCreatedAt = (
  isVisible: boolean | undefined,
  inventory: number | undefined,
  currentProduct: any
): boolean => {
  const isVisibilityChanged = isVisible !== undefined && isVisible !== currentProduct.isVisible;
  const isInventoryChanged = inventory !== undefined && inventory !== currentProduct.inventory;
  return isVisibilityChanged || isInventoryChanged;
};

// Generate slug if name changed
const generateSlugIfNameChanged = async (
  prisma: PrismaClient,
  name: string | undefined,
  currentProduct: any
): Promise<string | undefined> => {
  if (name && name !== currentProduct.name) {
    return await generateUniqueSlug(prisma, name, currentProduct.id);
  }
  return undefined;
};

// Build category update data
const buildCategoryUpdateData = (
  currentCategoryIds: string[],
  validCategories: string[]
) => {
  return {
    disconnect: currentCategoryIds.map((id: string) => ({ id })),
    ...(validCategories.length > 0 && {
      connect: validCategories.map((categoryId) => ({ id: categoryId })),
    }),
  };
};

// Build complete update data object
const buildUpdateData = (
  input: ProductInput,
  productSlug: string | undefined,
  shouldUpdateCreated: boolean,
  categoryUpdateData: any
) => {
  const {
    name,
    price,
    purchasePrice,
    brandId,
    isVisible,
    reference,
    description,
    inventory,
    colorsId,
    technicalDetails,
    images,
    groupProductVariantId,
  } = input;

  return {
    name,
    ...(productSlug && { slug: productSlug }),
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
    ...(shouldUpdateCreated && { createdAt: new Date().toISOString() }),
    categories: categoryUpdateData,
    groupProductVariantId,
  };
};

// Update or create discount
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

    const isActive = dateOfStart.isSameOrBefore(moment()) && dateOfEnd.isSameOrAfter(moment());
    const discountValue = price - discountInput.newPrice;

    const existingDiscount = await prisma.productDiscount.findFirst({
      where: { productId },
    });

    if (existingDiscount) {
      await prisma.productDiscount.update({
        where: { id: existingDiscount.id },
        data: {
          newPrice: discountInput.newPrice,
          price: price,
          dateOfEnd: dateOfEnd.toDate(),
          dateOfStart: dateOfStart.toDate(),
          isActive: isActive,
          isDeleted: false,
          updatedAt: new Date(),
          discountType: "FIXED_AMOUNT",
          discountValue: discountValue,
          campaignType: "MANUAL",
        },
      });
    } else {
      await prisma.productDiscount.create({
        data: {
          productId,
          newPrice: discountInput.newPrice,
          price: price,
          dateOfEnd: dateOfEnd.toDate(),
          dateOfStart: dateOfStart.toDate(),
          isActive: isActive,
          isDeleted: false,
          discountType: "FIXED_AMOUNT",
          discountValue: discountValue,
          campaignType: "MANUAL",
        },
      });
    }
  }
};

// Delete existing discounts
const deleteExistingDiscounts = async (
  prisma: PrismaClient,
  productId: string
) => {
  const existingDiscounts = await prisma.productDiscount.findMany({
    where: { productId },
  });

  if (existingDiscounts.length > 0) {
    await prisma.productDiscount.deleteMany({
      where: { productId },
    });
  }
};

// Handle discount updates
const handleDiscountUpdates = async (
  prisma: PrismaClient,
  productId: string,
  price: number,
  discount?: DiscountInput[]
) => {
  if (discount && discount.length > 0) {
    await updateDiscounts(prisma, productId, price, discount);
  } else {
    await deleteExistingDiscounts(prisma, productId);
  }
};

// Handle error responses
const handleUpdateError = (error: any, input: ProductInput) => {
  if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
    throw new Error(`Le nom du produit "${input.name}" existe déjà`);
  }

  if (error.code === 'P2025') {
    throw new Error('Une ou plusieurs catégories sélectionnées n\'existent pas');
  }

  console.error("Error updating product:", error);
  throw new Error("Échec de la mise à jour du produit. Veuillez réessayer.");
};

// ==================== MAIN FUNCTION ====================

export const updateProduct = async (
  _: any,
  { slug, input }: { slug: string; input: ProductInput },
  { prisma }: Context
): Promise<string> => {
  try {
    const { name, price, isVisible, inventory, categories, discount } = input;

    // Filter valid categories
    const validCategories = filterValidCategories(categories);

    // Get current product data
    const currentProduct = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        categories: { select: { id: true } },
        isVisible: true,
        inventory: true,
        name: true,
      },
    });

    if (!currentProduct) {
      throw new Error("Product not found");
    }

    // Determine if createdAt should be updated
    const shouldUpdateCreated = shouldUpdateCreatedAt(isVisible, inventory, currentProduct);

    // Generate new slug if name changed
    const productSlug = await generateSlugIfNameChanged(prisma, name, currentProduct);

    // Build category update data
    const currentCategoryIds = currentProduct?.categories.map((cat: any) => cat.id) || [];
    const categoryUpdateData = buildCategoryUpdateData(currentCategoryIds, validCategories);

    // Build complete update data
    const updateData = buildUpdateData(input, productSlug, shouldUpdateCreated, categoryUpdateData);

    // Update the product
    await prisma.product.update({
      where: { slug },
      data: updateData,
      include: {
        categories: true,
        productDiscounts: true,
      },
    });

    // Handle discounts
    await handleDiscountUpdates(prisma, currentProduct.id, price, discount);

    // Revalidate cache
    revalidateTag('collection-search');

    return "Product updated successfully";
  } catch (error: any) {
    handleUpdateError(error, input);
    throw error; // This line will never be reached due to handleUpdateError always throwing
  }
};