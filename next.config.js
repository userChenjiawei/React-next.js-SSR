const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: 'build',
};

const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);
