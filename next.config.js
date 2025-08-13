/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['drive.google.com'],
  },
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
      'three/webgpu': path.resolve(__dirname, 'src/utils/three-webgpu-stub.ts'),
      // three-globe also imports the optional TSL helpers introduced in newer
      // three builds.  Alias that path to a no-op stub so our older three
      // version can satisfy the import without errors.
      'three/tsl': path.resolve(__dirname, 'src/utils/three-tsl-stub.ts')
    };
    return config;
  }
};

module.exports = nextConfig;
