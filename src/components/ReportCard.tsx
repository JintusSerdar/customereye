import React from 'react';

interface ReportCardProps {
  report: {
    id: string;
    title: string;
    company: string;
    type: string;
  };
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  return (
    <div className="bg-blue-50 rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 hover:shadow-2xl transition-all duration-200">
      {/* Logo Placeholder */}
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold shadow">
        {/* Placeholder icon, could use an SVG or emoji */}
        <span>🏢</span>
      </div>
      {/* Company Name */}
      <div className="text-2xl font-extrabold text-blue-900 text-center truncate w-full">{report.company}</div>
      {/* View Report Button */}
      <a
        href={`/reports/${encodeURIComponent(report.company)}`}
        className="mt-2 w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-center shadow hover:bg-blue-700 transition-colors duration-150"
      >
        View Report
      </a>
    </div>
  );
}; 