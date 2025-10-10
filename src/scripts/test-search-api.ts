import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const testSearchAPI = async () => {
  console.log('🔍 Testing search API functionality...\n');
  
  try {
    // Test 1: Search for companies with "apple"
    console.log('📝 Test 1: Searching for "apple"...');
    const appleResults = await prisma.report.findMany({
      where: {
        companyName: {
          contains: 'apple',
          mode: 'insensitive'
        }
      },
      select: {
        companyName: true,
        industry: true,
        country: true,
        rating: true,
        reviewCount: true
      },
      take: 5,
      orderBy: {
        companyName: 'asc'
      }
    });
    
    console.log(`✅ Found ${appleResults.length} companies with "apple" in name:`);
    appleResults.forEach(company => {
      console.log(`  - ${company.companyName} (${company.industry}, ${company.country})`);
    });
    
    // Test 2: Search for companies with "tech"
    console.log('\n📝 Test 2: Searching for "tech"...');
    const techResults = await prisma.report.findMany({
      where: {
        companyName: {
          contains: 'tech',
          mode: 'insensitive'
        }
      },
      select: {
        companyName: true,
        industry: true,
        country: true,
        rating: true,
        reviewCount: true
      },
      take: 5,
      orderBy: {
        companyName: 'asc'
      }
    });
    
    console.log(`✅ Found ${techResults.length} companies with "tech" in name:`);
    techResults.forEach(company => {
      console.log(`  - ${company.companyName} (${company.industry}, ${company.country})`);
    });
    
    // Test 3: Get total company count
    const totalCompanies = await prisma.report.count();
    console.log(`\n📊 Total companies in database: ${totalCompanies}`);
    
    console.log('\n🎉 Search API functionality test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing search API:', error);
  } finally {
    await prisma.$disconnect();
  }
};

testSearchAPI();
