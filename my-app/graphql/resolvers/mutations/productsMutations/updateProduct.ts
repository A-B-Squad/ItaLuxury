import { PrismaClient } from "@prisma/client";
import { Context } from "@/pages/api/graphql";

interface AttributeInput {
  name: string;
  value: string;
}

interface DiscountInput {
  newPrice: GLfloat;
  dateOfEnd: string;
  dateOfStart: string;
  discountId?: string;
}

const updateAttributes = async (
  prisma: PrismaClient,
  productId: string,
  attributeInputs: AttributeInput[]
) => {
  const existingAttributes = await prisma.productAttribute.findMany({
    where: { productId },
  });

  const attributesToCreate: AttributeInput[] = [];
  const attributesToUpdate: { id: string; data: { value: string } }[] = [];
  const attributesToDelete: string[] = [];

  attributeInputs?.forEach((attribute) => {
    const existingAttribute = existingAttributes.find(
      (attr) => attr.name.trim() === attribute.name.trim()
    );
    if (existingAttribute) {
      attributesToUpdate.push({
        id: existingAttribute.id,
        data: { value: attribute.value },
      });
    } else {
      attributesToCreate.push({
        name: attribute.name,
        value: attribute.value,
      });
    }
  });

  // Identify attributes to delete
  existingAttributes.forEach((existingAttribute) => {
    const isStillPresent = attributeInputs.find(
      (attr) => attr.name.trim() === existingAttribute.name.trim()
    );
    if (!isStillPresent) {
      attributesToDelete.push(existingAttribute.id);
    }
  });

  // Update existing attributes
  for (const attribute of attributesToUpdate) {
    await prisma.productAttribute.update({
      where: { id: attribute.id },
      data: attribute.data,
    });
  }

  // Create new attributes
  if (attributesToCreate.length > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        attributes: {
          create: attributesToCreate,
        },
      },
    });
  }

  // Delete attributes that no longer exist in attributeInputs
  for (const id of attributesToDelete) {
    await prisma.productAttribute.delete({
      where: { id },
    });
  }
};

const updateDiscounts = async (
  prisma: PrismaClient,
  productId: string,
  price: number,
  discountInputs: DiscountInput[]
) => {
  for (const discountInput of discountInputs) {
    const existingDiscount = await prisma.productDiscount.findFirst({
      where: { productId, price },
    });

    const discountData = {
      newPrice: discountInput.newPrice,
      dateOfEnd: new Date(discountInput.dateOfEnd),
      dateOfStart: new Date(discountInput.dateOfStart),
      discountId: discountInput.discountId || null,
    };

    if (existingDiscount) {
      await prisma.productDiscount.updateMany({
        where: { productId, price },
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
    } = input;

    // Update the product with the provided data
    const productUpdated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        purchasePrice,
        isVisible,
        reference,
        description,
        inventory,
        colorsId,
        images,
        categories: {
          connect: categories?.map((categoryId) => ({ id: categoryId })),
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
    }

    return "Product updated successfully";
  } catch (error) {
    console.error("Error updating product:", error);
    return `Failed to update product: ${error}`;
  }
};
