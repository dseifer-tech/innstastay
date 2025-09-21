/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      {
        source: '/hotels/toronto-downtown',
        destination: '/downtown-toronto',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'photos.hotelbeds.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn1.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn2.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn3.gstatic.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development' 
              ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://cdn.sanity.io https://lh3.googleusercontent.com https://lh5.googleusercontent.com https://photos.hotelbeds.com https://encrypted-tbn0.gstatic.com https://encrypted-tbn1.gstatic.com https://encrypted-tbn2.gstatic.com https://encrypted-tbn3.gstatic.com; connect-src 'self' https://serpapi.com; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
              : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://cdn.sanity.io https://lh3.googleusercontent.com https://lh5.googleusercontent.com https://photos.hotelbeds.com https://encrypted-tbn0.gstatic.com https://encrypted-tbn1.gstatic.com https://encrypted-tbn2.gstatic.com https://encrypted-tbn3.gstatic.com; connect-src 'self' https://serpapi.com; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
}

module.exports = withBundleAnalyzer(nextConfig) 