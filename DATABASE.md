# 📊 CustomerEye Database System

This document explains the database structure and data upload system for CustomerEye.

## 🏗️ Database Schema

### Core Models

#### `Report`
Main report entity containing company information and metadata.

```typescript
{
  id: string
  title: string
  companyName: string
  companySlug: string (unique, URL-friendly)
  industry: string
  category?: string
  country?: string
  rating: number
  reviewCount: number
  summary: string
  tags: string[]
  reportType: 'FREE' | 'PREMIUM'
  language: string
  isPaid: boolean
  logo?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdAt: DateTime
  updatedAt: DateTime
  publishedAt?: DateTime
}
```

#### `ReportDataFile`
Individual files associated with reports (text, images, PDFs).

```typescript
{
  id: string
  reportId: string
  fileType: 'TEXT' | 'IMAGE' | 'PDF' | 'JSON'
  sectionType: SectionType
  sequence?: number
  filename: string
  originalName: string
  path: string
  size: number
  mimeType: string
  content?: string (for text files)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### `ReportSection`
Organized sections of report data for better structure.

```typescript
{
  id: string
  reportId: string
  sectionType: SectionType
  title: string
  content?: string
  order: number
  metadata?: Json
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Section Types

The system supports various analysis sections:

- `RATING_DISTRIBUTION` - Rating breakdown analysis
- `SENTIMENT_DISTRIBUTION` - Sentiment analysis
- `RATING_VS_SENTIMENT` - Correlation analysis
- `YEARLY_ANALYSIS` - Year-over-year trends
- `MONTHLY_ANALYSIS` - Monthly patterns
- `OVERALL_WORDCLOUD` - General word frequency
- `POSITIVE_WORDCLOUD` - Positive sentiment words
- `NEGATIVE_WORDCLOUD` - Negative sentiment words
- `OVERALL_COMMON_WORDS` - Most frequent words
- `POSITIVE_COMMON_WORDS` - Positive common words
- `NEGATIVE_COMMON_WORDS` - Negative common words
- `OVERALL_TEXT_COUNTS` - Text analysis metrics
- `POSITIVE_TEXT_COUNTS` - Positive text metrics
- `NEGATIVE_TEXT_COUNTS` - Negative text metrics
- `YEARLY_REPLIES` - Customer engagement analysis
- `CONCLUSION` - Summary and recommendations
- `CUSTOM_ANALYSIS` - Custom analysis sections

## 📁 File Structure

### Free Reports (Basic)
```
fragrance11/
├── 1_given_rating_distributions_fragrance11.txt
├── 1_given_rating_distributions_fragrance11.png
├── 6_overall_reviews_wordcloud_fragrance11.txt
├── 6_overall_reviews_wordcloud_fragrance11.png
├── 15_overall_yearly_replies_fragrance11.txt
├── 15_overall_yearly_replies_fragrance11.png
└── Conclusion.txt
```

### Premium Reports (Comprehensive)
```
remitly/
├── 1_clrat1_given_ratings_distribution_remitly.txt
├── 1_clrat1_given_ratings_distribution_remitly.png
├── 2_c1rat2_sentiments_distribution_remitly.txt
├── 2_c1rat2_sentiments_distribution_remitly.png
├── 3_c1rat3_given_ratings_vs_sentiments_remitly.txt
├── 3_c1rat3_given_ratings_vs_sentiments_remitly.png
├── 4_c1rat4_average_ratings_and_sentiments_over_years_remitly.txt
├── 4_c1rat4_average_ratings_and_sentiments_over_years_remitly.png
├── 5_c1rats_average_ratings_and_sentiments_over_months_remitly.txt
├── 5_c1rats_average_ratings_and_sentiments_over_months_remitly.png
├── 6_c1rev1_overall_wordcloud_remitly.txt
├── 6_c1rev1_overall_wordcloud_remitly.png
├── 7_c1rev2_positive_wordcloud_remitly.txt
├── 7_c1rev2_positive_wordcloud_remitly.png
├── 8_c1rev3_negative_wordcloud_remitly.txt
├── 8_c1rev3_negative_wordcloud_remitly.png
├── 9_c1rev4_overall_most_common_words_remitly.txt
├── 9_c1rev4_overall_most_common_words_remitly.png
├── 10_c1rev5_positive_most_common_words_remitly.txt
├── 10_c1rev5_positive_most_common_words_remitly.png
├── 11_c1rev6_negative_most_common_words_remitly.txt
├── 11_c1rev6_negative_most_common_words_remitly.png
├── 12_c1rev7_overall_text_item_counts_remitly.txt
├── 12_c1rev7_overall_text_item_counts_remitly.png
├── 13_c1rev8_positive_text_item_counts_remitly.txt
├── 13_c1rev8_positive_text_item_counts_remitly.png
├── 14_c1rev9_negative_text_item_counts_remitly.txt
├── 14_c1rev9_negative_text_item_counts_remitly.png
├── 15_overall_yearly_replies_remitly.txt
├── 15_overall_yearly_replies_remitly.png
└── Conclusion.txt
```

## 🚀 Upload Methods

### 1. CLI Upload (Recommended for bulk data)

```bash
# Upload Fragrance11 data (Free report)
npm run upload:fragrance11

# Upload Remitly data (Premium report)
npm run upload:remitly

# Custom upload
npm run upload:custom
```

### 2. Web Interface

Visit `/admin/upload` for a user-friendly upload interface.

### 3. API Upload

```typescript
const formData = new FormData();
formData.append('companyName', 'Fragrance11');
formData.append('industry', 'Beauty & Well-being');
// ... other fields
formData.append('files[0]', file1);
formData.append('files[1]', file2);

const response = await fetch('/api/reports/upload', {
  method: 'POST',
  body: formData,
});
```

## 🔧 Setup Instructions

### 1. Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Run migration script
npx ts-node src/scripts/migrate-database.ts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/customereye"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📊 Data Upload Process

### Automatic File Classification

The system automatically categorizes files based on naming patterns:

- `*rating_distribution*` → `RATING_DISTRIBUTION`
- `*sentiment_distribution*` → `SENTIMENT_DISTRIBUTION`
- `*wordcloud*` → `OVERALL_WORDCLOUD`
- `*positive_wordcloud*` → `POSITIVE_WORDCLOUD`
- `*negative_wordcloud*` → `NEGATIVE_WORDCLOUD`
- `*yearly_replies*` → `YEARLY_REPLIES`
- `*conclusion*` → `CONCLUSION`

### File Type Detection

- `.txt` → `TEXT`
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg` → `IMAGE`
- `.pdf` → `PDF`
- `.json` → `JSON`

### Sequence Extraction

Files with numbered prefixes (e.g., `1_`, `2_`, `15_`) automatically get sequence numbers for proper ordering.

## 🎯 Usage Examples

### Upload Free Report

```typescript
import { uploadReportData } from '@/lib/report-upload';

const reportData = {
  companyName: 'Fragrance11',
  industry: 'Beauty & Well-being',
  category: 'Fragrance & Cosmetics',
  country: 'US',
  rating: 4.2,
  reviewCount: 1250,
  summary: 'Fragrance11 delivers quality beauty products...',
  tags: ['Fragrance', 'Beauty', 'Cosmetics'],
  reportType: 'FREE',
  language: 'en',
  logo: '🌸',
};

const files = [
  {
    filename: '1_given_rating_distributions_fragrance11.txt',
    originalName: '1_given_rating_distributions_fragrance11.txt',
    fileType: 'TEXT',
    sectionType: '1_given_rating_distributions_fragrance11.txt',
    content: 'Rating distribution data...',
    path: '/path/to/file.txt',
    size: 1024,
    mimeType: 'text/plain',
  },
  // ... more files
];

const reportId = await uploadReportData(reportData, files);
```

### Query Reports

```typescript
// Get all reports
const reports = await prisma.report.findMany({
  include: {
    dataFiles: true,
    sections: true,
  },
});

// Get specific report with files
const report = await prisma.report.findUnique({
  where: { companySlug: 'fragrance11' },
  include: {
    dataFiles: {
      orderBy: { sequence: 'asc' },
    },
    sections: {
      orderBy: { order: 'asc' },
    },
  },
});
```

## 🔍 File Management

### Storage Structure

```
uploads/
└── reports/
    ├── fragrance11/
    │   ├── 1_given_rating_distributions_fragrance11.txt
    │   ├── 1_given_rating_distributions_fragrance11.png
    │   └── ...
    └── remitly/
        ├── 1_clrat1_given_ratings_distribution_remitly.txt
        ├── 1_clrat1_given_ratings_distribution_remitly.png
        └── ...
```

### File Access

Files are stored with their original names and can be accessed via the `path` field in `ReportDataFile`. Text content is also stored in the `content` field for quick access.

## 🚨 Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file permissions
   - Ensure upload directory exists
   - Verify file size limits

2. **Database Connection**
   - Check `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Run `npm run db:push` to sync schema

3. **File Classification Issues**
   - Check filename patterns
   - Verify file extensions
   - Review section type mapping

### Debug Commands

```bash
# Check database connection
npm run db:studio

# View logs
npm run dev

# Test upload
npm run upload:fragrance11
```

## 📈 Performance Considerations

- **Indexing**: Key fields are indexed for fast queries
- **File Storage**: Consider using cloud storage for production
- **Content Storage**: Text content is stored in database for quick access
- **Image Optimization**: Images should be optimized before upload

## 🔒 Security Notes

- File uploads are validated by type and size
- Database queries use parameterized statements
- File paths are sanitized to prevent directory traversal
- Access controls should be implemented for admin functions
