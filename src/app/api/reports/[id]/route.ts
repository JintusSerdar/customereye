// API route for individual report data at `/reports/[id]`
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function getTextFileContent(Bucket: string, Key: string) {
  const command = new GetObjectCommand({ Bucket, Key });
  const response = await s3.send(command);
  return await response.Body?.transformToString();
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const Bucket = process.env.AWS_BUCKET_NAME!;
  const basePrefix = `preview-reports/Health Medical/GPT/${id}/`;
  const graphPrefix = `preview-reports/Health Medical/GRAPH/${id}/`;

  // List text files
  const textList = await s3.send(new ListObjectsV2Command({
    Bucket,
    Prefix: basePrefix,
  }));

  // List graph files
  const graphList = await s3.send(new ListObjectsV2Command({
    Bucket,
    Prefix: graphPrefix,
  }));

  // Get text file contents (sorted for consistency)
  const textFiles = (textList.Contents || [])
    .filter(obj => obj.Key && obj.Key.endsWith('.txt'))
    .sort((a, b) => (a.Key! > b.Key! ? 1 : -1));

  const texts = await Promise.all(
    textFiles.map(async (file) => ({
      name: file.Key!.split('/').pop(),
      content: await getTextFileContent(Bucket, file.Key!),
    }))
  );

  // Get graph file URLs (sorted for consistency)
  const graphFiles = (graphList.Contents || [])
    .filter(obj => obj.Key && (obj.Key.endsWith('.png') || obj.Key.endsWith('.jpg')))
    .sort((a, b) => (a.Key! > b.Key! ? 1 : -1));

  const graphs = await Promise.all(
    graphFiles.map(async (file) => ({
      name: file.Key!.split('/').pop(),
      url: await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key: file.Key! }), { expiresIn: 3600 }),
    }))
  );

  return NextResponse.json({ texts, graphs });
}
