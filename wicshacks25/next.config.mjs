/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
      serverActions: true, // Enable Server Actions
    },
    serverActions: {
      bodySizeLimit: "10mb", // Adjust as needed
    },
  };
  
  export default nextConfig;
  