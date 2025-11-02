import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // --- ของเดิมที่คุณมีอยู่ ---
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // --- ✅ เพิ่มส่วนนี้เข้าไป ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};
export default nextConfig;
