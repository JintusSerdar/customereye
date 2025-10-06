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

async function uploadRakutenWithNewStructure() {
  console.log('🏗️ Uploading Rakuten.ca with new S3 structure...');
  
  try {
    // Clear existing data
    await prisma.reportDataFile.deleteMany({});
    await prisma.reportSection.deleteMany({});
    await prisma.report.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create new report with S3 structure
    const companySlug = 'rakuten-ca';
    const reportType = 'FREE';
    const country = 'CA';
    const version = 'v1';
    const s3Prefix = `companies/${companySlug}/reports/${reportType.toLowerCase()}/${version}`;

    const report = await prisma.report.create({
      data: {
        title: 'Rakuten.ca Customer Insights Report',
        description: 'Comprehensive analysis of Rakuten.ca customer reviews and satisfaction metrics in the Canadian market',
        companyName: 'Rakuten.ca',
        companySlug,
        industry: 'Money & Insurance',
        category: 'Financial Services',
        country,
        rating: 4.2,
        reviewCount: 11750,
        summary: 'Rakuten.ca delivers excellent cashback services with strong customer satisfaction. Customers appreciate the easy-to-use platform, reliable cashback features, and good customer service. The company shows strong engagement with 72.24% 5-star ratings, though response rates have fluctuated over the years.',
        tags: ['Cashback', 'Financial Services', 'Online Shopping', 'Rewards', 'Canada'],
        reportType: 'FREE',
        language: 'en',
        isPaid: false,
        logo: '🏦',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        version,
        s3Prefix,
        metadata: {
          totalFiles: 7,
          textFiles: 4,
          imageFiles: 3,
          reportStructure: 'free',
          dataSource: 'customer-reviews',
          analysisDate: new Date().toISOString(),
        },
      },
    });

    console.log(`✅ Report created: ${report.id}`);

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
        
        // Create S3 key for text file
        const s3Key = `${s3Prefix}/data/text/${filename}`;
        
        const dataFile = await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: 'TEXT',
            sectionType: sectionType as any,
            sequence,
            filename,
            originalName: filename,
            s3Key,
            size: stats.size,
            mimeType: 'text/plain',
            content,
            version,
            fileCategory: 'text',
          },
        });
        
        console.log(`📁 Text file: ${filename} -> ${sectionType} (${content.length} chars)`);
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

      // Create S3 key for image
      const s3Key = `${s3Prefix}/data/images/${imageName}`;
      
      // Upload to S3
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

      // Create data file entry with S3 key
      const dataFile = await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: 'IMAGE',
          sectionType: sectionType as any,
          sequence,
          filename: imageName,
          originalName: imageName,
          s3Key,
          size: stats.size,
          mimeType: 'image/png',
          version,
          fileCategory: 'images',
        },
      });

      console.log(`🖼️ Image uploaded to S3: ${imageName} -> ${sectionType} (${stats.size} bytes)`);
      console.log(`🔗 S3 Key: ${s3Key}`);
    }

    // Create report sections
    const sections = [
      {
        sectionType: 'RATING_DISTRIBUTION',
        title: 'Rating Distribution Analysis',
        content: 'Analysis shows 72.24% of customers give 5-star ratings, indicating high satisfaction with Rakuten.ca\'s cashback services. 16.97% give 4-star ratings, while only 5.75% give 3-star ratings. The distribution reflects strong customer satisfaction with the platform.',
        order: 1,
      },
      {
        sectionType: 'OVERALL_WORDCLOUD',
        title: 'Word Cloud Analysis',
        content: 'Key themes include "cashback," "easy," "great," "love," and "service." Customers appreciate the platform\'s user-friendly interface, reliable cashback features, and excellent customer service. The word cloud reflects predominantly positive sentiment.',
        order: 2,
      },
      {
        sectionType: 'YEARLY_REPLIES',
        title: 'Customer Engagement Analysis',
        content: 'Response rates have fluctuated over the years, with 37.38% in 2019, dropping to 4.15% in 2020, and recovering to 19.81% in 2022. The company should focus on consistent response rates to maintain customer engagement.',
        order: 3,
      },
      {
        sectionType: 'CONCLUSION',
        title: 'Conclusion & Recommendations',
        content: 'Rakuten.ca demonstrates strong customer satisfaction with 72.24% 5-star ratings. Key recommendations include maintaining consistent response rates, enhancing customer engagement, and continuing to focus on the cashback features that customers value most.',
        order: 4,
      },
    ];

    for (const section of sections) {
      await prisma.reportSection.create({
        data: {
          reportId: report.id,
          sectionType: section.sectionType as any,
          title: section.title,
          content: section.content,
          order: section.order,
        },
      });
    }

    console.log('🎉 Rakuten.ca data uploaded with new S3 structure!');
    console.log(`📊 S3 Structure: ${s3Prefix}`);
    console.log(`🔗 View at: http://localhost:3001/reports/rakuten-ca`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadRakutenWithNewStructure()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
