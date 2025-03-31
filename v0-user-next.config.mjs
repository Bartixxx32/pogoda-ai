/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PWA features
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
  // Other Next.js config options
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;

