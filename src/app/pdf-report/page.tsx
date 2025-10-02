import React from "react";
import ReportPDF from "@/components/ReportPDF";

interface PDFReportPageProps {
  searchParams: Promise<{
    companyName?: string;
  }>;
}

export default async function PDFReportPage({
  searchParams,
}: PDFReportPageProps) {
  const params = await searchParams;
  const companyName = params.companyName || "Sample Company";

  return (
    <div className="min-h-screen bg-white">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Print-specific styles for PDF generation */
          @media print {
            /* Hide navbar and other UI elements */
            nav,
            .navbar,
            header:not(.report-header) {
              display: none !important;
            }

            /* Page break controls */
            .pdf-section {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            .pdf-page-break {
              page-break-before: always;
              break-before: page;
            }

            .pdf-no-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }

            /* Ensure proper spacing */
            body {
              margin: 0 !important;
              padding: 0 !important;
            }

            /* Remove shadows and borders that don't print well */
            .shadow-lg,
            .shadow-md {
              box-shadow: none !important;
            }
          }
        `,
        }}
      />
      <ReportPDF companyName={companyName} />
    </div>
  );
}
