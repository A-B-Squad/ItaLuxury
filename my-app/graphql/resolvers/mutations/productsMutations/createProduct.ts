import { Context } from "@/pages/api/graphql";
import moment from "moment";
import { Prisma } from "@prisma/client";

export const createProduct = async (
  _: any,
  { input }: { input: ProductInput },
  { prisma }: Context
) => {
  try {
    const {
      name,
      price,
      isVisible,
      purchasePrice,
      reference,
      description,
      inventory,
      images,
      categories,
      attributeInputs,
      colorsId,
      discount,
      brandId,
      sameProductId,
    } = input;

    // Prepare the data for product creation
    const productData: Prisma.ProductCreateInput = {
      name,
      price,
      purchasePrice,
      isVisible,
      reference,
      description,
      inventory,
      images,
      categories: {
        connect: categories.map((categoryId) => ({ id: categoryId })),
      },
      attributes: {
        create: attributeInputs,
      },
    };

    // Conditionally add relations only if they are provided
    if (colorsId) {
      productData.Colors = { connect: { id: colorsId } };
    }
    if (brandId) {
      productData.Brand = { connect: { id: brandId } };
    }

    // Handle same product logic
    let parentProductId = null;
    if (sameProductId) {
      const selectedProduct = await prisma.product.findUnique({
        where: { id: sameProductId },
        include: { SameProducts: true },
      });

      if (selectedProduct) {
        if (selectedProduct.SameProducts.length > 0) {
          // If the selected product is already linked to others, find the parent
          const parentProduct = await prisma.product.findFirst({
            where: {
              SameProducts: {
                some: { sameProductId: selectedProduct.id },
              },
            },
          });
          parentProductId = parentProduct?.id || selectedProduct.id;
        } else {
          // If the selected product is not linked to others, it becomes the parent
          parentProductId = selectedProduct.id;
        }
      }
    }

    // Creating a new product using prisma
    const productCreate = await prisma.product.create({
      data: {
        ...productData,
        SameProducts: parentProductId
          ? {
              create: {
                sameProductId: parentProductId,
              },
            }
          : undefined,
      },
      include: {
        Colors: true,
        Brand: true,
      },
    });

    // If this is a parent product, create a SameProducts entry for itself
    if (!parentProductId) {
      await prisma.sameProducts.create({
        data: {
          productId: productCreate.id,
          sameProductId: productCreate.id,
        },
      });
    }

    // Handle discounts
    if (discount) {
      for (const discountInput of discount) {
        const dateOfEnd = moment(
          discountInput.dateOfEnd,
          "DD/MM/YYYY HH:mm",
          true
        );
        const dateOfStart = moment(
          discountInput.dateOfStart,
          "DD/MM/YYYY HH:mm",
          true
        );

        if (!dateOfEnd.isValid() || !dateOfStart.isValid()) {
          throw new Error(
            `Invalid date provided: start - ${discountInput.dateOfStart}, end - ${discountInput.dateOfEnd}`
          );
        }

        const existingDiscount = await prisma.productDiscount.findFirst({
          where: {
            productId: productCreate.id,
            price,
          },
        });

        if (existingDiscount) {
          console.warn(
            `Discount for this product and price already exists: ${price}`
          );
          continue;
        }

        await prisma.productDiscount.create({
          data: {
            productId: productCreate.id,
            newPrice: discountInput.newPrice,
            price,
            dateOfEnd: dateOfEnd.toDate(),
            dateOfStart: dateOfStart.toDate(),
            discountId: discountInput.discountId || null,
          },
        });
      }
    }

    return "Product created successfully";
  } catch (error: any) {
    console.error("Error creating product:", error.message);
    return { error: "Failed to create product. Please try again." };
  }
};