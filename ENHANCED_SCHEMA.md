# 🗄️ Enhanced Database Schema

## **Main Report Table**
```sql
CREATE TABLE Report (
  -- Primary identification
  id          VARCHAR PRIMARY KEY,
  companyName VARCHAR NOT NULL,
  companySlug VARCHAR NOT NULL,
  
  -- Categorization
  industry    VARCHAR NOT NULL,         -- "Beauty & Wellbeing"
  country     VARCHAR NOT NULL,         -- "CA", "UK", "US"
  reportType  VARCHAR NOT NULL,         -- "FREE", "PREMIUM"
  
  -- Extracted metrics
  rating      DECIMAL(3,2) NOT NULL,     -- 4.85, 3.50, etc.
  reviewCount INTEGER NOT NULL,         -- 1,250, 5,000, etc.
  
  -- Content
  title       VARCHAR NOT NULL,
  summary     TEXT,
  tags        VARCHAR[],
  
  -- Metadata
  language    VARCHAR DEFAULT 'en',
  isPaid      BOOLEAN DEFAULT false,
  status      VARCHAR DEFAULT 'PUBLISHED',
  version     VARCHAR DEFAULT 'v1',
  
  -- Timestamps
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW(),
  publishedAt TIMESTAMP,
  
  -- S3 organization
  s3Prefix    VARCHAR,                  -- "data/CA/Beauty & Wellbeing/aor.ca/free/v1"
  metadata    JSON,                      -- Additional structured data
  
  -- Constraints
  UNIQUE(companySlug, reportType, country, version)
);

-- Performance indexes
CREATE INDEX idx_report_country_industry ON Report(country, industry);
CREATE INDEX idx_report_rating ON Report(rating);
CREATE INDEX idx_report_review_count ON Report(reviewCount);
CREATE INDEX idx_report_created_at ON Report(createdAt);
CREATE INDEX idx_report_company_slug ON Report(companySlug);
```

## **Data Files Table**
```sql
CREATE TABLE ReportDataFile (
  -- Primary identification
  id          VARCHAR PRIMARY KEY,
  reportId    VARCHAR REFERENCES Report(id) ON DELETE CASCADE,
  
  -- File classification
  fileType    VARCHAR NOT NULL,         -- "TEXT", "IMAGE", "PDF", "JSON"
  sectionType VARCHAR NOT NULL,         -- "RATING_DISTRIBUTION", "WORDCLOUD", "YEARLY_REPLIES", "CONCLUSION"
  sequence    INTEGER,                  -- Order within section (1, 2, 3, etc.)
  
  -- File details
  filename    VARCHAR NOT NULL,
  originalName VARCHAR,
  s3Key       VARCHAR NOT NULL,         -- Full S3 path
  size        INTEGER,                  -- File size in bytes
  mimeType    VARCHAR,                  -- "image/png", "text/plain", "application/pdf"
  
  -- Content (for text files)
  content     TEXT,                     -- Full text content for fast access
  
  -- Organization
  version     VARCHAR DEFAULT 'v1',
  fileCategory VARCHAR DEFAULT 'text',  -- "text", "images", "json", "pdf"
  
  -- Timestamps
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_report_section ON ReportDataFile(reportId, sectionType),
  INDEX idx_file_type ON ReportDataFile(fileType),
  INDEX idx_s3_key ON ReportDataFile(s3Key)
);
```

## **Report Sections Table**
```sql
CREATE TABLE ReportSection (
  id          VARCHAR PRIMARY KEY,
  reportId    VARCHAR REFERENCES Report(id) ON DELETE CASCADE,
  
  -- Section identification
  sectionType VARCHAR NOT NULL,         -- "RATING_DISTRIBUTION", "WORDCLOUD", etc.
  title       VARCHAR NOT NULL,
  order       INTEGER NOT NULL,
  
  -- Content
  content     TEXT,                   -- Processed/analyzed content
  summary     TEXT,                    -- Section summary
  
  -- Metadata
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_report_section ON ReportSection(reportId, sectionType),
  INDEX idx_section_order ON ReportSection(reportId, "order")
);
```

## **Storage Strategy**

