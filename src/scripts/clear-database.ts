import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const clearDatabase = async () => {
  console.log('🗑️  Clearing current database data...\n');
  
  try {
    // Delete all data in the correct order (respecting foreign key constraints)
    console.log('Deleting ReportDataFile records...');
    await prisma.reportDataFile.deleteMany();
    
    console.log('Deleting Report records...');
    await prisma.report.deleteMany();
    
    console.log('✅ Database cleared successfully!');
    
    // Verify it's empty
    const count = await prisma.report.count();
    console.log(`📊 Total reports remaining: ${count}`);
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

clearDatabase();
