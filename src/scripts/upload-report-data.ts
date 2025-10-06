#!/usr/bin/env ts-node

import { uploadReportData, readFileContent, getFileStats, FileUploadData } from '../lib/report-upload';
import { ReportUploadData } from '../lib/report-upload';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

// CLI interface
interface UploadOptions {
  dataDir: string;
  companyName: string;
  industry: string;
  category?: string;
  country?: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: 'FREE' | 'PREMIUM';
  language?: string;
  logo?: string;
}

async function uploadFromDirectory(options: UploadOptions) {
  const { dataDir, ...reportData } = options;
  
  console.log(`📁 Scanning directory: ${dataDir}`);
  
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Directory not found: ${dataDir}`);
  }

  const files = await fs.promises.readdir(dataDir);
  const uploadFiles: FileUploadData[] = [];

  for (const filename of files) {
    const filePath = path.join(dataDir, filename);
    const stats = await getFileStats(filePath);
    
    if (!stats) continue;

    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    const fileType = getFileTypeFromExtension(path.extname(filename));
    
    let content: string | undefined;
    if (fileType === 'TEXT' && filename.endsWith('.txt')) {
      content = await readFileContent(filePath);
    }

    uploadFiles.push({
      filename: path.basename(filePath),
      originalName: filename,
      fileType,
      sectionType: filename, // Will be parsed in uploadReportData
      content,
      path: filePath,
      size: stats.size,
      mimeType,
    });
  }

  console.log(`📊 Found ${uploadFiles.length} files to upload`);
  
  // Upload the report
  const reportId = await uploadReportData(reportData, uploadFiles);
  console.log(`✅ Report uploaded successfully: ${reportId}`);
  
  return reportId;
}

function getFileTypeFromExtension(ext: string): 'TEXT' | 'IMAGE' | 'PDF' | 'JSON' {
  switch (ext.toLowerCase()) {
    case '.txt':
      return 'TEXT';
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return 'IMAGE';
    case '.pdf':
      return 'PDF';
    case '.json':
      return 'JSON';
    default:
      return 'TEXT';
  }
}

// Example usage functions
export async function uploadFragrance11Data() {
  const dataDir = './data/fragrance11';
  
  const reportData: ReportUploadData = {
    companyName: 'Fragrance11',
    industry: 'Beauty & Well-being',
    category: 'Fragrance & Cosmetics',
    country: 'US',
    rating: 4.2,
    reviewCount: 1250,
    summary: 'Fragrance11 delivers quality beauty products with excellent customer service. Customers appreciate the variety and quality of fragrances, though some mention shipping delays.',
    tags: ['Fragrance', 'Beauty', 'Cosmetics', 'Online Retail'],
    reportType: 'FREE',
    language: 'en',
    logo: '🌸',
  };

  return await uploadFromDirectory({ dataDir, ...reportData });
}

export async function uploadRemitlyData() {
  const dataDir = './data/remitly';
  
  const reportData: ReportUploadData = {
    companyName: 'Remitly',
    industry: 'Money & Insurance',
    category: 'Financial Services',
    country: 'US',
    rating: 4.5,
    reviewCount: 8500,
    summary: 'Remitly provides reliable money transfer services with competitive rates. Customers value the ease of use and fast transfers, though some mention occasional delays.',
    tags: ['Money Transfer', 'Financial Services', 'International', 'Fintech'],
    reportType: 'PREMIUM',
    language: 'en',
    logo: '💸',
  };

  return await uploadFromDirectory({ dataDir, ...reportData });
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📊 CustomerEye Data Upload Tool

Usage:
  npm run upload:fragrance11    # Upload Fragrance11 data
  npm run upload:remitly        # Upload Remitly data
  npm run upload:custom         # Upload custom data (see script for details)

Examples:
  # Upload Fragrance11 (Free report)
  npm run upload:fragrance11

  # Upload Remitly (Premium report)  
  npm run upload:remitly
    `);
    return;
  }

  try {
    switch (args[0]) {
      case 'fragrance11':
        console.log('🌸 Uploading Fragrance11 data...');
        await uploadFragrance11Data();
        break;
        
      case 'remitly':
        console.log('💸 Uploading Remitly data...');
        await uploadRemitlyData();
        break;
        
      default:
        console.log(`❌ Unknown command: ${args[0]}`);
        console.log('Available commands: fragrance11, remitly');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { uploadFromDirectory };