### **Text Files (Small - Store in Database)**
```typescript
// Store directly in database for fast access
{
  fileType: "TEXT",
  content: "The distribution of ratings for customer reviews...",
  size: 2048, // 2KB
  mimeType: "text/plain",
  s3Key: "data/CA/Beauty & Wellbeing/aor.ca/free/v1/text/1_given_rating_distributions_aor.ca.txt"
}
```

### **Images (Large - Store in S3)**
```typescript
// Store in S3, reference in database
{
  fileType: "IMAGE",
  content: null, // Not stored in database
  size: 256000, // 256KB
  mimeType: "image/png",
  s3Key: "data/CA/Beauty & Wellbeing/aor.ca/free/v1/images/1_given_rating_distributions_aor.ca.png"
}
```

### **PDFs (Very Large - Store in S3)**
```typescript
// Store in S3, reference in database
{
  fileType: "PDF",
  content: null, // Not stored in database
  size: 2048000, // 2MB
  mimeType: "application/pdf",
  s3Key: "data/CA/Beauty & Wellbeing/aor.ca/free/v1/pdf/complete_report.pdf"
}
```

## **Data Extraction Examples**

### **Rating Extraction**
```typescript
// From: "92.74% of the reviews receiving this rating"
const extractRating = (content: string) => {
  const rating5 = extractPercentage(content, "5.0", "92.74%"); // 92.74%
  const rating4 = extractPercentage(content, "4.0", "4.09%");  // 4.09%
  const rating3 = extractPercentage(content, "3.0", "0.92%"); // 0.92%
  const rating2 = extractPercentage(content, "2.0", "0.26%"); // 0.26%
  const rating1 = extractPercentage(content, "1.0", "1.98%"); // 1.98%
  
  // Calculate weighted average
  const averageRating = (5*0.9274 + 4*0.0409 + 3*0.0092 + 2*0.0026 + 1*0.0198);
  // Result: 4.85
  
  return {
    averageRating: 4.85,
    distribution: { "5": 92.74, "4": 4.09, "3": 0.92, "2": 0.26, "1": 1.98 }
  };
};
```

### **Review Count Extraction**
```typescript
// From file analysis or content
const extractReviewCount = (filename: string, content: string) => {
  // Method 1: From filename patterns
  const filenameMatch = filename.match(/(\d+)_reviews/);
  if (filenameMatch) return parseInt(filenameMatch[1]);
  
  // Method 2: From content analysis
  const reviewCountMatch = content.match(/(\d+)\s+reviews?/i);
  if (reviewCountMatch) return parseInt(reviewCountMatch[1]);
  
  // Method 3: Estimate from percentages
  const totalReviews = estimateFromDistribution(content);
  return totalReviews;
};
```

## **Query Performance**

### **Fast Country Filtering**
```sql
-- Get all CA companies
SELECT * FROM Report WHERE country = 'CA';
-- Index: idx_report_country_industry

-- Get CA Beauty companies
SELECT * FROM Report WHERE country = 'CA' AND industry = 'Beauty & Wellbeing';
-- Index: idx_report_country_industry
```

### **Fast Rating Filtering**
```sql
-- Get companies with 4.0+ rating
SELECT * FROM Report WHERE rating >= 4.0;
-- Index: idx_report_rating

-- Get companies with 3.0-4.0 rating
SELECT * FROM Report WHERE rating >= 3.0 AND rating <= 4.0;
-- Index: idx_report_rating
```

### **Fast Review Count Filtering**
```sql
-- Get companies with 1000+ reviews
SELECT * FROM Report WHERE reviewCount >= 1000;
-- Index: idx_report_review_count
```

## **Expected Performance**

- **Country filtering**: < 50ms
- **Industry filtering**: < 50ms
- **Rating range queries**: < 100ms
- **Complex combined queries**: < 200ms
- **Pagination**: < 30ms per page
- **File access**: < 100ms (S3)
- **Text content**: < 10ms (database)

## **Storage Costs**

### **Database Storage**
- **Text content**: ~1MB per company (stored in database)
- **Metadata**: ~1KB per company
- **Total database**: ~6GB for 6,000 companies

### **S3 Storage**
- **Images**: ~500KB per company
- **PDFs**: ~2MB per company (if any)
- **Total S3**: ~3GB for 6,000 companies

### **Total Storage Cost**
- **Database**: ~$50/month (PostgreSQL)
- **S3**: ~$10/month (AWS S3)
- **Total**: ~$60/month for 6,000 companies
