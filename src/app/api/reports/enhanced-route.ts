import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Basic filters
    const industry = searchParams.get('industry');
    const reportType = searchParams.get('reportType');
    const country = searchParams.get('country');
    const search = searchParams.get('search');
    const language = searchParams.get('language');
    const isPaid = searchParams.get('isPaid');
    
    // Advanced filters
    const ratingMin = searchParams.get('ratingMin');
    const ratingMax = searchParams.get('ratingMax');
    const reviewCountMin = searchParams.get('reviewCountMin');
    const reviewCountMax = searchParams.get('reviewCountMax');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const updatedFrom = searchParams.get('updatedFrom');
    const updatedTo = searchParams.get('updatedTo');
    
    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Basic filters
    if (industry) where.industry = industry;
    if (reportType) where.reportType = reportType;
    if (country) where.country = country;
    if (language) where.language = language;
    if (isPaid !== null) where.isPaid = isPaid === 'true';

    // Rating range filters
    if (ratingMin || ratingMax) {
      where.rating = {};
      if (ratingMin) where.rating.gte = parseFloat(ratingMin);
      if (ratingMax) where.rating.lte = parseFloat(ratingMax);
    }

    // Review count range filters
    if (reviewCountMin || reviewCountMax) {
      where.reviewCount = {};
      if (reviewCountMin) where.reviewCount.gte = parseInt(reviewCountMin);
      if (reviewCountMax) where.reviewCount.lte = parseInt(reviewCountMax);
    }

    // Date range filters
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    // Updated date range filters
    if (updatedFrom || updatedTo) {
      where.updatedAt = {};
      if (updatedFrom) where.updatedAt.gte = new Date(updatedFrom);
      if (updatedTo) where.updatedAt.lte = new Date(updatedTo);
    }

    // Search filters
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    switch (sortBy) {
      case 'rating':
        orderBy.rating = sortOrder;
        break;
      case 'reviewCount':
        orderBy.reviewCount = sortOrder;
        break;
      case 'companyName':
        orderBy.companyName = sortOrder;
        break;
      case 'createdAt':
        orderBy.createdAt = sortOrder;
        break;
      case 'updatedAt':
        orderBy.updatedAt = sortOrder;
        break;
      default:
        orderBy.createdAt = 'desc';
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
          createdAt: true,
          updatedAt: true,
          dataFilesCount: true,
          sectionsCount: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        industry,
        reportType,
        country,
        language,
        isPaid,
        ratingMin,
        ratingMax,
        reviewCountMin,
        reviewCountMax,
        dateFrom,
        dateTo,
        updatedFrom,
        updatedTo,
        search,
        sortBy,
        sortOrder,
      },
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
