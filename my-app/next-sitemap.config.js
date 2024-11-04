module.exports = {
//     siteUrl: 'https://localhost:4000',
generateRobotsTxt: true,
    generateIndexSitemap: true,
    robotsTxtOptions: {
        policies: [
      {
        userAgent: "*",
        disallow: "/admin",
      },
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    }
}

