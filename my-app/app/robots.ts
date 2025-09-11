import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'

    return {
        rules: [
            // General rules for all crawlers
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/Basket',
                    '/Checkout',
                    '/ForgotPassword',
                    '/ResetPassword',
                    '/signin',
                    '/signup',
                    '/Account',
                    '/FavoriteList',
                    '/*.json',
                    '/*.xml$',
                    '/404',
                    '/500',
                ],
            },
            // Specific rules for Google Bot
            {
                userAgent: 'Googlebot',
                allow: [
                    '/',
                    '/products/',
                    '/Collections/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/Home',
                    '/productComparison',
                    '/TrackingPackages',
                    '/signin',
                    '/signup',
                ],
                disallow: [
                    '/admin/',
                    '/api/',
                    '/_next/',
                    '/Basket',
                    '/Checkout',
                    '/Account',
                    '/ResetPassword',
                    '/ForgotPassword',
                ],
            },
            // Google Image Bot - for better image SEO
            {
                userAgent: 'Googlebot-Image',
                allow: [
                    '/images/',
                    '/_next/image',
                    '/_next/static/',
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
                    '/products/',
                    '/Collections/',
                    '/Contact-us',
                    '/Delivery',
                    '/Privacy-Policy',
                    '/Terms-of-use',
                    '/TrackingPackages',
                    '/Home',
                    '/signin',
                    '/signup',
                ],
                disallow: [
                    '/admin/',
                    '/api/',
                    '/Basket',
                    '/Checkout',
                    '/Account',

                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}

