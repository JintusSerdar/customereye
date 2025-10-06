#!/usr/bin/env ts-node

import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
// Inline functions to avoid import issues
const INDUSTRY_MAPPING = {
  'CA': {
    'Money Insurance (CA)': 'Money & Insurance',
    'Beauty Wellbeing (CA)': 'Beauty & Wellbeing',
    'Business Services (CA)': 'Business Services',
    'Electronics Technology (CA)': 'Electronics & Technology',
    'Events Entertainment (CA)': 'Events & Entertainment',
    'Food Beverages (CA)': 'Food & Beverages',
    'Health Medical (CA)': 'Health & Medical',
    'Home Garden (CA)': 'Home & Garden',
    'Shopping Fashion (CA)': 'Shopping & Fashion',
    'Travel Vacation (CA)': 'Travel & Vacation',
    'Others (CA)': 'Other'
  },
  'UK': {
    'Money Insurance (UK)': 'Money & Insurance',
    'Beauty Wellbeing (UK)': 'Beauty & Wellbeing',
    'Business Services (UK)': 'Business Services',
    'Electronics Technology (UK)': 'Electronics & Technology',
    'Events Entertainment (UK)': 'Events & Entertainment',
    'Food Beverages (UK)': 'Food & Beverages',
    'Health Medical (UK)': 'Health & Medical',
    'Home Garden (UK)': 'Home & Garden',
    'Shopping Fashion (UK)': 'Shopping & Fashion',
    'Travel Vacation (UK)': 'Travel & Vacation',
    'Others (UK)': 'Other'
  },
  'US': {
    'Money Insurance (US)': 'Money & Insurance',
    'Beauty Wellbeing (US)': 'Beauty & Wellbeing',
    'Business Services (US)': 'Business Services',
    'Electronics Technology (US)': 'Electronics & Technology',
    'Events Entertainment (US)': 'Events & Entertainment',
    'Food Beverages (US)': 'Food & Beverages',
    'Health Medical (US)': 'Health & Medical',
    'Home Garden (US)': 'Home & Garden',
    'Shopping Fashion (US)': 'Shopping & Fashion',
    'Travel Vacation (US)': 'Travel & Vacation',
    'Others (US)': 'Other'
  }
};

function getIndustry(country: string, folderName: string): string {
  const countryMapping = INDUSTRY_MAPPING[country as keyof typeof INDUSTRY_MAPPING];
  if (!countryMapping) {
    return 'Other';
  }
  return countryMapping[folderName as keyof typeof countryMapping] || 'Other';
}

function parseFileName(filename: string): {
  sequence: number;
  sectionType: string;
  fileType: 'TEXT' | 'IMAGE' | 'JSON' | 'CSV' | 'EXCEL' | 'PDF';
  simplifiedName: string;
  fileCategory: string;
} {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  let fileType: 'TEXT' | 'IMAGE' | 'JSON' | 'CSV' | 'EXCEL' | 'PDF' = 'TEXT';
  let fileCategory = 'text';
  
  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
    fileType = 'IMAGE';
    fileCategory = 'images';
  } else if (extension === 'json') {
    fileType = 'JSON';
    fileCategory = 'json';
  } else if (extension === 'csv') {
    fileType = 'CSV';
    fileCategory = 'data';
  } else if (['xlsx', 'xls'].includes(extension || '')) {
    fileType = 'EXCEL';
    fileCategory = 'data';
  } else if (extension === 'pdf') {
    fileType = 'PDF';
    fileCategory = 'documents';
  }
  
  // Extract the first number from filename
  const numberMatch = filename.match(/^(\d+)/);
  const sequence = numberMatch ? parseInt(numberMatch[1]) : 999;
  
  let sectionType = 'CUSTOM_ANALYSIS';
  let simplifiedName = filename;
  
  // More sophisticated pattern matching
  const lowerFilename = filename.toLowerCase();
  
  // Check for rating distribution patterns
  if (lowerFilename.includes('rating') && lowerFilename.includes('distribution')) {
    sectionType = 'RATING_DISTRIBUTION';
    simplifiedName = `1_rating_distribution.${extension}`;
  }
  // Check for wordcloud patterns
  else if (lowerFilename.includes('wordcloud') || lowerFilename.includes('word_cloud')) {
    sectionType = 'OVERALL_WORDCLOUD';
    simplifiedName = `2_wordcloud.${extension}`;
  }
  // Check for yearly replies patterns
  else if (lowerFilename.includes('yearly') || lowerFilename.includes('replies') || lowerFilename.includes('years')) {
    sectionType = 'YEARLY_REPLIES';
    simplifiedName = `3_yearly_replies.${extension}`;
  }
  // Check for conclusion
  else if (lowerFilename.includes('conclusion')) {
    sectionType = 'CONCLUSION';
    simplifiedName = `4_conclusion.${extension}`;
  }
  // Fallback to sequence-based detection
  else {
    if (sequence === 1) {
      sectionType = 'RATING_DISTRIBUTION';
      simplifiedName = `1_rating_distribution.${extension}`;
    } else if (sequence === 2) {
      sectionType = 'OVERALL_WORDCLOUD';
      simplifiedName = `2_wordcloud.${extension}`;
    } else if (sequence === 3) {
      sectionType = 'YEARLY_REPLIES';
      simplifiedName = `3_yearly_replies.${extension}`;
    } else if (sequence === 4) {
      sectionType = 'CONCLUSION';
      simplifiedName = `4_conclusion.${extension}`;
    }
  }
  
  return {
    sequence,
    sectionType,
    fileType,
    simplifiedName,
    fileCategory
  };
}

