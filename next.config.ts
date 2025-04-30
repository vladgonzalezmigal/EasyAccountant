/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.ENV === 'development',

  devIndicators: {
      appIsrStatus: process.env.ENV === 'development',
  },

  // REMOVE this line:
  // output: 'export',

  // Optional: uncomment if you're using SWC minification
  // swcMinify: true,
};

module.exports = nextConfig;