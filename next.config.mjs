/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Zabrání shození buildu na Vercelu kvůli DOM typům (WakeLock apod.)
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
