import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        preview: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Check if user has purchased the document
    const userId = request.headers.get('user-id'); // You'll need to implement proper authentication
    const hasPurchased = userId
      ? await prisma.purchase.findFirst({
          where: {
            userId,
            documentId: document.id,
          },
        })
      : false;

    // If user has purchased, return full content, otherwise return preview
    const response = hasPurchased
      ? { ...document, content: document.content }
      : {
          ...document,
          content: document.preview?.content || null,
        };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('user-id'); // You'll need to implement proper authentication
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create purchase record
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        documentId: params.id,
      },
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 