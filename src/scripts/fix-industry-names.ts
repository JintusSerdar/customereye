import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const fixIndustryNames = async () => {
  console.log('🔧 Fixing industry names - removing country suffixes...\n');
  
  try {
    // Get all unique industries to see what we're working with
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true }
    });
    
    console.log('📋 Current industries with counts:');
    industries.forEach(industry => {
      console.log(`  "${industry.industry}": ${industry._count.industry} reports`);
    });
    
    console.log('\n🔧 Starting cleanup...\n');
    
    // Define the mapping for industry name cleanup
    const industryMappings = [
      // Remove country suffixes
      { from: / \(US\)$/, to: '' },
      { from: / \(UK\)$/, to: '' },
      { from: / \(CA\)$/, to: '' },
      
      // Standardize specific industry names
      { from: /^Beauty Well-being$/, to: 'Beauty & Wellbeing' },
      { from: /^Beauty Wellbeing$/, to: 'Beauty & Wellbeing' },
      { from: /^Beauty & Wellbeing$/, to: 'Beauty & Wellbeing' },
      
      { from: /^Animals Pets$/, to: 'Animals & Pets' },
      
      { from: /^Construction Manufacturing$/, to: 'Construction' },
      
      // Clean up any remaining inconsistencies
      { from: /\s+$/, to: '' }, // Remove trailing spaces
      { from: /^\s+/, to: '' }, // Remove leading spaces
    ];
    
    let totalUpdated = 0;
    
    for (const industry of industries) {
      let cleanName = industry.industry;
      
      // Apply all mappings
      for (const mapping of industryMappings) {
        cleanName = cleanName.replace(mapping.from, mapping.to);
      }
      
      // Only update if the name actually changed
      if (cleanName !== industry.industry) {
        console.log(`  🔄 "${industry.industry}" → "${cleanName}"`);
        
        await prisma.report.updateMany({
          where: { industry: industry.industry },
          data: { industry: cleanName }
        });
        
        totalUpdated += industry._count.industry;
      }
    }
    
    console.log(`\n✅ Updated ${totalUpdated} reports`);
    
    // Show the cleaned up industries
    console.log('\n📊 Cleaned up industries:');
    const cleanedIndustries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { industry: 'asc' }
    });
    
    cleanedIndustries.forEach(industry => {
      console.log(`  "${industry.industry}": ${industry._count.industry} reports`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing industry names:', error);
  } finally {
    await prisma.$disconnect();
  }
};

fixIndustryNames();
