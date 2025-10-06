#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function uploadRakutenWithDatabaseStorage() {
  console.log('🔄 Re-uploading Rakuten.ca with database storage...');
  
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
            path: filePath,
            size: stats.size,
            mimeType: 'text/plain',
            content, // Store full text content
          },
        });
        
        console.log(`📁 Text file uploaded: ${filename} -> ${sectionType} (${content.length} chars)`);
      }
    }

    // Process images from temp folder and store in database
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

      // Read image as binary data
      const imageBuffer = await fs.promises.readFile(imagePath);
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

      // Create data file entry with binary data
      const dataFile = await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: 'IMAGE',
          sectionType: sectionType as any,
          sequence,
          filename: imageName,
          originalName: imageName,
          path: `/uploads/rakuten-ca/${imageName}`, // Keep path for reference
          size: stats.size,
          mimeType: 'image/png',
          data: imageBuffer, // Store binary data in database
        },
      });

      console.log(`🖼️ Image uploaded to database: ${imageName} -> ${sectionType} (${stats.size} bytes)`);
    }

    console.log('🎉 Rakuten.ca data re-uploaded with database storage!');
    console.log(`🔗 View at: http://localhost:3001/reports/rakuten-ca`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadRakutenWithDatabaseStorage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
