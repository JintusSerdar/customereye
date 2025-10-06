import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const getIndustries = async () => {
  console.log('🏭 Getting all unique industries...\n');
  
  try {
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: {
        id: true,
      },
      orderBy: {
        industry: 'asc',
      },
    });
    
    console.log('📊 Industries in database:');
    industries.forEach(industry => {
      console.log(`  ${industry.industry}: ${industry._count.id} reports`);
    });
    
    console.log(`\n📈 Total unique industries: ${industries.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

getIndustries();
