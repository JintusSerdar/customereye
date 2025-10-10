import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const getPopularSearches = async () => {
  console.log('🔍 Getting popular searches from database...\n');
  
  try {
    // Get most common industries
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { _count: { industry: 'desc' } },
      take: 5
    });
    
    console.log('📊 Top 5 industries by report count:');
    industries.forEach((industry, index) => {
      console.log(`  ${index + 1}. ${industry.industry}: ${industry._count.industry} reports`);
    });
    
    // Get some popular company names
    const popularCompanies = await prisma.report.findMany({
      select: {
        companyName: true,
        industry: true,
        reviewCount: true
      },
      orderBy: {
        reviewCount: 'desc'
      },
      take: 5
    });
    
    console.log('\n🏢 Top 5 companies by review count:');
    popularCompanies.forEach((company, index) => {
      console.log(`  ${index + 1}. ${company.companyName} (${company.industry}): ${company.reviewCount} reviews`);
    });
    
    console.log('\n🎯 Suggested popular searches:');
    console.log('Industries:', industries.map(i => i.industry));
    console.log('Companies:', popularCompanies.map(c => c.companyName));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

getPopularSearches();
