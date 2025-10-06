#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface CompanyInfo {
  name: string;
  country: string;
  industry: string;
  category: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: 'FREE' | 'PREMIUM';
  logo: string;
}

// Industry mapping from your Google Drive categories
const INDUSTRY_MAP: Record<string, { industry: string; category: string }> = {
  'Animals Pets (US)': { industry: 'Animals & Pets', category: 'Pet Services' },
  'Beauty Well-being (US)': { industry: 'Beauty & Well-being', category: 'Personal Care' },
  'Business Services (US)': { industry: 'Business Services', category: 'Professional Services' },
  'Construction (US)': { industry: 'Construction', category: 'Building & Construction' },
  'Education Training (US)': { industry: 'Education & Training', category: 'Learning & Development' },
  'Electronics Technology (US)': { industry: 'Electronics & Technology', category: 'Technology Services' },
  'Events Entertainment (US)': { industry: 'Events & Entertainment', category: 'Entertainment Services' },
  'Food Beverages Tobacco (US)': { industry: 'Food & Beverages', category: 'Food & Drink' },
  'Health Medical (US)': { industry: 'Health & Medical', category: 'Healthcare Services' },
  'Hobbies Crafts (US)': { industry: 'Hobbies & Crafts', category: 'Creative Arts' },
  'Home Garden (US)': { industry: 'Home & Garden', category: 'Home Improvement' },
  'Legal Services Government (US)': { industry: 'Legal Services', category: 'Legal & Government' },
  'Media Publishing (US)': { industry: 'Media & Publishing', category: 'Media & Communications' },
  'Money Insurance (US)': { industry: 'Money & Insurance', category: 'Financial Services' },
  'Public Local Services (US)': { industry: 'Public & Local Services', category: 'Government Services' },
  'Restaurants Bars (US)': { industry: 'Restaurants & Bars', category: 'Food & Beverage' },
  'Shopping Fashion (US)': { industry: 'Shopping & Fashion', category: 'Retail & Fashion' },
  'Sports (US)': { industry: 'Sports', category: 'Sports & Recreation' },
  'Travel Vacation (US)': { industry: 'Travel & Vacation', category: 'Travel Services' },
  'Utilities (US)': { industry: 'Utilities', category: 'Utility Services' },
  'Vehicles Transportation (US)': { industry: 'Vehicles & Transportation', category: 'Transportation Services' },
};

// Company logos by industry
const INDUSTRY_LOGOS: Record<string, string> = {
  'Animals & Pets': '🐾',
  'Beauty & Well-being': '💄',
  'Business Services': '💼',
  'Construction': '🏗️',
  'Education & Training': '📚',
  'Electronics & Technology': '💻',
  'Events & Entertainment': '🎉',
  'Food & Beverages': '🍽️',
  'Health & Medical': '🏥',
  'Hobbies & Crafts': '🎨',
  'Home & Garden': '🏠',
  'Legal Services': '⚖️',
  'Media & Publishing': '📰',
  'Money & Insurance': '🏦',
  'Public & Local Services': '🏛️',
  'Restaurants & Bars': '🍴',
  'Shopping & Fashion': '🛍️',
  'Sports': '⚽',
  'Travel & Vacation': '✈️',
  'Utilities': '⚡',
  'Vehicles & Transportation': '🚗',
};

function generateSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseSectionType(filename: string): string {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('rating_distribution') || lowerFilename.includes('given_rating')) {
    return 'RATING_DISTRIBUTION';
  }
  if (lowerFilename.includes('wordcloud') || lowerFilename.includes('word')) {
    return 'OVERALL_WORDCLOUD';
  }
  if (lowerFilename.includes('yearly_replies') || lowerFilename.includes('yearly')) {
    return 'YEARLY_REPLIES';
  }
  if (lowerFilename.includes('conclusion')) {
    return 'CONCLUSION';
  }
  
  return 'CUSTOM_ANALYSIS';
}

function extractSequence(filename: string): number | null {
  const match = filename.match(/^(\d+)[_\-]/);
  return match ? parseInt(match[1]) : null;
}

