/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL, // Ensures DATABASE_URL is accessible
    },
  };
  
  export default nextConfig;
  