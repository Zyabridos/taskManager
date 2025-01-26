// /** @type {import('next').NextConfig} */
// const nextConfig = {};


// export default nextConfig;

import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    config.resolve.extensions.push('.js', '.jsx');

    return config;
  },
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  experimental: {
    scrollRestoration: true,
    appDir: true, // я использую app router. При смене на pages router данная настройка дб удалена
  },
  // env: {
  //   API_URL: process.env.API_URL || 'http://localhost:5000',
  // },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/:path*',
      },
    ];
  },
};

export default nextConfig
