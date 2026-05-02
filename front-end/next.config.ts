import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    // Proxy only genuine API/fetch calls — not browser page navigations or
    // Next.js RSC requests (used for client-side routing).
    //   has:     accept must NOT contain "text/html"  → skips full-page browser loads
    //   missing: rsc header must be absent            → skips Next.js RSC navigation requests
    const notPageRequest = {
      has: [{ type: "header" as const, key: "accept", value: "^(?!.*text/html).*$" }],
      missing: [{ type: "header" as const, key: "rsc" }],
    };

    const apiRoutes = [
      { source: "/auth/:path*", destination: `${BACKEND_URL}/auth/:path*`, ...notPageRequest },
      { source: "/users/:path*", destination: `${BACKEND_URL}/users/:path*`, ...notPageRequest },
      { source: "/rooms/:path*", destination: `${BACKEND_URL}/rooms/:path*`, ...notPageRequest },
      { source: "/messages/:path*", destination: `${BACKEND_URL}/messages/:path*`, ...notPageRequest },
      { source: "/files/:path*", destination: `${BACKEND_URL}/files/:path*`, ...notPageRequest },
      { source: "/orgs/:path*", destination: `${BACKEND_URL}/orgs/:path*`, ...notPageRequest },
      { source: "/ice-servers", destination: `${BACKEND_URL}/ice-servers`, ...notPageRequest },
      { source: "/upload", destination: `${BACKEND_URL}/upload`, ...notPageRequest },
    ];
    return { beforeFiles: apiRoutes };
  },
};

export default nextConfig;
