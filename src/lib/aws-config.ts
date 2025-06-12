import { S3Client } from '@aws-sdk/client-s3';

// AWS S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// S3 bucket name
export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

// Database configuration
export const DB_CONFIG = {
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || '',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
}; 