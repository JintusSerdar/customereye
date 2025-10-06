import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const reportType = searchParams.get('reportType');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {
      // Remove status filter for now to see all reports
      // status: 'PUBLISHED',
    };

    if (industry) {
      where.industry = industry;
    }

    if (reportType) {
      where.reportType = reportType;
    }

    if (country) {
      where.country = country;
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Handle rating filter
    const rating = searchParams.get('rating');
    if (rating && rating !== 'all') {
      if (rating === '4+') {
        where.rating = { gte: 4 };
      } else if (rating === '3+') {
        where.rating = { gte: 3 };
      }
    }

    // Get reports with pagination
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        select: {
          id: true,
          title: true,
          companyName: true,
          companySlug: true,
          industry: true,
          country: true,
          rating: true,
          reviewCount: true,
          summary: true,
          tags: true,
          reportType: true,
          language: true,
          isPaid: true,
          logo: true,
          status: true,
          createdAt: true,
          publishedAt: true,
          _count: {
            select: {
              dataFiles: true,
              sections: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    // Transform the data for the frontend
    const transformedReports = reports.map(report => ({
      id: report.id,
      company: report.companyName,
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
      date: report.publishedAt || report.createdAt,
      dataFilesCount: report._count.dataFiles,
      sectionsCount: report._count.sections,
    }));

    return NextResponse.json({
      reports: transformedReports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
