/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors from binary files
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    // Ignore .ts files in public directory
    config.module.rules.push({
      test: /public\/.*\.ts$/,
      type: 'asset/resource',
    });
    return config;
  },
}

export default nextConfig