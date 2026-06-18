import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http2.mlstatic.com",
      },
      {
        protocol: "https",
        hostname: "newsport.vtexassets.com",
      },
      {
        protocol: "https",
        hostname: "cdn-images.farfetch-contents.com",
      },
    ],
  },
};

export default nextConfig;