import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || 'your-bucket-name';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function uploadFile(filePath: string, s3Key: string) {
  const fileContent = fs.readFileSync(filePath);
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
  });
  await s3Client.send(command);
  console.log(`Uploaded ${filePath} to ${s3Key}`);
}

async function uploadDirectory(dirPath: string, s3Prefix: string) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await uploadDirectory(filePath, `${s3Prefix}/${file}`);
    } else {
      const s3Key = `${s3Prefix}/${file}`;
      await uploadFile(filePath, s3Key);
    }
  }
}

async function main() {
  const dataDir = path.join(__dirname, '../../data');
  await uploadDirectory(dataDir, 'preview-reports');
  console.log('Upload completed successfully!');
}

main().catch(console.error); 