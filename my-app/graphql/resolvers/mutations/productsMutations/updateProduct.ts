import { PrismaClient } from "@prisma/client";
import { Context } from "@/pages/api/graphql";
import moment from "moment";

interface AttributeInput {
  name: string;
  value: string;
}

interface DiscountInput {
  newPrice: GLfloat;
  dateOfEnd: string;
  dateOfStart: string;
}




const updateAttributes = async (
  prisma: PrismaClient,
  productId: string,
  attributeInputs: AttributeInput[]
) => {
  try {
    // Use a transaction to ensure atomicity of operations
    return await prisma.$transaction(async (tx) => {
      // First, delete all existing attributes for the product
      await tx.productAttribute.deleteMany({
        where: { productId },
      });

      // Filter out any empty attributes and ensure uniqueness
      const validAttributes = attributeInputs.filter(
        attr => attr.name.trim() !== '' && attr.value.trim() !== ''
      );
      
      // Use a Map to ensure uniqueness based on name (case insensitive)
      const uniqueAttributes = new Map();
      
      validAttributes.forEach(attr => {
        const normalizedName = attr.name.trim().toLowerCase();
        uniqueAttributes.set(normalizedName, {
          name: attr.name.trim(),
          value: attr.value.trim(),
          productId: productId
        });
      });
      
      // Convert Map values to array for creation
      const formattedAttributes = Array.from(uniqueAttributes.values());

      // Create all new attributes using createMany for better performance
      if (formattedAttributes.length > 0) {
        await tx.productAttribute.createMany({
          data: formattedAttributes,
        });
      }
    });
  } catch (error) {
    console.error("Error updating attributes:", error);
    throw new Error("Failed to update product attributes");
  }
};


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
      attributeInputs,
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
          }))?.categories.map((cat:any) => ({ id: cat.id })) || [],
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
        colorsId,
        images,
        categories: {
          connect: categories?.map((categoryId) => ({ id: categoryId })) || [],
        },
      },
      include: {
        attributes: true,
        categories: true,
        productDiscounts: true,
      },
    });

    // Update attributes
    if (attributeInputs) {
      await updateAttributes(prisma, productId, attributeInputs);
    }

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