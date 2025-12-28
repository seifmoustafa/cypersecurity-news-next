/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  compress: false,
  // Ensure static files are properly handled
  trailingSlash: false,
  // Configure for IIS deployment
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Enable static file serving
  staticPageGenerationTimeout: 1000,
}

export default nextConfig
