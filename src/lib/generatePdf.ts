import puppeteer from "puppeteer";
import path from "path";

export const generatePdf = async (htmlContent: string, documentId: string, isDownload: boolean = true) => {
  let browser;
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewportSize({ width: 1200, height: 800 });

    // Create styled HTML content with Tailwind CSS
    const styledHtmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Customer Review Analysis Report</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
            color: #333;
            line-height: 1.6;
          }
          
          /* Ensure images are properly sized */
          img {
            max-width: 100%;
            height: auto;
          }
          
          /* Print-specific styles */
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            #pdf-report {
              max-width: none;
              box-shadow: none;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            .no-break {
              page-break-inside: avoid;
            }
          }
          
          /* Custom CSS for your brand colors */
          .bg-primary {
            background-color: oklch(0.3053 0.0739 252.6) !important;
          }
          
          .text-primary {
            color: oklch(0.3053 0.0739 252.6) !important;
          }
          
          .text-primary-foreground {
            color: white !important;
          }
          
          .bg-secondary {
            background-color: oklch(0.8052 0.1704 74.31) !important;
          }
          
          .text-secondary {
            color: oklch(0.8052 0.1704 74.31) !important;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    // Set the HTML content
    await page.setContent(styledHtmlContent, { 
      waitUntil: "networkidle0" 
    });

    // Save the PDF in the public folder if not for download
    if (!isDownload) {
      const outputPath = path.join(process.cwd(), `public/documents/document-${documentId}.pdf`);
      await page.pdf({ 
        path: outputPath, 
        format: "A4", 
        printBackground: true,
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px'
        }
      });
      return outputPath;
    }

    // Generate PDF buffer for immediate download
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
