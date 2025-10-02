// Special layout for PDF generation - no navbar
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Report - CustomerEye",
  description: "Customer review analysis report for PDF generation",
};

export default function PDFLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <main>{children}</main>
      </body>
    </html>
  );
}
