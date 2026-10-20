import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // native module: load from node_modules at runtime, never bundle
  serverExternalPackages: ["better-sqlite3"],
  // lets a check build run without clobbering a running dev server
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
