import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'customereye';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join('/');
    const s3Key = filePath;
    
    console.log(`📁 Fetching file: ${s3Key}`);
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Body) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', response.ContentType || 'application/octet-stream');
    headers.set('Content-Length', buffer.length.toString());
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('❌ Error fetching file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}