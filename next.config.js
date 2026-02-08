/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["opik", "nunjucks", "chokidar"],
  },
  webpack: (config) => {
    config.externals.push({
      "fsevents": "commonjs fsevents"
    });
    return config;
  }
};
module.exports = nextConfig;
