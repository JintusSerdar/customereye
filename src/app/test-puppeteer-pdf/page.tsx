"use client";

import { useState } from 'react';

export default function TestPuppeteerPDFPage() {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [isGenerating, setIsGenerating] = useState(false);

  const onDownload = async () => {
    setIsGenerating(true);
    try {
      console.log('🚀 Starting PDF download...');
      
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          companyName,
          reportData: {
            // You can add additional report data here
            rating: 4.8,
            totalReviews: 1247,
            positiveSentiment: 89
          }
        }),
      });

      if (response.ok) {
        console.log('✅ PDF generated successfully!');
        
        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${companyName}-report.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        console.log('📥 Download started');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to generate PDF');
      }
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            🚀 Puppeteer PDF Generation
          </h1>
          
          <div className="space-y-8">
            {/* Test Section */}
            <div className="border rounded-lg p-6 bg-blue-50">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                📄 Generate PDF from ReportPDF Component
              </h2>
              <p className="text-gray-600 mb-4">
                This uses Puppeteer to render your existing ReportPDF React component and convert it to a high-quality PDF.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>
                
                <button
                  onClick={onDownload}
                  disabled={isGenerating || !companyName.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? 'Generating PDF...' : 'Generate & Download PDF'}
                </button>
              </div>
            </div>

            {/* How it works */}
            <div className="border rounded-lg p-6 bg-green-50">
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                ✨ How It Works
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-gray-700">Uses <code className="bg-gray-200 px-2 py-1 rounded">renderToString</code> to convert your ReportPDF React component to HTML</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-gray-700">Puppeteer launches a headless Chrome browser to render the HTML</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-gray-700">Tailwind CSS is loaded from CDN to ensure all styling is preserved</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <p className="text-gray-700">Puppeteer generates a high-quality PDF and returns it as a buffer</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <p className="text-gray-700">The PDF is automatically downloaded to your device</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border rounded-lg p-6 bg-purple-50">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">
                🎯 Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-purple-700">Component Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Uses your existing ReportPDF component</li>
                    <li>• Server-side rendering with React</li>
                    <li>• Preserves all Tailwind CSS styling</li>
                    <li>• Dynamic content with props</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-purple-700">PDF Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• High-quality A4 format</li>
                    <li>• Pixel-perfect rendering</li>
                    <li>• Print-optimized styling</li>
                    <li>• Automatic download</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                🔧 Technical Implementation
              </h2>
              <div className="space-y-3">
                <div className="bg-white p-3 rounded border">
                  <code className="text-sm font-mono text-blue-600">
                    POST /api/generate-pdf
                  </code>
                  <p className="text-sm text-gray-600 mt-1">
                    API endpoint that handles PDF generation
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <code className="text-sm font-mono text-blue-600">
                    renderPdf() - React SSR
                  </code>
                  <p className="text-sm text-gray-600 mt-1">
                    Converts ReportPDF component to HTML string
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <code className="text-sm font-mono text-blue-600">
                    generatePdf() - Puppeteer
                  </code>
                  <p className="text-sm text-gray-600 mt-1">
                    Renders HTML in headless Chrome and generates PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
