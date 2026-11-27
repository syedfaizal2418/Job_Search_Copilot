/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents hello-pangea/dnd double-mount hydration issue in dev
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "pdfjs-dist", "@napi-rs/canvas"],
  },
};

export default nextConfig;

