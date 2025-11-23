import { Context } from "@apollo/client";
import { Category, Product } from "@prisma/client";

// Helper function to delete expired discounts
const deleteExpiredDiscounts = async (prisma: any) => {
    try {
        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);

        await prisma.productDiscount.deleteMany({
            where: {
                dateOfEnd: {
                    lte: currentDate
                }
            }
        });
    } catch (error) {
        console.error("Failed to delete expired discounts:", error);
    }
};

// Sort categories hierarchically
function sortCategoriesHierarchically(categories: Category[]) {
    const map: Record<string, Category & { children?: any[] }> = {};
    const result: Category[] = [];

    categories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach(cat => {
        if (cat.parentId && map[cat.parentId]) {
            map[cat.parentId].children!.push(map[cat.id]);
        } else {
            result.push(map[cat.id]);
        }
    });

    const linearSorted: Category[] = [];

    function flatten(category: Category & { children?: Category[] }) {
        linearSorted.push(category);
        category.children?.forEach(flatten);
    }

    result.forEach(flatten);
    return linearSorted;
}

// Build category breadcrumb for Google (e.g., "Electroménager > Appareil de coiffure > Séche cheveux")
function buildCategoryBreadcrumb(categories: Category[]): string {
    if (!categories || categories.length === 0) return "";

    // Get the deepest category path
    const sorted = sortCategoriesHierarchically(categories);
    const names = sorted.map(cat => cat.name);
    return names.join(" > ");
}

// Strip HTML tags from description
function stripHtml(html: string): string {
    if (!html) return "";
    return html
        .replaceAll(/<[^>]*>/g, " ")
        .replaceAll(/&[^;]+;/g, " ")
        .replaceAll(/\s+/g, " ")
        .trim();
}

// Format product for Google Merchant Feed
function formatProductForGoogle(product: any, baseUrl: string = "https://www.ita-luxury.com") {
    const sortedCategories = sortCategoriesHierarchically(product.categories || []);

    // Get price - use discounted price if available
    let price = product.price;
    let salePrice = null;

    if (product.productDiscounts && product.productDiscounts.length > 0) {
        const discount = product.productDiscounts[0];
        if (discount.newPrice && discount.newPrice < price) {
            salePrice = discount.newPrice;
        }
    }

    // Determine availability
    const availability = product.inventory > 0 ? "in stock" : "out of stock";

    // Get brand name
    const brand = product.Brand?.name 

    // Build product link
    const link = `${baseUrl}/products/${product.slug}`;

    // Get images
    const imageLink = product.images && product.images.length > 0 ? product.images[0] : "";
    const additionalImageLinks = product.images && product.images.length > 1
        ? product.images.slice(1, 11)
        : [];

    // Get color if available
    const color = product.Colors?.color || null;

    // Build category breadcrumb
    const productType = buildCategoryBreadcrumb(sortedCategories);

    return {
        id: product.id,
        title: product.name,
        description: stripHtml(product.description),
        link: link,
        image_link: imageLink,
        additional_image_link: additionalImageLinks.join(","),
        price: `${price.toFixed(2)} TND`,
        sale_price: salePrice ? `${salePrice.toFixed(2)} TND` : null,
        availability: availability,
        brand: brand,
        gtin: product.reference || null,
        mpn: product.reference || null,
        condition: "new",
        product_type: productType,
        google_product_category: sortedCategories.length > 0 ? sortedCategories[0].name : "",
        color: color,
        item_group_id: product.GroupProductVariant?.id || null,
        inventory: product.inventory,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    };
}

// MAIN FUNCTION: Fetch all products for Google Merchant Feed
export const getAllProductsForGoogleFeed = async (
    _: any,
    args: any,
    { prisma }: Context
) => {
    try {
        // Clean up expired discounts before fetching
        await deleteExpiredDiscounts(prisma);

        // Fetch all products with necessary relations
        const products = await prisma.product.findMany({
            where: {
                isVisible: true
            },
            include: {
                categories: {
                    include: {
                        subcategories: {
                            include: { subcategories: true }
                        }
                    },
                },
                productDiscounts: {
                    where: {
                        dateOfEnd: {
                            gte: new Date() 
                        }
                    }
                },
                Colors: true,
                Brand: true,
                GroupProductVariant: {
                    include: {
                        Products: {
                            include: {
                                Colors: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // Format all products for Google Merchant
        const formattedProducts = products.map((product: any) =>
            formatProductForGoogle(product)
        );

        return formattedProducts;
    } catch (error) {
        console.error("Failed to fetch products for Google Feed:", error);
        throw new Error("Failed to fetch products for Google Feed");
    }
};
