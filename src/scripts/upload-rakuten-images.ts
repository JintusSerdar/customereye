#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function uploadRakutenImages() {
  console.log('🖼️ Uploading Rakuten.ca images...');
  
  try {
    // Find the Rakuten.ca report
    const report = await prisma.report.findUnique({
      where: { companySlug: 'rakuten-ca' },
    });

    if (!report) {
      throw new Error('Rakuten.ca report not found. Please run the upload:rakuten-ca script first.');
    }

    console.log(`✅ Found report: ${report.id}`);

    // Process images from temp folder
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

      // Copy to public/uploads/rakuten-ca
      const publicDir = path.join('public', 'uploads', 'rakuten-ca');
      await fs.promises.mkdir(publicDir, { recursive: true });
      const destPath = path.join(publicDir, imageName);
      await fs.promises.copyFile(imagePath, destPath);

      // Get file stats
      const stats = await fs.promises.stat(imagePath);

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

      // Create data file entry
      const dataFile = await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: 'IMAGE',
          sectionType: sectionType as any,
          sequence,
          filename: imageName,
          originalName: imageName,
          path: `/uploads/rakuten-ca/${imageName}`,
          size: stats.size,
          mimeType: 'image/png',
        },
      });

      console.log(`🖼️ Image uploaded: ${imageName} -> ${sectionType}`);
    }

    console.log('🎉 Rakuten.ca images uploaded successfully!');
    console.log(`🔗 View at: http://localhost:3001/reports/rakuten-ca`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadRakutenImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
