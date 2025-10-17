import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_DOMAIN || 'https://www.ita-luxury.com'

    return {
        rules: [
            // General rules for all crawlers
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/_next/',              
                    '/images/',
                    '/products/',
                    '/Collections/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/Home',
                    '/productComparison',
                    '/TrackingPackages',
                ],
                disallow: [
                    '/admin/',
                    '/api/graphql',         
                    '/api/facebookApi',
                    '/Basket',
                    '/Checkout',
                    '/ForgotPassword',
                    '/ResetPassword',
                    '/signin',
                    '/signup',
                    '/Account',
                    '/FavoriteList',
                    '/*?_rsc=*',           
                    '/*.json$',
                    '/404',
                    '/500',
                ],
            },
            // Specific rules for Google Bot
            {
                userAgent: 'Googlebot',
                allow: [
                    '/',
                    '/_next/',
                    '/images/',
                    '/products/',
                    '/Collections/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/Home',
                    '/productComparison',
                    '/TrackingPackages',
                ],
                disallow: [
                    '/admin/',
                    '/api/graphql',
                    '/api/facebookApi',
                    '/Basket',
                    '/Checkout',
                    '/Account',
                    '/ResetPassword',
                    '/ForgotPassword',
                    '/signin',
                    '/signup',
                    '/*?_rsc=*',
                ],
            },
            // Google Image Bot 
            {
                userAgent: 'Googlebot-Image',
                allow: [
                    '/images/',
                    '/_next/image',
                    '/_next/static/media/',
                ],
                disallow: [
                    '/admin/',
                ],
            },
            // Bing Bot rules
            {
                userAgent: 'bingbot',
                allow: [
                    '/',
                    '/_next/',
                    '/images/',
                    '/products/',
                    '/Collections/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/TrackingPackages',
                    '/Home',
                ],
                disallow: [
                    '/admin/',
                    '/api/graphql',
                    '/api/facebookApi',
                    '/Basket',
                    '/Checkout',
                    '/Account',
                    '/signin',
                    '/signup',
                    '/*?_rsc=*',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}