// next.config.js ou next.config.ts (selon ton projet)
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/posts/**",
      },
    ],
  },
};

export default nextConfig;
