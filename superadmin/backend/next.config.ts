import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Each app has its own lockfile; pin the workspace root to this folder.
  turbopack: { root: process.cwd() },
};

export default nextConfig;
