/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration options go here
  
  // Redirects for URL compatibility with backend-generated links
  async redirects() {
    return [
      {
        source: '/verify-email',
        destination: '/auth/verify-email',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
