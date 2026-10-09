import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cricket tools moved under the cricket hub (docs/MULTISPORT.md) — keep old links alive.
  async redirects() {
    return [
      { source: "/players", destination: "/cricket/players", permanent: true },
      { source: "/players/:slug", destination: "/cricket/players/:slug", permanent: true },
      { source: "/xi", destination: "/cricket/xi", permanent: true },
      { source: "/quiz", destination: "/cricket/quiz", permanent: true },
    ];
  },
};

export default nextConfig;
