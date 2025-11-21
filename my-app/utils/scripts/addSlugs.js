const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

// Main function to add slugs to all products
async function addSlugsToAllProducts() {
  try {
    console.log('Fetching all products...');
    
    // Fetch all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      }
    });

    console.log(`Found ${products.length} products`);

    let updatedCount = 0;
    let skippedCount = 0;
    const slugMap = new Map(); // Track slug usage for uniqueness

    for (const product of products) {
      // Skip if product already has a slug
      if (product.slug) {
        console.log(`Skipping product ${product.id}: already has slug "${product.slug}"`);
        skippedCount++;
        continue;
      }

      // Generate base slug from product name
      let baseSlug = generateSlug(product.name);
      let finalSlug = baseSlug;

      // Ensure slug uniqueness
      if (slugMap.has(baseSlug)) {
        const count = slugMap.get(baseSlug) + 1;
        slugMap.set(baseSlug, count);
        finalSlug = `${baseSlug}-${count}`;
      } else {
        slugMap.set(baseSlug, 1);
      }

      // Update product with slug
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: finalSlug }
      });

      console.log(`Updated product ${product.id}: "${product.name}" -> slug: "${finalSlug}"`);
      updatedCount++;
    }

    console.log('\n=== Summary ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (already had slug): ${skippedCount}`);
    console.log('Done!');

  } catch (error) {
    console.error('Error adding slugs to products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
addSlugsToAllProducts()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

module.exports = { addSlugsToAllProducts };