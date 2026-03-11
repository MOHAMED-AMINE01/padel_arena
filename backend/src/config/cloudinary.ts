import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

cloudinary.config({
  cloud_name: 'djks8n2nh',
  api_key: '686645735224467',
  api_secret: 'zEz9o8xa-5FVXSP8lRL03LOuZEg'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'padel-arena',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any
});

export const upload = multer({ storage: storage });
export default cloudinary;
