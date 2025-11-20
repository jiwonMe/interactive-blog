/** @type {import('next').NextConfig} */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/interactive-ui"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "articles"),
            to: path.join(__dirname, "public/images/articles"),
            noErrorOnMissing: true,
            globOptions: {
              ignore: ["**/*.mdx", "**/*.tsx", "**/*.ts", "**/*.js", "**/*.json"],
            },
          },
        ],
      })
    );
    return config;
  },
};

module.exports = nextConfig;