function generateS3Key(
  companySlug: string,
  country: string,
  reportType: string,
  version: string,
  fileCategory: string,
  simplifiedName: string
): string {
  return `companies/${companySlug}-${country.toLowerCase()}/reports/${reportType.toLowerCase()}/${version}/data/${fileCategory}/${simplifiedName}`;
}

function generateCompanySlug(companyName: string, country: string): string {
  let cleanName = companyName;
  if (cleanName.endsWith(`.${country.toLowerCase()}`)) {
    cleanName = cleanName.replace(`.${country.toLowerCase()}`, '');
  }
  
  return cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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
const prisma = new PrismaClient();

// Progress tracking
let totalFiles = 0;
let processedFiles = 0;
let uploadedFiles = 0;
let errors = 0;

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

async function scanDataDirectory() {
  console.log('🔍 Scanning data directory...');
  
  const dataPath = './public/customereye data';
  const countries = ['CA', 'UK', 'US'];
  const allCompanies: Array<{
    country: string;
    industry: string;
    companyName: string;
    companySlug: string;
    textFiles: string[];
    imageFiles: string[];
  }> = [];

  for (const country of countries) {
    const countryPath = path.join(dataPath, country);
    if (!fs.existsSync(countryPath)) {
      console.log(`⚠️ Country directory not found: ${country}`);
      continue;
    }

    console.log(`📁 Processing ${country}...`);
    
    // Get all industry folders
    const industryFolders = fs.readdirSync(countryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const industryFolder of industryFolders) {
      const industryPath = path.join(countryPath, industryFolder);
      const industry = getIndustry(country, industryFolder);
      
      console.log(`  📂 ${industryFolder} -> ${industry}`);
      
      // Check for GPT and GRAPH folders
      const gptPath = path.join(industryPath, 'GPT');
      const graphPath = path.join(industryPath, 'GRAPH');
      
      if (fs.existsSync(gptPath)) {
        // Get all company folders in GPT
        const companyFolders = fs.readdirSync(gptPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        for (const companyFolder of companyFolders) {
          const companyName = companyFolder;
          const companySlug = generateCompanySlug(companyName, country);
          
          // Get text files
          const textFiles: string[] = [];
          const textPath = path.join(gptPath, companyFolder);
          if (fs.existsSync(textPath)) {
            const files = fs.readdirSync(textPath)
              .filter(file => file.endsWith('.txt'));
            textFiles.push(...files.map(file => path.join(textPath, file)));
          }
          
          // Get image files
          const imageFiles: string[] = [];
          const imagePath = path.join(graphPath, companyFolder);
          if (fs.existsSync(imagePath)) {
            const files = fs.readdirSync(imagePath)
              .filter(file => ['png', 'jpg', 'jpeg', 'webp'].includes(file.split('.').pop()?.toLowerCase() || ''));
            imageFiles.push(...files.map(file => path.join(imagePath, file)));
          }
          
          if (textFiles.length > 0 || imageFiles.length > 0) {
            allCompanies.push({
              country,
              industry,
              companyName,
              companySlug,
              textFiles,
              imageFiles
            });
            
            totalFiles += textFiles.length + imageFiles.length;
          }
        }
      }
    }
  }

  console.log(`📊 Found ${allCompanies.length} companies with ${totalFiles} files`);
  return allCompanies;
}

async function uploadCompanyData(company: any) {
  const { country, industry, companyName, companySlug, textFiles, imageFiles } = company;
  
  try {
    // Create report
    const report = await prisma.report.create({
      data: {
        title: `${companyName} Customer Analysis Report`,
        description: `Comprehensive analysis of ${companyName} customer reviews and satisfaction metrics in ${country}`,
        companyName,
        companySlug,
        industry,
        country,
        rating: 4.0, // Default rating, can be updated later
        reviewCount: 1000, // Default count, can be updated later
        summary: `Analysis of ${companyName} customer feedback and satisfaction metrics.`,
        tags: [industry, country],
        reportType: 'FREE',
        language: 'en',
        isPaid: false,
        logo: '🏢',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        version: 'v1',
        s3Prefix: `companies/${companySlug}/reports/free/v1`,
        metadata: {
          totalFiles: textFiles.length + imageFiles.length,
          textFiles: textFiles.length,
          imageFiles: imageFiles.length,
          reportStructure: 'free',
          dataSource: 'customer-reviews',
          analysisDate: new Date().toISOString(),
        },
      },
    });

    console.log(`✅ Created report: ${companyName} (${companySlug})`);

    // Process text files
    for (const filePath of textFiles) {
      try {
        const filename = path.basename(filePath);
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const stats = await fs.promises.stat(filePath);
        
        const parsed = parseFileName(filename);
        const s3Key = generateS3Key(companySlug, country, 'free', 'v1', parsed.fileCategory, parsed.simplifiedName);
        
        // Upload to S3
        await uploadToS3(s3Key, content, 'text/plain');
        
        // Create database entry
        await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: parsed.fileType,
            sectionType: parsed.sectionType,
            sequence: parsed.sequence,
            filename: parsed.simplifiedName,
            originalName: filename,
            s3Key,
            size: stats.size,
            mimeType: 'text/plain',
            content,
            version: 'v1',
            fileCategory: parsed.fileCategory,
          },
        });
        
        uploadedFiles++;
        console.log(`  📄 Text: ${parsed.simplifiedName} -> ${parsed.sectionType}`);
      } catch (error) {
        console.error(`  ❌ Error processing text file ${filePath}:`, error);
        errors++;
      }
    }

    // Process image files
    for (const filePath of imageFiles) {
      try {
        const filename = path.basename(filePath);
        const imageBuffer = await fs.promises.readFile(filePath);
        const stats = await fs.promises.stat(filePath);
        
        const parsed = parseFileName(filename);
        const s3Key = generateS3Key(companySlug, country, 'free', 'v1', parsed.fileCategory, parsed.simplifiedName);
        
        // Upload to S3
        await uploadToS3(s3Key, imageBuffer, 'image/png');
        
        // Create database entry
        await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: parsed.fileType,
            sectionType: parsed.sectionType,
            sequence: parsed.sequence,
            filename: parsed.simplifiedName,
            originalName: filename,
            s3Key,
            size: stats.size,
            mimeType: 'image/png',
            version: 'v1',
            fileCategory: parsed.fileCategory,
          },
        });
        
        uploadedFiles++;
        console.log(`  🖼️ Image: ${parsed.simplifiedName} -> ${parsed.sectionType}`);
      } catch (error) {
        console.error(`  ❌ Error processing image file ${filePath}:`, error);
        errors++;
      }
    }

    // Create report sections
    const sections = [
      {
        sectionType: 'RATING_DISTRIBUTION',
        title: 'Rating Distribution Analysis',
        content: `Analysis of ${companyName}'s customer rating distribution patterns.`,
        order: 1,
      },
      {
        sectionType: 'OVERALL_WORDCLOUD',
        title: 'Word Cloud Analysis',
        content: `Key themes and frequently mentioned words in ${companyName} customer reviews.`,
        order: 2,
      },
      {
        sectionType: 'YEARLY_REPLIES',
        title: 'Customer Engagement Analysis',
        content: `Analysis of ${companyName}'s customer engagement and response patterns over time.`,
        order: 3,
      },
      {
        sectionType: 'CONCLUSION',
        title: 'Conclusion & Recommendations',
        content: `Summary and recommendations for ${companyName} based on customer feedback analysis.`,
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

    processedFiles += textFiles.length + imageFiles.length;
    console.log(`✅ Completed: ${companyName} (${processedFiles}/${totalFiles} files)`);
    
  } catch (error) {
    console.error(`❌ Error processing company ${companyName}:`, error);
    errors++;
  }
}

