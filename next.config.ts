import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false
      };
    }
    return config;
  },

  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'platform-lookaside.fbsbx.com',
      'res.cloudinary.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.pexels.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
        pathname: '/**'
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  typescript: {
    ignoreBuildErrors: false
  },

  output: 'standalone',

  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
      bodySizeLimit: '2mb'
    }
  }
};

export default nextConfig;
