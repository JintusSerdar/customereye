import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get all unique industries from the database
    const industries = await prisma.report.groupBy({
      by: ['industry'],
      _count: { industry: true },
      orderBy: { industry: 'asc' }
    });

    // Return just the industry names
    const industryNames = industries.map(industry => industry.industry);

    return NextResponse.json({
      industries: industryNames,
      total: industryNames.length
    });

  } catch (error) {
    console.error('Error fetching industries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch industries' },
      { status: 500 }
    );
  }
}
