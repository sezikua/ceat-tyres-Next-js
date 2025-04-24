/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WOOCOMMERCE_KEY: process.env.WOOCOMMERCE_KEY,
    WOOCOMMERCE_SECRET: process.env.WOOCOMMERCE_SECRET,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['teslafun.top'],
  },
}

export default nextConfig
