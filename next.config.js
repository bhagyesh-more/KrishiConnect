/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ["localhost"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
