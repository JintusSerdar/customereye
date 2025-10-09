import { Suspense } from 'react';
import { Search, Calendar, Star, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ReportCard } from '@/components/ReportCard';
import { ReportFiltersSSR } from '@/components/ReportFiltersSSR';
import { Pagination } from '@/components/ui/pagination';
import Link from 'next/link';
import { getIndustries, getReports } from '@/lib/actions';

interface Report {
  id: string;
  companyName: string;
  title: string;
  industry: string;
  country: string;
  rating: number;
  reviewCount: number;
  summary: string;
  reportType: 'FREE' | 'PREMIUM';
  language: string;
  isPaid: boolean;
  logo: string;
  date: string;
}

interface Filters {
  industry: string;
  country: string;
  rating: string;
  access: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ReportsPageProps {
  searchParams: {
    page?: string;
    industry?: string;
    country?: string;
    rating?: string;
    access?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  // Get industries server-side
  const categories = await getIndustries();
  
  // Parse search params
  const page = parseInt(searchParams.page || '1');
  const industry = searchParams.industry || 'all';
  const country = searchParams.country || 'all';
  const rating = searchParams.rating || 'all';
  const access = searchParams.access || 'all';
  const search = searchParams.search || '';
  const sortBy = searchParams.sortBy || 'companyName';
  const sortOrder = searchParams.sortOrder || 'asc';

  // Get reports server-side
  const { reports, pagination } = await getReports({
    page,
    industry: industry === 'all' ? undefined : industry,
    country: country === 'all' ? undefined : country,
    rating: rating === 'all' ? undefined : rating,
    access: access === 'all' ? undefined : access,
    search: search || undefined,
    sortBy,
    sortOrder,
  });

  const filters: Filters = {
    industry,
    country,
    rating,
    access,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Company Reports</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover insights from {pagination.total.toLocaleString()} companies across industries
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <form method="GET" className="flex gap-2">
              <Input
                type="text"
                name="search"
                placeholder="Search companies or industries..."
                defaultValue={search}
                className="h-14 pl-6 pr-16 text-lg bg-background text-foreground border-0 shadow-lg"
              />
              <Button type="submit" size="lg" className="h-14 px-8">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
              {/* Preserve other filters */}
              {industry !== 'all' && <input type="hidden" name="industry" value={industry} />}
              {country !== 'all' && <input type="hidden" name="country" value={country} />}
              {rating !== 'all' && <input type="hidden" name="rating" value={rating} />}
              {access !== 'all' && <input type="hidden" name="access" value={access} />}
              {sortBy !== 'companyName' && <input type="hidden" name="sortBy" value={sortBy} />}
              {sortOrder !== 'asc' && <input type="hidden" name="sortOrder" value={sortOrder} />}
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ReportFiltersSSR 
              filters={filters} 
              categories={categories}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {pagination.total.toLocaleString()} reports found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <form method="GET" className="flex gap-2">
                  <select 
                    name="sortBy" 
                    defaultValue={sortBy}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="companyName">A-Z</option>
                    <option value="publishedAt">Most Recent</option>
                    <option value="reviewCount">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <select 
                    name="sortOrder" 
                    defaultValue={sortOrder}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                  {/* Preserve other filters */}
                  {industry !== 'all' && <input type="hidden" name="industry" value={industry} />}
                  {country !== 'all' && <input type="hidden" name="country" value={country} />}
                  {rating !== 'all' && <input type="hidden" name="rating" value={rating} />}
                  {access !== 'all' && <input type="hidden" name="access" value={access} />}
                  {search && <input type="hidden" name="search" value={search} />}
                  <Button type="submit" size="sm">Apply</Button>
                </form>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                baseUrl="/reports"
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}