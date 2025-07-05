import React, { Suspense } from 'react';
import ReportsFilterUI from '../../components/ReportsFilterUI';

async function fetchReports() {
  const baseUrl = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    : '';
  const res = await fetch(`${baseUrl}/api/reports`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch reports');
  return res.json();
}

export default async function ReportsPage() {
  let reports: Array<{ id: string; title: string; company: string; type: string }> = [];
  try {
    reports = await fetchReports();
  } catch {
    return <div className="p-8 text-center text-red-500">Failed to load reports.</div>;
  }

  // Extract unique types and companies
  const types = Array.from(new Set(reports.map(r => r.type)));
  const companies = Array.from(new Set(reports.map(r => r.company)));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Reports</h1>
      <Suspense fallback={<div>Loading search...</div>}>
        <ReportsFilterUI reports={reports} types={types} companies={companies} />
      </Suspense>
    </div>
  );
} 