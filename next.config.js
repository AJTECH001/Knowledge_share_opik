/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["opik", "nunjucks", "chokidar"],
  webpack: (config) => {
    config.externals.push({
      "fsevents": "commonjs fsevents"
    });
    return config;
  }
};
module.exports = nextConfig;
