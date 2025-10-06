#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

// Load environment variables
config({ path: '.env.local' });

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'customereye';

async function clearS3Bucket() {
  console.log(`🧹 Clearing S3 bucket: ${BUCKET_NAME}`);
  
  try {
    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
    });

    const listResponse = await s3Client.send(listCommand);
    
    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      console.log('✅ Bucket is already empty');
      return;
    }

    console.log(`📦 Found ${listResponse.Contents.length} objects to delete`);

    // Delete all objects
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: BUCKET_NAME,
      Delete: {
        Objects: listResponse.Contents.map(obj => ({
          Key: obj.Key!,
        })),
      },
    });

    await s3Client.send(deleteCommand);
    
    console.log('✅ S3 bucket cleared successfully!');
    console.log(`🗑️ Deleted ${listResponse.Contents.length} objects`);
    
  } catch (error) {
    console.error('❌ Error clearing S3 bucket:', error);
    throw error;
  }
}

// Run the cleanup
clearS3Bucket()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
