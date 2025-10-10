# 🎯 CustomerEye - Customer Insights Platform

> **A comprehensive platform for analyzing customer feedback, ratings, and sentiment across companies and industries.**

## 🚀 Live Demo

- **Production**: https://demo.customereye.ai (main branch)
- **Development**: https://customereye-git-development-jintusserdars-projects.vercel.app (development branch)
- **Staging**: https://customereye-git-develop-jintusserdars-projects.vercel.app

## 📊 Current Status

- **Total Companies**: 6,078 companies analyzed
- **Industries**: 15+ industries covered
- **Countries**: US, CA, UK
- **Data Sources**: Customer reviews, ratings, sentiment analysis
- **Report Types**: FREE reports with comprehensive insights

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Storage**: AWS S3
- **Deployment**: Vercel
- **UI Components**: Radix UI, shadcn/ui

## 📁 Project Structure

```
customereye/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── files/         # S3 file proxy
│   │   │   └── reports/       # Reports API
│   │   ├── reports/           # Reports pages
│   │   └── pdf-report/        # PDF report viewer
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── Navbar.tsx        # Navigation
│   │   ├── ReportCard.tsx    # Report display
│   │   ├── ReportFilters.tsx # Filtering system
│   │   └── ReportPDF.tsx     # PDF-like report view
│   ├── lib/                  # Utilities
│   │   ├── prisma.ts        # Database client
│   │   ├── utils.ts         # Helper functions
│   │   └── config.ts        # Configuration
│   ├── scripts/             # Database scripts
│   │   ├── upload-all-data.ts    # Main data upload
│   │   ├── seed-database.ts      # Database seeding
│   │   └── migrate-database.ts   # Schema migrations
│   └── types/               # TypeScript definitions
├── prisma/
│   └── schema.prisma        # Database schema
└── public/                 # Static assets
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- AWS S3 bucket
- Vercel account (for deployment)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/customereye.git
cd customereye
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/customereye"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Next.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database (optional)
npx ts-node src/scripts/seed-database.ts
```

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## 📊 Data Management

### Upload New Data

```bash
# Upload all data to S3 and database
npx ts-node src/scripts/upload-all-data.ts
```

### Database Operations

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Clear S3 bucket
npx ts-node src/scripts/clear-s3-bucket.ts
```

## 🎨 Features

### 📈 Reports Dashboard
- **Company Search**: Find companies by name
- **Industry Filtering**: Filter by 15+ industries
- **Country Filtering**: US, CA, UK markets
- **Rating Filtering**: Filter by rating ranges
- **Sorting**: A-Z, Z-A, Most Recent, Popular, Highest Rated
- **Pagination**: Efficient server-side pagination

### 📋 Individual Reports
- **Company Overview**: Company details and metrics
- **Rating Distribution**: Visual rating breakdown
- **Word Cloud Analysis**: Key themes and sentiment
- **Yearly Trends**: Reply patterns over time
- **Conclusion**: AI-generated insights and recommendations

### 🔍 Advanced Features
- **Real-time Search**: Instant company search
- **Responsive Design**: Mobile and desktop optimized
- **PDF Export**: Download reports as PDF
- **S3 Integration**: Secure file storage and retrieval
- **Cache Optimization**: Fast loading and performance

## 🛠️ API Endpoints

### Reports API

```typescript
GET /api/reports
// Query parameters:
// - page: number (pagination)
// - limit: number (results per page)
// - search: string (company search)
// - industry: string (filter by industry)
// - country: string (filter by country)
// - rating: string (filter by rating: "3+", "4+", "all")
// - sortBy: string (sort field)
// - sortOrder: "asc" | "desc"

GET /api/reports/[id]
// Get individual report by ID or company slug
```

### Files API

```typescript
GET /api/files/[...path]
// Proxy for S3 files with proper headers
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

```bash
# Deploy to Vercel
vercel --prod

# Or use Git integration
git push origin main
```

## 📊 Database Schema

### Core Models

- **Report**: Company reports with metadata
- **ReportDataFile**: Individual files (text/images)
- **ReportSection**: Report sections and content

### Key Fields

```typescript
Report {
  id: string
  companyName: string
  companySlug: string
  industry: string
  country: string
  rating: number
  reviewCount: number
  summary: string
  tags: string[]
  reportType: "FREE" | "PREMIUM"
  status: "DRAFT" | "PUBLISHED"
}
```

## 🔧 Development

### Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
npm run type-check   # TypeScript checking
```

### Database Scripts

```bash
# Upload data
npx ts-node src/scripts/upload-all-data.ts

# Seed database
npx ts-node src/scripts/seed-database.ts

# Clear S3
npx ts-node src/scripts/clear-s3-bucket.ts
```

## 🎯 Performance

- **Server-side Pagination**: Efficient data loading
- **S3 Proxy**: Optimized file serving
- **Database Indexing**: Fast queries
- **Cache Headers**: Browser caching
- **Image Optimization**: Next.js image optimization

## 🔒 Security

- **Environment Variables**: Secure configuration
- **S3 Permissions**: Controlled file access
- **API Rate Limiting**: Request throttling
- **Input Validation**: Sanitized inputs
- **HTTPS Only**: Secure connections

## 📈 Analytics

- **Company Metrics**: Rating distributions, review counts
- **Industry Insights**: Cross-industry comparisons
- **Trend Analysis**: Yearly patterns and changes
- **Sentiment Analysis**: Customer satisfaction trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For support and questions:
- **Email**: support@customereye.ai
- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues

---

**CustomerEye** - Transforming customer insights into business intelligence 🚀
