/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    // three-globe optionally imports the WebGPU renderer which isn't
    // bundled in our installed three version.  Alias it to an empty module
    // so the import resolves without pulling in WebGPU code.
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/webgpu': false
    };
    return config;
  }
};

module.exports = nextConfig;
