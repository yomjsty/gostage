import type { NextConfig } from "next";
import { env } from "./lib/env";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: env.NEXT_PUBLIC_UPLOADTHING_APP_ID + ".ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
    ],
  },
};

export default nextConfig;
