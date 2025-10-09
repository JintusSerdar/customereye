import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkTags = async () => {
  console.log('🔍 Checking tags field usage...\n');
  
  try {
    // Get sample reports with tags
    const sample = await prisma.report.findMany({ 
      take: 10, 
      select: { 
        companyName: true, 
        industry: true, 
        country: true, 
        tags: true 
      } 
    });
    
    console.log('📋 Sample reports with tags:');
    sample.forEach(report => {
      console.log(`  ${report.companyName}:`);
      console.log(`    industry: "${report.industry}"`);
      console.log(`    country: "${report.country}"`);
      console.log(`    tags: ${JSON.stringify(report.tags)}`);
      console.log('');
    });
    
    // Check if tags are redundant
    const reportsWithTags = await prisma.report.findMany({
      where: {
        tags: {
          not: null
        }
      },
      select: {
        companyName: true,
        industry: true,
        country: true,
        tags: true
      },
      take: 5
    });
    
    console.log('📊 Reports with non-null tags:');
    reportsWithTags.forEach(report => {
      console.log(`  ${report.companyName}: tags=${JSON.stringify(report.tags)}`);
    });
    
    // Count reports with tags vs without
    const withTags = await prisma.report.count({
      where: {
        tags: {
          not: null
        }
      }
    });
    
    const withoutTags = await prisma.report.count({
      where: {
        tags: null
      }
    });
    
    console.log(`\n📈 Tag usage statistics:`);
    console.log(`  Reports with tags: ${withTags}`);
    console.log(`  Reports without tags: ${withoutTags}`);
    console.log(`  Total reports: ${withTags + withoutTags}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkTags();
