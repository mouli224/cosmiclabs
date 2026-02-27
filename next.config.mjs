/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,

  // Compiler optimisations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Webpack tweaks for Three.js — suppress WASM warnings
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ["raw-loader"],
    });

    // Avoid "Can't resolve" issues with three's optional dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    return config;
  },

  // Image optimisation settings
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Enable experimental App Router features
  experimental: {
    // Optimise CSS (requires critters package but graceful if absent)
    optimizeCss: false,
  },
};

export default nextConfig;
