import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/admin",
  transpilePackages: ["@clonary/database"],
};

export default nextConfig;
