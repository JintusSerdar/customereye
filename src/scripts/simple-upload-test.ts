#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function uploadFragrance11Data() {
  console.log('🌸 Uploading Fragrance11 data...');
  
  try {
    // Create the report
    const report = await prisma.report.create({
      data: {
        title: 'Fragrance11 Customer Insights Report',
        description: 'Comprehensive analysis of Fragrance11 customer reviews and satisfaction metrics',
        companyName: 'Fragrance11',
        companySlug: 'fragrance11',
        industry: 'Beauty & Well-being',
        category: 'Fragrance & Cosmetics',
        country: 'US',
        rating: 4.2,
        reviewCount: 1251,
        summary: 'Fragrance11 delivers quality beauty products with excellent customer service. Customers appreciate the variety and quality of fragrances, though some mention shipping delays.',
        tags: ['Fragrance', 'Beauty', 'Cosmetics', 'Online Retail'],
        reportType: 'FREE',
        language: 'en',
        isPaid: false,
        logo: '🌸',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Report created: ${report.id}`);

    // Upload the text files
    const dataDir = './data/fragrance11';
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
            content,
          },
        });
        
        console.log(`📁 File uploaded: ${filename} -> ${sectionType}`);
      }
    }

    // Create report sections
    const sections = [
      {
        sectionType: 'RATING_DISTRIBUTION',
        title: 'Rating Distribution Analysis',
        content: 'Analysis of customer rating patterns and satisfaction levels.',
        order: 1,
      },
      {
        sectionType: 'OVERALL_WORDCLOUD',
        title: 'Overall Word Cloud',
        content: 'Most frequently mentioned words in customer reviews.',
        order: 2,
      },
      {
        sectionType: 'YEARLY_REPLIES',
        title: 'Customer Engagement Analysis',
        content: 'Company response patterns and customer engagement trends.',
        order: 3,
      },
      {
        sectionType: 'CONCLUSION',
        title: 'Conclusion & Recommendations',
        content: 'Strategic recommendations and key insights.',
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

    console.log('🎉 Fragrance11 data uploaded successfully!');
    console.log(`📊 Report ID: ${report.id}`);
    console.log(`🔗 View at: http://localhost:3000/reports/fragrance11`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadFragrance11Data()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
