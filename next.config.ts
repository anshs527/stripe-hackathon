import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/business", destination: "/fundraisers/business.html" },
      { source: "/organization", destination: "/fundraisers/organization.html" },
    ];
  },
};

export default nextConfig;
