import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleCompanies = [
  {
    title: 'Apple Inc Customer Insights Report',
    companyName: 'Apple Inc',
    companySlug: 'apple-inc-us',
    industry: 'Technology',
    country: 'US',
    rating: 4.5,
    reviewCount: 1250,
    summary: 'Apple Inc is a leading technology company known for innovative products and services.',
    tags: ['Technology', 'US'],
    reportType: 'FREE' as const,
    language: 'en',
    isPaid: false,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Tesla Motors Customer Insights Report',
    companyName: 'Tesla Motors',
    companySlug: 'tesla-motors-us',
    industry: 'Vehicles & Transportation',
    country: 'US',
    rating: 4.2,
    reviewCount: 890,
    summary: 'Tesla Motors is revolutionizing the automotive industry with electric vehicles.',
    tags: ['Vehicles & Transportation', 'US'],
    reportType: 'FREE' as const,
    language: 'en',
    isPaid: false,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Shopify Customer Insights Report',
    companyName: 'Shopify',
    companySlug: 'shopify-ca',
    industry: 'E-commerce',
    country: 'CA',
    rating: 4.3,
    reviewCount: 650,
    summary: 'Shopify provides e-commerce solutions for businesses of all sizes.',
    tags: ['E-commerce', 'CA'],
    reportType: 'FREE' as const,
    language: 'en',
    isPaid: false,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Zoom Customer Insights Report',
    companyName: 'Zoom',
    companySlug: 'zoom-us',
    industry: 'Technology',
    country: 'US',
    rating: 4.1,
    reviewCount: 2100,
    summary: 'Zoom provides video conferencing and communication solutions.',
    tags: ['Technology', 'US'],
    reportType: 'FREE' as const,
    language: 'en',
    isPaid: false,
    status: 'PUBLISHED' as const,
  },
  {
    title: 'Spotify Customer Insights Report',
    companyName: 'Spotify',
    companySlug: 'spotify-us',
    industry: 'Entertainment',
    country: 'US',
    rating: 4.4,
    reviewCount: 1800,
    summary: 'Spotify is a leading music streaming platform.',
    tags: ['Entertainment', 'US'],
    reportType: 'FREE' as const,
    language: 'en',
    isPaid: false,
    status: 'PUBLISHED' as const,
  }
];

const addSampleData = async () => {
  console.log('🚀 Adding sample data to local database...\n');
  
  try {
    // Clear existing data
    await prisma.reportDataFile.deleteMany();
    await prisma.report.deleteMany();
    console.log('✅ Cleared existing data');
    
    // Add sample companies
    for (const company of sampleCompanies) {
      const report = await prisma.report.create({
        data: company,
      });
      console.log(`✅ Added: ${company.companyName}`);
    }
    
    console.log(`\n🎉 Successfully added ${sampleCompanies.length} sample companies!`);
    console.log('\n📊 Sample companies:');
    sampleCompanies.forEach(company => {
      console.log(`  - ${company.companyName} (${company.industry}, ${company.country})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

addSampleData();