async function bulkUploadAllData() {
  console.log('🚀 Starting bulk upload of all CustomerEye data...');
  
  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await prisma.reportDataFile.deleteMany({});
    await prisma.reportSection.deleteMany({});
    await prisma.report.deleteMany({});
    
    // Scan all data
    const companies = await scanDataDirectory();
    
    if (companies.length === 0) {
      console.log('❌ No companies found to upload');
      return;
    }
    
    console.log(`\n📊 Processing ${companies.length} companies...`);
    
    // Process companies in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < companies.length; i += batchSize) {
      const batch = companies.slice(i, i + batchSize);
      
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(companies.length / batchSize)}`);
      
      await Promise.all(batch.map(company => uploadCompanyData(company)));
      
      // Progress update
      const progress = Math.round((processedFiles / totalFiles) * 100);
      console.log(`\n📈 Progress: ${progress}% (${processedFiles}/${totalFiles} files, ${uploadedFiles} uploaded, ${errors} errors)`);
    }
    
    console.log('\n🎉 Bulk upload completed!');
    console.log(`📊 Summary:`);
    console.log(`  - Companies processed: ${companies.length}`);
    console.log(`  - Files processed: ${processedFiles}`);
    console.log(`  - Files uploaded: ${uploadedFiles}`);
    console.log(`  - Errors: ${errors}`);
    console.log(`\n🔗 View reports at: http://localhost:3001/reports`);
    
  } catch (error) {
    console.error('❌ Bulk upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the bulk upload
bulkUploadAllData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
