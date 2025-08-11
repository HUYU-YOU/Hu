/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // three-globe optionally imports the WebGPU renderer which isn't
    // bundled in our installed three version.  Alias it to an empty module
    // so the import resolves without pulling in WebGPU code.
    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      // three-globe tries to import the optional WebGPU renderer from three,
      // but our three build doesn't ship it. Point the module to a tiny stub
      // so the import quietly resolves.
      'three/webgpu': path.resolve(__dirname, 'src/utils/three-webgpu-stub.ts')
    };
    return config;
  }
};

module.exports = nextConfig;
