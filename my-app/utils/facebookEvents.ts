import { sendGTMEvent } from "@next/third-parties/google";
import triggerEvents from "./events/trackEvents";

interface User {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
    id?: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    isVisible: boolean;
    reference: string;
    description: string;
    inventory: number;
    solde?: number;
    images: string[];
    categories: Array<{
        id: string;
        name: string;
        description?: string;
        subcategories?: any[];
    }>;
    productDiscounts?: Array<{
        id: string;
        price: number;
        newPrice: number;
        dateOfEnd: string;
        dateOfStart: string;
    }>;
    Colors?: {
        id: string;
        color: string;
        Hex: string;
    };
    Brand?: {
        name: string;
    } | null;
    technicalDetails?: string;
    reviews?: any[];
    GroupProductVariant?: any;
    quantity?: number
}

interface CartItem extends Product {
    quantity: number;
}

// Helper to clean HTML from descriptions
function cleanHtmlDescription(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 5000);
}

// Helper to get current discount if active
function getActiveDiscount(productDiscounts?: any[]): any {
    if (!productDiscounts?.length) return null;
    const now = new Date();
    return productDiscounts.find(d => {
        try {
            const start = new Date(parseInt(d.dateOfStart));
            const end = new Date(parseInt(d.dateOfEnd));
            return now >= start && now <= end;
        } catch {
            return false;
        }
    });
}

// Get primary category from your nested categories structure
function getPrimaryCategory(categories: any[]): string {
    if (!categories?.length) return 'Electronique';
    // Use the most specific category (last in array)
    return categories[categories.length - 1]?.name || categories[0]?.name || 'Electronique';
}



// Build Facebook Catalog-compatible product data
function buildCatalogProductData(product: Product, quantity: number = 1) {
    const discount = getActiveDiscount(product.productDiscounts);
    const currentPrice = discount ? discount.newPrice : product.price;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN?.replace(/\/$/, '') || 'https://www.ita-luxury.com';
    const primaryCategory = getPrimaryCategory(product.categories);
    const Images = product.images || '';

    return {
        // REQUIRED Facebook Catalog Fields
        id: product.id,
        title: product.name?.trim(),
        description: cleanHtmlDescription(product.description) || product.name,
        availability: (product.inventory || 0) > 0 ? 'in stock' : 'out of stock',
        condition: 'new',
        price: Math.round(currentPrice * 100),
        currency: 'TND',
        link: `${baseUrl}/products/${product.slug}`,
        image_url: Images,
        brand: product.Brand?.name || 'ita-luxury',
        ...(product.Colors?.color && { color: product.Colors.color }),
        category: primaryCategory,

        ...(discount && {
            sale_price: Math.round(discount.newPrice * 100),
            original_price: Math.round(product.price * 100),
        }),

        // Quantity for cart/order events
        quantity: quantity,
        item_price: currentPrice,
    };
}

// Enhanced content builder for Facebook Pixel 
function buildEnhancedContent(product: Product, quantity: number = 1) {
    const discount = getActiveDiscount(product.productDiscounts);
    const currentPrice = discount ? discount.newPrice : product.price;

    return {
        // REQUIRED fields by Facebook for contents array
        id: product.id,
        quantity: quantity,
        item_price: currentPrice,
        content_id: product.slug,
        // OPTIONAL but approved fields for contents array
        ...(product.name && { title: product.name.trim().slice(0, 100) }),
        ...(product.description && {
            description: cleanHtmlDescription(product.description).slice(0, 100)
        }),
        ...(product.categories?.length && {
            category: getPrimaryCategory(product.categories)
        }),
        ...(product.Brand?.name && { brand: product.Brand.name }),
    };
}


// ==================== CORE EVENTS ====================

