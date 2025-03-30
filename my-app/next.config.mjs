/** @type {import('next').NextConfig} */
const nextConfig = {

  env: {
    BASE_URL_DOMAIN: process.env.NEXT_PUBLIC_BASE_URL_DOMAIN,
  },

  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:4001/api/:path*'
          : 'http://admin:3001/api/:path*',
      },
    ];
  },

  async headers() {
    const developmentHosts = 'http://localhost:4000 http://localhost:4001';
    const productionHosts = 'https://ita-luxury.com https://admin.ita-luxury.com';

    return [
      {
        source: '/robots.txt',
        headers: [{ key: 'Content-Type', value: 'text/plain' }],
      },
      {
        source: '/google4773007d2b4f68e3.html',
        headers: [{ key: 'Content-Type', value: 'text/html' }],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' ? developmentHosts : productionHosts,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' ${process.env.NODE_ENV === 'development' ? developmentHosts : productionHosts};
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://apis.google.com
                https://accounts.google.com
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://connect.facebook.net
                https://konnect.network
                https://embed.tawk.to
                https://cdn.jsdelivr.net
                https://cdnjs.cloudflare.com
                https://ajax.googleapis.com
                https://js.pusher.com
                https://static.cloudflareinsights.com
                https://apollo-server-landing-page.cdn.apollographql.com
                https://embeddable-sandbox.cdn.apollographql.com
                https://embeddable-explorer.cdn.apollographql.com;
              style-src 'self' 'unsafe-inline'
                https://fonts.googleapis.com
                https://embed.tawk.to
                https://js.pusher.com
                https://www.googletagmanager.com
                https://apollo-server-landing-page.cdn.apollographql.com
                https://embeddable-sandbox.cdn.apollographql.com
                https://embeddable-explorer.cdn.apollographql.com;
              img-src 'self' data: https: http: blob:
                https://apollo-server-landing-page.cdn.apollographql.com;
              font-src 'self' data:
                https://fonts.gstatic.com
                https://js.pusher.com
                https://fonts.googleapis.com
                https://embed.tawk.to;
              connect-src 'self' https: wss:
                ${process.env.NODE_ENV === 'development' ? 'http://localhost:* ws://localhost:*' : productionHosts}
                https://apis.google.com
                https://accounts.google.com
                https://securetoken.googleapis.com
                https://js.pusher.com
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://connect.facebook.net
                https://konnect.network
                https://embed.tawk.to
                https://cdn.jsdelivr.net
                https://cdnjs.cloudflare.com
                https://ajax.googleapis.com
                https://www.ita-luxury.com/api/facebookApi
                https://static.cloudflareinsights.com
                https://apollo-server-landing-page.cdn.apollographql.com
                https://embeddable-sandbox.cdn.apollographql.com
                https://embeddable-explorer.cdn.apollographql.com;
              frame-src 'self' https:
                https://accounts.google.com
                ${process.env.NODE_ENV === 'development' ? developmentHosts : productionHosts};
              manifest-src 'self'
                https://apollo-server-landing-page.cdn.apollographql.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self' https://www.facebook.com;
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim(),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), sync-xhr=(), autoplay=(), display-capture=(), encrypted-media=(), fullscreen=(), picture-in-picture=()',
          },
        ],
      },
    ];
  },

  // Rest of the config remains unchanged
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "app.ita-luxury.com",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
        pathname: "**",
      },
      // Add Docker service hostnames
      {
        protocol: "http",
        hostname: "client-prod",
        port: "3000",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "admin",
        port: "3001",
        pathname: "**",
      }
    ],
    minimumCacheTTL: 60,
    domains: ['res.cloudinary.com', "via.placeholder.com", 'localhost'],
  },

  compress: true,

  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      test: /firebase-messaging-sw\.js$/,
      use: 'file-loader',
    });

    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }
    return config;
  },
};

export default nextConfig;