import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Bản demo FE: render động toàn bộ (cookie phiên demo qua DemoBar),
   * không dùng Cache Components/PPR.
   */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
