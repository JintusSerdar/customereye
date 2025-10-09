import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkCurrentIndustries = async () => {
  console.log('🔍 Checking current industries in database...\n');
  
  try {
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { industry: 'asc' }
    });
    
    console.log('📊 Current industries in database:');
    industries.forEach(industry => {
      console.log(`  "${industry.industry}": ${industry._count.industry} reports`);
    });
    
    console.log(`\n🎯 Total unique industries: ${industries.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkCurrentIndustries();
