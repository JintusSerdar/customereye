import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Find the data file by ID
    const dataFile = await prisma.reportDataFile.findUnique({
      where: { id },
    });

    if (!dataFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // If it's an image stored in database
    if (dataFile.fileType === 'IMAGE' && dataFile.data) {
      return new NextResponse(dataFile.data, {
        headers: {
          'Content-Type': dataFile.mimeType,
          'Content-Length': dataFile.size.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      });
    }

    // If it's a text file, return the content
    if (dataFile.fileType === 'TEXT' && dataFile.content) {
      return new NextResponse(dataFile.content, {
        headers: {
          'Content-Type': dataFile.mimeType,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    }

    // Fallback to file system if data is not in database
    if (dataFile.path && dataFile.path.startsWith('/')) {
      // This would require file system access - for now return 404
      return NextResponse.json(
        { error: 'File not available' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
