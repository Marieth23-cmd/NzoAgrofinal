import withPWA from 'next-pwa'
import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.freepik.com', 'res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: isDev,
})(nextConfig)













// import withPWA from 'next-pwa'
// import type { NextConfig } from 'next'

// const isDev = process.env.NODE_ENV === 'development';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ['img.freepik.com', 'res.cloudinary.com'],
//   },
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   // Adicionar headers para arquivos estáticos
//   async headers() {
//     return [
//       {    
//         source: '/manifest.json',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=86400'
//           },
//           {
//             key: 'Content-Type',
//             value: 'application/json'
//           }
//         ]
//       },
//       {
//         source: '/sw.js',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=0, must-revalidate'
//           }
//         ]
//       },
//       {
//         source: '/icons/(.*)',
//         headers: [
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000, immutable'
//           }
//         ]
//       }
//     ];
//   }
// }

// export default withPWA({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: isDev,
//   // Configurações PWA adicionais
//   publicExcludes: ['!manifest.json'],
//   buildExcludes: [/middleware-manifest\.json$/],
//   scope: '/',
//   sw: 'sw.js'
// })(nextConfig)