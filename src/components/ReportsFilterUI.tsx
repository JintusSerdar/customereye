'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { ReportCard } from './ReportCard';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  company: string;
  type: string;
}

interface ReportsFilterUIProps {
  reports: Report[];
  types: string[];
}

const PAGE_SIZE = 24;

const ReportsFilterUI: React.FC<ReportsFilterUIProps> = ({ reports, types }) => {
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sort, setSort] = useState<string>('az');
  const [page, setPage] = useState<number>(1);

  useEffect(() => { setPage(1); }, [search, selectedType, sort]);

  const filtered = useMemo(() => {
    let data = reports.filter(r =>
      (selectedType === '' || r.type === selectedType) &&
      (search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'az') data = data.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'za') data = data.sort((a, b) => b.title.localeCompare(a.title));
    else if (sort === 'type') data = data.sort((a, b) => a.type.localeCompare(b.type) || a.title.localeCompare(b.title));
    return data;
  }, [reports, search, selectedType, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="md:w-64 w-full md:sticky top-8 flex-shrink-0 bg-blue-50 rounded-xl shadow p-6 mb-4 md:mb-0">
        {/* Type Filter */}
        <div className="mb-8">
          <h3 className="font-bold text-lg mb-3 text-blue-900">Type</h3>
          <div className="flex md:flex-col flex-row flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full border text-sm transition-colors duration-150 ${selectedType === '' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'}`}
              onClick={() => setSelectedType('')}
            >
              All Types
            </button>
            {types.map(type => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full border text-sm transition-colors duration-150 ${selectedType === type ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-100'}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar: Search and Sort */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg shadow border-blue-300 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5 pointer-events-none" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-40 border-blue-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="az">A-Z</SelectItem>
              <SelectItem value="za">Z-A</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No reports found.</div>
          ) : (
            paginated.map(report => (
              <ReportCard key={report.id + report.company} report={report} />
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </Button>
            <span className="mx-2 text-blue-900 font-semibold">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReportsFilterUI; 