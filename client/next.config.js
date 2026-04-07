/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variable exposure
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
