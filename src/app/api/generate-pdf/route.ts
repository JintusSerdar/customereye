import { NextRequest, NextResponse } from 'next/server';
import { renderPdf } from '@/lib/renderPdf';
import { generatePdf } from '@/lib/generatePdf';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting PDF generation with Puppeteer...');
    
    // Parse request body
    const body = await request.json();
    const { companyName, reportData } = body;
    
    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }
    
    // Generate document ID
    const documentId = `report-${Date.now()}`;
    
    // Render the React component to HTML
    console.log('📝 Rendering React component to HTML...');
    const htmlContent = await renderPdf(companyName, reportData);
    
    // Generate PDF using Puppeteer
    console.log('🖨️ Generating PDF with Puppeteer...');
    const pdfBuffer = await generatePdf(htmlContent, documentId, true);
    
    console.log('✅ PDF generated successfully!');
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${companyName}-report.pdf`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'PDF generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
