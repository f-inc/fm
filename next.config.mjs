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
  async headers() {
    return [
      {
        source: '/:path*.ts', // For HLS segments
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.m3u8', // For HLS manifest
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
}

export default nextConfig