import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'customereye';

// Test with just 2 companies
const TEST_COMPANIES = [
  {
    name: 'aor',
    country: 'CA',
    industry: 'Beauty & Wellbeing',
    textPath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GPT/aor.ca',
    imagePath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GRAPH/aor.ca'
  }
];

// File renaming logic
const renameFiles = (files: string[]) => {
  const textFiles = files.filter(f => f.endsWith('.txt'));
  const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
  
  // Sort text files by sequence number
  const sortedTextFiles = textFiles.sort((a, b) => {
    const aNum = parseInt(a.match(/^(\d+)_/)?.[1] || '999');
    const bNum = parseInt(b.match(/^(\d+)_/)?.[1] || '999');
    return aNum - bNum;
  });
  
  // Sort image files by sequence number
  const sortedImageFiles = imageFiles.sort((a, b) => {
    const aNum = parseInt(a.match(/^(\d+)_/)?.[1] || '999');
    const bNum = parseInt(b.match(/^(\d+)_/)?.[1] || '999');
    return aNum - bNum;
  });
  
  // Rename text files
  const renamedTextFiles = sortedTextFiles.map((file, index) => {
    if (index === 0) return { original: file, new: '1_rating_distribution.txt' };
    if (index === 1) return { original: file, new: '2_wordcloud.txt' };
    if (index === 2) return { original: file, new: '3_yearly_replies.txt' };
    if (file.toLowerCase().includes('conclusion')) return { original: file, new: 'conclusion.txt' };
    return { original: file, new: `${index + 1}_${file}` };
  });
  
  // Rename image files (only first 3)
  const renamedImageFiles = sortedImageFiles.slice(0, 3).map((file, index) => {
    if (index === 0) return { original: file, new: '1_rating_distribution.png' };
    if (index === 1) return { original: file, new: '2_wordcloud.png' };
    if (index === 2) return { original: file, new: '3_yearly_replies.png' };
    return { original: file, new: `${index + 1}_${file}` };
  });
  
  return { textFiles: renamedTextFiles, imageFiles: renamedImageFiles };
};

// Generate company slug
const generateCompanySlug = (companyName: string, country: string) => {
  return `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${country.toLowerCase()}`;
};

// Generate S3 key
const generateS3Key = (companySlug: string, reportType: string, version: string, fileCategory: string, filename: string) => {
  return `companies/${companySlug}/${reportType.toLowerCase()}/${version}/${fileCategory}/${filename}`;
};

// Upload file to S3
const uploadToS3 = async (s3Key: string, filePath: string, mimeType: string) => {
  try {
    const fileContent = readFileSync(filePath);
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: mimeType,
    });
    
    await s3Client.send(command);
    console.log(`✅ Uploaded: ${s3Key}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to upload ${s3Key}:`, error);
    return false;
  }
};

