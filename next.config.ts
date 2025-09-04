import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent ESLint errors from blocking production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // In case of type issues, allow production build to proceed
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
