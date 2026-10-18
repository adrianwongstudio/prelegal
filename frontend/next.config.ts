import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export served by the FastAPI backend; trailing slashes emit nda/index.html.
  output: "export",
  trailingSlash: true,
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
