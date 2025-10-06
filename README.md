# CustomerEye - AI-Powered Customer Insights Platform

A comprehensive platform for generating and managing AI-enhanced customer insight reports across multiple industries and countries.

## 🚀 Features

- **6,078 Companies** with detailed customer insights
- **42,183 Files** stored in AWS S3
- **Multi-Country Support** (US, CA, UK)
- **22 Industry Categories** with clean organization
- **Advanced Filtering** by industry, country, rating, and access level
- **Smart Sorting** (A-Z, Z-A, Most Recent, Most Popular, Highest Rated)
- **PDF Report Generation** with dynamic content
- **Responsive Design** with modern UI/UX

## 📊 Data Overview

- **Total Reports**: 6,078
- **Countries**: US (5,611), CA (451), UK (16)
- **Industries**: 22 categories including Vehicles & Transportation, Beauty & Wellbeing, Business Services, etc.
- **File Types**: Text analysis, images, charts, and visualizations
- **Storage**: AWS S3 with optimized structure

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Storage**: AWS S3
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS S3 bucket
- Environment variables configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd customereye
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
customereye/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   ├── reports/        # Reports pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── ReportPDF.tsx  # PDF generation
│   ├── lib/               # Utility libraries
│   └── scripts/           # Database scripts
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
└── docs/                 # Documentation
```

## 🗄️ Database Schema

The platform uses a comprehensive database schema with:

- **Reports**: Main report entities with metadata
- **ReportDataFiles**: Individual files (text, images, PDFs)
- **ReportSections**: Organized content sections
- **Users**: User management (future feature)

## 🔧 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/customereye"

# AWS S3
AWS_REGION="us-west-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET_NAME="customereye"
NEXT_PUBLIC_AWS_S3_BUCKET_NAME="customereye"

# NextAuth (for future authentication)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 📈 API Endpoints

### Reports API
- `GET /api/reports` - List reports with filtering and pagination
- `GET /api/reports/[id]` - Get individual report details
- `GET /api/files/[...path]` - Serve files from S3

### Query Parameters
- `page`, `limit` - Pagination
- `industry`, `country` - Filtering
- `rating`, `isPaid` - Access filtering
- `sortBy`, `sortOrder` - Sorting
- `search` - Text search

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set environment variables** in Vercel dashboard

3. **Deploy**
   ```bash
   git push origin main
   ```

### Docker (Alternative)

1. **Build the image**
   ```bash
   docker build -t customereye .
   ```

2. **Run with docker-compose**
   ```bash
   docker-compose up -d
   ```

## 📊 Data Management

### Uploading New Data

Use the provided upload script:

```bash
npx ts-node src/scripts/upload-all-data.ts
```

### Database Management

```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --accept-data-loss

# Generate client
npx prisma generate
```

## 🔍 Filtering & Search

### Industry Categories
- Animals & Pets
- Beauty & Wellbeing
- Business Services
- Construction
- Education & Training
- Electronics & Technology
- Events & Entertainment
- Food & Beverages
- Health & Medical
- Hobbies & Crafts
- Home & Garden
- Legal Services
- Media & Publishing
- Money & Insurance
- Other
- Public & Local Services
- Restaurants & Bars
- Shopping & Fashion
- Sports
- Travel & Vacation
- Utilities
- Vehicles & Transportation

### Countries
- United States (US)
- Canada (CA)
- United Kingdom (UK)

## 📱 Features

### Reports List
- Grid/List view toggle
- Advanced filtering sidebar
- Smart pagination (608 pages)
- Real-time search
- Multiple sort options

### Individual Reports
- Dynamic PDF generation
- Image galleries
- Text analysis sections
- Download functionality
- Responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team.

---

**CustomerEye** - Transforming customer insights with AI-powered analysis.
