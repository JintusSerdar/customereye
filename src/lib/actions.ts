'use server';

import { prisma } from '@/lib/prisma';

export async function getIndustries() {
  try {
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { industry: 'asc' }
    });

    return industries.map(industry => industry.industry);
  } catch (error) {
    console.error('Error fetching industries:', error);
    // Fallback to hardcoded industries if database fails
    return [
      "Animals & Pets",
      "Beauty & Wellbeing",
      "Business Services",
      "Construction",
      "Education & Training",
      "Electronics & Technology",
      "Events & Entertainment",
      "Food & Beverages",
      "Health & Medical",
      "Hobbies & Crafts",
      "Home & Garden",
      "Legal & Government",
      "Media & Publishing",
      "Money & Insurance",
      "Other",
      "Public Services",
      "Restaurants & Bars",
      "Shopping & Fashion",
      "Sports",
      "Travel & Vacation",
      "Utilities",
      "Vehicles & Transportation"
    ];
  }
}

export async function getReports(filters: {
  page?: number;
  limit?: number;
  industry?: string;
  country?: string;
  rating?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  try {
    const {
      page = 1,
      limit = 10,
      industry,
      country,
      rating,
      search,
      sortBy = 'companyName',
      sortOrder = 'asc'
    } = filters;

    // Build where clause
    const where: any = {};

    if (industry && industry !== 'all') {
      where.industry = industry;
    }

    if (country && country !== 'all') {
      where.country = country;
    }

    if (rating && rating !== 'all') {
      if (rating === '4+') {
        where.rating = { gte: 4 };
      } else if (rating === '3+') {
        where.rating = { gte: 3 };
      }
    }

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get reports with pagination
    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        select: {
          id: true,
          companyName: true,
          title: true,
          industry: true,
          country: true,
          rating: true,
          reviewCount: true,
          summary: true,
          reportType: true,
          language: true,
          isPaid: true,
          logo: true,
          status: true,
          publishedAt: true,
          createdAt: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.report.count({ where }),
    ]);

    return {
      reports: reports.map(report => ({
        id: report.id,
        companyName: report.companyName,
        title: report.title,
        industry: report.industry,
        country: report.country,
        rating: report.rating,
        reviewCount: report.reviewCount,
        summary: report.summary,
        reportType: report.reportType,
        language: report.language,
        isPaid: report.isPaid,
        logo: report.logo,
        date: report.publishedAt || report.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return {
      reports: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}
