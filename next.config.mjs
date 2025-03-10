/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/bazi-five-elements",
  assetPrefix: "/bazi-five-elements/", // ✅ Ensure assets load properly
  output: "export", // ✅ Enables static exports
  trailingSlash: true,
  images: {
    unoptimized: true, // ✅ Fixes Next.js Image Optimization issue on Cloudflare
  },
};

export default nextConfig;
