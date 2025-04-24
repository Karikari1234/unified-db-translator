/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable production builds to be more memory efficient
  swcMinify: true,
  // Configure webpack to be more memory efficient
  webpack: (config, { dev, isServer }) => {
    // Optimize for development builds
    if (dev) {
      // Reduce parallel processes to minimize memory usage
      config.parallelism = 1;
      
      // Disable source maps in development to save memory
      config.devtool = false;
    }
    
    // Return the modified config
    return config;
  },
};

export default nextConfig;
