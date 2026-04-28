import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "https://j1kd03zy9sz0-d.space.z.ai",
    "https://preview-chat-6826dc5d-39a9-4ee6-8f01-c449e66e0e6c.space-z.ai",
  ],
};

export default nextConfig;
