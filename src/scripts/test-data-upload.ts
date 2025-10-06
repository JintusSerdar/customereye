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

// Test data structure
const TEST_COMPANIES = [
  {
    name: 'aor',
    country: 'CA',
    industry: 'Beauty & Wellbeing',
    textPath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GPT/aor.ca',
    imagePath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GRAPH/aor.ca'
  },
  {
    name: 'beautyritual',
    country: 'CA', 
    industry: 'Beauty & Wellbeing',
    textPath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GPT/beautyritual.ca',
    imagePath: 'public/customereye data/CA/Beauty Wellbeing (CA)/GRAPH/beautyritual.ca'
  }
];

// File renaming logic
const renameFiles = (files: string[]) => {
  const textFiles = files.filter(f => f.endsWith('.txt'));
  const imageFiles = files.filter(f => f.endsWith('.png'));
  
  // Sort text files by sequence number (extract number from filename)
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
  
  // Rename image files
  const renamedImageFiles = sortedImageFiles.map((file, index) => {
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

// Test upload for one company
const testUpload = async () => {
  console.log('🧪 Testing data upload...\n');
  
  for (const company of TEST_COMPANIES) {
    console.log(`\n📁 Processing: ${company.name} (${company.country})`);
    
    try {
      // Check text files
      const textFiles = readdirSync(company.textPath);
      console.log(`📄 Found ${textFiles.length} text files:`, textFiles);
      
      // Check image files
      const imageFiles = readdirSync(company.imagePath);
      console.log(`🖼️ Found ${imageFiles.length} image files:`, imageFiles);
      
      // Rename text files
      const { textFiles: renamedTextFiles } = renameFiles(textFiles);
      console.log('\n📝 Text files:');
      renamedTextFiles.forEach(f => console.log(`  ${f.original} → ${f.new}`));
      
      // Rename image files
      const { imageFiles: renamedImageFiles } = renameFiles(imageFiles);
      console.log('\n🖼️ Image files:');
      renamedImageFiles.forEach(f => console.log(`  ${f.original} → ${f.new}`));
      
      // Generate company slug
      const companySlug = generateCompanySlug(company.name, company.country);
      console.log(`\n🏷️ Company slug: ${companySlug}`);
      
      // Test S3 key generation
      const s3Prefix = `companies/${companySlug}/free/v1`;
      console.log(`📦 S3 prefix: ${s3Prefix}`);
      
      // Test file paths
      renamedTextFiles.forEach(f => {
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'text', f.new);
        console.log(`  📄 ${f.new} → ${s3Key}`);
      });
      
      renamedImageFiles.forEach(f => {
        const s3Key = generateS3Key(companySlug, 'free', 'v1', 'images', f.new);
        console.log(`  🖼️ ${f.new} → ${s3Key}`);
      });
      
    } catch (error) {
      console.error(`❌ Error processing ${company.name}:`, error);
    }
  }
  
  console.log('\n✅ Test completed!');
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
