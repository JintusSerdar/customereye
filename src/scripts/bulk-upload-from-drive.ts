#!/usr/bin/env ts-node

import { GoogleDriveDownloader, parseCategoryName, generateSlug } from '../lib/google-drive';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface BulkUploadOptions {
  rootFolderId: string;
  outputDir: string;
  credentialsPath: string;
  tokenPath?: string;
  maxCompanies?: number; // Limit for testing
}

async function bulkUploadFromDrive(options: BulkUploadOptions) {
  console.log('🚀 Starting bulk upload from Google Drive...');
  
  try {
    // Initialize Google Drive downloader
    const downloader = new GoogleDriveDownloader({
      credentialsPath: options.credentialsPath,
      tokenPath: options.tokenPath,
    });
    
    await downloader.initialize();
    
    // Get all company data
    console.log('📊 Fetching company data from Google Drive...');
    const companies = await downloader.getCompanyData(options.rootFolderId);
    
    console.log(`📈 Found ${companies.length} companies`);
    
    if (options.maxCompanies) {
      console.log(`🔢 Limiting to first ${options.maxCompanies} companies for testing`);
    }
    
    const companiesToProcess = options.maxCompanies 
      ? companies.slice(0, options.maxCompanies)
      : companies;
    
    // Create output directory
    await fs.promises.mkdir(options.outputDir, { recursive: true });
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const company of companiesToProcess) {
      try {
        console.log(`\n🏢 Processing: ${company.name}`);
        console.log(`   Country: ${company.country}`);
        console.log(`   Category: ${company.category}`);
        console.log(`   GPT Files: ${company.gptFiles.length}`);
        console.log(`   Graph Files: ${company.graphFiles.length}`);
        
        // Download company data
        const companyDir = await downloader.downloadCompanyData(company, options.outputDir);
        
        // Parse category
        const { industry, category } = parseCategoryName(company.category);
        
        // Create report in database
        const report = await prisma.report.create({
          data: {
            title: `${company.name} Customer Insights Report`,
            description: `Comprehensive analysis of ${company.name} customer reviews and satisfaction metrics`,
            companyName: company.name,
            companySlug: generateSlug(company.name),
            industry,
            category,
            country: company.country,
            rating: 4.0, // Default rating, can be updated later
            reviewCount: 100, // Default count, can be updated later
            summary: `Customer insights analysis for ${company.name} in the ${industry} industry.`,
            tags: [industry, category, company.country],
            reportType: 'FREE', // Default to free, can be updated
            language: 'en',
            isPaid: false,
            logo: '🏢', // Default logo
            status: 'PUBLISHED',
            publishedAt: new Date(),
          },
        });
        
        console.log(`✅ Report created: ${report.id}`);
        
        // Process and upload files
        const files = await fs.promises.readdir(companyDir);
        let fileCount = 0;
        
        for (const filename of files) {
          const filePath = path.join(companyDir, filename);
          const stats = await fs.promises.stat(filePath);
          
          // Determine file type and section
          let fileType = 'TEXT';
          let sectionType = 'CUSTOM_ANALYSIS';
          let sequence: number | null = null;
          
          if (filename.endsWith('.txt')) {
            fileType = 'TEXT';
            const content = await fs.promises.readFile(filePath, 'utf-8');
            
            // Determine section type based on filename
            if (filename.includes('rating') || filename.includes('distribution')) {
              sectionType = 'RATING_DISTRIBUTION';
            } else if (filename.includes('wordcloud') || filename.includes('word')) {
              sectionType = 'OVERALL_WORDCLOUD';
            } else if (filename.includes('yearly') || filename.includes('replies')) {
              sectionType = 'YEARLY_REPLIES';
            } else if (filename.includes('conclusion')) {
              sectionType = 'CONCLUSION';
            }
            
            // Extract sequence number
            const sequenceMatch = filename.match(/^(\d+)[_\-]/);
            sequence = sequenceMatch ? parseInt(sequenceMatch[1]) : null;
            
            // Create data file
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
                mimeType: 'text/plain',
                content,
              },
            });
            
            fileCount++;
          } else if (filename.match(/\.(png|jpg|jpeg|gif|svg)$/i)) {
            fileType = 'IMAGE';
            
            // Determine section type for images
            if (filename.includes('rating') || filename.includes('distribution')) {
              sectionType = 'RATING_DISTRIBUTION';
            } else if (filename.includes('wordcloud') || filename.includes('word')) {
              sectionType = 'OVERALL_WORDCLOUD';
            } else if (filename.includes('yearly') || filename.includes('replies')) {
              sectionType = 'YEARLY_REPLIES';
            }
            
            // Extract sequence number
            const sequenceMatch = filename.match(/^(\d+)[_\-]/);
            sequence = sequenceMatch ? parseInt(sequenceMatch[1]) : null;
            
            // Create data file
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
                mimeType: 'image/png', // Default, could be more specific
              },
            });
            
            fileCount++;
          }
        }
        
        // Create report sections
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
        
        console.log(`📁 Uploaded ${fileCount} files for ${company.name}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Failed to process ${company.name}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Bulk upload completed!`);
    console.log(`✅ Success: ${successCount} companies`);
    console.log(`❌ Errors: ${errorCount} companies`);
    console.log(`📁 Files saved to: ${options.outputDir}`);
    
  } catch (error) {
    console.error('❌ Bulk upload failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
🚀 Google Drive Bulk Upload Tool

Usage:
  npm run bulk-upload <root-folder-id> <credentials-path> [options]

Arguments:
  root-folder-id    Google Drive folder ID containing your data
  credentials-path  Path to Google API credentials JSON file

Options:
  --token-path      Path to store OAuth token (optional)
  --output-dir      Local directory to save files (default: ./downloads)
  --max-companies   Limit number of companies for testing (optional)

Example:
  npm run bulk-upload 1ABC123DEF456GHI789 ./credentials.json --max-companies 5

Setup:
1. Go to Google Cloud Console
2. Enable Google Drive API
3. Create credentials (OAuth 2.0)
4. Download credentials.json
5. Run the command above
    `);
    return;
  }
  
  const rootFolderId = args[0];
  const credentialsPath = args[1];
  const outputDir = args.find(arg => arg.startsWith('--output-dir='))?.split('=')[1] || './downloads';
  const maxCompanies = args.find(arg => arg.startsWith('--max-companies='))?.split('=')[1];
  const tokenPath = args.find(arg => arg.startsWith('--token-path='))?.split('=')[1];
  
  try {
    await bulkUploadFromDrive({
      rootFolderId,
      outputDir,
      credentialsPath,
      tokenPath,
      maxCompanies: maxCompanies ? parseInt(maxCompanies) : undefined,
    });
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { bulkUploadFromDrive };
