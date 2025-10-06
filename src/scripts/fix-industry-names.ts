import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

const fixIndustryNames = async () => {
  console.log('🔧 Fixing industry names in database...\n');
  
  try {
    // Get all unique industry names
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: {
        id: true,
      },
    });
    
    console.log('📊 Current industries:');
    industries.forEach(industry => {
      console.log(`  ${industry.industry}: ${industry._count.id} reports`);
    });
    
    // Define the mapping from old names to new clean names
    const industryMapping: { [key: string]: string } = {
      'Animals Pets (US)': 'Animals & Pets',
      'Animals Pets (UK)': 'Animals & Pets',
      'Beauty & Wellbeing': 'Beauty & Wellbeing',
      'Beauty Well-being (US)': 'Beauty & Wellbeing',
      'Beauty Wellbeing (UK)': 'Beauty & Wellbeing',
      'Business Services': 'Business Services',
      'Business Services (US)': 'Business Services',
      'Business Services (UK)': 'Business Services',
      'Construction (US)': 'Construction',
      'Construction Manufacturing (UK)': 'Construction',
      'Education Training (US)': 'Education & Training',
      'Education Training (UK)': 'Education & Training',
      'Electronics & Technology': 'Electronics & Technology',
      'Electronics Technology (US)': 'Electronics & Technology',
      'Events & Entertainment': 'Events & Entertainment',
      'Events Entertainment (US)': 'Events & Entertainment',
      'Events Entertainment (UK)': 'Events & Entertainment',
      'Food & Beverages': 'Food & Beverages',
      'Food Beverages Tobacco (US)': 'Food & Beverages',
      'Food beverages (UK)': 'Food & Beverages',
      'Health & Medical': 'Health & Medical',
      'Health Medical (US)': 'Health & Medical',
      'Health Medical (UK)': 'Health & Medical',
      'Hobbies Crafts (US)': 'Hobbies & Crafts',
      'Home & Garden': 'Home & Garden',
      'Home Garden (US)': 'Home & Garden',
      'Legal Services Government (US)': 'Legal Services',
      'Media Publishing (US)': 'Media & Publishing',
      'Money & Insurance': 'Money & Insurance',
      'Money Insurance (US)': 'Money & Insurance',
      'Others': 'Other',
      'Public Local Services (US)': 'Public & Local Services',
      'Restaurants Bars (US)': 'Restaurants & Bars',
      'Shopping & Fashion': 'Shopping & Fashion',
      'Shopping Fashion (US)': 'Shopping & Fashion',
      'Sports (US)': 'Sports',
      'Travel & Vacation': 'Travel & Vacation',
      'Travel Vacation (US)': 'Travel & Vacation',
      'Utilities (US)': 'Utilities',
      'Vehicles Transportation (US)': 'Vehicles & Transportation',
    };
    
    console.log('\n🔄 Updating industry names...');
    
    let updatedCount = 0;
    for (const [oldName, newName] of Object.entries(industryMapping)) {
      if (oldName !== newName) {
        const result = await prisma.report.updateMany({
          where: { industry: oldName },
          data: { industry: newName },
        });
        
        if (result.count > 0) {
          console.log(`  ✅ ${oldName} → ${newName} (${result.count} reports)`);
          updatedCount += result.count;
        }
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} reports with clean industry names!`);
    
    // Show the new industry distribution
    const newIndustries = await prisma.report.groupBy({
      by: ['industry'],
      _count: {
        id: true,
      },
      orderBy: {
        industry: 'asc',
      },
    });
    
    console.log('\n📊 New industry distribution:');
    newIndustries.forEach(industry => {
      console.log(`  ${industry.industry}: ${industry._count.id} reports`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
};

fixIndustryNames();
