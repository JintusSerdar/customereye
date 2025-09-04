import { NextRequest, NextResponse } from 'next/server';
import { readFile, getFileInfo } from '@/lib/file-system';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    
    // Security: Prevent directory traversal
    if (filePath.includes('..') || filePath.startsWith('/')) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Get file info
    const fileInfo = await getFileInfo(filePath);
    if (!fileInfo) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Read file content
    const fileBuffer = await readFile(filePath);
    
    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileInfo.mimeType,
        'Content-Length': fileInfo.size.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
