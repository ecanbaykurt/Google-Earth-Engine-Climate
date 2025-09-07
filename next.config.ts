import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages configuration
  experimental: {
    runtime: 'nodejs'
  },
  // Enable serverless functions for Cloudflare Pages
  output: 'standalone'
};

export default nextConfig;
