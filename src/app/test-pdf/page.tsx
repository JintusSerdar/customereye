"use client";

import { useState } from "react";
import ReportPDF from "@/components/ReportPDF";

export default function TestPDFPage() {
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/pdf/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${companyName}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    generatePDF();
  };

  return (
    <>
      {/* Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            .no-print {
              display: none !important;
            }
            .print-only {
              display: block !important;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
          }
          .print-only {
            display: none;
          }
        `,
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header Controls - Hidden in Print */}
        <div className="no-print bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  📊 Customer Review Report Preview
                </h1>
                <p className="text-gray-600 mt-1">
                  Preview and download your customer analysis report
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handlePrint}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🖨️</span>
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isGenerating || !companyName.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    <span>📥</span>
                    <span>
                      {isGenerating ? "Generating..." : "Download PDF"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <ReportPDF companyName={companyName} />
          </div>
        </div>

        {/* Footer Info - Hidden in Print */}
        <div className="no-print bg-white border-t mt-8">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl mb-2">🎨</div>
                <h3 className="font-semibold text-gray-800">
                  Professional Design
                </h3>
                <p className="text-sm text-gray-600">
                  Clean, modern layout with your brand colors
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📄</div>
                <h3 className="font-semibold text-gray-800">Print Ready</h3>
                <p className="text-sm text-gray-600">
                  Optimized for both screen and print viewing
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-800">Fast Generation</h3>
                <p className="text-sm text-gray-600">
                  High-quality PDFs generated in seconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
