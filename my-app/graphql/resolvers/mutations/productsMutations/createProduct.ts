import { Context } from "@/pages/api/graphql";
import moment from "moment";

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
      technicalDetails,
      colorsId,
      discount,
      brandId,
    } = input;

    // Filter and validate categories
    const validCategories = categories?.filter(id =>
      id && typeof id === 'string' && id.trim() !== ''
    ) || [];

    // Creating a new product using prisma  
    const productCreate = await prisma.product.create({
      data: {
        name,
        price,
        purchasePrice,
        isVisible,
        reference,
        description,
        technicalDetails,
        inventory,
        images,
        colorsId,
        brandId,
        updatedAt: new Date(), 
        ...(validCategories.length > 0 && {
          categories: {
            connect: validCategories.map((categoryId) => ({ id: categoryId })),
          },
        }),
      },
      include: {
        Colors: true,
        Brand: true,
      },
    });

    // If discount is provided  
    if (discount) {
      for (const discountInput of discount) {
        const dateOfEnd = moment(discountInput.dateOfEnd, 'DD/MM/YYYY HH:mm', true);
        const dateOfStart = moment(discountInput.dateOfStart, 'DD/MM/YYYY HH:mm', true);

        // Check for valid dates  
        if (!dateOfEnd.isValid() || !dateOfStart.isValid()) {
          throw new Error(`Invalid date provided: start - ${discountInput.dateOfStart}, end - ${discountInput.dateOfEnd}`);
        }

        // Avoiding duplicate discounts by checking for an existing discount  
        const existingDiscount = await prisma.productDiscount.findFirst({
          where: {
            productId: productCreate.id,
            price,
          },
        });

        if (existingDiscount) {
          // Optionally, update or skip, based on your logic, here we will just log a notice and skip  
          console.warn(`Discount for this product and price already exists: ${price}`);
          continue; // Skip creating this discount as it already exists  
        }

        // Creating a new product discount  
        await prisma.productDiscount.create({
          data: {
            productId: productCreate.id,
            newPrice: discountInput.newPrice,
            price,
            dateOfEnd: dateOfEnd.toDate(),
            dateOfStart: dateOfStart.toDate(),
          },
        });
      }
    }

    return "Product created successfully";
  } catch (error: any) {
    // Handle errors gracefully  
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      throw new Error(`Le nom du produit "${input.name}" existe déjà`);
    }
    console.error("Error creating product:", error.message);
    return { error: "Failed to create product. Please try again." };
  }
};