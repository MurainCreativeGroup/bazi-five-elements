/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/bazi-five-elements",
  assetPrefix: "/bazi-five-elements/", // ✅ Ensure assets load properly
  output: "export", // ✅ Enables static exports
  reactStrictMode: true,
};

export default nextConfig;
