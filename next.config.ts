/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**", // accepte toutes les images hébergées
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "", // Pas de port spécifique pour Unsplash
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