async function uploadCompanyFromDirectory(
  companyDir: string,
  companyInfo: CompanyInfo
): Promise<string> {
  console.log(`🏢 Processing: ${companyInfo.name}`);
  
  try {
    // Create report
    const report = await prisma.report.create({
      data: {
        title: `${companyInfo.name} Customer Insights Report`,
        description: companyInfo.summary,
        companyName: companyInfo.name,
        companySlug: generateSlug(companyInfo.name),
        industry: companyInfo.industry,
        category: companyInfo.category,
        country: companyInfo.country,
        rating: companyInfo.rating,
        reviewCount: companyInfo.reviewCount,
        summary: companyInfo.summary,
        tags: companyInfo.tags,
        reportType: companyInfo.reportType,
        language: 'en',
        isPaid: companyInfo.reportType === 'PREMIUM',
        logo: companyInfo.logo,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Report created: ${report.id}`);

    // Process files
    const files = await fs.promises.readdir(companyDir);
    let fileCount = 0;

    for (const filename of files) {
      const filePath = path.join(companyDir, filename);
      const stats = await fs.promises.stat(filePath);
      
      let fileType = 'TEXT';
      let mimeType = 'text/plain';
      
      if (filename.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
        fileType = 'IMAGE';
        mimeType = 'image/png';
      }
      
      const sectionType = parseSectionType(filename);
      const sequence = extractSequence(filename);
      
      let content: string | undefined;
      if (fileType === 'TEXT') {
        content = await fs.promises.readFile(filePath, 'utf-8');
      }
      
      await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: fileType as any,
          sectionType: sectionType as any,
          sequence,
          filename,
          originalName: filename,
          path: filePath,
          size: stats.size,
          mimeType,
          content,
        },
      });
      
      fileCount++;
    }

    // Create sections
    const sections = [
      { sectionType: 'RATING_DISTRIBUTION', title: 'Rating Distribution Analysis', order: 1 },
      { sectionType: 'OVERALL_WORDCLOUD', title: 'Word Cloud Analysis', order: 2 },
      { sectionType: 'YEARLY_REPLIES', title: 'Customer Engagement Analysis', order: 3 },
      { sectionType: 'CONCLUSION', title: 'Conclusion & Recommendations', order: 4 },
    ];

    for (const section of sections) {
      await prisma.reportSection.create({
        data: {
          reportId: report.id,
          sectionType: section.sectionType as any,
          title: section.title,
          content: `Analysis data for ${section.title.toLowerCase()}`,
          order: section.order,
        },
      });
    }

    console.log(`📁 Uploaded ${fileCount} files for ${companyInfo.name}`);
    return report.id;

  } catch (error) {
    console.error(`❌ Failed to process ${companyInfo.name}:`, error);
    throw error;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📁 Organize Google Drive Data Tool

This tool helps you organize your Google Drive data locally and upload to CustomerEye.

Usage:
  npm run organize-data <data-directory>

Example:
  npm run organize-data ./my-google-drive-data

Directory Structure Expected:
  ./my-google-drive-data/
  ├── US/
  │   ├── Beauty Well-being (US)/
  │   │   ├── GPT/
  │   │   │   ├── company1/
  │   │   │   │   ├── 1_rating_distribution_company1.txt
  │   │   │   │   ├── 2_wordcloud_company1.txt
  │   │   │   │   ├── 3_yearly_replies_company1.txt
  │   │   │   │   └── Conclusion.txt
  │   │   │   └── company2/...
  │   │   └── GRAPH/
  │   │       ├── company1/
  │   │       │   ├── 1_rating_distribution_company1.png
  │   │       │   ├── 2_wordcloud_company1.png
  │   │       │   └── 3_yearly_replies_company1.png
  │   │       └── company2/...
  │   └── Business Services (US)/...
  ├── UK/...
  └── CA/...

Steps:
1. Download your Google Drive data to a local folder
2. Organize it according to the structure above
3. Run this script to upload to CustomerEye
    `);
    return;
  }
  
  const dataDir = args[0];
  
  if (!fs.existsSync(dataDir)) {
    console.error(`❌ Directory not found: ${dataDir}`);
    process.exit(1);
  }
  
  try {
    console.log(`🚀 Processing data from: ${dataDir}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process countries
    const countries = await fs.promises.readdir(dataDir);
    
    for (const country of countries) {
      const countryPath = path.join(dataDir, country);
      const countryStats = await fs.promises.stat(countryPath);
      
      if (!countryStats.isDirectory()) continue;
      
      console.log(`\n🌍 Processing country: ${country}`);
      
      // Process categories
      const categories = await fs.promises.readdir(countryPath);
      
      for (const category of categories) {
        const categoryPath = path.join(countryPath, category);
        const categoryStats = await fs.promises.stat(categoryPath);
        
        if (!categoryStats.isDirectory()) continue;
        
        console.log(`📂 Processing category: ${category}`);
        
        // Get industry mapping
        const { industry, category: mappedCategory } = INDUSTRY_MAP[category] || {
          industry: 'Business Services',
          category: 'Other'
        };
        
        // Process GPT folder
        const gptPath = path.join(categoryPath, 'GPT');
        if (fs.existsSync(gptPath)) {
          const companies = await fs.promises.readdir(gptPath);
          
          for (const company of companies) {
            const companyPath = path.join(gptPath, company);
            const companyStats = await fs.promises.stat(companyPath);
            
            if (!companyStats.isDirectory()) continue;
            
            try {
              const companyInfo: CompanyInfo = {
                name: company,
                country,
                industry,
                category: mappedCategory,
                rating: 4.0, // Default, can be updated later
                reviewCount: 100, // Default, can be updated later
                summary: `Customer insights analysis for ${company} in the ${industry} industry.`,
                tags: [industry, mappedCategory, country],
                reportType: 'FREE', // Default to free
                logo: INDUSTRY_LOGOS[industry] || '🏢',
              };
              
              await uploadCompanyFromDirectory(companyPath, companyInfo);
              successCount++;
              
            } catch (error) {
              console.error(`❌ Failed to process ${company}:`, error);
              errorCount++;
            }
          }
        }
      }
    }
    
    console.log(`\n🎉 Processing completed!`);
    console.log(`✅ Success: ${successCount} companies`);
    console.log(`❌ Errors: ${errorCount} companies`);
    
  } catch (error) {
    console.error('❌ Processing failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { uploadCompanyFromDirectory };
