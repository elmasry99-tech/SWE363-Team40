import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${BACKEND_URL}/auth/:path*` },
      { source: "/users/:path*", destination: `${BACKEND_URL}/users/:path*` },
      { source: "/upload", destination: `${BACKEND_URL}/upload` },
    ];
  },
};

export default nextConfig;
