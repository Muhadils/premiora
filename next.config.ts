import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.premku.com',
      },
      {
        protocol: 'https',
        hostname: 'lvkfcnpyuxvglcjhrvqq.supabase.co',
      }
    ],
  },
};

export default nextConfig;
