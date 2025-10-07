import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkDatabase = async () => {
  console.log('🔍 Checking current database status...\n');
  
  try {
    const count = await prisma.report.count();
    console.log(`📊 Total reports in database: ${count}`);
    
    if (count > 0) {
      const sample = await prisma.report.findMany({ 
        take: 5, 
        select: { 
          companyName: true, 
          industry: true, 
          country: true,
          rating: true
        } 
      });
      
      console.log('\n📋 Sample reports:');
      sample.forEach((report, index) => {
        console.log(`  ${index + 1}. ${report.companyName} (${report.country}) - ${report.industry} - Rating: ${report.rating}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkDatabase();
