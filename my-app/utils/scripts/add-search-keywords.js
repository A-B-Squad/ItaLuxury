const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Helper function to normalize text (remove accents)
function normalizeText(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .trim();
}

// Helper function to generate search keywords
function generateSearchKeywords(productName) {
  const normalized = normalizeText(productName);
  const lowerName = productName.toLowerCase().trim();
  
  const keywords = new Set();

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

  // Add 2-word combinations
  if (words.length > 1) {
    for (let i = 0; i < words.length - 1; i++) {
      const combo = words[i] + ' ' + words[i + 1];
      keywords.add(combo);
      keywords.add(words[i] + words[i + 1]); // No space
      keywords.add(words[i] + '-' + words[i + 1]); // With hyphen
    }
  }

  // Add common misspellings (single letter variations)
  words.forEach(word => {
    if (word.length >= 4) {
      // Missing letter
      for (let i = 1; i < word.length - 1; i++) {
        keywords.add(word.slice(0, i) + word.slice(i + 1));
      }
    }
  });

  // Return as space-separated string
  return Array.from(keywords)
    .filter(k => k.length >= 2 && k.length <= 50)
    .join(' ');
}

// Call AI API to generate enhanced keywords (optional)
async function generateAIKeywords(productName) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'http://localhost:3000'}/api/generate-keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName: normalizeText(productName),
        count: 20
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error('API failed');
    }

    const data = await response.json();
    return (data.keywords || []).join(' ');
  } catch (error) {
    console.warn(`  ⚠️  AI generation failed for "${productName}":`, error.message);
    return '';
  }
}

// Main function to add searchKeywords to all products
async function addSearchKeywordsToAllProducts(useAI = false) {
  try {
    console.log('🔍 Fetching all products...');
    
    // Fetch all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        searchKeywords: true
      }
    });

    console.log(`📦 Found ${products.length} products\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i + 1}/${products.length}] Processing: "${product.name}"`);

      // Skip if product already has searchKeywords
      if (product.searchKeywords && product.searchKeywords.trim() !== '') {
        console.log(`  ⏭️  Skipping: already has keywords`);
        skippedCount++;
        continue;
      }

      try {
        // Generate fallback keywords
        const fallbackKeywords = generateSearchKeywords(product.name);
        console.log(`  ✓ Generated ${fallbackKeywords.split(' ').length} fallback keywords`);

        let finalKeywords = fallbackKeywords;

        // Optionally use AI to enhance keywords
        if (useAI) {
          console.log(`  🤖 Generating AI keywords...`);
          const aiKeywords = await generateAIKeywords(product.name);
          
          if (aiKeywords) {
            // Merge and deduplicate
            const allKeywords = `${fallbackKeywords} ${aiKeywords}`;
            const uniqueKeywords = [...new Set(
              allKeywords
                .toLowerCase()
                .split(/\s+/)
                .filter(k => k.length >= 2 && k.length <= 50)
            )].join(' ');
            
            finalKeywords = uniqueKeywords;
            console.log(`  ✓ Merged with AI keywords (total: ${uniqueKeywords.split(' ').length})`);
          }
        }

        // Update product with keywords
        await prisma.product.update({
          where: { id: product.id },
          data: { searchKeywords: finalKeywords }
        });

        console.log(`  ✅ Updated successfully\n`);
        updatedCount++;

        // Add small delay to avoid rate limiting if using AI
        if (useAI && i < products.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.error(`  ❌ Error updating product ${product.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n=================================');
    console.log('📊 Summary');
    console.log('=================================');
    console.log(`Total products:              ${products.length}`);
    console.log(`✅ Updated:                  ${updatedCount}`);
    console.log(`⏭️  Skipped (had keywords):  ${skippedCount}`);
    console.log(`❌ Errors:                   ${errorCount}`);
    console.log('=================================');
    console.log('✨ Done!');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
// Set to true to use AI generation (slower but better results)
// Set to false to use only algorithmic generation (faster)
const USE_AI = process.env.USE_AI === 'true' || false;

console.log(`🚀 Starting keyword generation (AI: ${USE_AI ? 'enabled' : 'disabled'})\n`);

addSearchKeywordsToAllProducts(USE_AI)
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

module.exports = { addSearchKeywordsToAllProducts };