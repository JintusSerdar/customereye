import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '6'); // Reduced from 10 to 6 for faster response

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Search for companies that match the query
    const companies = await prisma.report.findMany({
      where: {
        companyName: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        companyName: true,
        industry: true,
        country: true,
        rating: true,
        reviewCount: true
      },
      take: limit,
      orderBy: {
        companyName: 'asc'
      }
    });

    // Format suggestions
    const suggestions = companies.map(company => ({
      name: company.companyName,
      industry: company.industry,
      country: company.country,
      rating: company.rating,
      reviewCount: company.reviewCount
    }));

    return NextResponse.json({ suggestions });

  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    );
  }
}
