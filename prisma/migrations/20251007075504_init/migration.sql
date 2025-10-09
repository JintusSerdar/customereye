-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FREE', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DataFileType" AS ENUM ('TEXT', 'IMAGE', 'PDF', 'JSON', 'CSV', 'EXCEL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('RATING_DISTRIBUTION', 'SENTIMENT_DISTRIBUTION', 'RATING_VS_SENTIMENT', 'YEARLY_ANALYSIS', 'MONTHLY_ANALYSIS', 'OVERALL_WORDCLOUD', 'POSITIVE_WORDCLOUD', 'NEGATIVE_WORDCLOUD', 'OVERALL_COMMON_WORDS', 'POSITIVE_COMMON_WORDS', 'NEGATIVE_COMMON_WORDS', 'OVERALL_TEXT_COUNTS', 'POSITIVE_TEXT_COUNTS', 'NEGATIVE_TEXT_COUNTS', 'YEARLY_REPLIES', 'CONCLUSION', 'CUSTOM_ANALYSIS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "companyName" TEXT NOT NULL,
    "companySlug" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "country" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "tags" TEXT[],
    "reportType" "ReportType" NOT NULL DEFAULT 'FREE',
    "language" TEXT NOT NULL DEFAULT 'en',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "logo" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "version" TEXT NOT NULL DEFAULT 'v1',
    "s3Prefix" TEXT NOT NULL DEFAULT '',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportDataFile" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "fileType" "DataFileType" NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "sequence" INTEGER,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "content" TEXT,
    "version" TEXT NOT NULL DEFAULT 'v1',
    "fileCategory" TEXT NOT NULL DEFAULT 'text',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportDataFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportSection" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Report_companySlug_idx" ON "Report"("companySlug");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "Report"("reportType");

-- CreateIndex
CREATE INDEX "Report_industry_idx" ON "Report"("industry");

-- CreateIndex
CREATE INDEX "Report_country_idx" ON "Report"("country");

-- CreateIndex
CREATE INDEX "Report_version_idx" ON "Report"("version");

-- CreateIndex
CREATE UNIQUE INDEX "Report_companySlug_reportType_country_version_key" ON "Report"("companySlug", "reportType", "country", "version");

-- CreateIndex
CREATE INDEX "ReportDataFile_reportId_sectionType_idx" ON "ReportDataFile"("reportId", "sectionType");

-- CreateIndex
CREATE INDEX "ReportDataFile_fileType_idx" ON "ReportDataFile"("fileType");

-- CreateIndex
CREATE INDEX "ReportDataFile_fileCategory_idx" ON "ReportDataFile"("fileCategory");

-- CreateIndex
CREATE INDEX "ReportDataFile_version_idx" ON "ReportDataFile"("version");

-- CreateIndex
CREATE INDEX "ReportSection_reportId_order_idx" ON "ReportSection"("reportId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ReportSection_reportId_sectionType_key" ON "ReportSection"("reportId", "sectionType");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportDataFile" ADD CONSTRAINT "ReportDataFile_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportSection" ADD CONSTRAINT "ReportSection_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;
