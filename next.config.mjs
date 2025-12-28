/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "usercontent.jamendo.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp"],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
