import type { NextConfig } from "next";
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:8800";
const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_ORIGIN}/:path*` }];
  },
};
export default nextConfig;
