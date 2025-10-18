/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'static-01.daraz.com.bd',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'image.com',
      },
      {
        protocol: 'https',
        hostname: 'img.drz.lazcdn.com',
      },
      { // FIX: Added the new hostname from the error message
        protocol: 'https',
        hostname: 'ibb.co.com',
      },
      // You can continue to add any other domains you find here
    ],
  },
};

export default nextConfig;

