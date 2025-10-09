import { NextRequest, NextResponse } from 'next/server';
import { uploadReportData, ReportUploadData, FileUploadData } from '@/lib/report-upload';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting report upload...');
    
    const formData = await request.formData();
    
    // Extract report metadata
    const reportData: ReportUploadData = {
      companyName: formData.get('companyName') as string,
      industry: formData.get('industry') as string,
      category: formData.get('category') as string || undefined,
      country: formData.get('country') as string || undefined,
      rating: parseFloat(formData.get('rating') as string),
      reviewCount: parseInt(formData.get('reviewCount') as string),
      summary: formData.get('summary') as string,
      tags: JSON.parse(formData.get('tags') as string || '[]'),
      reportType: formData.get('reportType') as 'FREE' | 'PREMIUM',
      language: formData.get('language') as string || 'en',
      logo: formData.get('logo') as string || undefined,
    };

    // Validate required fields
    if (!reportData.companyName || !reportData.industry || !reportData.summary) {
      return NextResponse.json(
        { error: 'Missing required fields: companyName, industry, summary' },
        { status: 400 }
      );
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), 'uploads', 'reports', reportData.companyName.toLowerCase().replace(/\s+/g, '-'));
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Process uploaded files
    const files: FileUploadData[] = [];
    const fileEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('files['));

    for (const [key, value] of fileEntries) {
      if (value instanceof File) {
        const filePath = join(uploadDir, value.name);
        const buffer = await value.arrayBuffer();
        await writeFile(filePath, Buffer.from(buffer));

        // Read text content if it's a text file
        let content: string | undefined;
        if (value.type.startsWith('text/') || value.name.endsWith('.txt')) {
          content = Buffer.from(buffer).toString('utf-8');
        }

        files.push({
          filename: value.name,
          originalName: value.name,
          fileType: getFileType(value.name),
          sectionType: value.name, // Will be parsed in uploadReportData
          content,
          path: filePath,
          size: value.size,
          mimeType: value.type,
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    console.log(`📁 Processing ${files.length} files for ${reportData.companyName}`);

    // Upload the report
    const reportId = await uploadReportData(reportData, files);

    return NextResponse.json({
      success: true,
      reportId,
      message: `Report uploaded successfully for ${reportData.companyName}`,
    });

  } catch (error) {
    console.error('❌ Upload failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function getFileType(filename: string): 'TEXT' | 'IMAGE' | 'PDF' | 'JSON' {
  const ext = filename.toLowerCase().split('.').pop();
  
  switch (ext) {
    case 'txt':
      return 'TEXT';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return 'IMAGE';
    case 'pdf':
      return 'PDF';
    case 'json':
      return 'JSON';
    default:
      return 'TEXT';
  }
}
