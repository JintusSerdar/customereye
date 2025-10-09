import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const removeRedundantTags = async () => {
  console.log('🧹 Removing redundant tags field...\n');
  
  try {
    // Get total count
    const totalReports = await prisma.report.count();
    console.log(`📊 Total reports: ${totalReports}`);
    
    // Clear all tags since they're redundant
    console.log('🗑️  Clearing all tags (they are redundant with industry + country fields)...');
    
    const result = await prisma.report.updateMany({
      data: {
        tags: []
      }
    });
    
    console.log(`✅ Updated ${result.count} reports`);
    
    // Verify the cleanup
    const sample = await prisma.report.findMany({ 
      take: 5, 
      select: { 
        companyName: true, 
        industry: true, 
        country: true, 
        tags: true 
      } 
    });
    
    console.log('\n📋 Sample after cleanup:');
    sample.forEach(report => {
      console.log(`  ${report.companyName}:`);
      console.log(`    industry: "${report.industry}"`);
      console.log(`    country: "${report.country}"`);
      console.log(`    tags: ${JSON.stringify(report.tags)}`);
      console.log('');
    });
    
    console.log('🎉 Tags field cleaned up! Industry and country fields are sufficient.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

removeRedundantTags();
