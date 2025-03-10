import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/defaultDb';
export const PORT = process.env.PORT || 5001;
export const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'default_cloud_name';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'default_api_key';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'default_api_secret';
export const NODE_ENV = process.env.NODE_ENV || 'development';
