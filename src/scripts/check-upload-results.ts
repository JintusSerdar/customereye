import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkUploadResults = async () => {
  console.log('🔍 Checking upload results...\n');
  
  try {
    // Get total reports
    const totalReports = await prisma.report.count();
    console.log(`📊 Total reports in database: ${totalReports}`);
    
    // Get reports by country
    const reportsByCountry = await prisma.report.groupBy({
      by: ['country'],
      _count: { country: true }
    });
    
    console.log('\n🌍 Reports by country:');
    reportsByCountry.forEach(group => {
      console.log(`  ${group.country}: ${group._count.country} reports`);
    });
    
    // Get reports by industry
    const reportsByIndustry = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { _count: { industry: 'desc' } }
    });
    
    console.log('\n🏭 Top 10 industries:');
    reportsByIndustry.slice(0, 10).forEach(group => {
      console.log(`  ${group.industry}: ${group._count.industry} reports`);
    });
    
    // Get reports with rating data
    const reportsWithRating = await prisma.report.count({
      where: { rating: { gt: 0 } }
    });
    
    console.log(`\n⭐ Reports with rating data: ${reportsWithRating}`);
    
    // Get reports with data files
    const reportsWithFiles = await prisma.report.count({
      where: {
        dataFiles: {
          some: {}
        }
      }
    });
    
    console.log(`📁 Reports with data files: ${reportsWithFiles}`);
    
    // Get data files by type
    const filesByType = await prisma.reportDataFile.groupBy({
      by: ['fileType'],
      _count: { fileType: true }
    });
    
    console.log('\n📄 Data files by type:');
    filesByType.forEach(group => {
      console.log(`  ${group.fileType}: ${group._count.fileType} files`);
    });
    
    // Get data files by section type
    const filesBySection = await prisma.reportDataFile.groupBy({
      by: ['sectionType'],
      _count: { sectionType: true }
    });
    
    console.log('\n📋 Data files by section:');
    filesBySection.forEach(group => {
      console.log(`  ${group.sectionType}: ${group._count.sectionType} files`);
    });
    
    // Check for companies with missing data
    const reportsWithoutFiles = await prisma.report.findMany({
      where: {
        dataFiles: {
          none: {}
        }
      },
      select: {
        companyName: true,
        companySlug: true,
        country: true,
        industry: true
      },
      take: 10
    });
    
    if (reportsWithoutFiles.length > 0) {
      console.log('\n❌ Reports without data files (first 10):');
      reportsWithoutFiles.forEach(report => {
        console.log(`  ${report.companyName} (${report.companySlug}) - ${report.country} - ${report.industry}`);
      });
    }
    
    // Check for companies with incomplete data
    const reportsWithIncompleteData = await prisma.report.findMany({
      where: {
        dataFiles: {
          some: {}
        },
        AND: [
          {
            dataFiles: {
              none: {
                sectionType: 'RATING_DISTRIBUTION'
              }
            }
          }
        ]
      },
      select: {
        companyName: true,
        companySlug: true,
        country: true,
        industry: true
      },
      take: 10
    });
    
    if (reportsWithIncompleteData.length > 0) {
      console.log('\n⚠️ Reports with incomplete data (missing rating distribution):');
      reportsWithIncompleteData.forEach(report => {
        console.log(`  ${report.companyName} (${report.companySlug}) - ${report.country} - ${report.industry}`);
      });
    }
    
    // Sample some successful reports
    const sampleReports = await prisma.report.findMany({
      where: {
        dataFiles: {
          some: {}
        }
      },
      include: {
        dataFiles: {
          select: {
            fileType: true,
            sectionType: true,
            filename: true
          }
        }
      },
      take: 3
    });
    
    console.log('\n✅ Sample successful reports:');
    sampleReports.forEach(report => {
      console.log(`\n  🏢 ${report.companyName} (${report.companySlug})`);
      console.log(`     Country: ${report.country}, Industry: ${report.industry}`);
      console.log(`     Rating: ${report.rating}, Files: ${report.dataFiles.length}`);
      report.dataFiles.forEach(file => {
        console.log(`       ${file.fileType} - ${file.sectionType} - ${file.filename}`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Run the check
checkUploadResults()
  .then(() => {
    console.log('\n🎉 Database check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database check failed:', error);
    process.exit(1);
  });
