import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const checkImageFiles = async () => {
  console.log('🔍 Checking image files in database...\n');
  
  try {
    // Check zoomaround-us files
    const files = await prisma.reportDataFile.findMany({
      where: { 
        report: { companySlug: 'zoomaround-us' }
      },
      select: { 
        fileType: true, 
        sectionType: true, 
        filename: true, 
        s3Key: true,
        mimeType: true
      }
    });
    
    console.log('📁 All files for zoomaround-us:');
    files.forEach(file => {
      console.log(`  ${file.fileType} - ${file.sectionType} - ${file.filename} - ${file.mimeType}`);
      console.log(`    S3: ${file.s3Key}`);
    });
    
    // Check if there are any IMAGE files
    const imageFiles = files.filter(f => f.fileType === 'IMAGE');
    console.log(`\n🖼️ IMAGE files: ${imageFiles.length}`);
    
    // Check if there are any TEXT files with image extensions
    const textFilesWithImages = files.filter(f => 
      f.fileType === 'TEXT' && 
      (f.filename.endsWith('.png') || f.filename.endsWith('.jpg'))
    );
    console.log(`📄 TEXT files with image extensions: ${textFilesWithImages.length}`);
    
    if (textFilesWithImages.length > 0) {
      console.log('\n❌ Found TEXT files that should be IMAGE files:');
      textFilesWithImages.forEach(file => {
        console.log(`  ${file.filename} - ${file.sectionType}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

checkImageFiles();
