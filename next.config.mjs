/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites () {
    return [
      {
        source: '/api/:path*',
        destination: 'http://db:8080/api/:path*'
      }
    ]
  }
}

export default nextConfig
