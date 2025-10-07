import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkDataDistribution = async () => {
  console.log('📊 Checking data distribution...\n');
  
  try {
    const total = await prisma.report.count();
    console.log(`📈 Total reports: ${total}`);
    
    // Check countries
    const countries = await prisma.report.groupBy({
      by: ['country'],
      _count: { country: true }
    });
    
    console.log('\n🌍 Countries:');
    countries.forEach(country => {
      console.log(`  ${country.country}: ${country._count.country} reports`);
    });
    
    // Check industries
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true }
    });
    
    console.log('\n🏭 Industries (first 10):');
    industries.slice(0, 10).forEach(industry => {
      console.log(`  ${industry.industry}: ${industry._count.industry} reports`);
    });
    
    // Check ratings
    const ratingStats = await prisma.report.aggregate({
      _avg: { rating: true },
      _min: { rating: true },
      _max: { rating: true }
    });
    
    console.log('\n⭐ Rating stats:');
    console.log(`  Average: ${ratingStats._avg.rating}`);
    console.log(`  Min: ${ratingStats._min.rating}`);
    console.log(`  Max: ${ratingStats._max.rating}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkDataDistribution();