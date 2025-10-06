import { prisma } from './prisma';
import { ReportType, SectionType, DataFileType } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Types for data upload
export interface ReportUploadData {
  companyName: string;
  industry: string;
  category?: string;
  country?: string;
  rating: number;
  reviewCount: number;
  summary: string;
  tags: string[];
  reportType: 'FREE' | 'PREMIUM';
  language?: string;
  logo?: string;
}

export interface FileUploadData {
  filename: string;
  originalName: string;
  fileType: 'TEXT' | 'IMAGE' | 'PDF' | 'JSON';
  sectionType: string;
  sequence?: number;
  content?: string;
  path: string;
  size: number;
  mimeType: string;
}

// Utility functions
export function createSlug(companyName: string): string {
  return companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseSectionType(filename: string): SectionType {
  const lowerFilename = filename.toLowerCase();
  
  if (lowerFilename.includes('rating_distribution') || lowerFilename.includes('given_rating')) {
    return SectionType.RATING_DISTRIBUTION;
  }
  if (lowerFilename.includes('sentiment_distribution')) {
    return SectionType.SENTIMENT_DISTRIBUTION;
  }
  if (lowerFilename.includes('rating_vs_sentiment')) {
    return SectionType.RATING_VS_SENTIMENT;
  }
  if (lowerFilename.includes('yearly_analysis') || lowerFilename.includes('yearly_replies')) {
    return SectionType.YEARLY_REPLIES;
  }
  if (lowerFilename.includes('monthly_analysis')) {
    return SectionType.MONTHLY_ANALYSIS;
  }
  if (lowerFilename.includes('overall_wordcloud') || lowerFilename.includes('overall_reviews_wordcloud')) {
    return SectionType.OVERALL_WORDCLOUD;
  }
  if (lowerFilename.includes('positive_wordcloud')) {
    return SectionType.POSITIVE_WORDCLOUD;
  }
  if (lowerFilename.includes('negative_wordcloud')) {
    return SectionType.NEGATIVE_WORDCLOUD;
  }
  if (lowerFilename.includes('overall_most_common_words')) {
    return SectionType.OVERALL_COMMON_WORDS;
  }
  if (lowerFilename.includes('positive_most_common_words')) {
    return SectionType.POSITIVE_COMMON_WORDS;
  }
  if (lowerFilename.includes('negative_most_common_words')) {
    return SectionType.NEGATIVE_COMMON_WORDS;
  }
  if (lowerFilename.includes('overall_text_item_counts')) {
    return SectionType.OVERALL_TEXT_COUNTS;
  }
  if (lowerFilename.includes('positive_text_item_counts')) {
    return SectionType.POSITIVE_TEXT_COUNTS;
  }
  if (lowerFilename.includes('negative_text_item_counts')) {
    return SectionType.NEGATIVE_TEXT_COUNTS;
  }
  if (lowerFilename.includes('conclusion')) {
    return SectionType.CONCLUSION;
  }
  
  return SectionType.CUSTOM_ANALYSIS;
}

export function parseFileType(filename: string): DataFileType {
  const extension = path.extname(filename).toLowerCase();
  
  switch (extension) {
    case '.txt':
      return DataFileType.TEXT;
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
      return DataFileType.IMAGE;
    case '.pdf':
      return DataFileType.PDF;
    case '.json':
      return DataFileType.JSON;
    default:
      return DataFileType.TEXT;
  }
}

export function extractSequence(filename: string): number | null {
  const match = filename.match(/^(\d+)[_\-]/);
  return match ? parseInt(match[1]) : null;
}

// Main upload function
export async function uploadReportData(
  reportData: ReportUploadData,
  files: FileUploadData[]
): Promise<string> {
  try {
    console.log(`🚀 Starting upload for ${reportData.companyName}...`);
    
    // Create or update report
    const companySlug = createSlug(reportData.companyName);
    
    const report = await prisma.report.upsert({
      where: { companySlug },
      update: {
        title: `${reportData.companyName} Customer Insights Report`,
        description: reportData.summary,
        companyName: reportData.companyName,
        industry: reportData.industry,
        category: reportData.category,
        country: reportData.country,
        rating: reportData.rating,
        reviewCount: reportData.reviewCount,
        summary: reportData.summary,
        tags: reportData.tags,
        reportType: reportData.reportType as ReportType,
        language: reportData.language || 'en',
        isPaid: reportData.reportType === 'PREMIUM',
        logo: reportData.logo,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      create: {
        title: `${reportData.companyName} Customer Insights Report`,
        description: reportData.summary,
        companyName: reportData.companyName,
        companySlug,
        industry: reportData.industry,
        category: reportData.category,
        country: reportData.country,
        rating: reportData.rating,
        reviewCount: reportData.reviewCount,
        summary: reportData.summary,
        tags: reportData.tags,
        reportType: reportData.reportType as ReportType,
        language: reportData.language || 'en',
        isPaid: reportData.reportType === 'PREMIUM',
        logo: reportData.logo,
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Report created/updated: ${report.id}`);

    // Process and upload files
    for (const file of files) {
      const sectionType = parseSectionType(file.originalName);
      const fileType = parseFileType(file.originalName);
      const sequence = extractSequence(file.originalName);

      await prisma.reportDataFile.create({
        data: {
          reportId: report.id,
          fileType: fileType as DataFileType,
          sectionType,
          sequence,
          filename: file.filename,
          originalName: file.originalName,
          path: file.path,
          size: file.size,
          mimeType: file.mimeType,
          content: file.content,
        },
      });

      console.log(`📁 File uploaded: ${file.originalName} -> ${sectionType}`);
    }

    // Create report sections based on uploaded files
    await createReportSections(report.id, files);

    console.log(`🎉 Upload completed for ${reportData.companyName}`);
    return report.id;

  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
}

// Create organized report sections
async function createReportSections(reportId: string, files: FileUploadData[]) {
  const sections = new Map<SectionType, { files: FileUploadData[], order: number }>();
  
  // Group files by section type
  files.forEach(file => {
    const sectionType = parseSectionType(file.originalName);
    if (!sections.has(sectionType)) {
      sections.set(sectionType, { files: [], order: 0 });
    }
    sections.get(sectionType)!.files.push(file);
  });

  // Create sections with proper ordering
  const sectionOrder: SectionType[] = [
    SectionType.RATING_DISTRIBUTION,
    SectionType.SENTIMENT_DISTRIBUTION,
    SectionType.RATING_VS_SENTIMENT,
    SectionType.YEARLY_ANALYSIS,
    SectionType.MONTHLY_ANALYSIS,
    SectionType.OVERALL_WORDCLOUD,
    SectionType.POSITIVE_WORDCLOUD,
    SectionType.NEGATIVE_WORDCLOUD,
    SectionType.OVERALL_COMMON_WORDS,
    SectionType.POSITIVE_COMMON_WORDS,
    SectionType.NEGATIVE_COMMON_WORDS,
    SectionType.OVERALL_TEXT_COUNTS,
    SectionType.POSITIVE_TEXT_COUNTS,
    SectionType.NEGATIVE_TEXT_COUNTS,
    SectionType.YEARLY_REPLIES,
    SectionType.CONCLUSION,
  ];

  for (let i = 0; i < sectionOrder.length; i++) {
    const sectionType = sectionOrder[i];
    const sectionData = sections.get(sectionType);
    
    if (sectionData && sectionData.files.length > 0) {
      // Get text content for this section
      const textFile = sectionData.files.find(f => f.fileType === 'TEXT');
      const content = textFile?.content || null;

      await prisma.reportSection.create({
        data: {
          reportId,
          sectionType,
          title: getSectionTitle(sectionType),
          content,
          order: i + 1,
          metadata: {
            fileCount: sectionData.files.length,
            hasImages: sectionData.files.some(f => f.fileType === 'IMAGE'),
            hasText: !!textFile,
          },
        },
      });
    }
  }
}

function getSectionTitle(sectionType: SectionType): string {
  const titles: Record<SectionType, string> = {
    [SectionType.RATING_DISTRIBUTION]: 'Rating Distribution Analysis',
    [SectionType.SENTIMENT_DISTRIBUTION]: 'Sentiment Distribution',
    [SectionType.RATING_VS_SENTIMENT]: 'Rating vs Sentiment Analysis',
    [SectionType.YEARLY_ANALYSIS]: 'Yearly Analysis',
    [SectionType.MONTHLY_ANALYSIS]: 'Monthly Analysis',
    [SectionType.OVERALL_WORDCLOUD]: 'Overall Word Cloud',
    [SectionType.POSITIVE_WORDCLOUD]: 'Positive Sentiment Word Cloud',
    [SectionType.NEGATIVE_WORDCLOUD]: 'Negative Sentiment Word Cloud',
    [SectionType.OVERALL_COMMON_WORDS]: 'Most Common Words',
    [SectionType.POSITIVE_COMMON_WORDS]: 'Positive Common Words',
    [SectionType.NEGATIVE_COMMON_WORDS]: 'Negative Common Words',
    [SectionType.OVERALL_TEXT_COUNTS]: 'Text Analysis Counts',
    [SectionType.POSITIVE_TEXT_COUNTS]: 'Positive Text Counts',
    [SectionType.NEGATIVE_TEXT_COUNTS]: 'Negative Text Counts',
    [SectionType.YEARLY_REPLIES]: 'Customer Engagement Analysis',
    [SectionType.CONCLUSION]: 'Conclusion & Recommendations',
    [SectionType.CUSTOM_ANALYSIS]: 'Custom Analysis',
  };
  
  return titles[sectionType];
}

// Utility to read file content
export async function readFileContent(filePath: string): Promise<string> {
  try {
    return await fs.promises.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error);
    return '';
  }
}

// Utility to get file stats
export async function getFileStats(filePath: string) {
  try {
    const stats = await fs.promises.stat(filePath);
    return {
      size: stats.size,
      mtime: stats.mtime,
    };
  } catch (error) {
    console.error(`Failed to get stats for ${filePath}:`, error);
    return null;
  }
}
