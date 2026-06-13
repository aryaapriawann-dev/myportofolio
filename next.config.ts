import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Allow local network access for dev server
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
