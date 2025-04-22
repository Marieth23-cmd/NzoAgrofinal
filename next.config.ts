import withPWA from 'next-pwa'
import type { NextConfig } from 'next'


const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.freepik.com'],
  },
  
  eslint: {
    ignoreDuringBuilds: true, 
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev
})(nextConfig)
