/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "app.jax-delivery.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "wamia-media.s3.eu-west-1.amazonaws.com",
        pathname: "**",
      },

{
      protocol: "https",
      hostname: "www.ita-luxury.com",
      pathname: "**",
    },
      {
        protocol: "https",
        hostname: "png.pngtree.com",
        pathname: "**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/google4773007d2b4f68e3.html',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html',
          },
        ],
      },
    ];
  },


};

export default nextConfig;
