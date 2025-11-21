import { InferenceClient } from '@huggingface/inference';
import { NextRequest, NextResponse } from 'next/server';

const hf = new InferenceClient(process.env.NEXT_PUBLIC_HUGGINGFACE_API_TOKEN || '');

interface RequestBody {
    productName: string;
    count?: number;
}

export async function POST(request: NextRequest) {
    console.log('🔵 API Route called');

    let productName = '';
    let count = 10;

    try {
        const body: RequestBody = await request.json();
        console.log('📦 Request body:', body);

        productName = body.productName || '';
        count = body.count || 10;

        if (!productName || productName.trim() === '') {
            return NextResponse.json({
                error: 'Product name is required'
            }, {
                status: 400
            });
        }

        console.log('🤖 Calling Hugging Face API...');

        // Try multiple models with fallback
        const models = [
            'meta-llama/Llama-3.2-3B-Instruct',
            'microsoft/Phi-3-mini-4k-instruct'
        ];

        let response;
        let usedModel = '';

        for (const model of models) {
            try {
                console.log(`Trying model: ${model}`);
                response = await hf.chatCompletion({
                    model,
                    messages: [
                        {
                            role: 'user',
                            content: `You are a search keyword generator. Generate ${count} search keywords for the product: "${productName}"

STRICT OUTPUT FORMAT:
- Return ONLY keywords
- One keyword per line
- NO numbers, bullets, quotes, explanations, or any other text
- NO introductory text like "Here are the keywords:"
- Start directly with the first keyword

REQUIRED KEYWORDS (must include):
1. Each individual word from the product name separated by spaces
2. All variations below

GENERATION RULES:
- Remove ALL accents: é→e, è→e, à→a, ç→c, ô→o, î→i, ê→e, û→u
- Remove ALL special characters except hyphens (keep only: a-z, 0-9, spaces, hyphens)
- Everything in lowercase

REQUIRED VARIATIONS:
a) Individual words (CRITICAL - must be first lines):
   Example: "seche" "cheveux" "5000w"

b) Full phrase combinations:
   - With spaces: "seche cheveux"
   - Without spaces: "sechecheveux"  
   - With hyphens: "seche-cheveux"
   - Full with all words: "seche cheveux 5000w"

c) Common misspellings:
   - Missing letters: "sech cheveux"
   - Double letters: "secche cheveux"
   - Letter substitutions: "seche cheuveux"

d) Partial combinations:
   - 2-word combos: "seche 5000w"
   - Without last word
   - Without first word

EXAMPLE INPUT: "Sèche Cheveux 5000w"
EXAMPLE OUTPUT:
seche
cheveux
5000w
seche cheveux
sechecheveux
seche-cheveux
seche cheveux 5000w
sechecheveux5000w
seche-cheveux-5000w
secche cheveux
sech cheveux
seche cheuveux
seche 5000w
cheveux 5000w

Now generate keywords for: "${productName}"

Remember: Start immediately with keywords, no explanations.`
                        }
                    ],
                    max_tokens: 400,
                    temperature: 0.3,
                });
                usedModel = model;
                console.log(`✅ Success with model: ${model}`);
                break;
            } catch (modelError) {
                console.log(`❌ Failed with ${model}, trying next...`);
                continue;
            }
        }

        if (!response) {
            throw new Error('All models failed');
        }

        const generatedText = response.choices[0]?.message?.content || '';
        console.log('📄 Generated text:', generatedText);

        // Enhanced cleaning - remove ALL special characters
        const keywords = generatedText
            .trim()
            .split(/\n/)
            .map(k => k.trim().toLowerCase())
            .map(k => k.replace(/^[-•*\d.)\]]+\s*/, '')) // Remove bullets/numbers
            .map(k => k.replace(/["'`]/g, '')) // Remove quotes
            .map(k => k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')) // Remove accents
            .map(k => k.replace(/[^a-z0-9\s-]/g, '')) // Remove special characters
            .map(k => k.replace(/\s+/g, ' ')) // Normalize spaces
            .map(k => k.trim())
            .filter(k => k.length >= 2 && k.length <= 40)
            .filter(k => !k.includes(':'))
            .filter(k => !k.match(/^(example|generate|keyword|search|include|rule|important|format|critical|now|must|first|line)/i))
            .filter(k => !/^(the|a|an|for|with|and|or|these|variations)\s/i.test(k))
            .filter((k, index, self) => self.indexOf(k) === index); // Remove duplicates

        console.log('🎯 Generated keywords before fallback:', keywords);

        // IMPORTANT: Always add base words as fallback
        const baseWords = generateBaseWords(productName);
        const allKeywords = [...new Set([...baseWords, ...keywords])]; // Merge with base words first

        console.log('🎯 Final keywords with base words:', allKeywords);

        return NextResponse.json({
            keywords: allKeywords.slice(0, count),
            model: usedModel,
            debug: {
                originalText: generatedText,
                productName,
                count,
                baseWords,
                generated: keywords.length,
                final: allKeywords.length
            }
        }, {
            status: 200
        });

    } catch (error: any) {
        console.error('❌ All models failed:', error);

        // Return smart fallback keywords
        const fallbackKeywords = generateFallbackKeywords(productName, count);

        return NextResponse.json({
            keywords: fallbackKeywords,
            warning: 'AI generation failed, using algorithmic fallback',
            details: error.message
        }, {
            status: 200
        });
    }
}

// Extract and clean base words from product name
function generateBaseWords(productName: string): string[] {
    if (!productName) return [];

    const cleanName = (str: string) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim();
    };

    const name = cleanName(productName);
    const words = name.split(/[\s-]+/).filter(w => w.length > 0);

    const baseWords = new Set<string>();

    // Add each individual word (critical for partial search)
    words.forEach(word => {
        if (word.length >= 2) {
            baseWords.add(word);
        }
    });

    // Add basic combinations
    baseWords.add(name); // Full phrase with spaces
    if (words.length > 0) {
        baseWords.add(words.join('')); // No spaces
        baseWords.add(words.join('-')); // With hyphens
    }

    // Add 2-word combinations
    if (words.length > 1) {
        for (let i = 0; i < words.length - 1; i++) {
            const combo = words[i] + ' ' + words[i + 1];
            baseWords.add(combo);
            baseWords.add(words[i] + words[i + 1]); // No space
            baseWords.add(words[i] + '-' + words[i + 1]); // With hyphen
        }
    }

    return Array.from(baseWords).filter(k => k.length >= 2 && k.length <= 40);
}

// Smart fallback keyword generator with special character removal
function generateFallbackKeywords(productName: string, count: number): string[] {
    if (!productName) return [];

    const cleanName = (str: string) => {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim();
    };

    const name = cleanName(productName);
    const words = name.split(/[\s-]+/).filter(w => w.length > 0);

    const keywords = new Set<string>();

    // PRIORITY: Add individual base words FIRST
    words.forEach(word => {
        if (word.length >= 2) {
            keywords.add(word);
        }
    });

    // Base variations
    keywords.add(name); // "seche cheveux"
    keywords.add(name.replace(/\s+/g, '')); // "sechecheveux"
    keywords.add(name.replace(/\s+/g, '-')); // "seche-cheveux"
    keywords.add(name.replace(/-/g, '')); // Remove hyphens
    keywords.add(name.replace(/-/g, ' ')); // Hyphens to spaces

    // Word combinations
    if (words.length > 1) {
        for (let i = 0; i < words.length - 1; i++) {
            keywords.add(words.slice(i, i + 2).join(' '));
            keywords.add(words.slice(i, i + 2).join(''));
            keywords.add(words.slice(i, i + 2).join('-'));
        }

        // 3-word combinations
        if (words.length > 2) {
            for (let i = 0; i < words.length - 2; i++) {
                keywords.add(words.slice(i, i + 3).join(' '));
                keywords.add(words.slice(i, i + 3).join(''));
                keywords.add(words.slice(i, i + 3).join('-'));
            }
        }
    }

    // Common misspellings (single letter variations)
    words.forEach(word => {
        if (word.length >= 4) {
            // Missing letter
            for (let i = 1; i < word.length - 1; i++) {
                keywords.add(word.slice(0, i) + word.slice(i + 1));
            }
            // Doubled letter
            for (let i = 0; i < word.length - 1; i++) {
                keywords.add(word.slice(0, i + 1) + word[i] + word.slice(i + 1));
            }
        }
    });

    // Abbreviations
    if (words.length > 1) {
        keywords.add(words.map(w => w[0]).join('')); // First letters
    }

    return Array.from(keywords)
        .filter(k => k.length >= 2 && k.length <= 40)
        .slice(0, count);
}