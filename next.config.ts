import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aranyakresortghatsila.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
