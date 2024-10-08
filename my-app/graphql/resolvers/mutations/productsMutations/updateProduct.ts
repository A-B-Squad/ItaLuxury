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
      (attr: { name: string; }) => attr.name.trim() === attribute.name.trim()
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
  existingAttributes.forEach((existingAttribute: { name: string; id: string; }) => {
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
    const dateOfEnd = moment(discountInput.dateOfEnd, 'DD/MM/YYYY HH:mm', true);  
    const dateOfStart = moment(discountInput.dateOfStart, 'DD/MM/YYYY HH:mm', true);  

    if (!dateOfEnd.isValid() || !dateOfStart.isValid()) {  
      throw new Error(`Invalid date provided: start - ${discountInput.dateOfStart}, end - ${discountInput.dateOfEnd}`);  
    }  

    const discountData = {  
      newPrice: discountInput.newPrice,  
      dateOfEnd: dateOfEnd.toDate(),  
      dateOfStart: dateOfStart.toDate(),  
      discountId: discountInput.discountId || null,  
    };  

    const existingDiscount = await prisma.productDiscount.findFirst({  
      where: { productId },  
    });  

    // Avoiding the `unique constraint` error by properly handling existing discounts  
    if (existingDiscount) {  
      await prisma.productDiscount.update({  
        where: { id: existingDiscount.id }, // Update only the existing discount by ID  
        data: discountData,  
      });  
    } else {  
      // You can consider checking if a discount with the same price exists for any other product  
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
  } catch (error) {
    console.error("Error updating product:", error);
    return `Failed to update product: ${error}`;
  }
};
