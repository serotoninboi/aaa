/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {dirs: ['app', 'components', 'lib', 'hooks']},
  experimental: { serverComponentsExternalPackages: ['bcryptjs'] }
}
module.exports = nextConfig
