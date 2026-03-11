import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ozscmuviswmqotbtqdku.supabase.co",
      },
    ],
  },
}

module.exports = nextConfig