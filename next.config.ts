import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.freepik.com'],
  },
  
  
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})(nextConfig)
