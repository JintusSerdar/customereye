#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function uploadRakutenCa() {
  console.log('🚀 Uploading Rakuten.ca data...');
  
  try {
    // Create the report
    const report = await prisma.report.create({
      data: {
        title: 'Rakuten.ca Customer Insights Report',
        description: 'Comprehensive analysis of Rakuten.ca customer reviews and satisfaction metrics in the Canadian market',
        companyName: 'Rakuten.ca',
        companySlug: 'rakuten-ca',
        industry: 'Money & Insurance',
        category: 'Financial Services',
        country: 'CA',
        rating: 4.2, // Based on the 72.24% 5-star rating
        reviewCount: 11750, // Estimated from the data
        summary: 'Rakuten.ca delivers excellent cashback services with strong customer satisfaction. Customers appreciate the easy-to-use platform, reliable cashback features, and good customer service. The company shows strong engagement with 72.24% 5-star ratings, though response rates have fluctuated over the years.',
        tags: ['Cashback', 'Financial Services', 'Online Shopping', 'Rewards', 'Canada'],
        reportType: 'FREE',
        language: 'en',
        isPaid: false,
        logo: '🏦',
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Report created: ${report.id}`);

    // Process and upload files
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
            content,
          },
        });
        
        console.log(`📁 File uploaded: ${filename} -> ${sectionType}`);
      }
    }

    // Create report sections with detailed content
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

    console.log('🎉 Rakuten.ca data uploaded successfully!');
    console.log(`📊 Report ID: ${report.id}`);
    console.log(`🔗 View at: http://localhost:3001/reports/rakuten-ca`);
    
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the upload
uploadRakutenCa()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
