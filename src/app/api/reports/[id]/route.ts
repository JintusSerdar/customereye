import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to find by ID first
    let report = await prisma.report.findUnique({
      where: { id },
      include: {
        dataFiles: {
          orderBy: { sequence: 'asc' },
        },
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // If not found by ID, try by slug (need to use findFirst since companySlug is not unique alone)
    if (!report) {
      report = await prisma.report.findFirst({
        where: { companySlug: id },
        include: {
          dataFiles: {
            orderBy: { sequence: 'asc' },
          },
          sections: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Transform the data for the frontend
    const transformedReport = {
      id: report.id,
      title: report.title,
      companyName: report.companyName,
      companySlug: report.companySlug,
      industry: report.industry,
      country: report.country,
      rating: report.rating,
      reviewCount: report.reviewCount,
      summary: report.summary,
      tags: report.tags,
      reportType: report.reportType,
      language: report.language,
      isPaid: report.isPaid,
      logo: report.logo,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      publishedAt: report.publishedAt,
      
      // Process data files
      dataFiles: report.dataFiles.map(file => ({
        id: file.id,
        fileType: file.fileType,
        sectionType: file.sectionType,
        sequence: file.sequence,
        filename: file.filename,
        originalName: file.originalName,
        path: file.s3Key ? `/api/files/${file.s3Key}` : '',
        size: file.size,
        mimeType: file.mimeType,
        content: file.content,
        createdAt: file.createdAt,
      })),
      
      // Process sections
      sections: report.sections.map(section => ({
        id: section.id,
        sectionType: section.sectionType,
        title: section.title,
        content: section.content,
        order: section.order,
        metadata: section.metadata,
        createdAt: section.createdAt,
      })),
    };

    return NextResponse.json(transformedReport);

  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
