import { Context } from "@apollo/client";
import moment from "moment-timezone";
import { generateUniqueSlug } from "@/app/Helpers/_slugify.ts";
import { normalizeText } from "@/app/Helpers/_normalizeText";


// Helper function to generate fallback keywords
function generateFallbackKeywords(productName: string): string {
  const normalized = normalizeText(productName);
  const lowerName = productName.toLowerCase();

  const keywords = new Set<string>();

  // Add individual words (CRITICAL for partial search)
  const words = normalized.split(/[\s-]+/).filter(w => w.length >= 2);
  words.forEach(word => keywords.add(word));

  // Add full variations
  keywords.add(lowerName);
  keywords.add(normalized);
  keywords.add(lowerName.replace(/\s+/g, ''));
  keywords.add(normalized.replace(/\s+/g, ''));
  keywords.add(lowerName.replace(/\s+/g, '-'));
  keywords.add(normalized.replace(/\s+/g, '-'));

  // Return as space-separated string
  return Array.from(keywords).filter(k => k.length > 0).join(' ');
}

// Helper function to call the keyword generation API
async function generateSearchKeywords(productName: string): Promise<string> {
  try {
    const normalizedName = normalizeText(productName);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN}/api/generate-keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: normalizedName,
        count: 20
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('Keyword generation API failed:', response.statusText);
      throw new Error('Failed to generate keywords');
    }

    const data = await response.json();

    // Return as space-separated string
    return (data.keywords || []).join(' ');

  } catch (error) {
    console.error('Error generating keywords:', error);
    return generateFallbackKeywords(productName);
  }
}



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
      groupProductVariantId,
    } = input;

    console.log('🔵 Creating product:', name);

    // Generate unique slug from product name
    const slug = await generateUniqueSlug(prisma, name);

    // Generate basic fallback keywords immediately (as string)
    const fallbackKeywords = generateFallbackKeywords(name);

    // Filter and validate categories
    const validCategories = categories?.filter(id =>
      id && typeof id === 'string' && id.trim() !== ''
    ) || [];

    // Create product with fallback keywords first
    const productCreate = await prisma.product.create({
      data: {
        name,
        price,
        purchasePrice,
        isVisible,
        slug,
        reference,
        description,
        technicalDetails,
        inventory,
        images,
        colorsId,
        brandId,
        groupProductVariantId,
        searchKeywords: fallbackKeywords,
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

    console.log('✅ Product created with ID:', productCreate.id);

    // Process discounts if provided  
    if (discount && discount.length > 0) {
      console.log('🔵 Processing discounts...');

      const discountPromises = discount.map(async (discountInput) => {
        const dateOfEnd = moment(discountInput.dateOfEnd, 'DD/MM/YYYY HH:mm', true);
        const dateOfStart = moment(discountInput.dateOfStart, 'DD/MM/YYYY HH:mm', true);

        if (!dateOfEnd.isValid() || !dateOfStart.isValid()) {
          throw new Error(`Invalid date provided: start - ${discountInput.dateOfStart}, end - ${discountInput.dateOfEnd}`);
        }

        // Check if discount dates overlap with existing active discounts
        const existingDiscount = await prisma.productDiscount.findFirst({
          where: {
            productId: productCreate.id,
            isActive: true,
            isDeleted: false,
            OR: [
              {
                AND: [
                  { dateOfStart: { lte: dateOfEnd.toDate() } },
                  { dateOfEnd: { gte: dateOfStart.toDate() } },
                ],
              },
            ],
          },
        });

        if (existingDiscount) {
          console.warn(`⚠️ Overlapping discount already exists for this product in the specified date range`);
          return null;
        }

        // Determine discount type and value
        const discountValue = price - discountInput.newPrice;

        // Calculate new price based on discount type
        const newPrice = discountInput.newPrice

        // Determine if discount should be active now
        const now = new Date();
        const isActive = dateOfStart.toDate() <= now && dateOfEnd.toDate() >= now;

        return prisma.productDiscount.create({
          data: {
            productId: productCreate.id,
            price: price,
            newPrice: newPrice,
            discountType: "FIXED_AMOUNT" ,
            discountValue: discountValue,
            campaignName: 'Product Launch Discount',
            campaignType: 'MANUAL',
            dateOfStart: dateOfStart.toDate(),
            dateOfEnd: dateOfEnd.toDate(),
            isActive: isActive,
            isDeleted: false,
          },
        });
      });

      const results = await Promise.all(discountPromises);
      const successfulDiscounts = results.filter(r => r !== null);
      console.log(`✅ ${successfulDiscounts.length} discount(s) created`);
    }

    // Generate AI keywords in background (don't await - non-blocking)
    generateSearchKeywords(name)
      .then(async (aiKeywordsString) => {
        if (!aiKeywordsString || aiKeywordsString.trim() === '') {
          console.warn('⚠️ AI keywords empty, keeping fallback');
          return;
        }

        // Merge AI keywords with fallback keywords
        const allKeywords = `${fallbackKeywords} ${aiKeywordsString}`;

        // Remove duplicates by splitting, filtering, and rejoining
        const uniqueKeywords = [...new Set(
          allKeywords
            .toLowerCase()
            .split(/\s+/)
            .filter(k => k.length >= 2 && k.length <= 50)
        )].join(' ');

        await prisma.product.update({
          where: { id: productCreate.id },
          data: { searchKeywords: uniqueKeywords },
        });

        console.log(`✅ AI Keywords updated for product ${productCreate.id}`);
      })
      .catch((error) => {
        console.error(`⚠️ Failed to update AI keywords for product ${productCreate.id}:`, error);
        // Product still has fallback keywords, so it's searchable
      });

    return "Product created successfully";

  } catch (error: any) {
    console.error("❌ Error creating product:", error);

    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      throw new Error(`Le nom du produit "${input.name}" existe déjà`);
    }

    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      throw new Error(`Un produit avec ce slug existe déjà`);
    }

    throw new Error(`Failed to create product: ${error.message}`);
  }
};