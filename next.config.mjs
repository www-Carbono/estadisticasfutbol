/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
      {
        protocol: 'https',
        hostname: 's1.abcstatics.com'
      },
      {
        protocol: 'https',
        hostname: 'cdn.ssref.net'
      },
      {
        protocol: 'https',
        hostname: 'flagsapi.com'
      }
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        sharp: 'commonjs sharp',
        'onnxruntime-node': 'commonjs onnxruntime-node'
      })
    }

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader'
    })

    return config
  }
}

export default nextConfig