// VIEW CONTENT 
export async function trackViewContent(product: Product, user?: User) {
    const discount = getActiveDiscount(product.productDiscounts);
    const finalPrice = discount ? discount.newPrice : product.price;
    const catalogData = buildCatalogProductData(product);
    const enhancedContent = buildEnhancedContent(product, 1);

    console.log('📦 ViewContent - Catalog Data:', {
        id: catalogData.id,
        title: catalogData.title,
        price: catalogData.price,
        availability: catalogData.availability,
        category: catalogData.category
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'view_item',
        ecommerce: {
            currency: 'TND',
            value: finalPrice,
            items: [{
                item_id: product.id,
                item_name: product.name,
                price: finalPrice,
                quantity: 1
            }]
        }
    });

    // Facebook Pixel - FIXED: Only approved fields in contents
    return await triggerEvents('ViewContent', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            // Basic event data
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: finalPrice,
            currency: 'TND',

            // Facebook Catalog required fields - FIXED structure
            content_category: getPrimaryCategory(product.categories),
            contents: [enhancedContent],

            // Enhanced product data for catalog (outside contents array)
            product_id: product.id,
            product_name: product.name,
            product_brand: product.Brand?.name || 'ita-luxury',
            product_price: finalPrice,
            product_currency: 'TND',
            product_quantity: 1,
            product_image: product.images?.[0] || '',
            product_category: getPrimaryCategory(product.categories),

            // Availability
            availability: (product.inventory || 0) > 0 ? 'in stock' : 'out of stock',

            // Additional product info (outside contents array)
            ...(product.reference && { product_reference: product.reference }),
            ...(product.Colors?.color && { product_color: product.Colors.color }),
            ...(discount && {
                discount_value: product.price - discount.newPrice,
                original_price: product.price,
            }),
        },
    });
}

// ADD TO CART
export async function trackAddToCart(product: Product, user?: User) {
    const qty = product.quantity || 1;
    const discount = getActiveDiscount(product.productDiscounts);
    const finalPrice = discount ? discount.newPrice : product.price;
    const catalogData = buildCatalogProductData(product, qty);
    const enhancedContent = buildEnhancedContent(product, qty);

    console.log('🛒 AddToCart - Catalog Data:', {
        id: catalogData.id,
        title: catalogData.title,
        quantity: qty,
        price: catalogData.price,
        total_value: finalPrice * qty
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'add_to_cart',
        ecommerce: {
            currency: 'TND',
            value: finalPrice * qty,
            items: [{
                item_id: product.id,
                item_name: product.name,
                price: finalPrice,
                quantity: qty
            }]
        }
    });

    // Facebook Pixel
    return await triggerEvents('AddToCart', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: finalPrice * qty,
            currency: 'TND',
            content_category: getPrimaryCategory(product.categories),
            contents: [enhancedContent],
            num_items: qty,
            product_id: product.id,
            product_name: product.name,
            product_brand: product.Brand?.name || 'ita-luxury',
            product_price: finalPrice,
            product_currency: 'TND',
            product_quantity: qty,
        },
    });
}

// INITIATE CHECKOUT
export async function trackInitiateCheckout(
    cartItems: CartItem[],
    totalValue: number,
    user?: User
) {
    const contents = cartItems.map(item => buildEnhancedContent(item, item.quantity));
    const content_ids = cartItems.map(item => item.id);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    console.log('💰 InitiateCheckout - Cart Summary:', {
        total_items: totalItems,
        total_value: totalValue,
        product_count: cartItems.length,
        product_ids: content_ids
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'begin_checkout',
        ecommerce: {
            currency: 'TND',
            value: totalValue,
            items: cartItems.map(item => {
                const discount = getActiveDiscount(item.productDiscounts);
                const finalPrice = discount ? discount.newPrice : item.price;
                return {
                    item_id: item.id,
                    item_name: item.name,
                    price: finalPrice,
                    quantity: item.quantity
                };
            })
        }
    });

    // Facebook Pixel
    return await triggerEvents('InitiateCheckout', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            content_ids,
            contents,
            value: totalValue,
            currency: 'TND',
            num_items: totalItems,
            content_category: getPrimaryCategory(cartItems[0]?.categories || []),
            product_ids: content_ids,
            product_names: cartItems.map(item => item.name),
            product_categories: cartItems.map(item => getPrimaryCategory(item.categories)),
            product_brands: cartItems.map(item => item.Brand?.name || 'ita-luxury'),
            product_quantities: cartItems.map(item => item.quantity),
        },
    });
}

