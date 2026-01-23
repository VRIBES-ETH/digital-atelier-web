import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/sobre-nosotros',
        destination: '/',
        permanent: true,
      },
      {
        source: '/blog/la-diferencia-entre-amateur-institucional-copywriting-web3',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blog/fear-and-greed-index-crypto-analisis-avanzado',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
