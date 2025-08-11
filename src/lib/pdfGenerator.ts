import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFOptions {
  filename?: string;
  companyName: string;
}

export const generatePDF = async (element: HTMLElement, options: PDFOptions) => {
  const { filename = 'customer-review-report.pdf', companyName } = options;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  
  // Set up canvas options for better localhost compatibility
  const canvasOptions = {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: 794,
    height: 1123,
    logging: true, // Enable logging to debug
    removeContainer: true,
    foreignObjectRendering: true, // Enable for better image rendering
    imageTimeout: 30000, // 30 second timeout for images
    onclone: (clonedDoc: Document) => {
      // Ensure all images are loaded in the cloned document
      const images = clonedDoc.querySelectorAll('img');
      images.forEach(img => {
        img.crossOrigin = 'anonymous';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      });
    }
  };

  try {
    console.log('Starting PDF generation...');
    console.log('Element found:', !!element);
    
    // Preload images to ensure they're available
    const images = element.querySelectorAll('img');
    console.log('Found images:', images.length);
    
    // Set up image loading with better error handling
    const imagePromises = Array.from(images).map((img, index) => {
      return new Promise((resolve) => {
        console.log(`Loading image ${index + 1}:`, img.src);
        
        // Set crossOrigin for localhost
        img.crossOrigin = 'anonymous';
        
        if (img.complete && img.naturalWidth > 0) {
          console.log(`Image ${index + 1} already loaded`);
          resolve(null);
        } else {
          img.onload = () => {
            console.log(`Image ${index + 1} loaded successfully`);
            resolve(null);
          };
          img.onerror = (error) => {
            console.error(`Image ${index + 1} failed to load:`, error);
            resolve(null); // Continue even if image fails
          };
          
          // Force reload if needed
          if (img.src) {
            img.src = img.src;
          }
        }
      });
    });
    
    // Wait for all images to load
    await Promise.all(imagePromises);
    console.log('All images processed');
    
    // Additional wait for rendering
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Convert the element to canvas
    const canvas = await html2canvas(element, canvasOptions);
    console.log('Canvas created:', canvas.width, 'x', canvas.height);
    
    const imgData = canvas.toDataURL('image/png');
    console.log('Image data created, length:', imgData.length);
    
    // Calculate dimensions
    const imgWidth = pageWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;
    let pageNumber = 1;
    
    // Add first page
    pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
    heightLeft -= (pageHeight - (margin * 2));
    
    // Add header to first page
    addPageHeader(pdf, companyName, pageNumber);
    
    // Add subsequent pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pageNumber++;
      
      // Add header to new page
      addPageHeader(pdf, companyName, pageNumber);
      
      pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
    }
    
    // Save the PDF
    pdf.save(filename);
    console.log('PDF saved successfully');
    
  } catch (error) {
    console.error('Error generating PDF with images:', error);
    console.log('Retrying with different settings...');
    
    // Retry with different settings
    try {
      const retryOptions = {
        ...canvasOptions,
        scale: 1.5,
        foreignObjectRendering: false,
        allowTaint: false,
      };
      
      console.log('Retrying PDF generation...');
      const canvas = await html2canvas(element, retryOptions);
      console.log('Retry canvas created:', canvas.width, 'x', canvas.height);
      
      const imgData = canvas.toDataURL('image/png');
      console.log('Retry image data created, length:', imgData.length);
      
      // Calculate dimensions
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
      
      // Add header to first page
      addPageHeader(pdf, companyName, pageNumber);
      
      // Add subsequent pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pageNumber++;
        
        // Add header to new page
        addPageHeader(pdf, companyName, pageNumber);
        
        pdf.addImage(imgData, 'PNG', margin, position + margin, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (margin * 2));
      }
      
      // Save the PDF
      pdf.save(filename);
      console.log('PDF saved successfully on retry');
      
    } catch (retryError) {
      console.error('Retry also failed:', retryError);
      throw new Error(`PDF generation failed after retry: ${retryError instanceof Error ? retryError.message : 'Unknown error'}`);
    }
  }
};



const addPageHeader = (pdf: jsPDF, companyName: string, pageNumber: number) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  
  // Set font styles
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  
  // Add CustomerEye branding
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(48, 83, 252); // Primary color
  pdf.text('CustomerEye', margin, 15);
  
  // Add company name
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(50, 50, 50);
  pdf.text(`${companyName} - Customer Review Analysis`, margin, 25);
  
  // Add page number
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Page ${pageNumber}`, pageWidth - margin - 20, 15);
  
  // Add date
  const today = new Date().toLocaleDateString();
  pdf.text(`Generated: ${today}`, pageWidth - margin - 60, 15);
  
  // Add separator line
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, 30, pageWidth - margin, 30);
};

export const downloadPDF = async (elementId: string, options: PDFOptions) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }
  
  await generatePDF(element, options);
}; 