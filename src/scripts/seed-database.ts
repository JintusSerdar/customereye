import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleReports = [
  {
    companyName: "Advance America",
    industry: "Money & Insurance",
    rating: 4.8,
    reviewCount: 15420,
    summary: "Advance America excels in customer service with 93.39% 5-star ratings. Customers praise helpful staff, easy processes, and fast service. Key strengths include friendly interactions and consistent reliability. The company shows significant improvement in customer engagement since 2023.",
    tags: ["Payday Loans", "Financial Services", "Customer Service", "Quick Loans", "Reliable"],
    reportType: "Premium",
    language: "English",
    isPaid: true,
    logo: "🏦",
  },
  {
    companyName: "LocalBite Restaurant",
    industry: "Food & Beverages",
    rating: 4.1,
    reviewCount: 287,
    summary: "LocalBite Restaurant delivers quality dining experiences with farm-to-table focus. Customers appreciate fresh ingredients and friendly service, while some note limited menu options.",
    tags: ["Restaurant", "Farm-to-Table", "Local"],
    reportType: "Free",
    language: "English",
    isPaid: false,
    logo: "🍽️",
  },
  {
    companyName: "TechFlow Software",
    industry: "Electronics & Technology",
    rating: 3.9,
    reviewCount: 156,
    summary: "TechFlow Software provides solid business solutions with good customer support. Users value the intuitive interface, though some request more advanced features and faster updates.",
    tags: ["Software", "Business", "SaaS"],
    reportType: "Premium",
    language: "English",
    isPaid: true,
    logo: "💻",
  },
  {
    companyName: "Wellness First Clinic",
    industry: "Health & Medical",
    rating: 4.2,
    reviewCount: 198,
    summary: "Wellness First Clinic offers personalized healthcare with caring staff. Patients appreciate the attention to detail and comprehensive care, though wait times can be lengthy.",
    tags: ["Healthcare", "Wellness", "Clinic"],
    reportType: "Free",
    language: "English",
    isPaid: false,
    logo: "🏥",
  },
  {
    companyName: "CraftWorks Furniture",
    industry: "Shopping & Fashion",
    rating: 4.0,
    reviewCount: 124,
    summary: "CraftWorks Furniture delivers quality handcrafted pieces with excellent craftsmanship. Customers love the unique designs and durability, while some mention longer delivery times.",
    tags: ["Furniture", "Handcrafted", "Retail"],
    reportType: "Premium",
    language: "English",
    isPaid: true,
    logo: "🪑",
  },
  {
    companyName: "BrightStart Education",
    industry: "Education & Training",
    rating: 4.4,
    reviewCount: 89,
    summary: "BrightStart Education provides innovative learning programs with dedicated teachers. Parents appreciate the personalized approach and progress tracking, though class sizes are growing.",
    tags: ["Education", "Learning", "Children"],
    reportType: "Free",
    language: "English",
    isPaid: false,
    logo: "📚",
  },
  {
    companyName: "EcoClean Services",
    industry: "Business Services",
    rating: 3.8,
    reviewCount: 203,
    summary: "EcoClean Services offers reliable cleaning with eco-friendly products. Clients value the thorough work and environmental commitment, though some note occasional scheduling issues.",
    tags: ["Cleaning", "Eco-Friendly", "Services"],
    reportType: "Premium",
    language: "English",
    isPaid: true,
    logo: "🧹",
  },
  {
    companyName: "FitLife Gym",
    industry: "Sports",
    rating: 4.1,
    reviewCount: 167,
    summary: "FitLife Gym provides excellent fitness facilities with knowledgeable trainers. Members appreciate the variety of classes and equipment, while some mention peak hour crowding.",
    tags: ["Fitness", "Gym", "Wellness"],
    reportType: "Free",
    language: "English",
    isPaid: false,
    logo: "💪",
  },
  {
    companyName: "Pawsome Pet Care",
    industry: "Animals & Pets",
    rating: 4.5,
    reviewCount: 134,
    summary: "Pawsome Pet Care provides exceptional pet grooming and boarding services. Pet owners appreciate the gentle care and attention to detail, though some mention booking difficulties during peak seasons.",
    tags: ["Pet Care", "Grooming", "Boarding"],
    reportType: "Premium",
    language: "English",
    isPaid: true,
    logo: "🐾",
  },
  {
    companyName: "Beauty Haven Spa",
    industry: "Beauty & Well-being",
    rating: 4.2,
    reviewCount: 189,
    summary: "Beauty Haven Spa offers luxurious spa treatments and beauty services. Clients love the relaxing atmosphere and skilled therapists, though some note premium pricing for services.",
    tags: ["Spa", "Beauty", "Wellness"],
    reportType: "Free",
    language: "English",
    isPaid: false,
    logo: "💆‍♀️",
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Clear existing data
    await prisma.report.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('🗑️  Cleared existing data');
    
    // Create sample reports
    for (const reportData of sampleReports) {
      // Create report in database
      await prisma.report.create({
        data: {
          title: `${reportData.companyName} Customer Insights Report`,
          description: reportData.summary,
          companyName: reportData.companyName,
          industry: reportData.industry,
          rating: reportData.rating,
          reviewCount: reportData.reviewCount,
          summary: reportData.summary,
          tags: JSON.stringify(reportData.tags),
          reportType: reportData.reportType,
          language: reportData.language,
          isPaid: reportData.isPaid,
          logo: reportData.logo,
          reportData: JSON.stringify({
            company: {
              name: reportData.companyName,
              industry: reportData.industry,
              rating: reportData.rating,
              reviewCount: reportData.reviewCount,
            },
            analysis: {
              sentiment: {
                overall: reportData.rating,
                positive: Math.round((reportData.rating / 5) * 100),
                negative: Math.round(((5 - reportData.rating) / 5) * 100),
                neutral: 0,
                confidence: 0.85,
              },
              topics: reportData.tags.map(tag => ({
                topic: tag,
                frequency: Math.floor(Math.random() * 100) + 1,
                sentiment: reportData.rating,
                keywords: [tag.toLowerCase()],
              })),
            },
            insights: [
              {
                id: '1',
                type: 'positive',
                title: 'Strong Customer Satisfaction',
                description: `Customers rate ${reportData.companyName} highly with a ${reportData.rating}/5 rating.`,
                impact: 'high',
                confidence: 0.9,
                evidence: [`${reportData.reviewCount} reviews analyzed`],
              },
            ],
            recommendations: [
              {
                id: '1',
                category: 'customer-service',
                title: 'Maintain Service Quality',
                description: 'Continue providing excellent customer service as reflected in reviews.',
                priority: 'high',
                effort: 'low',
                expectedImpact: 'Maintain current high ratings',
                implementation: ['Regular staff training', 'Customer feedback monitoring'],
              },
            ],
            metadata: {
              generatedAt: new Date(),
              dataSource: 'Trustpilot',
              language: reportData.language,
              totalReviews: reportData.reviewCount,
              reviewPeriod: {
                start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
                end: new Date(),
              },
              aiModel: 'BERT + GPT-4',
              version: '1.0.0',
            },
          }),
        },
      });
      
      console.log(`✅ Created report for ${reportData.companyName}`);
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${sampleReports.length} sample reports`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export { main as seedDatabase };
