import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Allow external avatar and media hosts so <Image /> works without runtime errors.
   * Add more domains here if new providers are introduced.
   */
  images: {
    // Common hosts (Google avatars, Supabase storage, Unsplash placeholders)
    domains: [
      "lh3.googleusercontent.com", // Google OAuth profile images
    ],
  },
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
  // Turbopack configuration moved to experimental in Next.js 15
  experimental: {
    turbo: {
      watchOptions: {
        ignored: [
          "**/node_modules/**",
          "**/.next/**",
          "**/.git/**",
          "**/coverage/**",
          "**/.turbo/**",
          "**/prisma/migrations/**",
        ],
      },
    },
  },
};

export default nextConfig;
