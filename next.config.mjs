/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/bazi-five-elements",
  output: "export", // <=== enables static exports
  reactStrictMode: true,
  images: {
    unoptimized: true, // Fixes image loading issues on GitHub Pages
  },
};

export default nextConfig;
