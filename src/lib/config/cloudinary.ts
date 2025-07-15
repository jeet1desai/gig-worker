import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { publicEnv } from './publicEnv';

dotenv.config();

cloudinary.config({
  cloud_name: publicEnv.CLOUDINARY_CLOUD_NAME,
  api_key: publicEnv.CLOUDINARY_API_KEY,
  api_secret: publicEnv.CLOUDINARY_API_SECRET
});

export default cloudinary;
