import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // native module: load from node_modules at runtime, never bundle
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
