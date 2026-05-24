/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ik.imagekit.io' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Allow backend API calls from server components during ISR
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin',  value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,X-Session-ID' },
        ],
      },
    ];
  },
  // Suppress hydration warning from Lenis/GSAP
  reactStrictMode: false,
};

module.exports = nextConfig;
