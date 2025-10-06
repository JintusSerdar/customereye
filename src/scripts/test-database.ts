#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🧪 Testing database connection...');
  
  try {
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test creating a sample report
    const testReport = await prisma.report.create({
      data: {
        title: 'Test Report',
        companyName: 'Test Company',
        companySlug: 'test-company',
        industry: 'Technology',
        rating: 4.5,
        reviewCount: 100,
        summary: 'This is a test report',
        tags: ['test', 'sample'],
        reportType: 'FREE',
        language: 'en',
        isPaid: false,
        status: 'DRAFT',
      },
    });
    
    console.log('✅ Test report created:', testReport.id);
    
    // Test creating a data file
    const testFile = await prisma.reportDataFile.create({
      data: {
        reportId: testReport.id,
        fileType: 'TEXT',
        sectionType: 'RATING_DISTRIBUTION',
        sequence: 1,
        filename: 'test.txt',
        originalName: 'test.txt',
        path: '/tmp/test.txt',
        size: 100,
        mimeType: 'text/plain',
        content: 'Test content',
      },
    });
    
    console.log('✅ Test file created:', testFile.id);
    
    // Test creating a section
    const testSection = await prisma.reportSection.create({
      data: {
        reportId: testReport.id,
        sectionType: 'RATING_DISTRIBUTION',
        title: 'Rating Distribution Analysis',
        content: 'Test section content',
        order: 1,
      },
    });
    
    console.log('✅ Test section created:', testSection.id);
    
    // Clean up test data
    await prisma.reportSection.deleteMany({ where: { reportId: testReport.id } });
    await prisma.reportDataFile.deleteMany({ where: { reportId: testReport.id } });
    await prisma.report.delete({ where: { id: testReport.id } });
    
    console.log('✅ Test data cleaned up');
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run test
testDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
