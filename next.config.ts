/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**', // accepte toutes les images hébergées
      },
    ],
  },
}

module.exports = nextConfig
