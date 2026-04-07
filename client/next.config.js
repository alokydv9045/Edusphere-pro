/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimization for Render's restricted memory environment (Free Tier)
  // Disable linting and Type Checking during build to avoid OOM (Out of Memory)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Environment variable exposure
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
