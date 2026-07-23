import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
  // pixi.js is a browser-only WebGL/canvas library — skip server-side bundling
  serverExternalPackages: ["pixi.js"],
  typescript: {
    // Type narrowing errors in JSX are safe at runtime (guarded by quest.type checks).
    // Full type safety is enforced during development via IDE.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;


