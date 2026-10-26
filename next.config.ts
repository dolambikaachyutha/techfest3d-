import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  // Pin Turbopack's project root to this directory. Without it Turbopack
  // walks up looking for a lockfile and can latch onto one outside the repo
  // (e.g. a stray package-lock.json in the home directory), which produces a
  // "Next.js ignored package-lock.json" warning and non-deterministic builds
  // locally and on Netlify.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
