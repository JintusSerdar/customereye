import { S3Client, PutBucketPolicyCommand, GetBucketPolicyCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'customereye';

const fixS3Permissions = async () => {
  console.log('🔧 Fixing S3 bucket permissions...\n');
  
  try {
    // First, check current bucket policy
    try {
      const currentPolicy = await s3Client.send(new GetBucketPolicyCommand({
        Bucket: BUCKET_NAME
      }));
      console.log('📋 Current bucket policy:');
      console.log(JSON.stringify(JSON.parse(currentPolicy.Policy!), null, 2));
    } catch (error) {
      console.log('📋 No existing bucket policy found');
    }
    
    // Set public read policy for the bucket
    const bucketPolicy = {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Sid": "PublicReadGetObject",
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": `arn:aws:s3:::${BUCKET_NAME}/*`
        }
      ]
    };
    
    await s3Client.send(new PutBucketPolicyCommand({
      Bucket: BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    }));
    
    console.log('✅ S3 bucket policy updated successfully!');
    console.log('🌐 Files should now be publicly accessible');
    
  } catch (error) {
    console.error('❌ Error fixing S3 permissions:', error);
  }
};

fixS3Permissions();
