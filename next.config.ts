import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Proxy API requests to backend in development
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*",
      },
    ];
  },
};

export default nextConfig;
