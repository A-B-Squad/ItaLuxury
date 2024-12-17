/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Development server configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4001/api/:path*',
      },
    ];
  },

  // Headers configuration for comprehensive cross-origin support
  async headers() {
    return [
      // Robots.txt specific header
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      // Google verification file
      {
        source: '/google4773007d2b4f68e3.html',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
        ],
      },
      // Global headers for all routes
      {
        source: '/:path*',
        headers: [
          // CORS Headers
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development'
              ? 'http://localhost:4000 http://localhost:4001 http://client.localhost:4000 http://admin.localhost:4001'
              : 'https://ita-luxury.com https://admin.ita-luxury.com',
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

          // Security Headers
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

          // Cross-Origin Policies
          {
            key: 'Cross-Origin-Opener-Policy',
            value: process.env.NODE_ENV === 'development'
              ? 'unsafe-none'
              : 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },

          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self' ${
                process.env.NODE_ENV === 'development'
                  ? 'http://localhost:4000 http://localhost:4001'
                  : 'https://ita-luxury.com https://admin.ita-luxury.com'
              };
              script-src 'self' 'unsafe-inline' 'unsafe-eval'
                https://apis.google.com
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://connect.facebook.net
                https://konnect.network
                https://embed.tawk.to
                https://cdn.jsdelivr.net
                https://cdnjs.cloudflare.com
                https://ajax.googleapis.com
                https://js.pusher.com
                https://static.cloudflareinsights.com;
                
                style-src 'self' 'unsafe-inline'
                https://fonts.googleapis.com
                https://embed.tawk.to
                https://js.pusher.com
                https://www.googletagmanager.com;
                
                img-src 'self' data: https: http: blob:;
                
                font-src 'self' data: 
                https://fonts.gstatic.com
                https://js.pusher.com
                https://fonts.googleapis.com
                https://embed.tawk.to;
                
                connect-src 'self' 
                https: 
                wss:
                https://apis.google.com
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
                ${
                  process.env.NODE_ENV === 'development'
                    ? 'http://localhost:4000 http://localhost:4001 ws://localhost:4000 ws://localhost:4001'
                    : 'https://ita-luxury.com https://admin.ita-luxury.com'
                };
              
              frame-src 'self' 
                https: 
                ${
                  process.env.NODE_ENV === 'development'
                    ? 'http://localhost:4000 http://localhost:4001'
                    : 'https://ita-luxury.com https://admin.ita-luxury.com'
                };
              
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim(),
          },

          // Other Security Headers
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
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), sync-xhr=(), autoplay=(), display-capture=(), encrypted-media=(), fullscreen=(), picture-in-picture=()',
          },
        ],
      },
    ];
  },

  // Image optimization configuration
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
      }
    ],
    minimumCacheTTL: 60,
    domains: ['res.cloudinary.com', "via.placeholder.com", 'localhost'],
  },
  // Compression and optimization
  compress: true,

  // Webpack configuration
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