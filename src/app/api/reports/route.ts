import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET() {
  const Bucket = process.env.AWS_BUCKET_NAME!;
  const basePrefix = 'preview-reports/';

  try {
    // List all types (e.g., Health Medical, Home Garden, Money Insurance)
    const typesList = await s3.send(new ListObjectsV2Command({
      Bucket,
      Prefix: basePrefix,
      Delimiter: '/',
    }));
    const typePrefixes = (typesList.CommonPrefixes || []).map(p => p.Prefix).filter(Boolean) as string[];

    const reports: Array<{ id: string; title: string; company: string; type: string }> = [];

    for (const typePrefix of typePrefixes) {
      if (!typePrefix) continue;
      const type = typePrefix.replace(basePrefix, '').replace(/\/$/, '');
      // Only look under GPT/ for each type
      const gptPrefix = `${typePrefix}GPT/`;
      const companiesList = await s3.send(new ListObjectsV2Command({
        Bucket,
        Prefix: gptPrefix,
        Delimiter: '/',
      }));
      const companyPrefixes = (companiesList.CommonPrefixes || []).map(p => p.Prefix).filter(Boolean) as string[];
      for (const companyPrefix of companyPrefixes) {
        if (!companyPrefix) continue;
        const company = companyPrefix.replace(gptPrefix, '').replace(/\/$/, '');
        reports.push({
          id: company,
          title: company,
          company,
          type,
        });
      }
    }

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error in /api/reports:', error);
    return NextResponse.json([]);
  }
} 