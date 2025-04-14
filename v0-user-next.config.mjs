/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Optimize images from placeholder domains
  images: {
    domains: ['placeholder.svg', 'encrypted-tbn0.gstatic.com', 'assets.enterprisestorageforum.com', 'cdn.prod.website-files.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Experimental features to improve performance
  experimental: {
    // Enable App Router optimizations
    optimizeCss: true,
  },
  
  // Improve build output
  output: 'standalone',
  
  // Improve development experience
  devIndicators: {
    position: 'bottom-right',
  },
}

export default nextConfig
