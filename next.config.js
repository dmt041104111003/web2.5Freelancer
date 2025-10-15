/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['snarkjs', 'ffjavascript', 'web-worker'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('web-worker', 'ffjavascript', { snarkjs: 'commonjs snarkjs' });
    }
    return config;
  },
};

module.exports = nextConfig;
