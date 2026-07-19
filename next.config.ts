import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent @libsql/client native bindings from being bundled by Next.js
  // Required for Turso to work on Vercel / Netlify serverless
  serverExternalPackages: ["@libsql/client", "@prisma/adapter-libsql"],

  // Silence the turbopack workspace-root warning caused by a parent lockfile
  turbopack: {
    root: __dirname,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
  },
};

export default nextConfig;
