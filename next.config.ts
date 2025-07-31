import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (dev) {
      // Reduce file watching overhead to improve performance
      config.watchOptions = {
        ...(config.watchOptions || {}),
        ignored: [
          "**/node_modules/**",
          "**/.next/**",
          "**/.git/**",
          "**/coverage/**",
          "**/.turbo/**",
          "**/prisma/migrations/**",
        ],
      };
    }

    return config;
  },
};

export default nextConfig;