// Get MIME type
const getMimeType = (filename: string) => {
  if (filename.endsWith('.txt')) return 'text/plain';
  if (filename.endsWith('.png')) return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  if (filename.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
};

// Extract rating from text content
const extractRatingFromContent = (content: string): number | null => {
  // Look for percentage patterns like "92.74%"
  const percentageMatch = content.match(/(\d+\.?\d*)%/);
  if (percentageMatch) {
    const percentage = parseFloat(percentageMatch[1]);
    // Convert percentage to rating (rough estimation)
    if (percentage >= 90) return 4.5;
    if (percentage >= 80) return 4.0;
    if (percentage >= 70) return 3.5;
    if (percentage >= 60) return 3.0;
    return 2.5;
  }
  return null;
};

// Test upload
const testUpload = async () => {
  console.log('🧪 Testing small upload...\n');
  
  for (const company of TEST_COMPANIES) {
    console.log(`\n🏢 Processing: ${company.name} (${company.country})`);
    
    try {
      // Check if company already exists
      const companySlug = generateCompanySlug(company.name, company.country);
      const existingReport = await prisma.report.findFirst({
        where: { companySlug, reportType: 'FREE' }
      });
      
      if (existingReport) {
        console.log(`⏭️ Skipping ${company.name} - already exists`);
        continue;
      }
      
      // Process text files
      const textFiles = readdirSync(company.textPath);
      const { textFiles: renamedTextFiles } = renameFiles(textFiles);
      
      // Process image files
      const imageFiles = readdirSync(company.imagePath);
      const { imageFiles: renamedImageFiles } = renameFiles(imageFiles);
      
      console.log(`📄 Text files: ${renamedTextFiles.length}`);
      console.log(`🖼️ Image files: ${renamedImageFiles.length}`);
      
      // Upload text files to S3 and get content
      const textContent: { [key: string]: string } = {};
      for (const file of renamedTextFiles) {
        const filePath = join(company.textPath, file.original);
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'text', file.new);
        const mimeType = getMimeType(file.original);
        
        // Read content
        const content = readFileSync(filePath, 'utf-8');
        textContent[file.new] = content;
        
        // Upload to S3
        await uploadToS3(s3Key, filePath, mimeType);
      }
      
      // Upload image files to S3
      for (const file of renamedImageFiles) {
        const filePath = join(company.imagePath, file.original);
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'images', file.new);
        const mimeType = getMimeType(file.original);
        
        await uploadToS3(s3Key, filePath, mimeType);
      }
      
      // Extract rating from content
      const rating = extractRatingFromContent(textContent['1_rating_distribution.txt'] || '');
      console.log(`⭐ Extracted rating: ${rating || 'N/A'}`);
      
      // Create report in database
      const report = await prisma.report.create({
        data: {
          title: `${company.name} Customer Insights Report`,
          description: `AI-generated customer insights report for ${company.name}`,
          companyName: company.name,
          companySlug: companySlug,
          industry: company.industry,
          country: company.country,
          rating: rating || 0, // Use 0 if no rating found
          reviewCount: 0, // We don't have this data yet
          summary: textContent['conclusion.txt'] || 'No summary available',
          tags: [company.industry, company.country],
          reportType: 'FREE',
          language: 'en',
          isPaid: false,
          status: 'PUBLISHED',
          version: 'v1',
          s3Prefix: `companies/${companySlug}/free/v1`,
          publishedAt: new Date(),
        }
      });
      
      console.log(`✅ Created report: ${report.id}`);
      
      // Create data files in database
      for (const file of renamedTextFiles) {
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'text', file.new);
        const filePath = join(company.textPath, file.original);
        const stats = statSync(filePath);
        
        let sectionType = 'CUSTOM_ANALYSIS';
        if (file.new === '1_rating_distribution.txt') sectionType = 'RATING_DISTRIBUTION';
        if (file.new === '2_wordcloud.txt') sectionType = 'OVERALL_WORDCLOUD';
        if (file.new === '3_yearly_replies.txt') sectionType = 'YEARLY_REPLIES';
        if (file.new === 'conclusion.txt') sectionType = 'CONCLUSION';
        
        await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: 'TEXT',
            sectionType: sectionType as any,
            sequence: parseInt(file.new.match(/^(\d+)_/)?.[1] || '0'),
            filename: file.new,
            originalName: file.original,
            s3Key: s3Key,
            size: stats.size,
            mimeType: 'text/plain',
            content: textContent[file.new],
            version: 'v1',
            fileCategory: 'text',
          }
        });
      }
      
      for (const file of renamedImageFiles) {
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'images', file.new);
        const filePath = join(company.imagePath, file.original);
        const stats = statSync(filePath);
        
        let sectionType = 'CUSTOM_ANALYSIS';
        if (file.new === '1_rating_distribution.png') sectionType = 'RATING_DISTRIBUTION';
        if (file.new === '2_wordcloud.png') sectionType = 'OVERALL_WORDCLOUD';
        if (file.new === '3_yearly_replies.png') sectionType = 'YEARLY_REPLIES';
        
        await prisma.reportDataFile.create({
          data: {
            reportId: report.id,
            fileType: 'IMAGE',
            sectionType: sectionType as any,
            sequence: parseInt(file.new.match(/^(\d+)_/)?.[1] || '0'),
            filename: file.new,
            originalName: file.original,
            s3Key: s3Key,
            size: stats.size,
            mimeType: getMimeType(file.original),
            version: 'v1',
            fileCategory: 'images',
          }
        });
      }
      
      console.log(`✅ Successfully processed: ${company.name}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${company.name}:`, error);
    }
  }
  
  console.log('\n✅ Test upload completed!');
};

// Run test
testUpload()
  .then(() => {
    console.log('\n🎉 Test upload completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error);
    process.exit(1);
  });
