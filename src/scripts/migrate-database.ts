#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateDatabase() {
  console.log('🔄 Starting database migration...');
  
  try {
    // Check if we have existing data
    const existingReports = await prisma.report.findMany();
    console.log(`📊 Found ${existingReports.length} existing reports`);
    
    if (existingReports.length > 0) {
      console.log('⚠️  Existing data found. This migration will:');
      console.log('   - Preserve existing reports');
      console.log('   - Add new fields with default values');
      console.log('   - Create new tables for file management');
      
      // Update existing reports with new fields
      for (const report of existingReports) {
        const companySlug = report.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        
        await prisma.report.update({
          where: { id: report.id },
          data: {
            companySlug,
            category: null,
            country: null,
            tags: report.tags ? JSON.parse(report.tags) : [],
            status: 'PUBLISHED',
            publishedAt: report.createdAt,
          },
        });
        
        console.log(`✅ Updated report: ${report.companyName}`);
      }
    }
    
    console.log('🎉 Database migration completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run: npm run db:generate');
    console.log('2. Run: npm run db:push');
    console.log('3. Test the upload system: npm run upload:fragrance11');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
