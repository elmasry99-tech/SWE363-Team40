import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "https://cyphernet-backend.onrender.com";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: `${BACKEND_URL}/auth/:path*` },
      { source: "/users/:path*", destination: `${BACKEND_URL}/users/:path*` },
      { source: "/rooms/:path*", destination: `${BACKEND_URL}/rooms/:path*` },
      { source: "/messages/:path*", destination: `${BACKEND_URL}/messages/:path*` },
      { source: "/files/:path*", destination: `${BACKEND_URL}/files/:path*` },
      { source: "/orgs/:path*", destination: `${BACKEND_URL}/orgs/:path*` },
      { source: "/ice-servers", destination: `${BACKEND_URL}/ice-servers` },
      { source: "/upload", destination: `${BACKEND_URL}/upload` },
    ];
  },
};

export default nextConfig;
