import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated agent files out of the repo.
  agentRules: false,
  // Images are pre-optimised into public/images (see scripts/optimise-images.mjs),
  // so the site does not depend on Vercel's image optimisation quota.
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: "/resume", destination: "/Sejal_Borkar_Resume.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
