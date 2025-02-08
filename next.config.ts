import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Use remotePatterns (recommended for Next.js 13 and later)
      {
        protocol: "http", // Usually https
        hostname: "www.plantuml.com",
        port: "", // Leave empty if no custom port
        pathname: "/**", // Allow all paths on this hostname
      },
    ],
  },
};

export default nextConfig;
