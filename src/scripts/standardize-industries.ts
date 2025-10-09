import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const standardizeIndustries = async () => {
  console.log('🔧 Standardizing industry names...\n');
  
  try {
    // Define the complete mapping for industry standardization
    const industryMappings = [
      // Standardize naming conventions
      { from: 'Animals & Pets', to: 'Animals & Pets' },
      { from: 'Beauty & Wellbeing', to: 'Beauty & Wellbeing' },
      { from: 'Business Services', to: 'Business Services' },
      { from: 'Construction', to: 'Construction' },
      { from: 'Education Training', to: 'Education & Training' },
      { from: 'Electronics & Technology', to: 'Electronics & Technology' },
      { from: 'Electronics Technology', to: 'Electronics & Technology' },
      { from: 'Events & Entertainment', to: 'Events & Entertainment' },
      { from: 'Events Entertainment', to: 'Events & Entertainment' },
      { from: 'Food & Beverages', to: 'Food & Beverages' },
      { from: 'Food Beverages Tobacco', to: 'Food & Beverages' },
      { from: 'Food beverages', to: 'Food & Beverages' },
      { from: 'Health & Medical', to: 'Health & Medical' },
      { from: 'Health Medical', to: 'Health & Medical' },
      { from: 'Hobbies Crafts', to: 'Hobbies & Crafts' },
      { from: 'Home & Garden', to: 'Home & Garden' },
      { from: 'Home Garden', to: 'Home & Garden' },
      { from: 'Legal Services Government', to: 'Legal & Government' },
      { from: 'Media Publishing', to: 'Media & Publishing' },
      { from: 'Money & Insurance', to: 'Money & Insurance' },
      { from: 'Money Insurance', to: 'Money & Insurance' },
      { from: 'Public Local Services', to: 'Public Services' },
      { from: 'Restaurants Bars', to: 'Restaurants & Bars' },
      { from: 'Shopping & Fashion', to: 'Shopping & Fashion' },
      { from: 'Shopping Fashion', to: 'Shopping & Fashion' },
      { from: 'Sports', to: 'Sports' },
      { from: 'Travel & Vacation', to: 'Travel & Vacation' },
      { from: 'Travel Vacation', to: 'Travel & Vacation' },
      { from: 'Utilities', to: 'Utilities' },
      { from: 'Vehicles Transportation', to: 'Vehicles & Transportation' },
      { from: 'Others', to: 'Other' },
    ];
    
    let totalUpdated = 0;
    
    console.log('🔄 Applying industry standardizations...\n');
    
    for (const mapping of industryMappings) {
      if (mapping.from !== mapping.to) {
        const count = await prisma.report.count({
          where: { industry: mapping.from }
        });
        
        if (count > 0) {
          console.log(`  🔄 "${mapping.from}" → "${mapping.to}" (${count} reports)`);
          
          await prisma.report.updateMany({
            where: { industry: mapping.from },
            data: { industry: mapping.to }
          });
          
          totalUpdated += count;
        }
      }
    }
    
    console.log(`\n✅ Updated ${totalUpdated} reports`);
    
    // Show the final standardized industries
    console.log('\n📊 Final standardized industries:');
    const finalIndustries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { industry: 'asc' }
    });
    
    finalIndustries.forEach(industry => {
      console.log(`  "${industry.industry}": ${industry._count.industry} reports`);
    });
    
    console.log(`\n🎯 Total unique industries: ${finalIndustries.length}`);
    
  } catch (error) {
    console.error('❌ Error standardizing industries:', error);
  } finally {
    await prisma.$disconnect();
  }
};

standardizeIndustries();
