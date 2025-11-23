import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'https://www.ita-luxury.com').replaceAll(/\/$/, '');

    return {
        rules: [
            // === MAIN RULE FOR ALL BOTS ===
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/Home',
                    '/Collections/',
                    '/products/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/TrackingPackages',
                    
                    // === NEXT.JS STATIC ASSETS ===
                    '/_next/static/',
                    '/_next/image/',
                    '/static/',
                    '/images/',
                    '/assets/',
                    '/fonts/',
                    '/static/css/',
                    '/static/chunks/',
                ],
                disallow: [
                    // === USER PRIVATE AREAS ONLY ===
                    '/Account',
                    '/Account/',
                    '/FavoriteList',
                    
                    // === API & INTERNAL PATHS ===
                    '/api/',
                    '/auth/',
                    '/_next/data/',
                    '/_next/cache/',
                    '/_next/webpack/',
                    '/_next/swc/',
                    '/_next/server/',
                    
                    // === BUILD FILES ===
                    '/types/',
                    '/*.json$',
                    '/*.map$',
                    
                    // === RSC & SSR INTERNAL ===
                    '/*?_rsc=',
                    '/*&_rsc=',
                ],
                crawlDelay: 10,
            },

            // === GOOGLEBOT OPTIMIZED ===
            {
                userAgent: 'Googlebot',
                allow: [
                    '/',
                    '/Home',
                    '/Collections/',
                    '/products/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/TrackingPackages',
                    '/signin',          
                    '/signup',           
                    '/Basket',           
                    '/Checkout',         
                    '/productComparison',
                    
                    // Static assets
                    '/_next/static/',
                    '/_next/image/',
                    '/static/css/',
                    '/static/chunks/',
                    '/images/',
                ],
                disallow: [
                    '/Account',
                    '/FavoriteList',
                    '/api/',
                    '/auth/',
                    '/_next/data/',
                    '/_next/cache/',
                ],
                crawlDelay: 5,
            },

            // === GOOGLE IMAGE BOT ===
            {
                userAgent: 'Googlebot-Image',
                allow: [
                    '/images/',
                    '/_next/image/',
                    '/static/',
                    '/products/',
                ],
                disallow: [
                    '/api/',
                    '/auth/',
                ],
            },

            // === GOOGLE SHOPPING BOT (IMPORTANT!) ===
            {
                userAgent: 'Googlebot-Shopping',
                allow: [
                    '/',
                    '/products/',
                    '/Collections/',
                    '/images/',
                    '/_next/image/',
                    '/Basket',
                    '/Checkout',
                ],
                disallow: [
                    '/api/',
                    '/auth/',
                ],
                crawlDelay: 5,
            },
        ],
        
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}