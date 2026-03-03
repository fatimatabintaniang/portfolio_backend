// src/config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file, folder = 'portfolio') => {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [
      { width: 1200, height: 900, crop: 'limit' },
      { quality: 'auto:best' },
      { format: 'webp' }
    ]
  });
  return { url: result.secure_url, publicId: result.public_id };
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
