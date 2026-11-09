/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Environment variables validation
  env: {
    NEXT_PUBLIC_APP_NAME: 'فكرتو',
    NEXT_PUBLIC_APP_NAME_EN: 'Fekrto',
  },
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
