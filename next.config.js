/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  reactStrictMode: true,

  images: {
    domains: [],
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  output: 'standalone',

  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
