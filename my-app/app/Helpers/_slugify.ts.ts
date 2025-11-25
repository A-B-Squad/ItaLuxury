/**
 * Generates a URL-friendly slug from a string
 * Handles French accents and special characters
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Normalize accented characters (é → e, à → a, etc.)
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    // Replace spaces and special chars with hyphens
    .replaceAll(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens (grouped for explicit precedence)
    .replaceAll(/(^-+)|(-+$)/g, '');
}


/**
 * Generates a unique slug by checking database
 * Appends -2, -3, etc. if slug already exists
 */
export async function generateUniqueSlug(
  prisma: any,
  productName: string,
  productId?: string
): Promise<string> {
  const baseSlug = createSlug(productName);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      select: { id: true }
    });

    // Slug is available or belongs to the product being updated
    if (!existingProduct || existingProduct.id === productId) {
      return slug;
    }

    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}