// File parsing and section type detection
export function parseFileName(filename: string): {
  sequence: number;
  sectionType: string;
  fileType: 'TEXT' | 'IMAGE' | 'JSON' | 'CSV' | 'EXCEL' | 'PDF';
  simplifiedName: string;
  fileCategory: string;
} {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  // Determine file type and category
  let fileType: 'TEXT' | 'IMAGE' | 'JSON' | 'CSV' | 'EXCEL' | 'PDF' = 'TEXT';
  let fileCategory = 'text';
  
  if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
    fileType = 'IMAGE';
    fileCategory = 'images';
  } else if (extension === 'json') {
    fileType = 'JSON';
    fileCategory = 'json';
  } else if (extension === 'csv') {
    fileType = 'CSV';
    fileCategory = 'data';
  } else if (['xlsx', 'xls'].includes(extension || '')) {
    fileType = 'EXCEL';
    fileCategory = 'data';
  } else if (extension === 'pdf') {
    fileType = 'PDF';
    fileCategory = 'documents';
  }
  
  // Extract the first number from filename
  const numberMatch = filename.match(/^(\d+)/);
  const sequence = numberMatch ? parseInt(numberMatch[1]) : 999;
  
  let sectionType = 'CUSTOM_ANALYSIS';
  let simplifiedName = filename;
  
  // More sophisticated pattern matching
  const lowerFilename = filename.toLowerCase();
  
  // Check for rating distribution patterns
  if (lowerFilename.includes('rating') && lowerFilename.includes('distribution')) {
    sectionType = 'RATING_DISTRIBUTION';
    simplifiedName = `1_rating_distribution.${extension}`;
  }
  // Check for wordcloud patterns
  else if (lowerFilename.includes('wordcloud') || lowerFilename.includes('word_cloud')) {
    sectionType = 'OVERALL_WORDCLOUD';
    simplifiedName = `2_wordcloud.${extension}`;
  }
  // Check for yearly replies patterns
  else if (lowerFilename.includes('yearly') || lowerFilename.includes('replies') || lowerFilename.includes('years')) {
    sectionType = 'YEARLY_REPLIES';
    simplifiedName = `3_yearly_replies.${extension}`;
  }
  // Check for conclusion
  else if (lowerFilename.includes('conclusion')) {
    sectionType = 'CONCLUSION';
    simplifiedName = `4_conclusion.${extension}`;
  }
  // Check for company score patterns
  else if (lowerFilename.includes('score') || (lowerFilename.includes('rating') && !lowerFilename.includes('distribution'))) {
    sectionType = 'COMPANY_SCORE';
    simplifiedName = `company_score.${extension}`;
  }
  // Check for metadata patterns
  else if (lowerFilename.includes('metadata') || lowerFilename.includes('info')) {
    sectionType = 'METADATA';
    simplifiedName = `metadata.${extension}`;
  }
  // Fallback to sequence-based detection
  else {
    if (sequence === 1) {
      sectionType = 'RATING_DISTRIBUTION';
      simplifiedName = `1_rating_distribution.${extension}`;
    } else if (sequence === 2) {
      sectionType = 'OVERALL_WORDCLOUD';
      simplifiedName = `2_wordcloud.${extension}`;
    } else if (sequence === 3) {
      sectionType = 'YEARLY_REPLIES';
      simplifiedName = `3_yearly_replies.${extension}`;
    } else if (sequence === 4) {
      sectionType = 'CONCLUSION';
      simplifiedName = `4_conclusion.${extension}`;
    }
  }
  
  return {
    sequence,
    sectionType,
    fileType,
    simplifiedName,
    fileCategory
  };
}

// Generate S3 key with simplified naming
export function generateS3Key(
  companySlug: string,
  country: string,
  reportType: string,
  version: string,
  fileCategory: string,
  simplifiedName: string
): string {
  return `companies/${companySlug}-${country.toLowerCase()}/reports/${reportType.toLowerCase()}/${version}/data/${fileCategory}/${simplifiedName}`;
}

// Generate company slug from company name
export function generateCompanySlug(companyName: string, country: string): string {
  // Remove country suffix if present
  let cleanName = companyName;
  if (cleanName.endsWith(`.${country.toLowerCase()}`)) {
    cleanName = cleanName.replace(`.${country.toLowerCase()}`, '');
  }
  
  // Convert to URL-friendly slug
  return cleanName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