// PURCHASE / TRANSACTION COMPLETE
export async function trackPurchase(
    orderId: string,
    cartItems: CartItem[],
    totalValue: number,
    user?: User,
    shippingValue: number = 0,
    taxValue: number = 0
) {
    const contents = cartItems.map(item => buildEnhancedContent(item, item.quantity));
    const content_ids = cartItems.map(item => item.id);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    console.log('🎉 Purchase - Order Complete:', {
        order_id: orderId,
        total_value: totalValue,
        total_items: totalItems,
        product_count: cartItems.length,
        shipping: shippingValue
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'purchase',
        ecommerce: {
            currency: 'TND',
            transaction_id: orderId,
            value: totalValue,
            tax: taxValue,
            shipping: shippingValue,
            items: cartItems.map(item => {
                const discount = getActiveDiscount(item.productDiscounts);
                const finalPrice = discount ? discount.newPrice : item.price;
                return {
                    item_id: item.id,
                    item_name: item.name,
                    price: finalPrice,
                    quantity: item.quantity
                };
            })
        }
    });

    // Facebook Pixel
    return await triggerEvents('Purchase', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            content_ids,
            contents,
            value: totalValue,
            currency: 'TND',
            num_items: totalItems,
            transaction_id: orderId,
            content_type: 'product',
            shipping: shippingValue,
            tax: taxValue,
            order_total: totalValue + shippingValue + taxValue,
            product_ids: content_ids,
            product_names: cartItems.map(item => item.name),
            product_categories: cartItems.map(item => getPrimaryCategory(item.categories)),
            product_brands: cartItems.map(item => item.Brand?.name || 'ita-luxury'),
            product_quantities: cartItems.map(item => item.quantity),
        },
    });
}

// SEARCH
export async function trackSearch(
    searchQuery: string,
    user?: User,
    resultsCount?: number,
    category?: string
) {
    console.log('🔍 Search Event:', {
        query: searchQuery,
        results_count: resultsCount,
        category: category
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'search',
        search_term: searchQuery
    });

    // Facebook Pixel
    return await triggerEvents('Search', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            search_string: searchQuery,
            content_type: 'product',
            content_category: category || 'general',
            ...(resultsCount !== undefined && { num_items: resultsCount }),
        },
    });
}

// VIEW CART
export async function trackViewCart(
    cartItems: CartItem[],
    totalValue: number,
    user?: User
) {
    const contents = cartItems.map(item => buildEnhancedContent(item, item.quantity));
    const content_ids = cartItems.map(item => item.id);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    console.log('🛒 ViewCart - Cart Summary:', {
        total_items: totalItems,
        total_value: totalValue,
        product_count: cartItems.length
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'view_cart',
        ecommerce: {
            currency: 'TND',
            value: totalValue,
            items: cartItems.map(item => {
                const discount = getActiveDiscount(item.productDiscounts);
                const finalPrice = discount ? discount.newPrice : item.price;
                return {
                    item_id: item.id,
                    item_name: item.name,
                    price: finalPrice,
                    quantity: item.quantity
                };
            })
        }
    });

    // Facebook Pixel
    return await triggerEvents('ViewCart', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            content_ids,
            contents,
            value: totalValue,
            currency: 'TND',
            num_items: totalItems,
            content_type: 'product',
            content_category: getPrimaryCategory(cartItems[0]?.categories || []),
            product_ids: content_ids,
            product_names: cartItems.map(item => item.name),
            product_categories: cartItems.map(item => getPrimaryCategory(item.categories)),
        },
    });
}

// REMOVE FROM CART
export async function trackRemoveFromCart(
    product: CartItem,
    user?: User
) {
    const discount = getActiveDiscount(product.productDiscounts);
    const finalPrice = discount ? discount.newPrice : product.price;
    const value = finalPrice * product.quantity;
    const catalogData = buildCatalogProductData(product, product.quantity);
    const enhancedContent = buildEnhancedContent(product, product.quantity);

    console.log('❌ RemoveFromCart - Product:', {
        id: catalogData.id,
        title: catalogData.title,
        quantity: product.quantity,
        value: value
    });

    // Google Tag Manager
    sendGTMEvent({
        event: 'remove_from_cart',
        ecommerce: {
            currency: 'TND',
            value: value,
            items: [{
                item_id: product.id,
                item_name: product.name,
                price: finalPrice,
                quantity: product.quantity
            }]
        }
    });

    // Facebook Pixel
    return await triggerEvents('RemoveFromCart', {
        user_data: {
            em: user?.email,
            ph: user?.phone,
            fn: user?.firstName,
            ln: user?.lastName,
            ct: user?.city,
            country: user?.country || 'tn',
            external_id: user?.id,
        },
        custom_data: {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: value,
            currency: 'TND',
            contents: [enhancedContent],
            num_items: product.quantity,
            content_category: getPrimaryCategory(product.categories),
            product_id: product.id,
            product_name: product.name,
            product_brand: product.Brand?.name || 'ita-luxury',
            product_price: finalPrice,
            product_currency: 'TND',
            product_quantity: product.quantity,
        },
    });
}

