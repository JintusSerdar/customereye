#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'customereye';

async function uploadToS3(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

const prisma = new PrismaClient();

async function uploadRakutenToS3() {
  console.log('☁️ Uploading Rakuten.ca to S3...');
  
  try {
    // Find the Rakuten.ca report
    const report = await prisma.report.findUnique({
      where: { companySlug: 'rakuten-ca' },
    });

    if (!report) {
      throw new Error('Rakuten.ca report not found. Please run the upload:rakuten-ca script first.');
    }

    console.log(`✅ Found report: ${report.id}`);

    // Delete existing data files to re-upload
    await prisma.reportDataFile.deleteMany({
      where: { reportId: report.id }
    });
    console.log('🗑️ Cleared existing data files');

    // Process text files from data folder
    const dataDir = './data/rakuten-ca';
    const files = await fs.promises.readdir(dataDir);
    
    for (const filename of files) {
      if (filename.endsWith('.txt')) {
        const filePath = path.join(dataDir, filename);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const stats = await fs.promises.stat(filePath);
        
        // Determine section type based on filename
        let sectionType = 'CUSTOM_ANALYSIS';
        if (filename.includes('rating_distribution')) {
          sectionType = 'RATING_DISTRIBUTION';
        } else if (filename.includes('wordcloud')) {
          sectionType = 'OVERALL_WORDCLOUD';
        } else if (filename.includes('yearly_replies')) {
          sectionType = 'YEARLY_REPLIES';
        } else if (filename.includes('conclusion')) {
          sectionType = 'CONCLUSION';
        }
        
        // Extract sequence number
        const sequenceMatch = filename.match(/^(\d+)_/);
        const sequence = sequenceMatch ? parseInt(sequenceMatch[1]) : null;
        
        const dataFile = await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: 'TEXT',
            sectionType: sectionType as any,
            sequence,
            filename,
            originalName: filename,
            path: `reports/${report.companySlug}/${filename}`, // S3 path
            size: stats.size,
            mimeType: 'text/plain',
            content, // Store full text content
          },
        });
        
        console.log(`📁 Text file uploaded: ${filename} -> ${sectionType} (${content.length} chars)`);
      }
    }

    // Process images from temp folder and upload to S3
    const tempDir = './public/temp';
    const images = [
      '1_given_rating_distributions_rakuten.ca.png',
      '6_overall_reviews_wordcloud_rakuten.ca.png',
      '15_overall_yearly_replies_rakuten.ca.png'
    ];

    for (const imageName of images) {
      const imagePath = path.join(tempDir, imageName);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`⚠️ Image not found: ${imageName}`);
        continue;
      }

      // Read image as buffer
      const imageBuffer = await fs.promises.readFile(imagePath);
      const stats = await fs.promises.stat(imagePath);

      // Upload to S3
      const s3Key = `reports/${report.companySlug}/${imageName}`;
      const s3Url = await uploadToS3(s3Key, imageBuffer, 'image/png');

      // Determine section type based on filename
      let sectionType = 'CUSTOM_ANALYSIS';
      if (imageName.includes('rating_distributions') || imageName.includes('rating_distribution')) {
        sectionType = 'RATING_DISTRIBUTION';
      } else if (imageName.includes('wordcloud')) {
        sectionType = 'OVERALL_WORDCLOUD';
      } else if (imageName.includes('yearly_replies')) {
        sectionType = 'YEARLY_REPLIES';
      }

      // Extract sequence number
      const sequenceMatch = imageName.match(/^(\d+)_/);
      const sequence = sequenceMatch ? parseInt(sequenceMatch[1]) : null;

      // Create data file entry with S3 URL
      const dataFile = await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: 'IMAGE',
          sectionType: sectionType as any,
          sequence,
          filename: imageName,
          originalName: imageName,
          path: s3Url, // S3 URL
          size: stats.size,
          mimeType: 'image/png',
        },
      });

      console.log(`🖼️ Image uploaded to S3: ${imageName} -> ${sectionType} (${stats.size} bytes)`);
      console.log(`🔗 S3 URL: ${s3Url}`);
    }

    console.log('🎉 Rakuten.ca data uploaded to S3 successfully!');
    console.log(`🔗 View at: http://localhost:3001/reports/rakuten-ca`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadRakutenToS3()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
