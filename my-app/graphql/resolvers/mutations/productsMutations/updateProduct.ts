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

    // Disconnect all categories
    await prisma.product.update({
      where: { id: productId },
      data: {
        categories: {
          disconnect: (await prisma.product.findUnique({
            where: { id: productId },
            select: { categories: { select: { id: true } } },
          }))?.categories.map((cat: any) => ({ id: cat.id })) || [],
        },
      },
    });

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
        colorsId, technicalDetails,
        images,
        categories: {
          connect: categories?.map((categoryId) => ({ id: categoryId })) || [],
        },
      },
      include: {
        categories: true,
        productDiscounts: true,
      },
    });



    // Update discounts
    if (discount) {
      await updateDiscounts(prisma, productId, price, discount);
    } else {
      const existingDiscounts = await prisma.productDiscount.findFirst({
        where: { productId, price },
      });
      if (existingDiscounts) {
        await prisma.productDiscount.delete({
          where: { productId, price },
        });
      }
    }

    return "Product updated successfully";
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      throw new Error(`Le nom du produit "${input.name}" existe déjà`);
    }
    console.error("Error updating product:", error);
    throw error;
  }
};