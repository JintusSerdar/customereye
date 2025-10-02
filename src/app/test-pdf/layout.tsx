// Special layout for test-pdf page - no navbar for clean printing
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Test - CustomerEye",
  description: "Test PDF generation and print preview functionality",
};

export default function TestPDFLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <main>{children}</main>
      </body>
    </html>
  );
}
