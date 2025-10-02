import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting PDF generation test from page...');
    
    // Launch browser
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Get the base URL from the request
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const pdfPageUrl = `${baseUrl}/pdf-report?companyName=Test%20Company`;
    
    console.log(`📄 Navigating to: ${pdfPageUrl}`);
    
    // Navigate to the actual page that renders ReportPDF component
    await page.goto(pdfPageUrl, { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit more for any dynamic content to load
    await page.waitForTimeout(2000);
    
    // Generate PDF with headers and footers
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <span style="margin-right: 20px;">CustomerEye Test Report</span>
          <span>Test Company</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; text-align: center; width: 100%; color: #666; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          <span style="margin-left: 20px;">Generated on ${new Date().toLocaleDateString()}</span>
        </div>
      `,
      margin: {
        top: '60px',
        right: '20px',
        bottom: '60px',
        left: '20px'
      },
      preferCSSPageSize: true
    });
    
    // Close browser
    await browser.close();
    
    console.log('✅ PDF test generated successfully from page!');
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="test-report.pdf"',
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