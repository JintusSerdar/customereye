import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const fixRatings = async () => {
  console.log('🔧 Fixing ratings in database...\n');
  
  try {
    // Update all reports to have rating = 0
    const result = await prisma.report.updateMany({
      where: {},
      data: {
        rating: 0,
      },
    });
    
    console.log(`✅ Updated ${result.count} reports to have rating = 0`);
    
    // Verify the update
    const sampleReports = await prisma.report.findMany({
      take: 5,
      select: {
        companyName: true,
        rating: true,
      },
    });
    
    console.log('\n📊 Sample reports after update:');
    sampleReports.forEach(report => {
      console.log(`  ${report.companyName}: ${report.rating}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

fixRatings();
